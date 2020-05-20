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

  getListGroup2User: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    let nom = req.body.data;
    sequelize.query('Select groupe.id, groupe.nom From groupe2user Inner Join groupe On groupe2user.ref_id_groupe = groupe.id WHERE groupe2user.ref_id_user = $userId',
      { bind: { userId: userId }, type: sequelize.QueryTypes.SELECT }
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

  checkGroupe2User: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    let nom = req.body.data;
    sequelize.query('Select COUNT(*) From groupe2user where ref_id_user = $userId and ref_id_groupe = $idGroupe',
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
  },

  deleteGroupe2user: function(req, res){
    sequelize.query('Delete from groupe2user where ref_id_user = $idUser and ref_id_groupe = $idGroupe',
    { bind: { idUser:req.body.user, idGroupe: req.body.groupe }, type: sequelize.QueryTypes.SELECT }
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

  addUser2Groupe: function(req, res){
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      sequelize.query('INSERT INTO groupe2user (ref_id_user,ref_id_groupe) VALUES ($ref_id_user,$ref_id_groupe)',
      { bind: { 
        ref_id_user: userId,
        ref_id_groupe: req.body.groupe
       }, type: sequelize.QueryTypes.INSERT }
      )
      .then(function(groupe) {
          res.status(201).json(true);
      })
      .catch(function(err) {
        console.log(err);
        return res.status(500).json({ 'error': 'cannot add user' });
      });
    }
  },
  groupe2userNumberUser: function(req, res){
    var headerAuth  = req.body.token;
          var userId      = jwtUtils.getUserId(headerAuth);
          if(userId<0){
            res.status(404).json({ 'error': 'wrong token' });
          }else{
            sequelize.query('Select COUNT(*) From groupe2user WHERE ref_id_groupe = $id',
              { bind: { id: req.body.groupe }, type: sequelize.QueryTypes.SELECT }
            ).then(function(groupe) {
              console.log(groupe)
              if (groupe) {
                res.status(201).json(groupe);
              } else {
                res.status(404).json({ 'error': 'groupe2user to found' });
              }
            }).catch(function(err) {      
              res.status(500).json({ 'error': 'cannot fetch groupe2user' });
            })
          }
  }
  
}