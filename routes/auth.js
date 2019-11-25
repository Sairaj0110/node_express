const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { loginValidation, registerValidation } = require('../validate')

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //check if user exist
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists!')

    //new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id })
    } catch (err) {
        res.status(400).send(err)
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email not found!');

    //is password correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('password incorrect!');

    //create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('logged in!');
});

module.exports = router;