const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json())

const SECRET_KEY = process.env.SECRET_KEY;
const user = {
    id : 1,
    username: 'vindhya',
    password: '1234'
};
app.post('/login',(req,res) => {
    const {username,password } = req.body;

    if(username === user.username && password === user.password) {
        const token = jwt.sign({id : user.id},SECRET_KEY,{expiresIn: '1h'});
        res.json({token});
    }
    else
    {
        res.status(401).json({
            message: 'Invalid credentials'
        });
    }


});


app.get('/dashboard',(req,res) => {
    const token   = req.headers['authorization'];
    if(!token) return res.status(403).json({ message : 'Token required'});

    try {
        const verified = jwt.verify(token,SECRET_KEY);
        res.json({message: 'welcome to your dashboard , Vindhya'});
    }
    catch{
        return res.status(401).json({ message : 'Invalid token'});
    }
})


app.listen(5000, () => {
    console.log('Server Running Successfully');
})
