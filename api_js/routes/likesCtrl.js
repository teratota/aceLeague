// Imports
var jwtUtils = require('../utils/jwt.utils');
const sequelize = require('../models/index')
var cryptoUtils = require('../utils/crypto.utils');

// Routes
module.exports = {
  likePublication: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var publication = cryptoUtils.decrypt(req.body.publication);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('INSERT into `like` (ref_id_user, ref_id_publication, etat) values ($idUser,$idPublication,$etat) ', {
        bind: {
          idUser: userId,
          idPublication: publication,
          etat: 1
        },
        type: sequelize.QueryTypes.INSERT
      }).then(function (like) {
        if (like) {
          res.status(201).json(true);
        } else {
          res.status(404).json({
            'error': 'erreur like'
          });
        }
      }).catch(function (err) {
        res.status(500).json({
          'error': 'erreur ajout like'
        });
      })
    }
  },
  dislikePublication: function (req, res) {
    var headerAuth = cryptoUtils.decrypt(req.body.token);
    var userId = jwtUtils.getUserId(headerAuth);
    var publication = cryptoUtils.decrypt(req.body.publication);
    if (userId < 0) {
      res.status(404).json({
        'error': 'wrong token'
      });
    } else {
      sequelize.query('Delete from `like` where ref_id_publication = $idPublication and ref_id_user = $idUser', {
        bind: {
          idUser: userId,
          idPublication: publication
        },
        type: sequelize.QueryTypes.DELETE
      }).then(function (friend) {
        res.status(201).json(true);
      }).catch(function (err) {
        console.log(err)
        res.status(500).json({
          'error': 'erreur suppression like'
        });
      })
    }
  },
}