const express = require('express')
const cors = require('cors');
const mongoDB = require('./config/db');
const app = express();
const taskRoutes = require('./routes/TaskRoute');

app.use(cors());
app.use(express.json())

mongoDB();

app.use('/api/tasks',taskRoutes)
app.listen(5000, () => {
    console.log('Server is running');
})