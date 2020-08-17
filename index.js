const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DATABASE}`;
const app = express();
const port = process.env.PORT || 8080;

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
mongoose.connect(uri,  {useNewUrlParser: true, useUnifiedTopology: true});

/**
 * mongoose Models
 */
const Post = mongoose.model('post', {
    title: String,
    content: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
});

const Comment = mongoose.model('comment', {
    comment: String,
});

/**
 * Posts a new post.
 */
app.post('/addPost', (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data);
        res.status(201).json({last_inserted_id: data._id});
    });
});

app.put('/updatePost/:postId', (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, { "title": req.body.title, "content": req.body.content}, {useFindAndModify: false, versionKey: false},(err, doc) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.status(200).json(doc);
    });
});

app.delete('/deletePost/:postId', (req, res) => {
   Post.deleteOne({_id: req.params.postId}, (err, doc) => {
       if (err) {
           res.status(500).json(err);
           return;
       }
       res.status(200).json(doc);
   });
});

app.post('/addComment/:postId', (req, res) => {
    Post.findById(req.params.postId, (err, postDoc) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        Comment.create(req.body.comment, (err, commentDoc) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            commentDoc.comments = req.body.comment;
            commentDoc.save();
            postDoc.comments.push(commentDoc);
            postDoc.save();
            res.status(201).json(postDoc);
        });
    });
});



app.listen(port, () => {
    console.log(`Listen on ${port}`);
})