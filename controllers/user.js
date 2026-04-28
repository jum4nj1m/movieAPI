const User = require('../models/User');

const bcrypt = require('bcryptjs');
const auth = require("../auth");

const { errorHandler } = require("../auth");

module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    } 
    
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters" });
    } 
    
    else {
        let newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then(result => res.status(201).send({ message: "Registered Successfully" }))
            .catch(err => errorHandler(err, req, res));
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
        .then(result => {
            if(result == null) {
                return res.status(404).send({message: "No email found"});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if(isPasswordCorrect) {
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send({message: "Incorrect username or password."});
                }
            }
        })
        .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send(false);
    } 
};