// Imports
var express      = require('express');
var usersCtrl    = require('./routes/usersCtrl');
var commentaireCtrl = require('./routes/commentaireCtrl');
var likesCtrl    = require('./routes/likesCtrl');
var proCtrl    = require('./routes/proCtrl');
var groupeCtrl    = require('./routes/groupeCtrl');
var publicationCtrl    = require('./routes/publicationCtrl');
var friendCtrl    = require('./routes/friendCtrl');
var chatCtrl    = require('./routes/chatCtrl');
var groupe2userCtrl = require('./routes/groupe2userCtrl');


// Router
exports.router = (function() {
  var apiRouter = express.Router();

  // Users routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/me/').post(usersCtrl.getUserProfile);
  apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);
  apiRouter.route('/users/test/').post(usersCtrl.testConnection);
  apiRouter.route('/users/getlist/').post(usersCtrl.getlist);
  apiRouter.route('/users/update').post(usersCtrl.updateUser);
  apiRouter.route('/users/update/image').post(usersCtrl.updateUserImage);
  
  
  // Friends
  apiRouter.route('/users/friend/').post(friendCtrl.getUserFriend);
  apiRouter.route('/users/newfriend/').post(friendCtrl.addNewUserFriend);
  apiRouter.route('/users/validatefriend/').post(friendCtrl.ValidateNewUserFriend);
  apiRouter.route('/users/listvalidatefriend/').post(friendCtrl.getListValidateNewUserFriend);
  apiRouter.route('/users/friend/check/').post(friendCtrl.checkFriend);

  
  // Publications
  apiRouter.route('/publication/me/').post(publicationCtrl.getUserPublication);
  apiRouter.route('/publication/upload/').post(publicationCtrl.uploadPublication);
  apiRouter.route('/publication/upload/pro').post(publicationCtrl.uploadProPublication);
  apiRouter.route('/publication/upload/groupe').post(publicationCtrl.uploadGroupePublication);
  apiRouter.route('/publication/all-publication/').post(publicationCtrl.getAllPublications);
  apiRouter.route('/publication/pro/').post(publicationCtrl.getProPublications);
  apiRouter.route('/publication/groupe/').post(publicationCtrl.getGroupePublications);

  // Commentaire
  apiRouter.route('/commentaire/add/').post(commentaireCtrl.addCommentaire);
  apiRouter.route('/commentaire').post(commentaireCtrl.listCommentaire);

  // Likes
  apiRouter.route('/like/publication').post(likesCtrl.likePublication);
  apiRouter.route('/dislike/publication').post(likesCtrl.dislikePublication);

  // Pro
  apiRouter.route('/pro/getlist').post(proCtrl.getList);
  apiRouter.route('/pro/getlist/me').post(proCtrl.getListProUser);
  apiRouter.route('/pro/add').post(proCtrl.addPro);
  apiRouter.route('/pro/delete').post(proCtrl.deletePro);
  apiRouter.route('/pro/update').post(proCtrl.updatePro);
  apiRouter.route('/pro/update/image').post(proCtrl.updateProImage);
  apiRouter.route('/pro/get').post(proCtrl.getPro);
  apiRouter.route('/pro/number/abonnement').post(proCtrl.getNumberAbonnement);
  apiRouter.route('/pro/number/abonnement/me').post(proCtrl.getNumberAbonnementUser);
  apiRouter.route('/pro/add/abonnement').post(proCtrl.addAbonnement);
  apiRouter.route('/pro/check/abonnement').post(proCtrl.checkAbonnement);
  apiRouter.route('/pro/check/author').post(proCtrl.checkProAuthor);
  

  // Groupe
  apiRouter.route('/groupe/getlist').post(groupeCtrl.getList);
  apiRouter.route('/groupe/delete').post(groupeCtrl.deleteGroupe)
  apiRouter.route('/groupe/get').post(groupeCtrl.getGroupe)
  apiRouter.route('/groupe/me').post(groupeCtrl.getMyGroupe)
  apiRouter.route('/groupe/check/author').post(groupeCtrl.checkGroupeAuthor)
  apiRouter.route('/groupe/add').post(groupeCtrl.addGroupe)
  apiRouter.route('/groupe/update/image').post(groupeCtrl.updateGroupeImage)
  apiRouter.route('/groupe/update').post(groupeCtrl.updateGroupe)
  

  // Groupe2User
  apiRouter.route('/groupe2user/getlist').post(groupe2userCtrl.getListGroup2User);
  apiRouter.route('/groupe2user/add').post(groupe2userCtrl.addUser2Groupe)
  apiRouter.route('/groupe2user/check').post(groupe2userCtrl.checkGroupe2User)
  apiRouter.route('/groupe2user/delete').post(groupe2userCtrl.deleteGroupe2user)
  apiRouter.route('/groupe2user/number/user').post(groupe2userCtrl.groupe2userNumberUser)
  apiRouter.route('/groupe2user/list/user').post(groupe2userCtrl.getListUserInGroupe2User)
  apiRouter.route('/groupe2user/list/userfriend/isnot').post(groupe2userCtrl.getListUserInGroupe2UserIsNot)

  //Chat
  apiRouter.route('/chat/add').post(chatCtrl.addChat);
  apiRouter.route('/chat/get').post(chatCtrl.getChat);

  return apiRouter;
})();