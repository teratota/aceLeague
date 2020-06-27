// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
const sequelize = require('../models/index')
var cryptoUtils = require('../utils/crypto.utils');
const fs = require('fs');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  addChat: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var data = JSON.parse(cryptoUtils.decrypt(req.body.data));
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      let nom = Math.random().toString(36).substring(7);
      asyncLib.waterfall([
        function (done) {
          sequelize.query('INSERT INTO chat (nom,createdAt,updateAt,nomvue) VALUES ($nom,NOW(),NOW(),$nomvue)', {
              bind: {
                nom: nom,
                nomvue: data.nom
              },
              type: sequelize.QueryTypes.INSERT
            })
            .then(function (friendFound) {
              fs.writeFile('./files/chat/' + nom + '.json', '[]', function (err) {
                if (err) return console.log(err);
              });
              done(friendFound);
            })
            .catch(function (err) {
              console.log(err)
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        }
      ], function (friendFound) {
        for (let index = 0; index < data.friend.length; index++) {
          sequelize.query('INSERT INTO chat2user (ref_id_chat,ref_id_user) VALUES ($idchat,$iduser)', {
              bind: {
                idchat: friendFound[0],
                iduser: data.friend[index]
              },
              type: sequelize.QueryTypes.INSERT
            })
            .then(function (chatFound) {})
            .catch(function (err) {
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        }
        sequelize.query('INSERT INTO chat2user (ref_id_chat,ref_id_user) VALUES ($idchat,$iduser)', {
            bind: {
              idchat: friendFound[0],
              iduser: userId
            },
            type: sequelize.QueryTypes.INSERT
          })
          .then(function (chatFound) {})
          .catch(function (err) {
            return res.status(500).json({
              'error': 'unable to find friends'
            });
          });
        if (friendFound) {
          return res.status(201).json({
            'reussie': 'true'
          });
        } else {
          return res.status(500).json({
            'error': 'cannot fetch publication'
          });
        }
      });

    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getChat: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
        function (done) {
          sequelize.query('select chat.id, chat.nom, chat.nomvue From chat Inner Join chat2user On chat2user.ref_id_chat = chat.id WHERE chat2user.ref_id_user = $iduser', {
              bind: {
                iduser: userId
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (chatFound) {
              done(chatFound);
            })
            .catch(function (err) {
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        }
      ], function (chatFound) {
        for (let index = 0; index < chatFound.length; index++) {
          sequelize.query('SELECT user.username FROM chat2user Inner JOIN user ON chat2user.ref_id_user = user.id WHERE chat2user.ref_id_chat = $chatid', {
              bind: {
                chatid: chatFound[index].id
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (userFound) {
              chatFound[index].userlist = userFound
            })
            .catch(function (err) {
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        }
        if (chatFound) {
          return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(chatFound)));
        } else {
          return res.status(500).json({
            'error': 'cannot fetch publication'
          });
        }
      });

    }
  },
  getChatMessage: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let room = cryptoUtils.decrypt(req.body.room);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      let data = fs.readFileSync('./files/chat/' + room + '.json', 'utf8')
      if (data) {
        res.status(201).json(data);
      } else {
        res.status(404).json({
          'error': 'chat not found'
        });
      }
    }
  }
}