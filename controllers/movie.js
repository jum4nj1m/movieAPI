const Movie = require("../models/Movie");
const { errorHandler } = require("../auth");

module.exports.addMovie = (req, res) => {
    return Movie.findOne({ title: req.body.title })
        .then(existingMovie => {
            if (existingMovie) {
                return res.status(409).send({ message: "Movie already exists" });
            }

            let newMovie = new Movie({
                title: req.body.title,
                description: req.body.description,
                director: req.body.director,
                genre: req.body.genre,
                year: req.body.year
            });

            return newMovie.save()
                .then(result => res.status(201).send(result))
                .catch(err => errorHandler(err, req, res));
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.getMovie = (req, res) => {
    return Movie.findById(req.params.id)
        .then(movie => {
            if (movie) {
                return res.status(200).send(movie);
            }
            return res.status(404).send({ message: "Movie not found" });
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.getAllMovies = (req, res) => {
    return Movie.find({})
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send({ movies: result });
            }
            return res.status(404).send({ message: "No movies found" });
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.updateMovie = (req, res) => {

    let updatedMovie = {
        title: req.body.title,
        description: req.body.description,
        director: req.body.director,
        genre: req.body.genre, 
        year: req.body.year 
    };


    return Movie.findByIdAndUpdate(req.params.id, updatedMovie, { new: true })
        .then(movie => {
            if (movie) {
                res.status(200).send({ 
                    message: "Movie updated successfully", 
                    updatedMovie: movie 
                });
            } else {
                res.status(404).send({ message: "Movie not found" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.deleteMovie = (req, res) => {
    
    return Movie.findByIdAndDelete(req.params.id)
        .then(movie => {
            if (movie) {
                res.status(200).send({ message: "Movie deleted successfully" });
            } else {
                res.status(404).send({ message: "Movie not found" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkoutStatus = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField).then(course => {
        if (course) {
            if (course.isActive) {
                return res.status(200).send('Course already activated');
            }
            
            return res.status(200).send(true);
        } else {
            return res.status(404).send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.addComment = (req, res) => {

    const newComment = {
        userId: req.user.id, 
        comment: req.body.comment
    };

    return Movie.findByIdAndUpdate(
        req.params.id, 
        { $push: { comments: newComment } },
        { new: true } 
    )
    .then(updatedMovie => {
        if (updatedMovie) {
            res.status(201).send({
                message: "Comment added successfully",
                updatedMovie: updatedMovie
            });
        } else {
            res.status(404).send({ message: "Movie not found" });
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getComments = (req, res) => {
    return Movie.findById(req.params.id)
        .then(movie => {
            if (movie) {
                res.status(200).send({ comments: movie.comments });
            } else {
                res.status(404).send({ message: "Movie not found" });
            }
        })
        .catch(err => errorHandler(err, req, res));
};