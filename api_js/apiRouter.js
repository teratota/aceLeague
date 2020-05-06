// Imports
var express      = require('express');
var usersCtrl    = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl    = require('./routes/likesCtrl');
var proCtrl    = require('./routes/proCtrl');
var groupeCtrl    = require('./routes/groupeCtrl');
var publicationCtrl    = require('./routes/publicationCtrl');
var friendCtrl    = require('./routes/friendCtrl');


// Router
exports.router = (function() {
  var apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me/').post(usersCtrl.getUserProfile);
  apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);
  apiRouter.route('/users/test/').post(usersCtrl.test);
  apiRouter.route('/users/getlist/').post(usersCtrl.getlist);
  apiRouter.route('/publication/all-publication/').post(publicationCtrl.getAllPublications);
  apiRouter.route('/users/update').post(usersCtrl.updateUser);
  
  
  // Friends
  apiRouter.route('/users/friend/').post(friendCtrl.getUserFriend);

  // Publications
  apiRouter.route('/publication/me/').post(publicationCtrl.getUserPublication);
  apiRouter.route('/publication/upload/').post(publicationCtrl.uploadPubliction);

  // Messages routes
  apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
  apiRouter.route('/messages/').get(messagesCtrl.listMessages);

  // Likes
  apiRouter.route('/messages/:messageId/vote/like').post(likesCtrl.likePost);
  apiRouter.route('/messages/:messageId/vote/dislike').post(likesCtrl.dislikePost);

  // Pro
  apiRouter.route('/pro/getlist').post(proCtrl.getList);

  // Groupe
  apiRouter.route('/groupe/getlist').post(groupeCtrl.getList);

  return apiRouter;
})();