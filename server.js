const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
// Set db
require('./data/reddit-db');
const app = express();

const port = 3000


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// routes

require('./controllers/posts')(app);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/posts/new', (req, res) => {
    res.render('posts/new')
})


app.get('/page1', (req, res) => {
    res.render('pages/page1')
})


app.listen(port, () => {
    console.log(`Reddit app listening at http://localhost:${port}`)
})