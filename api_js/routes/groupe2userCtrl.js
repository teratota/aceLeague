// Imports
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
const sequelize = require('../models/index')
var cryptoUtils = require('../utils/crypto.utils');


// Routes
module.exports = {

  getListGroup2User: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    }
    let nom = req.body.data;
    sequelize.query('Select groupe.id, groupe.nom From groupe2user Inner Join groupe On groupe2user.ref_id_groupe = groupe.id WHERE groupe2user.ref_id_user = $userId', {
      bind: {
        userId: userId
      },
      type: sequelize.QueryTypes.SELECT
    }).then(function (groupe) {
      if (groupe) {
        res.status(201).json(cryptoUtils.encrypt(JSON.stringify(groupe)));
      } else {
        res.status(404).json({
          'error': 'friend not found'
        });
      }
    }).catch(function (err) {
      res.status(500).json({
        'error': 'cannot fetch friends'
      });
    })
  },
  checkGroupe2User: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      let nom = req.body.data;
      sequelize.query('Select COUNT(*) From groupe2user where ref_id_user = $userId and ref_id_groupe = $idGroupe', {
        bind: {
          userId: userId,
          idGroupe: groupe
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        if (groupe[0]['COUNT(*)'] == 1) {
          res.status(201).json(true);
        } else {
          res.status(404).json(false);
        }
      }).catch(function (err) {
        res.status(500).json({
          'error': 'cannot fetch friends'
        });
      })
    }
  },
  deleteGroupe2user: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    var user = cryptoUtils.decrypt(req.body.user);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Delete from groupe2user where ref_id_user = $idUser and ref_id_groupe = $idGroupe', {
        bind: {
          idUser: user,
          idGroupe: groupe
        },
        type: sequelize.QueryTypes.DELETE
      }).then(function (groupe) {
        res.status(201).json(true);
      }).catch(function (err) {
        res.status(500).json({
          'error': 'cannot delete groupe'
        });
      })
    }
  },
  addUser2Groupe: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var user = cryptoUtils.decrypt(req.body.user);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    console.log(groupe);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (typeof user == 'string') {
      user = JSON.parse(user)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      if (user == '' || user == null) {
        sequelize.query('INSERT INTO groupe2user (ref_id_user,ref_id_groupe) VALUES ($ref_id_user,$ref_id_groupe)', {
            bind: {
              ref_id_user: userId,
              ref_id_groupe: groupe
            },
            type: sequelize.QueryTypes.INSERT
          })
          .then(function (groupe) {
            res.status(201).json(true);
          })
          .catch(function (err) {
            console.log(err);
            return res.status(500).json({
              'error': 'cannot add user'
            });
          });
      } else {
        sequelize.query('INSERT INTO groupe2user (ref_id_user,ref_id_groupe) VALUES ($ref_id_user,$ref_id_groupe)', {
            bind: {
              ref_id_user: user,
              ref_id_groupe: groupe
            },
            type: sequelize.QueryTypes.INSERT
          })
          .then(function (groupe) {
            res.status(201).json(true);
          })
          .catch(function (err) {
            console.log(err);
            return res.status(500).json({
              'error': 'cannot add user'
            });
          });
      }
    }
  },
  groupe2userNumberUser: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select COUNT(*) From groupe2user WHERE ref_id_groupe = $id', {
        bind: {
          id: groupe
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        if (groupe) {
          res.status(201).json(cryptoUtils.encrypt(JSON.stringify(groupe)));
        } else {
          res.status(404).json({
            'error': 'groupe2user to found'
          });
        }
      }).catch(function (err) {
        res.status(500).json({
          'error': 'cannot fetch groupe2user'
        });
      })
    }
  },
  getListUserInGroupe2User: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select user.id, user.username From groupe2user Inner Join user On groupe2user.ref_id_user = user.id WHERE groupe2user.ref_id_groupe = $groupe and groupe2user.ref_id_user != $id ', {
        bind: {
          groupe: groupe,
          id: userId
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        if (groupe) {
          res.status(201).json(cryptoUtils.encrypt(JSON.stringify(groupe)));
        } else {
          res.status(404).json({
            'error': 'groupe2user to found'
          });
        }
      }).catch(function (err) {
        console.log(err)
        res.status(500).json({
          'error': 'cannot fetch groupe2user'
        });
      })
    }
  },
  getListUserInGroupe2UserIsNot: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    var user = cryptoUtils.decrypt(req.body.user);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
          function (done) {
            sequelize.query('Select user.id, user.username From groupe2user Inner Join user On groupe2user.ref_id_user = user.id WHERE groupe2user.ref_id_groupe = $groupe', {
              bind: {
                groupe: groupe
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (groupe) {
              done(null, groupe)
            }).catch(function (err) {
              res.status(500).json({
                'error': 'cannot fetch groupe2user'
              });
            })
          },
          function (groupe, done) {
            let userList = '';
            if (groupe.length != 0) {
              for (let i = 0; i < groupe.length; i++) {
                if (i == 0) {
                  userList += groupe[i].id;
                } else
                  userList += "," + groupe[i].id;
              }
            }
            userList = '(' + userList + ')'
            sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1 and friend.ref_id_user_friend not in ' + userList, {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friend) {
              done(null, friend, userList)
            }).catch(function (err) {
              console.log(err)
              res.status(500).json({
                'error': 'cannot fetch friends'
              });
            })
          },
          function (friend, userList, done) {
            sequelize.query('Select user.username, user.bio, friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 1 and friend.ref_id_user_principal not in ' + userList, {
              bind: {
                id: userId,
                idFriend: user
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friendP) {
              let x = friend.length;
              if (friendP.lenght != 0) {
                for (let index = 0; index < friendP.length; index++) {
                  friend[friend.length] = {
                    ref_id_user_friend: friendP[index].ref_id_user_principal,
                    username: friendP[index].username,
                    bio: friendP[index].bio
                  }
                }
              }
              done(friend)
            }).catch(function (err) {
              console.log(err)
              res.status(500).json({
                'error': 'cannot fetch friends'
              });
            })
          },
        ],
        function (friend) {
          if (friend) {
            return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(friend)));
          } else {
            return res.status(500).json({
              'error': 'cannot update user profile'
            });
          }
        });
    }
  },
}