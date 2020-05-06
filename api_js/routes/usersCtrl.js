// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,20}$/;

// Routes
module.exports = {
  test: function(req, res){
    return res.status(201).json("connection etablie");
  },
  register: function(req, res) {
    
    // Params
    var email    = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var bio      = req.body.bio;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ 'error': 'email is not valid' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }

    asyncLib.waterfall([
      function(done) {
        sequelize.query('Select email From user WHERE email = $email',
        { bind: { email: email }, type: sequelize.QueryTypes.SELECT }
        )
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        console.log(userFound);
        if (userFound = "[]") {
          bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, done) {
        var newUser = sequelize.query('INSERT INTO user (email,username,password,bio,isAdmin,createdAt,updatedAt) VALUES ($email,$username,$password,$bio,$isAdmin,NOW(),NOW())',
        { bind: { 
          email: email,
          username: username,
          password: bcryptedPassword,
          bio: bio,
          isAdmin: 0
         }, type: sequelize.QueryTypes.INSERT }
        )
        .then(function(newUser) {
          done(newUser);
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      if (newUser) {
        return res.status(201).json('test');
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
  },
  login: function(req, res) {
    console.log(req.body);
    // Params
    var email    = req.body.email;
    var password = req.body.password;
    if (req.method == "OPTIONS")
    {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end();
    }

    if (email == null ||  password == null) {
      console.log('erreur 404');
      return res.status(400).json({ 'error': 'missing parameters' });
    }
    console.log('hello');

    asyncLib.waterfall([
      function(done) {
        sequelize.query('Select id,email, password From user WHERE email = $email',
        { bind: { email: email }, type: sequelize.QueryTypes.SELECT }
        )
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if (userFound) {
          bcrypt.compare(password, userFound[0].password, function(errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(201).json({ 'error': 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, done) {
        if(resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ 'error': 'invalid password' });
        }
      }
    ], function(userFound) {
      if (userFound) {
		 console.log(userFound);
        return res.status(201).json({
          'userId': userFound[0].id,
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  },
  getUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      console.log(userId);
    sequelize.query('Select username, bio from user where id = $id limit 1',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
    }
  },
  updateUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }

    // Params
    var bio = req.body.bio;

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          attributes: ['id', 'bio'],
          where: { id: userId }
        }).then(function (userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          userFound.update({
            bio: (bio ? bio : userFound.bio)
          }).then(function() {
            done(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
      }
    });
  },
  updateUser: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
  },
  getlist: function(req, res) {
    let nom = req.body.data;
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('Select id, username From user WHERE username LIKE $nom',
      { bind: { nom: '%'+nom+'%' }, type: sequelize.QueryTypes.SELECT }
    ).then(function(user) {
      console.log(user)
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
    }
  }
}