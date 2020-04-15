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

  getUserPublication: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    let PubObject;
    let userId = 1;
    
    sequelize.query('Select id, image, description From publication WHERE ref_id_user = $id',
      { bind: { id: userId }, type: sequelize.QueryTypes.SELECT }
    ).then(function(publication) {
      PubObject = publication;
      if (publication) {
        res.status(201).json(publication);
      } else {
        res.status(404).json({ 'error': 'publications not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch publications' });
    })
  },

}