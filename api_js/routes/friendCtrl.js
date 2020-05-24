// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {

  getUserFriend: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
      if(req.body.user != null){
        userId = req.body.user
      }
    asyncLib.waterfall([
    function(done) {
    sequelize.query('Select user.username, user.bio, friend.ref_id_user_friend From friend INNER Join user ON friend.ref_id_user_friend = user.id WHERE friend.ref_id_user_principal = $id AND friend.validate = 1',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    done(null,friend)
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  function(friend,done) {
    sequelize.query('Select user.username, user.bio, friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 1',
      { bind: { id: userId, idFriend: req.body.user }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friendP) {
   let x = friend.length;
   if(friendP.lenght != 0){
    for (let index = 0; index < friendP.length; index++) {
      console.log(friend.lenght)
      friend[friend.length] = {
        ref_id_user_friend:friendP[index].ref_id_user_principal,
        username:friendP[index].username,
        bio:friendP[index].bio
      }
    }
   } 
   done(friend) 
  }).catch(function(err) {      
      console.log(err)
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  ], 
  function(friend) {
  if (friend) {
    return res.status(201).json(friend);
  } else {
    return res.status(500).json({ 'error': 'cannot update user profile' });
  }
  });
  }
  },
  addNewUserFriend: function(req, res) {
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Insert into friend (ref_id_user_principal,ref_id_user_friend,validate) values ($idPrincipal,$idFriend,0) ',
      { bind: { idPrincipal: userId , idFriend: req.body.user}, type: sequelize.QueryTypes.INSERT }
    ).then(function(friend) {
  console.log(friend)
    if (friend) {
        res.status(201).json(friend);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
  }).catch(function(err) {  
      console.log(err)    
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },
  ValidateNewUserFriend: function(req, res) {
    //update or delete
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    if(req.body.validate = true){
        sequelize.query('Update friend set validate = 1 where id = $id ',
        { bind: { id: req.body.id }, type: sequelize.QueryTypes.UPDATE }
        ).then(function(friend) {
          console.log(friend)
          if (friend) {
            res.status(201).json(friend);
          } else {
            res.status(404).json({ 'error': 'friend not found' });
          }
        }).catch(function(err) {      
            console.log(err)
            res.status(500).json({ 'error': 'cannot fetch friends' });
        })
    }else{
        sequelize.query('Delete from friend where id = $id',
        { bind: { id: req.body.id }, type: sequelize.QueryTypes.DELETE }
      ).then(function(friend) {
        console.log(friend)
        if (friend) {
            res.status(201).json(friend);
        } else {
            res.status(404).json({ 'error': 'friend not found' });
        }
      }).catch(function(err) {      
          res.status(500).json({ 'error': 'cannot fetch friends' });
      })
    }
    }
    
  },
  getListValidateNewUserFriend: function(req, res){
      //list pas valider
      var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    sequelize.query('Select user.username, friend.id,friend.ref_id_user_principal From friend INNER Join user ON friend.ref_id_user_principal = user.id WHERE friend.ref_id_user_friend = $id AND friend.validate = 0',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend) {
        res.status(201).json(friend);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  }
  },
  checkFriend: function(req, res){
    var headerAuth  = req.body.token;
    var userId      = jwtUtils.getUserId(headerAuth);
	console.log(userId)
    if(userId<0){
      res.status(404).json({ 'error': 'wrong token' });
    }else{
    asyncLib.waterfall([
      function(done) {
    sequelize.query('Select COUNT(*) from friend where friend.ref_id_user_principal = $id and friend.ref_id_user_friend = $idFriend and validate = 1 or friend.ref_id_user_principal = $idFriend and friend.ref_id_user_friend = $id and validate = 1',
      { bind: { id: userId, idFriend: req.body.user }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend[0]['COUNT(*)']==1) {
        res.status(201).json(true);
      } else {
        done(null)
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  function(done) {
    sequelize.query('Select COUNT(*) from friend where friend.ref_id_user_principal = $id and friend.ref_id_user_friend = $idFriend and validate = 0 or friend.ref_id_user_principal = $idFriend and friend.ref_id_user_friend = $id and validate = 0',
      { bind: { id: userId, idFriend: req.body.user }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
  console.log(friend)
    if (friend[0]['COUNT(*)']==1) {
        res.status(201).json('cour');
      } else {
        done(null)
      }
  }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  ], 
  function(pro) {
  if (pro == null) {
    return res.status(201).json(false);
  } else {
    return res.status(500).json({ 'error': 'cannot update user profile' });
  }
});
}
}
}


