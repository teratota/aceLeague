// Imports
var express     = require('express');
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;
let http = require('http').Server(express);
let io = require('socket.io')(http);
var jwtUtils  = require('./utils/jwt.utils');
var cryptoUtils  = require('./utils/crypto.utils');
const fs = require('fs');


// Instantiate server
var server = express();

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
server.use(bodyParser.json({limit: '100mb'}));

server.use(express.json({limit: '100mb'}));
server.use(express.urlencoded({limit: '100mb'}));

// Configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super server</h1>');
});

server.use('/api/', apiRouter);

io.on('connection', (socket) => {

    // socket.on('createRoom', function(){
    //   console.log(socket)
    //   socket.join(socket.room);  
    // });
  
    socket.on('join', function(room){
      console.log(socket)
      var headerAuth  = cryptoUtils.decrypt(room.token);
      var userId      = jwtUtils.getUserId(headerAuth);
	    console.log(userId)
      if(userId>0){
        socket.join(room.nom);  
      }
    });
  
    
    socket.on('disconnect', function(){
      var headerAuth  = cryptoUtils.decrypt(socket.token);
      var userId      = jwtUtils.getUserId(headerAuth);
	    console.log(userId)
      if(userId>0){
        io.sockets.in(socket.room).emit('users-changed', {user: socket.nickname, event: 'left'});   
      }
    });
  
    socket.on('set-nickname', (nickname) => {
      socket.nickname = nickname.nickname;
      socket.room = nickname.room;
      socket.token = nickname.token;
      var headerAuth  = cryptoUtils.decrypt(socket.token);
      var userId      = jwtUtils.getUserId(headerAuth);
	    console.log(userId)
      if(userId>0){
        socket.join(nickname.room); 
        io.sockets.in(socket.room).emit('users-changed', {user: socket.nickname, event: 'joined'});  
      } 
    });
    
    socket.on('add-message', (message) => {
      var headerAuth  = cryptoUtils.decrypt(socket.token);
      var userId      = jwtUtils.getUserId(headerAuth);
	    console.log(userId)
      if(userId>0){
        fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){ 
          if (err){
           console.log(err); 
          } else {
             obj = json.parse(data); 
             let date = new Date();
             obj.table.push({user: socket.nickname , message: message.text, time : date});
             json = json.stringify(obj); 
             fs.writeFile(socket.room+'.json', json, 'utf8', callback);
             io.sockets.in(socket.room).emit('message', {text: message.text, from: socket.nickname, created: new Date()});
        }});  
      } 
    });
  });
var port = process.env.PORT || 3001;

http.listen(port, function(){
     console.log('listening in http://localhost:' + port);
});

// Launch server
server.listen(4444, function() {
    console.log('Server en écoute :)');
});