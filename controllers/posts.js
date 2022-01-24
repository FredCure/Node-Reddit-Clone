const Post = require('../models/post');

module.exports = (app) => {

    // NEW POST FORM
    app.get('/posts/new', (req, res) => {
        res.render('posts/new')
    })


    // CREATE
    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        console.log(req.body);
        const post = new Post(req.body);

        // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
        post.save(() => res.redirect('../posts/index'));
    });


    // SHOW ALL POSTS

    app.get('/posts/index', async (req, res) => {
        try {
            const posts = await Post.find({}).lean();
            return res.render('posts/index', { posts });
        } catch (err) {
            console.log(err.message);
        }
    });


    // LOOK UP ONE POST

    app.get('/posts/:id', async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).lean().populate('comments');
            return res.render('posts/show', { post });
        } catch (err) {
            console.log(err.message);
        }
    });


    // SUBREDDIT
    app.get('/n/:subreddit', async (req, res) => {
        try {
            const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
            return res.render('posts/index', { posts });
        } catch (err) {
            console.log(err.message);
        }
    });

};

