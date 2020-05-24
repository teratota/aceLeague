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
            if(req.body.file != ''){
              nameFile = r;
            }
            sequelize.query('INSERT INTO pro (ref_id_user,nom,type,description,image,createdAt,updatedAt) VALUES ($ref_id_user,$nom,$type,$description,$image,NOW(),NOW())',
            { bind: { 
              ref_id_user: userId,
              nom: req.body.form.nom,
              type: req.body.form.type,
              description: req.body.form.description,
              image: nameFile
             }, type: sequelize.QueryTypes.INSERT }
            )
            .then(function(newUser) {
              if(req.body.file != ''){
                fs.writeFile('./files/pro/'+r, req.body.file, function (err) {
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
        updatePro: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            var newUser = sequelize.query('Update pro set nom = $nom,type = $type, description = $description ,updatedAt = NOW() where id = $id and ref_id_user = $userId',
            { bind: { 
              userId :userId,
              id: req.body.pro,
              nom: req.body.form.nom,
              type: req.body.form.type,
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
        updateProImage: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            asyncLib.waterfall([
              function(done) {
                sequelize.query('Select image from pro where id = $id and ref_id_user = $userId',
                { bind: { 
                  userId :userId,
                  id: req.body.pro,
                }, type: sequelize.QueryTypes.SELECT }
                )
                .then(function(imagepro) {
                  if(imagepro[0].image != null){
                    fs.writeFile('./files/pro/'+imagepro[0].image, req.body.file, function (err) {
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
                var newUser = sequelize.query('Update pro set image = $image ,updatedAt = NOW() where id = $id and ref_id_user = $userId',
                { bind: { 
                  userId: userId,
                  id: req.body.pro,
                  image: namefile,
                }, type: sequelize.QueryTypes.UPDATE }
                )
                .then(function(newUser) {
                  fs.writeFile('./files/pro/'+namefile, req.body.file, function (err) {
                    if (err) return console.log(err);
                    done(true)
                  });
                })
                .catch(function(err) {
                  console.log(err);
                  return res.status(500).json({ 'error': 'cannot add user' });
                });
              },
            ], function(pro) {
              if (pro) {
                return res.status(201).json(pro);
              } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
              }
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
            if (pro[0].image != null) { 
              let file = fs.readFileSync ('./files/pro/' + pro[0].image,  'utf8' );
              pro[0].image = file
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
            if(req.body.user != null){
              userId = req.body.user
            }
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
        checkProAuthor: function(req, res) {
          var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }
          let nom = req.body.data;
          sequelize.query('Select COUNT(*) From pro where ref_id_user = $userId and id = $idPro',
            { bind: { userId: userId, idPro: req.body.pro }, type: sequelize.QueryTypes.SELECT }
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