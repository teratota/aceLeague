// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')

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
      }else{
        let nom = req.body.data;
        sequelize.query('Select id, nom From pro WHERE nom LIKE $nom',
          { bind: { nom: '%'+nom+'%' }, type: sequelize.QueryTypes.SELECT }
        ).then(function(pro) {
          console.log(pro)
          if (pro) {
            res.status(201).json(pro);
          } else {
            res.status(404).json({ 'error': 'friend not found' });
          }
        }).catch(function(err) {      
          res.status(500).json({ 'error': 'cannot fetch friends' });
        })
      }
      },
      getListProUser: function(req, res) {
        var headerAuth  = req.body.token;
        var userId      = jwtUtils.getUserId(headerAuth);
        if(userId<0){
          res.status(404).json({ 'error': 'wrong token' });
        }else{
          let nom = req.body.data;
          sequelize.query('Select id, nom From pro WHERE ref_id_user = $userId',
            { bind: { userId: userId }, type: sequelize.QueryTypes.SELECT }
          ).then(function(pro) {
            console.log(pro)
            if (pro) {
              res.status(201).json(pro);
            } else {
              res.status(404).json({ 'error': 'friend not found' });
            }
          }).catch(function(err) {      
            res.status(500).json({ 'error': 'cannot fetch friends' });
          })
        }
        },
        addPro: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            let r = Math.random().toString(36).substring(7);
            let nameFile = r;
            var newUser = sequelize.query('INSERT INTO pro (ref_id_user,nom,type,description,image,createdAt,updatedAt) VALUES ($ref_id_user,$nom,$type,$description,$image,NOW(),NOW())',
            { bind: { 
              ref_id_user: userId,
              nom: req.body.form.nom,
              type: req.body.form.type,
              description: req.body.form.description,
              image: nameFile
             }, type: sequelize.QueryTypes.INSERT }
            )
            .then(function(newUser) {
              fs.writeFile('./files/pro/'+r, req.body.file, function (err) {
                if (err) return console.log(err);
                res.status(201).json(true);
              });
            })
            .catch(function(err) {
              console.log(err);
              return res.status(500).json({ 'error': 'cannot add user' });
            });
          }
        },
        updatePro: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            var newUser = sequelize.query('Update pro set nom = $nom,type = $type, description = $description ,updatedAt = NOW() where id = $id',
            { bind: { 
              $id: req.body.pro,
              nom: req.body.form.nom,
              type: req.body.form.type,
              description: req.body.form.description,
             }, type: sequelize.QueryTypes.INSERT }
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
        updateProImage: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            var newUser = sequelize.query('Select image from pro where id = $id',
            { bind: { 
              $id: req.body.pro,
              
             }, type: sequelize.QueryTypes.SELECT }
            )
            .then(function(imagepro) {
              fs.writeFile('./files/pro/'+imagepro.image, req.body.file, function (err) {
                if (err) return console.log(err);
                res.status(201).json(true);
              });
            })
            .catch(function(err) {
              console.log(err);
              return res.status(500).json({ 'error': 'cannot add user' });
            });
          }
        },
        getPro: function(req, res) {
          var headerAuth  = req.body.token;
        var userId      = jwtUtils.getUserId(headerAuth);
        if(userId<0){
          res.status(404).json({ 'error': 'wrong token' });
        }else{
          sequelize.query('Select * From pro WHERE id = $id',
            { bind: { id: req.body.pro }, type: sequelize.QueryTypes.SELECT }
          ).then(function(pro) {
            console.log(pro)
            if (pro.image != null) { 
              let file = fs.readFileSync ('./files/pro/' + pro.image,  'utf8' );
              pro.image = file
            }
            if (pro) {
              res.status(201).json(pro);
            } else {
              res.status(404).json({ 'error': 'friend not found' });
            }
          }).catch(function(err) {      
            res.status(500).json({ 'error': 'cannot fetch friends' });
          })
        }
        },
        deletePro: function(req, res) {
          sequelize.query('Delete pro groupe where id = $id and ref_id_user = $userId',
          { bind: { userId:userId, id: req.body.id }, type: sequelize.QueryTypes.SELECT }
          ).then(function(pro) {
            if (pro) {
                res.status(201).json(true);
            } else {
                res.status(404).json({ 'error': 'pro not found' });
            }
          }).catch(function(err) {      
              res.status(500).json({ 'error': 'cannot delete pro' });
          })
        },
        getNumberAbonnement: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            sequelize.query('Select COUNT(*) From abonnement WHERE ref_id_pro = $id',
              { bind: { id: req.body.pro }, type: sequelize.QueryTypes.SELECT }
            ).then(function(pro) {
              console.log(pro)
              if (pro) {
                res.status(201).json(pro);
              } else {
                res.status(404).json({ 'error': 'friend not found' });
              }
            }).catch(function(err) {      
              res.status(500).json({ 'error': 'cannot fetch friends' });
            })
          }
        },
        getNumberAbonnementUser: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            sequelize.query('Select COUNT(*) From abonnement WHERE ref_id_user = $id',
              { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
            ).then(function(pro) {
              console.log(pro)
              if (pro) {
                res.status(201).json(pro);
              } else {
                res.status(404).json({ 'error': 'friend not found' });
              }
            }).catch(function(err) {      
              res.status(500).json({ 'error': 'cannot fetch friends' });
            })
          }
        },
        addAbonnement: function(req, res){
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            sequelize.query('INSERT INTO abonnement (ref_id_user,ref_id_pro) VALUES ($ref_id_user,$ref_id_pro)',
            { bind: { 
              ref_id_user: userId,
              ref_id_pro: req.body.pro
             }, type: sequelize.QueryTypes.INSERT }
            )
            .then(function(pro) {
                res.status(201).json(true);
            })
            .catch(function(err) {
              console.log(err);
              return res.status(500).json({ 'error': 'cannot add user' });
            });
          }
        },
        checkAbonnement: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }
          let nom = req.body.data;
          sequelize.query('Select COUNT(*) From abonnement where ref_id_user = $userId and ref_id_pro = $idpro',
            { bind: { userId: userId, idpro: req.body.pro }, type: sequelize.QueryTypes.SELECT }
          ).then(function(pro) {
            console.log(pro)
            if (pro[0]['COUNT(*)'] == 1) {
              res.status(201).json(true);
            } else {
              res.status(404).json(false);
            }
          }).catch(function(err) {      
            res.status(500).json({ 'error': 'cannot fetch friends' });
          })
        },
        
}