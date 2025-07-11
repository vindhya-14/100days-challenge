const express = require('express')
const cors = require('cors');
const mongoDB = require('./config/db');
const app = express();
const taskRoutes = require('./routes/TaskRoute');

app.use(cors({
  origin: 'https://task-manager-1-me06.onrender.com'
  
}));
app.use(express.json())

// mongoDB();

app.get('/api/ping', (req, res) => {
  res.send('Server is awake!');
});

app.use('/api/tasks',taskRoutes)

app.listen(5000, () => {
    console.log('Server is running');
})