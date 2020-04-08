// Imports
var express     = require('express');
const app = express();
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;

// Instantiate server
var server = express();

const http = server.listen(3000, function() {
    console.log('Server chat');
});

const io = require('socket.io')(http);

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super server</h1>');
});

server.use('/api/', apiRouter);


const documents = {};
      
io.on('connection', socket => {
          let previousId;
          const safeJoin = currentId => {
              //entrer dans la room
              socket.leave(previousId);
              socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
              previousId = currentId;
          }
      
          socket.on('getMess', docId => {
              //fonction de renvoi de la conversation
              safeJoin(docId);
              socket.emit('message', documents[docId]);
          });
      
          socket.on('addMess', doc => {
              // creation de la room
              documents[doc.id] = doc;
              safeJoin(doc.id);
              io.emit('messages', Object.keys(documents));
              socket.emit('document', doc);
          });
      
          socket.on('editMess', doc => {
              //fonction qui recupere le message
              documents[doc.id] = doc;
              console.log(doc);
              socket.to(doc.id).emit('message', doc);
          });
      
          io.emit('messages', Object.keys(documents));
          console.log(`Socket ${socket.id} has connected`);
});
// Launch server
server.listen(8080, function() {
    console.log('Server api');
});
