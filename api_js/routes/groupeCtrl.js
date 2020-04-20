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

  getlist: function(req, res) {
    let nom = req.body.data;
    sequelize.query('Select id, nom From groupe WHERE nom LIKE %$nom%',
      { bind: { nom: nom }, type: sequelize.QueryTypes.SELECT }
    ).then(function(friend) {
      console.log(groupe)
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(404).json({ 'error': 'friend not found' });
      }
    }).catch(function(err) {      
      res.status(500).json({ 'error': 'cannot fetch friends' });
    })
  },
  
}