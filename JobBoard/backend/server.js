const app = require('./app');
const mongoose = require('mongoose');
const seedJobs = require('./seedJobs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://siddikianjum321_db_user:Ecommerce786@cluster0.tpapwyq.mongodb.net/jobboard?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
  console.log('Connected to MongoDB');

  // Seed jobs after connection
  await seedJobs();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
