// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var cryptoUtils  = require('../utils/crypto.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')
const fs = require('fs');

// Constants
const EMAIL_REGEX     = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,20}$/;

// Routes
module.exports = {
  testConnection: function(req, res){
    if(req.body.token == null){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      var headerAuth  = cryptoUtils.decrypt(req.body.token);
      var userId = jwtUtils.getUserId(headerAuth);
      if(userId<0){
        res.status(404).json({ 'error': 'wrong token' });
      }else{
        res.status(201).json(true);
      }
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  register: function(req, res) {
    
    // Params
    data = cryptoUtils.decrypt(req.body.form)
    data = JSON.parse(data)
    var email    = data.email;
    var username = data.username;
    var password = data.password;
    var bio      = data.bio;
    var level    = data.level;
    var sport    = data.sport;
    var sportDescription    = data.sportDescription;

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
        if (userFound = "[]") {
          bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, done) {
        let r = Math.random().toString(36).substring(7);
        let nameFile = null
        file = cryptoUtils.decrypt(req.body.file)
        file = JSON.parse(file)
        if(file != ''){
          nameFile = r;
        }
        var newUser = sequelize.query('INSERT INTO user (email,username,password,bio,image,level,sport,sportDescription,isAdmin,createdAt,updatedAt) VALUES ($email,$username,$password,$bio,$image,$level,$sport,$sportDescription,$isAdmin,NOW(),NOW())',
        { bind: { 
          email: email,
          username: username,
          password: bcryptedPassword,
          bio: bio,
          image: nameFile,
          level: level,
          sport: sport,
          sportDescription: sportDescription,
          isAdmin: 0
         }, type: sequelize.QueryTypes.INSERT }
        )
        .then(function(newUser) {
          
          if(file != ''){
            fs.writeFile('./files/user/'+r, file, function (err) {
              done(newUser);
            });
          }else{
            done(newUser);
          }
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      sequelize.query('Select id From user WHERE username = $username',
        { bind: { username: username }, type: sequelize.QueryTypes.SELECT }
        )
        .then(function(newUser) {
          if (newUser) {
            return res.status(201).json({
              'token': jwtUtils.generateTokenForUser(userFound)
            });
          } else {
            return res.status(500).json({ 'error': 'cannot add user' });
          }
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    });
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  login: function(req, res) {
    // Params
    data = cryptoUtils.decrypt(req.body.data)
    console.log(data);
    data = JSON.parse(data)
    var email    = data.email;
    var password = data.password;
    if (req.method == "OPTIONS")
    {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end();
    }

    if (email == null ||  password == null) {
      console.log('erreur 404');
      return res.status(400).json({ 'error': 'missing parameters' });
    }

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
        return res.status(201).json({
          'token': jwtUtils.generateTokenForUser(userFound)
        });
      } else {
        return res.status(500).json({ 'error': 'cannot log on user' });
      }
    });
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getUserProfile: function(req, res) {
    // Getting auth header
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var userId      = jwtUtils.getUserId(headerAuth);
    var otherUser = cryptoUtils.decrypt(req.body.user);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      if(otherUser!= ''){
        userId = otherUser
      }
    var user = sequelize.query('Select username, bio, image, sport, level, sportDescription from user where id = $id limit 1',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(user) {
      for (let i = 0; i < user.length; i++) {
            
        if (user[i].image != null) {
          let file = fs.readFileSync ('./files/user/' + user[i].image,  'utf8' );
          user[i].image = file
        }
      }
      if (user) {
        res.status(201).json(cryptoUtils.encrypt(JSON.stringify(user)));
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      console.log(err)
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateUser: function(req, res) {
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var userId      = jwtUtils.getUserId(headerAuth);
    var data = JSON.parse(cryptoUtils.decrypt(req.body.data));
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Update user set username = $username,bio = $bio, sport = $sport ,level = $level,sportDescription= $sportDescription, updatedAt = NOW() where id = $id',
    { bind: { 
      id :userId,
      username: data.username,
      sport: data.sport,
      bio: data.bio,
      level: data.level,
      sportDescription: data.sportDescription,
    }, type: sequelize.QueryTypes.UPDATE }
    )
    .then(function(updateUser) {
      res.status(201).json(true);
    })
    .catch(function(err) {
      console.log(err);
      return res.status(500).json({ 'error': 'cannot add user' });
    });
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateUserImage: function(req, res) {
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var userId      = jwtUtils.getUserId(headerAuth);
    var file = JSON.parse(cryptoUtils.decrypt(req.body.file));
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      asyncLib.waterfall([
        function(done) {
         sequelize.query('Select image from user where id = $id',
          { bind: { 
            id: userId,
          }, type: sequelize.QueryTypes.SELECT }
          )
          .then(function(imageuser) {
            if(imageuser[0].image != null){
              fs.writeFile('./files/user/'+imageuser[0].image, file, function (err) {
                if (err) return console.log(err);
                res.status(201).json(true);
              });
            }else{
              let r = Math.random().toString(36).substring(7);
              done(null,r)
            }  
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({ 'error': 'cannot add user' });
          });
        },
        function(namefile, done) {
          sequelize.query('Update user set image = $image where id = $id',
          { bind: { 
            id: userId,
            image: namefile,
          }, type: sequelize.QueryTypes.UPDATE }
          )
          .then(function(user) {
            fs.writeFile('./files/user/'+namefile, file, function (err) {
              if (err) return console.log(err);
              done(true)
            });
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({ 'error': 'cannot add user' });
          });
        },
      ], function(user) {
        if (user) {
          return res.status(201).json(true);
        } else {
          return res.status(500).json({ 'error': 'cannot update user profile' });
        }
      });
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getlist: function(req, res) {
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var userId      = jwtUtils.getUserId(headerAuth);
    let data = JSON.parse(cryptoUtils.decrypt(req.body.data));
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('Select id, username From user WHERE username LIKE $nom',
      { bind: { nom: '%'+data+'%' }, type: sequelize.QueryTypes.SELECT }
    ).then(function(user) {
      if (user) {
        res.status(201).json(cryptoUtils.encrypt(JSON.stringify(user)));
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
    }
  }
}