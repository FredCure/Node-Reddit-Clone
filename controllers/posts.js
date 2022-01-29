const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


module.exports = (app) => {

    // NEW POST FORM
    app.get('/posts/new', (req, res) => {
        const currentUser = req.user;

        res.render('posts/new', { currentUser })
    })


    // CREATE
    app.post('/posts/new', (req, res) => {
        if (req.user) {
            const userId = req.user._id;
            const post = new Post(req.body);
            post.author = userId;

            post
                .save()
                .then(() => User.findById(userId))
                .then((user) => {
                    user.posts.unshift(post);
                    user.save();
                    // REDIRECT TO THE NEW POST
                    return res.redirect(`/posts/${post._id}`);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });


    // SHOW ALL POSTS

    app.get('/posts/index', async (req, res) => {
        const currentUser = req.user;

        try {
            const posts = await Post.find({}).lean().populate('author');
            return res.render('posts/index', { posts, currentUser });
        } catch (err) {
            console.log(err.message);
        }
    });


    // LOOK UP ONE POST

    app.get('/posts/:id', async (req, res) => {
        const currentUser = req.user;

        try {
            const post = await Post.findById(req.params.id).lean().populate('comments').populate('author');
            return res.render('posts/show', { post, currentUser });
        } catch (err) {
            console.log(err.message);
        }
    });


    // SUBREDDIT
    app.get('/n/:subreddit', async (req, res) => {
        const currentUser = req.user;

        try {
            const posts = await Post.find({ subreddit: req.params.subreddit }).lean().populate('author');
            return res.render('posts/index', { posts, currentUser });
        } catch (err) {
            console.log(err.message);
        }
    });

};

