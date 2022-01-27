const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = (app) => {

    // SIGN UP FORM
    app.get('/signup', (req, res) => {
        res.render('posts/signup')
    })



    // SIGN UP POST
    app.post('/signup', (req, res) => {
        // Create User and JWT
        const user = new User(req.body);

        user
            .save()
            .then((user) => {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                return res.redirect('../posts/index');
            })
            .catch((err) => {
                console.log(err.message);
                return res.status(400).send({ err });
            });
    });

    // LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('../posts/index');
    });

    // LOGIN FORM
    app.get('/login', (req, res) => {
        res.render('posts/login')
    });

    // LOGIN
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
        // Find this user name
        User.findOne({ username }, 'username password')
            .then((user) => {
                if (!user) {
                    // User not found
                    return res.status(401).send({ message: 'Wrong Username or Password' });
                }
                // Check the password
                user.comparePassword(password, (err, isMatch) => {
                    if (!isMatch) {
                        // Password does not match
                        return res.status(401).send({ message: 'Wrong Username or password' });
                    }
                    // Create a token
                    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                        expiresIn: '60 days',
                    });
                    // Set a cookie and redirect to root
                    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                    return res.redirect('../posts/index');
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};