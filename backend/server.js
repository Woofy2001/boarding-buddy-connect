const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Root test route
app.get('/', (req, res) => {
  res.send('Boarding Buddy Connect API is running!');
});

// 🛡 Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
