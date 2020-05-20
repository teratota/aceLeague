// Imports
var models   = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likePublication: function(req, res) {
    var headerAuth  = req.body.token;
     var userId      = jwtUtils.getUserId(headerAuth);
     if(userId<0){
       res.status(404).json({ 'error': 'wrong token' });
     }else{
     sequelize.query('INSERT into like (ref_id_user, ref_id_publication, etat) values ($idUser,$idPublication,$etat) ',
       { bind: { idUser:userId ,idPublication:req.body.publication,etat: 1}, type: sequelize.QueryTypes.INSERT }
     ).then(function(like) {
     if (like) {
         res.status(201).json(true);
       } else {
         res.status(404).json({ 'error': 'erreur like' });
       }
   }).catch(function(err) {      
       res.status(500).json({ 'error': 'erreur ajout like' });
     })
   }
  },
  dislikePublication: function(req, res) {
    var headerAuth  = req.body.token;
     var userId      = jwtUtils.getUserId(headerAuth);
     if(userId<0){
       res.status(404).json({ 'error': 'wrong token' });
     }else{
      sequelize.query('Delete from like where ref_id_publication = $idPublication and ref_id_user = $idUser,',
      { bind: { idUser: userId, idPublication: req.body.publication }, type: sequelize.QueryTypes.SELECT }
      ).then(function(friend) {
        if (friend) {
            res.status(201).json(true);
        } else {
            res.status(404).json({ 'error': 'erreur like' });
        }
      }).catch(function(err) {      
        res.status(500).json({ 'error': 'erreur suppression like' });
      })
    }
  },
}