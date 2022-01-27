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
};