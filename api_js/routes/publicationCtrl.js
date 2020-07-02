// Imports
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');
const sequelize = require('../models/index')
var cryptoUtils = require('../utils/crypto.utils');
const fs = require('fs');


module.exports = {

  getUserPublication: function (req, res) {
    // Getting auth header
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var OtherUser = cryptoUtils.decrypt(req.body.user);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      if (OtherUser != '') {
        userId = OtherUser
      }
      asyncLib.waterfall([
          function (done) {
            sequelize.query('Select user.username, user.image as profilePic, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_user = $id and publication.ref_id_groupe is null ORDER BY publication.createdAt DESC', {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (publication) {
              let publicationList = ""
              for (let i = 0; i < publication.length; i++) {
                if (i == 0) {
                  publicationList += publication[i].id;
                } else {
                  publicationList += "," + publication[i].id;
                }
                if (publication[i].image != null) {
                  let file = fs.readFileSync('./files/publication/' + publication[i].image, 'utf8');
                  publication[i].image = file
                }
                if (publication[i].profilePic != null) {
                  let file = fs.readFileSync('./files/user/' + publication[i].profilePic, 'utf8');
                  publication[i].profilePic = file
                }
              }
              if (publicationList == "") {
                publicationList = 0;
                publicationList = '(' + publicationList + ')';
              } else {
                publicationList = '(' + publicationList + ')';
              }
              done(null, publication, publicationList);
            }).catch(function (err) {
              console.log(err)
              res.status(500).json({
                'error': 'fcannot fetch publications'
              });
            })
          },
          function (publication, publicationList, done) {
            sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in ' + publicationList, {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (like) {
              for (let i = 0; i < publication.length; i++) {
                if (like.length != 0) {
                  for (let x = 0; x < like.length; x++) {
                    if (like[x].ref_id_publication == publication[i].id) {
                      publication[i].like = true
                    } else if (publication[i].like != true) {
                      publication[i].like = false
                    }
                  }
                } else {
                  publication[i].like = false
                }
              }

              done(null, publication, publicationList)
            }).catch(function (err) {
              console.log(err)
              res.status(500).json({
                'error': 'cannot fetch publications'
              });
            })
          },
          function (publication, publicationList, done) {
            sequelize.query('SELECT * from `like` where ref_id_publication in ' + publicationList, {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (like) {
              for (let i = 0; i < publication.length; i++) {
                publication[i].likeMax = 0;
                if (like.length != 0) {
                  for (let x = 0; x < like.length; x++) {
                    if (like[x].ref_id_publication == publication[i].id) {
                      publication[i].likeMax++
                    }
                  }
                }
              }
              done(null, publication, publicationList)
            }).catch(function (err) {
              res.status(500).json({
                'error': 'cannot fetch publications'
              });
            })
          },
          function (publication, publicationList, done) {
            sequelize.query('SELECT * from `commentaire` where ref_id_publication in ' + publicationList, {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            }).then(function (commentaire) {
              for (let i = 0; i < publication.length; i++) {
                publication[i].commentaireMax = 0;
                if (commentaire.length != 0) {
                  for (let x = 0; x < commentaire.length; x++) {
                    if (commentaire[x].ref_id_publication == publication[i].id) {
                      publication[i].commentaireMax++
                    }
                  }
                }
              }
              done(publication)
            }).catch(function (err) {
              console.log(err)
              res.status(500).json({
                'error': 'cannot fetch publications'
              });
            })
          }
        ],
        function (publication) {
          if (publication) {
            res.status(201).json(cryptoUtils.encrypt(JSON.stringify(publication)));
          } else {
            res.status(404).json({
              'error': 'publications not found'
            });
          }
        })
    }
  },
  uploadPublication: function (req, res) {
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
    }
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if (file != '') {
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_user,image,description, createdAt) Values ($ref_id_user, $image, $description, NOW())', {
      bind: {
        ref_id_user: userId,
        image: nameFile,
        description: form.description
      },
      type: sequelize.QueryTypes.INSERT
    }).then(function (publication) {
      if (file != '') {
        fs.writeFile('./files/publication/' + r, file, function (err) {
          if (err) return console.log(err);
          res.status(201).json(true);
        });
      } else {
        res.status(201).json(true);
      }
    }).catch(function (err) {
      res.status(500).json({
        'error': 'cannot fetch publications'
      });
    })
  },
  getAllPublications: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
        function (done) {
          sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1', {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (friendFound) {
              done(null, friendFound);
            })
            .catch(function (err) {
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        },
        function (friendFound, done) {
          sequelize.query('Select ref_id_pro From abonnement WHERE ref_id_user = $id', {
              bind: {
                id: userId
              },
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (proFound) {
              done(null, friendFound, proFound);
            })
            .catch(function (err) {
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        },
        function (friendFound, proFound, done) {
          sequelize.query('Select user.username, user.bio, friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 1', {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (friendP) {
            let x = friendFound.length;
            if (friendP.lenght != 0) {
              for (let index = 0; index < friendP.length; index++) {
                friendFound[friendFound.length] = {
                  ref_id_user_friend: friendP[index].ref_id_user_principal,
                  username: friendP[index].username,
                  bio: friendP[index].bio
                }
              }
            }
            done(null, friendFound, proFound);
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch friends'
            });
          })
        },
        function (friendFound, proFound, done) {
          let friendList = "";

          for (let i = 0; i < friendFound.length; i++) {
            if (i == 0) {
              friendList += friendFound[i].ref_id_user_friend;
            } else
              friendList += "," + friendFound[i].ref_id_user_friend;
          }

          if (friendList == "") {
            friendList = 0;
            friendList = '(' + friendList + ')';
          } else {
            friendList = '(' + friendList + ')';
          }

          let proList = "";

          for (let i = 0; i < proFound.length; i++) {
            if (i == 0) {
              proList += proFound[i].ref_id_pro;
            } else
              proList += "," + proFound[i].ref_id_pro;
          }

          if (proList == "") {
            proList = 0;
            proList = '(' + proList + ')';
          } else {
            proList = '(' + proList + ')';
          }


          sequelize.query('Select pro.nom, pro.image as proPic ,user.username, user.image as profilePic, publication.image, publication.id, publication.description, publication.createdAt From publication left Join user On publication.ref_id_user = user.id  left JOIN pro on publication.ref_id_pro = pro.id WHERE publication.ref_id_groupe is null and publication.ref_id_user IN ' + friendList + ' or publication.ref_id_pro in ' + proList + ' ORDER BY publication.createdAt DESC limit 20', {
              type: sequelize.QueryTypes.SELECT
            })
            .then(function (publication) {
              var stringified = JSON.stringify(publication);
              let publicationList = ''
              for (let i = 0; i < publication.length; i++) {
                if (i == 0) {
                  publicationList += publication[i].id;
                } else {
                  publicationList += "," + publication[i].id;
                }

                if (publication[i].image != null) {
                  let file = fs.readFileSync('./files/publication/' + publication[i].image, 'utf8');
                  publication[i].image = file
                }

                if (publication[i].username != null) {
                  if (publication[i].profilePic != null) {
                    let file = fs.readFileSync('./files/user/' + publication[i].profilePic, 'utf8');
                    publication[i].profilePic = file
                  }
                } else if (publication[i].nom != null) {
                  if (publication[i].proPic != null) {
                    let file = fs.readFileSync('./files/pro/' + publication[i].proPic, 'utf8');
                    publication[i].proPic = file
                  }
                }
              }
              if (publicationList == "") {
                publicationList = 0;
                publicationList = '(' + publicationList + ')';
              } else {
                publicationList = '(' + publicationList + ')';
              }
              done(null, publication, publicationList);
            })
            .catch(function (err) {
              console.log(err)
              return res.status(500).json({
                'error': 'unable to find friends'
              });
            });
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].like = true
                  } else if (publication[i].like != true) {
                    publication[i].like = false
                  }
                }
              } else {
                publication[i].like = false
              }
            }

            done(null, publication, publicationList)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].likeMax = 0;
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].likeMax++
                  }
                }
              }
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `commentaire` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (commentaire) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].commentaireMax = 0;
              if (commentaire.length != 0) {
                for (let x = 0; x < commentaire.length; x++) {
                  if (commentaire[x].ref_id_publication == publication[i].id) {
                    publication[i].commentaireMax++
                  }
                }
              }
            }
            done(publication)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        }
      ], function (publication) {
        if (publication) {
          return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(publication)));
        } else {
          return res.status(500).json({
            'error': 'cannot fetch publication'
          });
        }
      });
    }
  },
  getProPublications: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var pro = cryptoUtils.decrypt(req.body.pro);
    if (typeof pro == 'string') {
      pro = JSON.parse(pro)
    }
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      asyncLib.waterfall([
        function (done) {
          sequelize.query('Select pro.nom, pro.image as profilePic, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join pro On publication.ref_id_pro = pro.id WHERE publication.ref_id_pro = $id ORDER BY publication.createdAt DESC', {
            bind: {
              id: pro
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (publication) {
            console.log(publication)
            let publicationList = ''
            for (let i = 0; i < publication.length; i++) {
              if (i == 0) {
                publicationList += publication[i].id;
              } else {
                publicationList += "," + publication[i].id;
              }

              if (publication[i].image != null) {
                let file = fs.readFileSync('./files/publication/' + publication[i].image, 'utf8');
                publication[i].image = file
              }

              if (publication[i].profilePic != null) {
                let file = fs.readFileSync('./files/pro/' + publication[i].profilePic, 'utf8');
                publication[i].profilePic = file
              }

            }
            if (publicationList == "") {
              publicationList = 0;
              publicationList = '(' + publicationList + ')';
            } else {
              publicationList = '(' + publicationList + ')';
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].like = true
                  } else if (publication[i].like != true) {
                    publication[i].like = false
                  }
                }
              } else {
                publication[i].like = false
              }
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].likeMax = 0;
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].likeMax++
                  }
                }
              }
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `commentaire` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (commentaire) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].commentaireMax = 0;
              if (commentaire.length != 0) {
                for (let x = 0; x < commentaire.length; x++) {
                  if (commentaire[x].ref_id_publication == publication[i].id) {
                    publication[i].commentaireMax++
                  }
                }
              }
            }
            done(publication)
          }).catch(function (err) {
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        }
      ], function (publication) {
        if (publication) {
          return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(publication)));
        } else {
          return res.status(500).json({
            'error': 'cannot fetch publication'
          });
        }
      });
    }
  },
  getGroupePublications: function (req, res) {
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
      asyncLib.waterfall([
        function (done) {
          sequelize.query('Select user.username, user.image as profilePic, publication.image, publication.id, publication.description, publication.createdAt From publication Inner Join user On publication.ref_id_user = user.id WHERE publication.ref_id_groupe = $id ORDER BY publication.createdAt DESC', {
            bind: {
              userid: userId,
              id: groupe
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (publication) {
            PubObject = publication;
            let publicationList = ''
            for (let i = 0; i < publication.length; i++) {
              if (i == 0) {
                publicationList += publication[i].id;
              } else {
                publicationList += "," + publication[i].id;
              }

              if (publication[i].image != null) {
                let file = fs.readFileSync('./files/publication/' + publication[i].image, 'utf8');
                publication[i].image = file
              }

              if (publication[i].profilePic != null) {
                let file = fs.readFileSync('./files/user/' + publication[i].profilePic, 'utf8');
                publication[i].profilePic = file
              }

            }
            if (publicationList == "") {
              publicationList = 0;
              publicationList = '(' + publicationList + ')';
            } else {
              publicationList = '(' + publicationList + ')';
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_user = $id and ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].like = true
                  } else if (publication[i].like != true) {
                    publication[i].like = false
                  }
                }
              } else {
                publication[i].like = false
              }
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `like` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (like) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].likeMax = 0;
              if (like.length != 0) {
                for (let x = 0; x < like.length; x++) {
                  if (like[x].ref_id_publication == publication[i].id) {
                    publication[i].likeMax++
                  }
                }
              }
            }
            done(null, publication, publicationList)
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        },
        function (publication, publicationList, done) {
          sequelize.query('SELECT * from `commentaire` where ref_id_publication in ' + publicationList, {
            bind: {
              id: userId
            },
            type: sequelize.QueryTypes.SELECT
          }).then(function (commentaire) {
            for (let i = 0; i < publication.length; i++) {
              publication[i].commentaireMax = 0;
              if (commentaire.length != 0) {
                for (let x = 0; x < commentaire.length; x++) {
                  if (commentaire[x].ref_id_publication == publication[i].id) {
                    publication[i].commentaireMax++
                  }
                }
              }
            }
            done(publication)
          }).catch(function (err) {
            console.log(err)
            res.status(500).json({
              'error': 'cannot fetch publications'
            });
          })
        }
      ], function (publication) {
        if (publication) {
          return res.status(201).json(cryptoUtils.encrypt(JSON.stringify(publication)));
        } else {
          return res.status(500).json({
            'error': 'cannot fetch publication'
          });
        }
      });
    }
  },
  uploadProPublication: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let file = cryptoUtils.decrypt(req.body.file);
    if (file != "") {
      file = JSON.parse(file)
    }
    var form = JSON.parse(cryptoUtils.decrypt(req.body.form));
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if (file != '') {
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_pro,image,description, createdAt) Values ($ref_id_pro, $image, $description, NOW())', {
      bind: {
        ref_id_pro: form.pro,
        image: nameFile,
        description: form.description
      },
      type: sequelize.QueryTypes.INSERT
    }).then(function (publication) {
      if (file != '') {
        fs.writeFile('./files/publication/' + r, file, function (err) {
          res.status(201).json('test');
        });
      } else {
        res.status(201).json('test');
      }
    }).catch(function (err) {
      res.status(500).json({
        'error': 'cannot fetch publications'
      });
    })
  },
  uploadGroupePublication: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    let file = cryptoUtils.decrypt(req.body.file);
    if (file != "") {
      file = JSON.parse(file)
    }
    var form = JSON.parse(cryptoUtils.decrypt(req.body.form));
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    }
    //let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = null
    if (file != '') {
      nameFile = r;
    }
    sequelize.query('INSERT INTO publication (ref_id_user,ref_id_groupe,image,description, createdAt) Values ($ref_id_user, $ref_id_groupe, $image, $description, NOW())', {
      bind: {
        ref_id_user: userId,
        ref_id_groupe: form.groupe,
        image: nameFile,
        description: form.description
      },
      type: sequelize.QueryTypes.INSERT
    }).then(function (publication) {
      if (file != '') {
        fs.writeFile('./files/publication/' + r, file, function (err) {
          if (err) return console.log(err);
          res.status(201).json('test');
        });
      } else {
        res.status(201).json('test');
      }
    }).catch(function (err) {
      console.log(err)
      res.status(500).json({
        'error': 'cannot fetch publications'
      });
    })
  },
  deletePublication: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var id = cryptoUtils.decrypt(req.body.id);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Delete from publication where id = $id', {
        bind: {
          id: id
        },
        type: sequelize.QueryTypes.DELETE
      }).then(function (publication) {
          res.status(201).json(true);
      }).catch(function (err) {
        res.status(500).json({
          'error': 'cannot delete groupe'
        });
      })
    }
  },
}