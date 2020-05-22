// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')
const fs = require('fs');

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  getList: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    let nom = req.body.data;
    sequelize.query('Select id, nom From groupe WHERE nom LIKE $nom and private = 0',
      { bind: { nom: '%'+nom+'%' }, type: sequelize.QueryTypes.SELECT }
    ).then(function(groupe) {
      console.log(groupe)
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  addGroupe: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      let r = Math.random().toString(36).substring(7);
      if(req.body.file != ''){
        nameFile = r;
      }
      var newUser = sequelize.query('INSERT INTO groupe (ref_id_user,nom,private,description,image,createdAt,updatedAt) VALUES ($ref_id_user,$nom,$private,$description,$image,NOW(),NOW())',
      { bind: { 
        ref_id_user: userId,
        nom: req.body.form.nom,
        private: req.body.form.private,
        description: req.body.form.description,
        image: nameFile
       }, type: sequelize.QueryTypes.INSERT }
      )
      .then(function(newUser) {
        if(req.body.file != ''){
          fs.writeFile('./files/groupe/'+r, req.body.file, function (err) {
            res.status(201).json('test');
          });
        }else{
          res.status(201).json('test');
        }
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({ 'error': 'cannot add user' });
      });
    }
  },
  updateGroupe: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      console.log(req.body.form);
      sequelize.query('Update groupe set nom = $nom, description = $description ,private = $private,updatedAt = NOW() where id = $id and ref_id_user = $userId',
      { bind: { 
        userId: userId,
        id: req.body.groupe,
        nom: req.body.form.nom,
        private: req.body.form.private,
        description: req.body.form.description,
       }, type: sequelize.QueryTypes.UPDATE }
      )
      .then(function(newUser) {
          res.status(201).json(true);
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({ 'error': 'cannot add user' });
      });
    }
  },
  updateGroupeImage: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      asyncLib.waterfall([
        function(done) {
          var newUser = sequelize.query('Select image from groupe where id = $id',
          { bind: { 
            id: req.body.groupe,
          }, type: sequelize.QueryTypes.SELECT }
          )
          .then(function(imagegroupe) {
            if(imagegroupe[0].image != null){
              fs.writeFile('./files/groupe/'+imagegroupe[0].image, req.body.file, function (err) {
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
          sequelize.query('Update groupe set image = $image where id = $id',
          { bind: { 
            id: req.body.groupe,
            image: namefile,
          }, type: sequelize.QueryTypes.UPDATE }
          )
          .then(function(groupe) {
            fs.writeFile('./files/groupe/'+namefile, req.body.file, function (err) {
              if (err) return console.log(err);
              done(true)
            });
          })
          .catch(function(err) {
            console.log(err);
            return res.status(500).json({ 'error': 'cannot add user' });
          });
        },
      ], function(groupe) {
        if (groupe) {
          return res.status(201).json(groupe);
        } else {
          return res.status(500).json({ 'error': 'cannot update user profile' });
        }
      });
    }
  },
  getGroupe: function(req, res) {
    var headerAuth  = req.body.token;
  var userId      = jwtUtils.getUserId(headerAuth);
  if(userId<0){
    res.status(404).json({ 'error': 'wrong token' });
  }else{
    sequelize.query('Select * From groupe WHERE id = $id',
      { bind: { id: req.body.groupe }, type: sequelize.QueryTypes.SELECT }
    ).then(function(groupe) {
      console.log(groupe)
      if (groupe[0].image != null) { 
        let file = fs.readFileSync ('./files/groupe/' + groupe[0].image,  'utf8' );
        groupe[0].image = file
      }
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },
  getMyGroupe: function(req, res) {
    var headerAuth  = req.body.token;
  var userId      = jwtUtils.getUserId(headerAuth);
  if(userId<0){
    res.status(404).json({ 'error': 'wrong token' });
  }else{
    sequelize.query('Select * From groupe WHERE ref_id_user = $id',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(groupe) {
      console.log(groupe)
      if (groupe.image != null) { 
        let file = fs.readFileSync ('./files/groupe/' + groupe.image,  'utf8' );
        groupe.image = file
      }
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },

  deleteGroupe: function(req, res) {
    sequelize.query('Delete from groupe where id = $id and ref_id_user = $userId',
    { bind: { userId:userId, id: req.body.id }, type: sequelize.QueryTypes.SELECT }
    ).then(function(groupe) {
      if (groupe) {
          res.status(201).json(true);
      } else {
          res.status(404).json({ 'error': 'groupe not found' });
      }
    }).catch(function(err) {      
        res.status(500).json({ 'error': 'cannot delete groupe' });
    })
  },

  checkGroupeAuthor: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    let nom = req.body.data;
    sequelize.query('Select COUNT(*) From groupe where ref_id_user = $userId and id = $idGroupe',
      { bind: { userId: userId, idGroupe: req.body.groupe }, type: sequelize.QueryTypes.SELECT }
    ).then(function(groupe) {
      console.log(groupe)
      if (groupe[0]['COUNT(*)'] == 1) {
        res.status(201).json(true);
      } else {
        res.status(404).json(false);
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
}