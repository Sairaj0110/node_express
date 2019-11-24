const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//import route
const authRoute = require('./routes/auth')



dotenv.config()

//connect to db
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('Connected to db'))

//middleware
app.use(express.json());



//route middleware
app.use('/api/user', authRoute)


app.listen(3001, () => console.log('Server is running'));   