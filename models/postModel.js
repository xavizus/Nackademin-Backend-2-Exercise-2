const {Post} = require('../database/mongodb');
module.exports = {
    insertPost: async (title, content) => {
        return await Post.create({
            title: title,
            content: content
        }).then((document,err ) => {
            if(err) return false;
            return document._id;
        });
    },

    updatePost: async (title, content, postId) => {
       return await Post.findByIdAndUpdate(postId, { "title": title, "content": content}, {useFindAndModify: false, versionKey: false})
            .then((document,err ) => {
                if(err) return false;
                return document._id;
            });
    },
    deletePost: async (postId) => {
        return await Post.deleteOne({_id: postId})
            .then((document,err ) => {
                if(err) return false;
                return document.deletedCount;
            });
    },
    getPosts: async() => {
        return await Post.find({}, {'title': 1, 'content': 1});
    },
    getPost: async(postId) => {
        return await Post.findOne({_id: postId}, {'title': 1, 'content': 1});
    }
}