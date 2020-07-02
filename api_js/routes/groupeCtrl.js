// Imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
const sequelize = require('../models/index')
const fs = require('fs');
var cryptoUtils = require('../utils/crypto.utils');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  getList: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let data = JSON.parse(cryptoUtils.decrypt(req.body.data));
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    }
    let nom = data;
    sequelize.query('Select id, nom From groupe WHERE nom LIKE $nom and private = 0', {
      bind: {
        nom: '%' + nom + '%'
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
  addGroupe: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let form = JSON.parse(cryptoUtils.decrypt(req.body.form));
    let file = cryptoUtils.decrypt(req.body.file);
    if (file != "") {
      file = JSON.parse(file)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      let nameFile = 'fake'
      let r = Math.random().toString(36).substring(7);
      if (file != '') {
        nameFile = r;
      }
      asyncLib.waterfall([
        function (done) {
          var newUser = sequelize.query('INSERT INTO groupe (ref_id_user,nom,private,description,image,createdAt,updatedAt) VALUES ($ref_id_user,$nom,$private,$description,$image,NOW(),NOW())', {
              bind: {
                ref_id_user: userId,
                nom: form.nom,
                private: form.private,
                description: form.description,
                image: nameFile
              },
              type: sequelize.QueryTypes.INSERT
            })
            .then(function (newUser) {
              if (file != '') {
                fs.writeFile('./files/groupe/' + r, file, function (err) {
                  done(null)
                });
              } else {
                res.status(201).json('test');
              }
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({
                'error': 'cannot add user'
              });
            });
        },
        function (done) {
          sequelize.query('SELECT id from groupe where ref_id_user = $ref_id_user and nom = $nom and private = $private and description = $description  ', {
              bind: {
                ref_id_user: userId,
                nom: form.nom,
                private: form.private,
                description: form.description,
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (groupe) {
              done(null, groupe)
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({
                'error': 'cannot add user'
              });
            });
        },
        function (groupe, done) {
          sequelize.query('INSERT INTO groupe2user (ref_id_user,ref_id_groupe) VALUES ($ref_id_user,$ref_id_groupe)', {
              bind: {
                ref_id_user: userId,
                ref_id_groupe: groupe[0].id
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
        },
      ], function (groupe) {
        if (groupe) {
          return res.status(201).json(true);
        } else {
          return res.status(500).json({
            'error': 'cannot update user profile'
          });
        }
      });
    }
  },
  updateGroupe: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let form = JSON.parse(cryptoUtils.decrypt(req.body.form));
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    if (typeof groupe == 'string') {
      groupe = JSON.parse(groupe)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Update groupe set nom = $nom, description = $description ,private = $private,updatedAt = NOW() where id = $id and ref_id_user = $userId', {
          bind: {
            userId: userId,
            id: groupe,
            nom: form.nom,
            private: form.private,
            description: form.description,
          },
          type: sequelize.QueryTypes.UPDATE
        })
        .then(function (newUser) {
          res.status(201).json(true);
        })
        .catch(function (err) {
          return res.status(500).json({
            'error': 'cannot add user'
          });
        });
    }
  },
  updateGroupeImage: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var groupe = cryptoUtils.decrypt(req.body.groupe);
    let file = cryptoUtils.decrypt(req.body.file);
    if (file != "") {
      file = JSON.parse(file)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
        function (done) {
          var newUser = sequelize.query('Select image from groupe where id = $id', {
              bind: {
                id: groupe,
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (imagegroupe) {
              if (imagegroupe[0].image != null) {
                fs.writeFile('./files/groupe/' + imagegroupe[0].image, file, function (err) {
                  if (err) return console.log(err);
                  res.status(201).json(true);
                });
              } else {
                let r = Math.random().toString(36).substring(7);
                done(null, r)
              }
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({
                'error': 'cannot add user'
              });
            });
        },
        function (namefile, done) {
          sequelize.query('Update groupe set image = $image where id = $id', {
              bind: {
                id: groupe,
                image: namefile,
              },
              type: sequelize.QueryTypes.UPDATE
            })
            .then(function (groupe) {
              fs.writeFile('./files/groupe/' + namefile, file, function (err) {
                if (err) return console.log(err);
                done(true)
              });
            })
            .catch(function (err) {
              console.log(err);
              return res.status(500).json({
                'error': 'cannot add user'
              });
            });
        },
      ], function (groupe) {
        if (groupe) {
          return res.status(201).json(true);
        } else {
          return res.status(500).json({
            'error': 'cannot update user profile'
          });
        }
      });
    }
  },
  getGroupe: function (req, res) {
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
      sequelize.query('Select * From groupe WHERE id = $id', {
        bind: {
          id: groupe
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        if (groupe[0].image != null) {
          let file = fs.readFileSync('./files/groupe/' + groupe[0].image, 'utf8');
          groupe[0].image = file
        }
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
    }
  },
  getMyGroupe: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select * From groupe WHERE ref_id_user = $id', {
        bind: {
          id: userId
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        if (groupe.image != null) {
          let file = fs.readFileSync('./files/groupe/' + groupe.image, 'utf8');
          groupe.image = file
        }
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
    }
  },
  getMyGroupePrive: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select groupe.* From groupe2user inner join groupe on groupe2user.ref_id_groupe = groupe.id WHERE groupe2user.ref_id_user = $id and groupe.private = 1', {
        bind: {
          id: userId
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        for (let index = 0; index < groupe.length; index++) {
          if (groupe[index].image != null) {
            let file = fs.readFileSync('./files/groupe/' + groupe[index].image, 'utf8');
            groupe[index].image = file
          }
        }
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
    }
  },
  getMyGroupePublic: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Select groupe.* From groupe2user inner join groupe on groupe2user.ref_id_groupe = groupe.id WHERE groupe2user.ref_id_user = $id and groupe.private = 0', {
        bind: {
          id: userId
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function (groupe) {
        for (let index = 0; index < groupe.length; index++) {
          if (groupe[index].image != null) {
            let file = fs.readFileSync('./files/groupe/' + groupe[index].image, 'utf8');
            groupe[index].image = file
          }
        }
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
    }
  },
  deleteGroupe: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var id = cryptoUtils.decrypt(req.body.groupe);
    console.log(id)
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Delete from groupe where id = $id and ref_id_user = $userId', {
        bind: {
          userId: userId,
          id: id
        },
        type: sequelize.QueryTypes.DELETE
      }).then(function (groupe) {
          res.status(201).json(true);
      }).catch(function (err) {
        console.log(err)
        res.status(500).json({
          'error': 'cannot delete groupe'
        });
      })
    }
  },
  checkGroupeAuthor: function (req, res) {
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
    }
    let nom = req.body.data;
    sequelize.query('Select COUNT(*) From groupe where ref_id_user = $userId and id = $idGroupe', {
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
}