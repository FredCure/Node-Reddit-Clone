require('dotenv').config();

const checkAuth = require('./middleware/checkAuth');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
// Set db
require('./data/reddit-db');
const app = express();
app.use(cookieParser());
const port = 3000


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkAuth);



// routes

require('./controllers/auth')(app);
require('./controllers/posts')(app);
require('./controllers/comments')(app);

app.get('/', (req, res) => {
    res.render('home')
})



app.get('/page1', (req, res) => {
    const currentUser = req.user;

    res.render('pages/page1', { currentUser })
})


app.listen(port, () => {
    console.log(`Reddit app listening at http://localhost:${port}`)
})



module.exports = app;