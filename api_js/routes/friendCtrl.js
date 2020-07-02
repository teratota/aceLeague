// Imports
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
const sequelize = require('../models/index')
var cryptoUtils = require('../utils/crypto.utils');
const fs = require('fs');

// Routes
module.exports = {

  getUserFriend: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var OtherUser = cryptoUtils.decrypt(req.body.user);
    console.log(userId)
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      if (OtherUser != 'null' && OtherUser != '') {
        userId = OtherUser
      }
      asyncLib.waterfall([
          function (done) {
            sequelize.query('Select friend.id, user.username, user.bio, user.image, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1', {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friend) {
              done(null, friend)
            }).catch(function (err) {
              res.status(500).json({
                'error': 'cannot fetch friends'
              });
            })
          },
          function (friend, done) {
            sequelize.query('Select friend.id, user.username, user.bio, user.image, friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 1', {
              bind: {
                id: userId,
                idFriend: req.body.user
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friendP) {
              let x = friend.length;
              if (friendP.lenght != 0) {
                for (let index = 0; index < friendP.length; index++) {
                  friend[friend.length] = {
                    id: friendP[index].id,
                    ref_id_user_friend: friendP[index].ref_id_user_principal,
                    username: friendP[index].username,
                    bio: friendP[index].bio,
                    image: friendP[index].image
                  }
                }
              }
              for (let index = 0; index < friend.length; index++) {
                if (friend[index].image != null) {
                  let file = fs.readFileSync('./files/user/' + friend[index].image, 'utf8');
                  friend[index].image = file
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
  addNewUserFriend: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var user = cryptoUtils.decrypt(req.body.user);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Insert into friend (ref_id_user_principal,ref_id_user_friend,validate) values ($idPrincipal,$idFriend,0) ', {
        bind: {
          idPrincipal: userId,
          idFriend: user
        },
        type: sequelize.QueryTypes.INSERT
      }).then(function (friend) {
        if (friend) {
          res.status(201).json(true);
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
    }
  },
  ValidateNewUserFriend: function (req, res) {
    //update or delete
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var validate = JSON.parse(cryptoUtils.decrypt(req.body.validate));
    var id = cryptoUtils.decrypt(req.body.id);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      console.log(validate)
      if (validate == true) {
        sequelize.query('Update friend set validate = 1 where id = $id ', {
          bind: {
            id: id
          },
          type: sequelize.QueryTypes.UPDATE
        }).then(function (friend) {
          if (friend) {
            res.status(201).json(true);
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
      } else {
        sequelize.query('Delete from friend where id = $id', {
          bind: {
            id: id
          },
          type: sequelize.QueryTypes.DELETE
        }).then(function (friend) {
          res.status(201).json(true);
        }).catch(function (err) {
          res.status(500).json({
            'error': 'cannot fetch friends'
          });
        })
      }
    }

  },
  getListValidateNewUserFriend: function (req, res) {
    //list pas valider
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select user.username, friend.id,friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 0', {
        bind: {
          id: userId
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (friend) {
        if (friend) {
          res.status(201).json(cryptoUtils.encrypt(JSON.stringify(friend)));
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
    }
  },
  checkFriend: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var user = cryptoUtils.decrypt(req.body.user);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
          function (done) {
            sequelize.query('Select COUNT(*) from friend where friend.ref_id_user_principal = $id and friend.ref_id_user_friend = $idFriend and validate = 1 or friend.ref_id_user_principal = $idFriend and friend.ref_id_user_friend = $id and validate = 1', {
              bind: {
                id: userId,
                idFriend: user
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friend) {
              if (friend[0]['COUNT(*)'] == 1) {
                res.status(201).json(true);
              } else {
                done(null)
              }
            }).catch(function (err) {
              res.status(500).json({
                'error': 'cannot fetch friends'
              });
            })
          },
          function (done) {
            sequelize.query('Select COUNT(*) from friend where friend.ref_id_user_principal = $id and friend.ref_id_user_friend = $idFriend and validate = 0 or friend.ref_id_user_principal = $idFriend and friend.ref_id_user_friend = $id and validate = 0', {
              bind: {
                id: userId,
                idFriend: user
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (friend) {
              if (friend[0]['COUNT(*)'] == 1) {
                res.status(201).json('cour');
              } else {
                done(null)
              }
            }).catch(function (err) {
              res.status(500).json({
                'error': 'cannot fetch friends'
              });
            })
          },
        ],
        function (pro) {
          if (pro == null) {
            return res.status(201).json(false);
          } else {
            return res.status(500).json({
              'error': 'cannot update user profile'
            });
          }
        });
    }
  },
  deleteFriend: function (req, res) {
    //update or delete
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var id = cryptoUtils.decrypt(req.body.id);
    console.log(id)
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
        sequelize.query('Delete from friend where id = $id', {
          bind: {
            id: id
          },
          type: sequelize.QueryTypes.DELETE
        }).then(function (friend) {
          res.status(201).json(true);
        }).catch(function (err) {
          res.status(500).json({
            'error': 'cannot fetch friends'
          });
        })
      }
  },
}