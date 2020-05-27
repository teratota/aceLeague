// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
const sequelize = require('../models/index')
var cryptoUtils  = require('../utils/crypto.utils');


module.exports = {
  addCommentaire: function(req, res) { 
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
     var userId      = jwtUtils.getUserId(headerAuth);
     var publication = cryptoUtils.decrypt(req.body.publication);
     var form = JSON.parse(cryptoUtils.decrypt(req.body.form));
   console.log(userId)
     if(userId<0){
       res.status(404).json({ 'error': 'wrong token' });
     }else{
     sequelize.query('INSERT into commentaire (ref_id_user, ref_id_publication, message, createdAt) values ($idUser,$idPublication,$message, NOW()) ',
       { bind: { idUser:userId ,idPublication:publication,message:form.message}, type: sequelize.QueryTypes.INSERT }
     ).then(function(friend) {
   console.log(friend)
     if (friend) {
         res.status(201).json(true);
       } else {
         res.status(404).json({ 'error': 'commentaire not found' });
       }
   }).catch(function(err) {    
     console.log(err)  
       res.status(500).json({ 'error': 'cannot fetch commentaire' });
     })
   }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  listCommentaire: function(req, res) {
    var headerAuth  = cryptoUtils.decrypt(req.body.token);
    var userId      = jwtUtils.getUserId(headerAuth);
    var publication = cryptoUtils.decrypt(req.body.publication);
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }
    sequelize.query('Select commentaire.*, user.username from commentaire inner join user on commentaire.ref_id_user = user.id where commentaire.ref_id_publication = $id ',
       { bind: { id: publication}, type: sequelize.QueryTypes.SELECT }
    ).then(function(commentaire) {
      console.log(commentaire)
      if (commentaire) {
        res.status(201).json(cryptoUtils.encrypt(JSON.stringify(commentaire)));
      } else {
        res.status(404).json({ 'error': 'commentaire not found' });
      }
    }).catch(function(err) {      
      console.log(err) 
      res.status(500).json({ 'error': 'cannot fetch commentaire' });
    })
  }
}