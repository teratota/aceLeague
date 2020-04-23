// Imports
var express      = require('express');
var usersCtrl    = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl    = require('./routes/likesCtrl');
var publicationCtrl    = require('./routes/publicationCtrl');
var friendCtrl    = require('./routes/friendCtrl');


// Router
exports.router = (function() {
  var apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
  apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);
  apiRouter.route('/users/test/').get(usersCtrl.test);
  apiRouter.route('/users/getlist/').get(usersCtrl.getlist);
  
  // Friends
  apiRouter.route('/users/friend/').get(friendCtrl.getUserFriend);

  // Publications
  apiRouter.route('/publication/me/').get(publicationCtrl.getUserPublication);
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