// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')
var cryptoUtils  = require('../utils/crypto.utils');

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  addChat: function(req, res) {
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var data = JSON.parse(cryptoUtils.decrypt(req.body.data));
    console.log(data)
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
        let nom = Math.random().toString(36).substring(7);
  asyncLib.waterfall([
    function(done) {
        sequelize.query('INSERT INTO chat (nom,createdAt,updateAt) VALUES ($nom,NOW(),NOW())',
        { bind: { nom: nom }, type: sequelize.QueryTypes.INSERT }
      )
      .then(function(friendFound) {
        done(friendFound);
      })
      .catch(function(err) {
        console.log(err)
        return res.status(500).json({ 'error': 'unable to find friends' });
      });
    }
  ],function(friendFound) {
      console.log(friendFound)
      for (let index = 0; index < data.friend.length; index++) {
          console.log(data.friend[index])
          console.log(friendFound[0])
          sequelize.query('INSERT INTO chat2user (ref_id_chat,ref_id_user) VALUES ($idchat,$iduser)',
          { bind: { idchat: friendFound[0] ,iduser:data.friend[index]}, type: sequelize.QueryTypes.INSERT }
        )
        .then(function(chatFound) {
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to find friends' });
        }); 
      }
      sequelize.query('INSERT INTO chat2user (ref_id_chat,ref_id_user) VALUES ($idchat,$iduser)',
          { bind: { idchat: friendFound[0] ,iduser:userId}, type: sequelize.QueryTypes.INSERT }
        )
        .then(function(chatFound) {
        })
        .catch(function(err) {
          console.log(err)
          return res.status(500).json({ 'error': 'unable to find friends' });
        }); 
    if (friendFound) {
      return res.status(201).json({'reussie':'true'});
    } else {
      return res.status(500).json({ 'error': 'cannot fetch publication' });
    }
  });
  
}
  },
    // getChat: function(req, res) {
    // var headerAuth  = req.body.token;
    // var data = req.body.data;
    // console.log(data)
    // var userId      = jwtUtils.getUserId(headerAuth);
	// console.log(userId)
    // if(userId<0){
    //   res.status(404).json({ 'error': 'wrong token' });
    // }else{
    //     sequelize.query('select chat.nom From chat Inner Join chat2user On chat2user.ref_id_chat = chat.id WHERE chat2user.ref_id_user = $iduser',
    //       { bind: { iduser: friendFound[0]}, type: sequelize.QueryTypes.SELECT }
    //     )
    //     .then(function(chatFound) {
    //     })
    //     .catch(function(err) {
    //       console.log(err)
    //       return res.status(500).json({ 'error': 'unable to find friends' });
    //     }); 
    // if (chatFound) {
    //   return res.status(201).json(chatFound);
    // } else {
    //   return res.status(500).json({ 'error': 'cannot fetch publication' });
    // }
    
    // }
    // },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getChat: function(req, res) {
      var headerAuth  = cryptoUtils.decrypt(req.body.token);
        var userId      = jwtUtils.getUserId(headerAuth);
        console.log(userId)
        if(userId<0){
          res.status(404).json({ 'error': 'wrong token' });
        }else{
      asyncLib.waterfall([
        function(done) {
            sequelize.query('select chat.id, chat.nom From chat Inner Join chat2user On chat2user.ref_id_chat = chat.id WHERE chat2user.ref_id_user = $iduser',
          { bind: { iduser: userId}, type: sequelize.QueryTypes.SELECT }
        )
          .then(function(chatFound) {
            done(chatFound);
          })
          .catch(function(err) {
            console.log(err)
            return res.status(500).json({ 'error': 'unable to find friends' });
          });
        }
      ],function(chatFound) {
          console.log(chatFound)
          for (let index = 0; index < chatFound.length; index++) {
              console.log(chatFound[index].id)
              sequelize.query('SELECT user.username FROM chat2user Inner JOIN user ON chat2user.ref_id_user = user.id WHERE chat2user.ref_id_chat = $chatid',
              { bind: { chatid: chatFound[index].id }, type: sequelize.QueryTypes.SELECT }
            )
            .then(function(userFound) {
                chatFound[index].userlist = userFound
            })
            .catch(function(err) {
              console.log(err)
              return res.status(500).json({ 'error': 'unable to find friends' });
            }); 
          }
        if (chatFound) {
          return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(chatFound)));
        } else {
          return res.status(500).json({ 'error': 'cannot fetch publication' });
        }
      });
    
    }
    }
}


