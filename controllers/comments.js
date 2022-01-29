const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports = (app) => {

    // CREATE Comment
    app.post('/posts/:postId/comments', (req, res) => {
        // INSTANTIATE INSTANCE OF MODEL
        if (req.user) {
            const userId = req.user._id;
            const comment = new Comment(req.body);
            comment.author = userId;

            // SAVE INSTANCE OF Comment MODEL TO DB
            comment
                .save()
                .then(() => Post.findById(req.params.postId))
                .then((post) => {
                    post.comments.unshift(comment);
                    post.save();
                })
                .then(() => res.redirect(`/posts/${req.params.postId}`))
                .catch((err) => {
                    console.log(err);
                });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

};

