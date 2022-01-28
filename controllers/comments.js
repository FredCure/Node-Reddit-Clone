const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {

    // CREATE Comment
    app.post('/posts/:postId/comments', (req, res) => {
        // INSTANTIATE INSTANCE OF MODEL
        if (req.user) {
            const comment = new Comment(req.body);

            // SAVE INSTANCE OF Comment MODEL TO DB
            comment
                .save()
                .then(() => Post.findById(req.params.postId))
                .then((post) => {
                    post.comments.unshift(comment);
                    return post.save();
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

