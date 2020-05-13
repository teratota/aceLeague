// Imports

var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')
const fs = require('fs');
//  var multipart = require('connect-multiparty');
//  var multiparty = multipart();
//  multipartyMiddleware = multiparty({ uploadDir: './files' });
// var multer  =   require('multer');
// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './files');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });
// var upload = multer({ storage : storage}).single('userPhoto');


// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  getUserPublication: function(req, res) {
    // Getting auth header
    let PubObject;
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('Select user.username, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_user = $id',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
      ).then(function(publication) {
        PubObject = publication;
        console.log(publication);
        for (let i = 0; i < publication.length; i++) {
            
          if (publication[i].image != null) {
            let file = fs.readFileSync ('./files/publication/' + publication[i].image,  'utf8' );
            publication[i].image = file
          }

        }
        if (publication) {
          res.status(201).json(publication);
        } else {
          res.status(404).json({ 'error': 'publications not found' });
        }
      }).catch(function(err) {
        res.status(500).json({ 'error': 'cannot fetch publications' });
      })
    }
  },
  uploadPubliction: function(req, res){
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = r;
    sequelize.query('INSERT INTO publication (ref_id_user,image,description, createdAt) Values ($ref_id_user, $image, $description, NOW())',
      { bind: { ref_id_user: userId, image: nameFile, description: req.body.form.description }, type: sequelize.QueryTypes.INSERT }
    ).then(function(publication) {
		//console.log(req.body.file);
      fs.writeFile('./files/publication/'+r, req.body.file, function (err) {
        if (err) return console.log(err);
        res.status(201).json('test');
      });
    }).catch(function(err) {
      console.log(err)
      res.status(500).json({ 'error': 'cannot fetch publications' });
    })
  },
  getAllPublications: function(req, res) {   
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    asyncLib.waterfall([
      function(done) {
        sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1',
        { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
        )
        .then(function(friendFound) {
          done(null, friendFound);
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to find friends' });
        });
      },
      function(friendFound, done) {
        let friendList = "";

        for (let i = 0; i < friendFound.length; i++) {
          if (i == 0) {
            friendList += friendFound[i].ref_id_user_friend;
          }
          else
            friendList += "," + friendFound[i].ref_id_user_friend;
        }

        friendList = '(\'' + friendList + '\')'
        
        
        sequelize.query('Select user.username, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_user IN '+ friendList,
        { type: sequelize.QueryTypes.SELECT }
        )
        .then(function(publicationList) {
          var stringified = JSON.stringify(publicationList);

          for (let i = 0; i < publicationList.length; i++) {
            
              if (publicationList[i].image != null) {
                //async
                /*
                fs.readFile('../files/publication/'+publicationList[i].image, {encoding: 'utf8'}, function (err, data) {
                    if (err) throw err;
                    console.log(data);
                });
                */
                let file = fs.readFileSync ('./files/publication/' + publicationList[i].image,  'utf8' );
                publicationList[i].image = file
              }

            }
          done(friendList, publicationList);
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to find friends' });
        });
      }
    ],function(friendList, publicationList) {
      if (publicationList) {
        return res.status(201).json(publicationList);
      } else {
        return res.status(500).json({ 'error': 'cannot fetch publication' });
      }
    });
  },

}