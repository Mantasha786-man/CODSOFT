const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Job = require('./models/Job');
const User = require('./models/User');

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    location: 'New York, NY',
    type: 'Full-time',
    category: 'Technology',
    salaryMin: 120000,
    salaryMax: 180000,
    description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
    responsibilities: [
      'Design and develop scalable software solutions',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews and mentoring',
      'Troubleshoot and debug applications'
    ],
    requirements: [
      '5+ years of software development experience',
      'Strong proficiency in JavaScript/Node.js',
      'Experience with React and modern web technologies',
      'Knowledge of database design and SQL/NoSQL',
      'Excellent problem-solving skills'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work hours',
      'Professional development budget',
      'Remote work options'
    ]
  },
  {
    title: 'Marketing Manager',
    location: 'San Francisco, CA',
    type: 'Full-time',
    category: 'Marketing',
    salaryMin: 90000,
    salaryMax: 130000,
    description: 'Join our marketing team to drive brand awareness and customer acquisition. You will lead marketing campaigns and analyze their performance.',
    responsibilities: [
      'Develop and execute marketing strategies',
      'Manage digital marketing campaigns',
      'Analyze campaign performance and ROI',
      'Collaborate with sales and product teams',
      'Create compelling marketing content'
    ],
    requirements: [
      '3+ years of marketing experience',
      'Experience with digital marketing tools',
      'Strong analytical and communication skills',
      'Knowledge of SEO and social media marketing',
      'Bachelor\'s degree in Marketing or related field'
    ],
    benefits: [
      'Competitive salary package',
      'Health and wellness benefits',
      'Professional development opportunities',
      'Flexible work environment',
      'Team building activities'
    ]
  },
  {
    title: 'Data Analyst',
    location: 'Austin, TX',
    type: 'Full-time',
    category: 'Technology',
    salaryMin: 70000,
    salaryMax: 100000,
    description: 'We are seeking a Data Analyst to help us make data-driven decisions. You will analyze complex datasets and provide actionable insights.',
    responsibilities: [
      'Analyze large datasets to identify trends',
      'Create dashboards and reports',
      'Collaborate with stakeholders to understand requirements',
      'Present findings to non-technical audiences',
      'Maintain data quality and integrity'
    ],
    requirements: [
      '2+ years of data analysis experience',
      'Proficiency in SQL and Excel',
      'Experience with data visualization tools',
      'Strong analytical and problem-solving skills',
      'Bachelor\'s degree in Statistics, Mathematics, or related field'
    ],
    benefits: [
      'Competitive compensation',
      'Health insurance coverage',
      'Retirement savings plan',
      'Learning and development programs',
      'Collaborative work environment'
    ]
  },
  {
    title: 'UX/UI Designer',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    category: 'Design',
    salaryMin: 80000,
    salaryMax: 120000,
    description: 'Create beautiful and intuitive user experiences for our products. You will work closely with product managers and developers to design user-centered solutions.',
    responsibilities: [
      'Design user interfaces and experiences',
      'Create wireframes, prototypes, and mockups',
      'Conduct user research and usability testing',
      'Collaborate with development teams',
      'Maintain design systems and guidelines'
    ],
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma, Sketch, or Adobe XD',
      'Strong portfolio demonstrating design skills',
      'Understanding of user-centered design principles',
      'Experience with design systems'
    ],
    benefits: [
      'Creative and collaborative environment',
      'Competitive salary and benefits',
      'Professional growth opportunities',
      'Flexible work arrangements',
      'Design tool subscriptions'
    ]
  },
  {
    title: 'DevOps Engineer',
    location: 'Seattle, WA',
    type: 'Full-time',
    category: 'Technology',
    salaryMin: 110000,
    salaryMax: 160000,
    description: 'Join our DevOps team to build and maintain our infrastructure. You will work on CI/CD pipelines, cloud infrastructure, and automation.',
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure (AWS/Azure/GCP)',
      'Implement monitoring and logging solutions',
      'Automate deployment and scaling processes',
      'Ensure system security and compliance'
    ],
    requirements: [
      '4+ years of DevOps or SRE experience',
      'Experience with cloud platforms (AWS preferred)',
      'Knowledge of containerization (Docker, Kubernetes)',
      'Scripting skills (Python, Bash)',
      'Understanding of infrastructure as code'
    ],
    benefits: [
      'High-impact role with growth opportunities',
      'Competitive salary and equity',
      'Comprehensive benefits package',
      'Work with cutting-edge technologies',
      'Flexible remote work options'
    ]
  },
  {
    title: 'Sales Representative',
    location: 'Chicago, IL',
    type: 'Full-time',
    category: 'Sales',
    salaryMin: 60000,
    salaryMax: 100000,
    description: 'Drive revenue growth by building relationships with clients and closing deals. You will be responsible for the full sales cycle from prospecting to closing.',
    responsibilities: [
      'Identify and qualify potential clients',
      'Develop and maintain client relationships',
      'Present product demonstrations',
      'Negotiate contracts and close deals',
      'Meet or exceed sales targets'
    ],
    requirements: [
      '2+ years of sales experience',
      'Strong communication and interpersonal skills',
      'Self-motivated and results-oriented',
      'Experience with CRM software',
      'Bachelor\'s degree preferred'
    ],
    benefits: [
      'Uncapped commission structure',
      'Comprehensive benefits package',
      'Sales training and development',
      'Career advancement opportunities',
      'Travel opportunities'
    ]
  }
];

const seedJobs = async () => {
  try {
    // Find or create a demo employer
    let demoEmployer = await User.findOne({ email: 'siddikimantasha644@gmail.com' });

    if (!demoEmployer) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('654321', salt);

      demoEmployer = new User({
        name: 'Authorized Employer',
        email: 'siddikimantasha644@gmail.com',
        passwordHash: passwordHash,
        role: 'employer',
        company: {
          name: 'codsoft.in',
          description: 'Leading technology company',
          website: 'https://codsoft.in'
        }
      });
      await demoEmployer.save();
      console.log('Authorized employer created');
    } else {
      // Update the company name if it exists
      demoEmployer.company.name = 'codsoft.in';
      await demoEmployer.save();
      console.log('Authorized employer company name updated');
    }

    // Check if jobs already exist
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log('Jobs already seeded, skipping...');
      return;
    }

    // Create jobs with the demo employer
    const jobsWithEmployer = sampleJobs.map(job => ({
      ...job,
      companyId: demoEmployer._id
    }));

    await Job.insertMany(jobsWithEmployer);
    console.log(`${sampleJobs.length} sample jobs seeded successfully`);

  } catch (error) {
    console.error('Error seeding jobs:', error);
  }
};

module.exports = seedJobs;
