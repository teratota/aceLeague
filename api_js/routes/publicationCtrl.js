// Imports

var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models');
var asyncLib  = require('async');
const sequelize = require('../models/index')
const fs = require('fs');
//  var multipart = require('connect-multiparty');
//  var multiparty = multipart();
//  multipartyMiddleware = multiparty({ uploadDir: './files' });
// var multer  =   require('multer');
// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './files');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });
// var upload = multer({ storage : storage}).single('userPhoto');


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
  uploadPubliction: function(req, res){
    let result = req.body.form.image.split("\\");
    let type = result[2].split(".");
    let userId = 15;
    let r = Math.random().toString(36).substring(7);
    let nameFile = r+"."+type[1];
    sequelize.query('INSERT INTO publication (ref_id_user,image,description, createdAt) Values ($ref_id_user, $image, $description, NOW())',
      { bind: { ref_id_user: userId, image: nameFile, description: req.body.form.description }, type: sequelize.QueryTypes.INSERT }
    ).then(function(publication) {
      fs.writeFile('./files/publication/'+r+"."+type[1], req.body.file, function (err) {
        if (err) return console.log(err);
        res.status(201).json('test');
      });
    }).catch(function(err) {
      console.log(err)
      res.status(500).json({ 'error': 'cannot fetch publications' });
    })
  }

}