// test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { after, describe, it } = require('mocha');
chai.use(chaiHttp);

// Import the Post model from our models folder so we
// we can use it in our tests.
const Post = require('../models/post');
const app = require('../server');
const agent = chai.request.agent(app);

const should = chai.should();


describe('Posts', function () {
    // Post that we'll use for testing purposes
    const newPost = {
        title: 'post title',
        url: 'https://www.google.com',
        summary: 'post summary'
    };
    it('Should create with valid attributes at POST /posts/new', function (done) {
        // Checks how many posts there are now
        Post.estimatedDocumentCount()
            .then(function (initialDocCount) {
                agent
                    .post('/posts/new')
                    // This line fakes a form post,
                    // since we're not actually filling out a form
                    .set('content-type', 'application/x-www-form-urlencoded')
                    // Make a request to create another
                    .send(newPost)
                    .then(function (res) {
                        Post.estimatedDocumentCount()
                            .then(function (newDocCount) {
                                // Check that the database has status 200
                                res.should.have.status(200);
                                // Check that the database has one more post in it
                                newDocCount.should.equal(initialDocCount + 1)
                                done();
                                console.log(initialDocCount);
                            })
                            .catch(function (err) {
                                done(err);
                            });
                    })
                    .catch(function (err) {
                        done(err);
                    })
            })
            .catch(function (err) {
                done(err);
            });
    });

    after(function () {
        Post.findOneAndDelete(newPost);
    });

});