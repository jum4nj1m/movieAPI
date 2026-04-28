const mongoose = require('mongoose');

// Subdocument
const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    comment: {
        type: String,
        required: [true, 'Comment text is required']
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie Title is Required']
    },
    description: {
        type: String,
        required: [true, 'Movie Description is Required']
    },
    director: {
        type: String,
        required: [true, 'Director Name is Required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is Required']
    },
    year: {
        type: Number,
        required: [true, 'Release Year is Required']
    },
    comments: [commentSchema] 
});

module.exports = mongoose.model('Movie', movieSchema);