const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
    const today = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {  

            // const saltRounds = 10; // default 10
            // let salt = bcrypt.genSaltSync(saltRounds);
            // const hash = bcrypt.hashSync(req.body.password, salt);       
            
            // userData.password = hash;

            // User.create(userData)
            // .then(user => {
            //     res.json({status: user.email + 'registered'});
            // })
            // .catch(err => {
            //     res.send('error: ' + err);
            // });

            bcrypt.hash(req.body.password, 10, (err, hash) => {

                userData.password = hash                
                User.create(userData)
                .then(user => {
                    res.json({status: user.email + 'registered'});
                })
                .catch(err => {
                    res.send('error: ' + err);
                });
            });
        } else {
            res.json({error: "User already exists"});
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    })
});

users.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {        
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                jwt.sign(user.dataValues, process.env.SECRET_KEY,  { expiresIn: '15s'}, (err, token) => {
                    res.json({
                        token
                    });
                });
            } else {
                res.status(400).json({error: 'Password Fail'});    
            }
        } else {
            res.status(400).json({error: 'User doen not exist'});
        }
    })
    .catch(err => {
        res.status(400).json({ error: err});
    })
});

module.exports = users;