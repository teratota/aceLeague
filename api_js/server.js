// Imports
var express     = require('express');
const app = express();
var bodyParser  = require('body-parser');
var apiRouter   = require('./apiRouter').router;
var fs = require('fs');

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
              console.log('trouver');
              socket.leave(previousId);
              socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
              previousId = currentId;
          }
      
          socket.on('getMess', docId => {
              //fonction de renvoi de la conversation
              safeJoin(docId);
              console.log(documents[docId]);
              socket.emit('message', documents[docId]);
          });
      
          socket.on('addMess', doc => {
              // creation de la room
              documents[doc.id] = doc;
              //safeJoin(doc.id);
              console.log(doc)
              io.emit('messages', Object.keys(documents));
              socket.emit('message', doc);
          });
      
          socket.on('editMess', doc => {
              //fonction qui recupere le message
              documents[doc.id] = doc;
              try {
                var data = fs.readFileSync("./files/chat/"+doc.id+".json",'utf8')
              } catch (err) {
                fs.writeFileSync("./files/chat/"+doc.id+".json", "[]")
                var data = fs.readFileSync("./files/chat/"+doc.id+".json", 'utf8');
              }
              data = data.slice(0, -1);
              console.log(data);
              let virgule = '';
              if(data != '['){
                  virgule = ',';
              }
              try {
                  fs.writeFileSync("./files/chat/"+doc.id+".json", data+virgule+doc.message+"]", {flag: "w+"});
              } catch(err) {
                  // An error occurred
                  console.error(err);
              }
              var contents = fs.readFileSync("./files/chat/"+doc.id+".json", 'utf8');
              // console.log(contents);
              doc.message = contents;
             // console.log(doc.message);
              doc.token = contents; 
              console.log("-----------");
              console.log(doc);
              console.log("----");
             // console.log(documents);
              console.log("-----------");
              socket.emit('message', doc);
          });
      
          io.emit('messages', Object.keys(documents));
          console.log(`Socket ${socket.id} has connected`);
});
// Launch server
server.listen(8080, function() {
    console.log('Server api');
});
