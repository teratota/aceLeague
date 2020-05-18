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

  getUserFriend: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend) {
        res.status(201).json(friend);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },
  addNewUserFriend: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Insert into friend (ref_id_user_principal,ref_id_user_friend,validate) values ($idPrincipal,$idFriend,0) ',
      { bind: { idPrincipal: userId , idFriend: req.body.friend}, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend) {
        res.status(201).json(friend);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },
  ValidateNewUserFriend: function(req, res) {
    //update or delete
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    if(req.body.validate = true){
        sequelize.query('Update friend set validate = 1 where id = $id ',
        { bind: { id: req.body.id }, type: sequelize.QueryTypes.SELECT }
        ).then(function(friend) {
          console.log(friend)
          if (friend) {
            res.status(201).json(friend);
          } else {
            res.status(404).json({ 'error': 'friend not found' });
          }
        }).catch(function(err) {      
            res.status(500).json({ 'error': 'cannot fetch friends' });
        })
    }else{
        sequelize.query('Delete from friend where id = $id',
        { bind: { id: req.body.id }, type: sequelize.QueryTypes.SELECT }
      ).then(function(friend) {
        console.log(friend)
        if (friend) {
            res.status(201).json(friend);
        } else {
            res.status(404).json({ 'error': 'friend not found' });
        }
      }).catch(function(err) {      
          res.status(500).json({ 'error': 'cannot fetch friends' });
      })
    }
    }
    
  },
  getListValidateNewUserFriend: function(req, res){
      //list pas valider
      var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 0',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend) {
        res.status(201).json(friend);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  }
  
}