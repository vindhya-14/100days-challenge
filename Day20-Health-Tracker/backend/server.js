const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(process.env.PORT, () => {
        console.log('Server started on port', process.env.PORT);
    }))
    .catch(err => console.log(err));
