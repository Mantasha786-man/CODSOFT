// Global variables
let currentUser = null;
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    // Removed forced login redirect to allow viewing without login
    loadPage();
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
    }
}

// Load appropriate page content
function loadPage() {
    const path = window.location.pathname.split('/').pop();
    switch(path) {
        case 'index.html':
        case '':
            loadHome();
            break;
        case 'create-quiz.html':
            loadCreateQuiz();
            break;
        case 'quiz-list.html':
            loadQuizList();
            break;
        case 'take-quiz.html':
            loadTakeQuiz();
            break;
        case 'results.html':
            loadResults();
            break;
        case 'auth.html':
            loadAuth();
            break;
    }
}

// Home page
function loadHome() {
    // Already loaded in HTML
    showNav();
}

// Auth page
function loadAuth() {
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }
}

function handleAuth(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const action = formData.get('action');
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (action === 'register') {
        // Register user
        const user = { name, email, password, quizzes: [] };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Registration successful!');
        window.location.href = 'index.html';
    } else {
        // Login user
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    }
}

// Create Quiz page
function loadCreateQuiz() {
    showNav();
    const addQuestionBtn = document.getElementById('add-question');
    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');

    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', addQuestion);
    }

    if (quizForm) {
        quizForm.addEventListener('submit', saveQuiz);
    }

    function addQuestion() {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <label>Question:</label>
            <input type="text" name="question" required>
            <label>Options:</label>
            <input type="text" name="option1" placeholder="Option 1" required>
            <input type="text" name="option2" placeholder="Option 2" required>
            <input type="text" name="option3" placeholder="Option 3" required>
            <input type="text" name="option4" placeholder="Option 4" required>
            <label>Correct Answer (1-4):</label>
            <input type="number" name="correct" min="1" max="4" required>
            <button type="button" class="remove-question">Remove Question</button>
        `;
        questionsContainer.appendChild(questionDiv);

        // Add remove functionality
        questionDiv.querySelector('.remove-question').addEventListener('click', function() {
            questionsContainer.removeChild(questionDiv);
        });
    }
}

// Allow creating quiz without login for demo purposes
function saveQuiz(e) {
    e.preventDefault();
    // Removed login check to allow creating quiz without login

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');

    const questions = [];
    const questionElements = document.querySelectorAll('.question');

    questionElements.forEach((q, index) => {
        const inputs = q.querySelectorAll('input');
        const question = inputs[0].value;
        const options = [inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value];
        const correct = parseInt(inputs[5].value) - 1; // 0-based index

        questions.push({ question, options, correct });
    });

    const quiz = {
        id: Date.now(),
        title,
        description,
        questions,
        creator: currentUser ? currentUser.email : 'Anonymous'
    };

    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    alert('Quiz created successfully!');
    window.location.href = 'quiz-list.html';
}

// Quiz List page
function loadQuizList() {
    showNav();
    const quizListContainer = document.getElementById('quiz-list');
    if (quizListContainer) {
        quizListContainer.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.className = 'quiz-item';
            let buttons = `<button onclick="takeQuiz(${quiz.id})">Take Quiz</button>`;
            if (currentUser && quiz.creator === currentUser.email) {
                buttons += `<button onclick="deleteQuiz(${quiz.id})" class="delete-btn">Delete Quiz</button>`;
            }
            quizItem.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>${quiz.description}</p>
                <p>Questions: ${quiz.questions.length}</p>
                ${buttons}
            `;
            quizListContainer.appendChild(quizItem);
        });
    }
}

function takeQuiz(quizId) {
    localStorage.setItem('currentQuizId', quizId);
    window.location.href = 'take-quiz.html';
}

function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz?')) {
        quizzes = quizzes.filter(quiz => quiz.id !== quizId);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        loadQuizList(); // Reload the list
    }
}

// Take Quiz page
function loadTakeQuiz() {
    showNav();
    const quizId = localStorage.getItem('currentQuizId');
    currentQuiz = quizzes.find(q => q.id == quizId);

    if (!currentQuiz) {
        alert('Quiz not found');
        window.location.href = 'quiz-list.html';
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    questionContainer.innerHTML = `
        <h3>Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</h3>
        <p>${currentQuestion.question}</p>
        <ul class="options">
            ${currentQuestion.options.map((option, index) => `
                <li>
                    <input type="radio" name="answer" value="${index}" id="option${index}">
                    <label for="option${index}">${option}</label>
                </li>
            `).join('')}
        </ul>
        <button onclick="nextQuestion()">Next</button>
    `;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer');
        return;
    }

    userAnswers.push(parseInt(selectedAnswer.value));

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
        showQuestion();
    } else {
        // Quiz finished
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
        window.location.href = 'results.html';
    }
}

// Results page
function loadResults() {
    showNav();
    const quizId = localStorage.getItem('currentQuizId');
    const quiz = quizzes.find(q => q.id == quizId);
    const answers = JSON.parse(localStorage.getItem('userAnswers'));

    if (!quiz || !answers) {
        alert('No results found');
        window.location.href = 'index.html';
        return;
    }

    let score = 0;
    const resultsContainer = document.getElementById('results-container');

    resultsContainer.innerHTML = `
        <h3>Quiz Results: ${quiz.title}</h3>
        <p>Your Score: ${answers.filter((answer, index) => answer === quiz.questions[index].correct).length} / ${quiz.questions.length}</p>
        <h4>Review:</h4>
    `;

    quiz.questions.forEach((question, index) => {
        const userAnswer = answers[index];
        const correctAnswer = question.correct;
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) score++;

        resultsContainer.innerHTML += `
            <div class="question-review">
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p>Your answer: ${question.options[userAnswer]} ${isCorrect ? '(Correct)' : '(Incorrect)'}</p>
                ${!isCorrect ? `<p>Correct answer: ${question.options[correctAnswer]}</p>` : ''}
            </div>
        `;
    });

    // Clear temporary data
    localStorage.removeItem('currentQuizId');
    localStorage.removeItem('userAnswers');
}

// Show navigation menu
function showNav() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.style.display = 'block';
    }
}
