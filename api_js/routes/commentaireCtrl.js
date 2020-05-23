// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');


module.exports = {
  addCommentaire: function(req, res) { 
     var headerAuth  = req.body.token;
     var userId      = jwtUtils.getUserId(headerAuth);
   console.log(userId)
     if(userId<0){
       res.status(404).json({ 'error': 'wrong token' });
     }else{
     sequelize.query('INSERT into commentaire (ref_id_user, ref_id_publication, message, createdAt) values ($idUser,$idPublication,$message, NOW()) ',
       { bind: { idUser:userId ,idPublication:req.body.publication,message:req.body.form.message}, type: sequelize.QueryTypes.INSERT }
     ).then(function(friend) {
   console.log(friend)
     if (friend) {
         res.status(201).json(friend);
       } else {
         res.status(404).json({ 'error': 'commentaire not found' });
       }
   }).catch(function(err) {      
       res.status(500).json({ 'error': 'cannot fetch commentaire' });
     })
   }
  },

  listCommentaire: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    sequelize.query('Select commentaire.*, user.user from commentaire inner join user on commentaire.ref_id_user = user.id where commentaire.ref_id_publication = $id ',
       { bind: { id: req.body.publication}, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
      console.log(groupe)
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(404).json({ 'error': 'commentaire not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch commentaire' });
    })
  }
}