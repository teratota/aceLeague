// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'fkglsjdmvnxbnclwjxkvncwxvbnhgbdfgvbxhcwbvhcxbwkvbkhbwhbvhjkbvxcgdvbsjkdvbwxcbkjwcxbbhkjhxcvbkwxcbvkhxbvnkvshvdfbsvcdb';

// Exported functions
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData[0].id,
      isAdmin: userData.isAdmin
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '172800000'
    })
  },
 /* parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },*/
  getUserId: function(token) {
    var userId = -1;
   // var token = module.exports.parseAuthorization(authorization);

    if(token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          userId = jwtToken.userId;
      } catch(err) { }
    }
    return userId;
  }
}