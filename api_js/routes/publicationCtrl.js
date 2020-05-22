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
      if(req.body.user != null){
        userId = req.body.user
      }
      asyncLib.waterfall([
      function(done) {
      sequelize.query('Select user.username, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_user = $id and publication.ref_id_groupe is null',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
      ).then(function(publication) {
        PubObject = publication;
       let publicationList = ""
        for (let i = 0; i < publication.length; i++) {
          if (i == 0) {
            publicationList += publication[i].id;
          }
          else{
            publicationList += "," + publication[i].id;
          }
          if (publication[i].image != null) {
            let file = fs.readFileSync ('./files/publication/' + publication[i].image,  'utf8' );
            publication[i].image = file
          }
        }
        publicationList = '(\'' + publicationList + '\')'
        done(null,publication, publicationList);
      }).catch(function(err) {
        res.status(500).json({ 'error': 'fcannot fetch publications' });
      })
    },
    function(publication, publicationList, done) {
      sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in '+ publicationList,
          { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
          ).then(function(like) {
            for (let i = 0; i < publication.length; i++) {
              if(like == '[]'){
                for(let x = 0; x < like.length; x++){
                  if(like[x].ref_id_publication == publication[i].id){
                    publication[i].like = true
                  }else if(publication[i].like != true){
                    publication[i].like = false
                  }
                }
              }else{
                publication[i].like = false
              }
            }
            done(publication)
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch publications' });
          })
        }
      ],
    function(publication) {
      if (publication) {
        res.status(201).json(publication);
      } else {
        res.status(404).json({ 'error': 'publications not found' });
      }
    })
  }
  },
  uploadPublication: function(req, res){
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if(req.body.file != ''){
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_user,image,description, createdAt) Values ($ref_id_user, $image, $description, NOW())',
      { bind: { ref_id_user: userId, image: nameFile, description: req.body.form.description }, type: sequelize.QueryTypes.INSERT }
    ).then(function(publication) {
      if(req.body.file != ''){
      fs.writeFile('./files/publication/'+r, req.body.file, function (err) {
        if (err) return console.log(err);
        res.status(201).json('test');
      });
    }else{
      res.status(201).json('test');
    }
    }).catch(function(err) {
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
          return res.status(500).json({ 'error': 'unable to find friends' });
        });
      },
      function(friendFound, done) {
        sequelize.query('Select ref_id_pro From abonnement WHERE ref_id_user = $id',
        { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
        )
        .then(function(proFound) {
          done(null, friendFound,proFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to find friends' });
        });
      },
      function(friendFound,proFound, done) {
        let friendList = "";

        for (let i = 0; i < friendFound.length; i++) {
          if (i == 0) {
            friendList += friendFound[i].ref_id_user_friend;
          }
          else
            friendList += "," + friendFound[i].ref_id_user_friend;
        }

        friendList = '(' + friendList + ')'

        let proList = "";

        for (let i = 0; i < proFound.length; i++) {
          if (i == 0) {
            proList += proFound[i].ref_id_pro;
          }
          else
          proList += "," + proFound[i].ref_id_pro;
        }

        proList = '(' + proList + ')'
        
        
        sequelize.query('Select pro.nom ,user.username, publication.image, publication.id, publication.description, publication.createdAt From publication left Join user On publication.ref_id_user = user.id  left JOIN pro on publication.ref_id_pro = pro.id WHERE publication.ref_id_groupe is null and publication.ref_id_user IN '+ friendList + ' or publication.ref_id_pro in '+proList+' ORDER BY publication.createdAt DESC',
        { type: sequelize.QueryTypes.SELECT }
        )
        .then(function(publication) {
          var stringified = JSON.stringify(publication);
          let publicationList = ''
          for (let i = 0; i < publication.length; i++) {
                if (i == 0) {
                  publicationList += publication[i].id;
                }
                else{
                  publicationList += "," + publication[i].id;
                }
            
              if (publication[i].image != null) { 
                let file = fs.readFileSync ('./files/publication/' + publication[i].image,  'utf8' );
                publication[i].image = file
              }

            }
            publicationList = '(' + publicationList + ')'
          done(null ,publication, publicationList);
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to find friends' });
        });
      },
      function(publication, publicationList, done) {
        sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in '+ publicationList,
            { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
            ).then(function(like) {
              for (let i = 0; i < publication.length; i++) {
                if(like.length == '[]'){
                  for(let x = 0; x < like.length; x++){
                    if(like[x].ref_id_publication == publication[i].id){
                      publication[i].like = true
                    }else if(publication[i].like != true){
                      publication[i].like = false
                    }
                  }
                }else{
                  publication[i].like = false
                }
              }
              done(publication)
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot fetch publications' });
            })
          }
    ],function(publication) {
      if (publication) {
        return res.status(201).json(publication);
      } else {
        return res.status(500).json({ 'error': 'cannot fetch publication' });
      }
    });
  },
  getProPublications: function(req, res) {   
    let PubObject;
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('Select pro.nom, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join pro On publication.ref_id_pro = pro.id WHERE publication.ref_id_pro = $id',
      { bind: { id: req.body.pro }, type: sequelize.QueryTypes.SELECT }
      ).then(function(publication) {
        PubObject = publication;
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
  getGroupePublications: function(req, res) {   
    let PubObject;
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('Select user.username, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_groupe = $id',
      { bind: { userid:userId, id:  req.body.groupe }, type: sequelize.QueryTypes.SELECT }
      ).then(function(publication) {
        PubObject = publication;
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
  uploadProPublication: function(req, res) {   
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if(req.body.file != ''){
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_pro,image,description, createdAt) Values ($ref_id_pro, $image, $description, NOW())',
      { bind: { ref_id_pro: req.body.form.pro, image: nameFile, description: req.body.form.description }, type: sequelize.QueryTypes.INSERT }
    ).then(function(publication) {
      if(req.body.file != ''){
        fs.writeFile('./files/publication/'+r, req.body.file, function (err) {
          res.status(201).json('test');
        });
      }else{
        res.status(201).json('test');
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch publications' });
    })
  },
  uploadGroupePublication: function(req, res) {   
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if(req.body.file != ''){
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_user,ref_id_groupe,image,description, createdAt) Values ($ref_id_user, $ref_id_groupe, $image, $description, NOW())',
      { bind: { ref_id_user: userId, ref_id_groupe: req.body.form.groupe, image: nameFile, description: req.body.form.description }, type: sequelize.QueryTypes.INSERT }
    ).then(function(publication) {
      if(req.body.file != ''){
      fs.writeFile('./files/publication/'+r, req.body.file, function (err) {
        if (err) return console.log(err);
        res.status(201).json('test');
      });
      }else{
        res.status(201).json('test');
      }
    }).catch(function(err) {
      console.log(err)
      res.status(500).json({ 'error': 'cannot fetch publications' });
    })
  }
}