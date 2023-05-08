//..............Include Express..................................//
const express = require('express');
const app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
const ejs = require('ejs');
const methodOverride = require('method-override');


//..............Create an Express server object..................//

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));//middleware for CRUD:UPDATE and DELETE

app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

app.use(require('./controllers/auth'));
app.use(require('./controllers/index'));
app.use(require('./controllers/photo_controller'));
app.use(require('./controllers/artist_controller'));
app.use("", function(request, response) {
  response.redirect('/error?code=400');
});

//..............Start the server...............................//

const port = process.env.PORT || 3000;
app.set('port', port); //let heroku pick the port if needed

let socketapi =require('./controllers/socketConnections');
socketapi.io.attach(server);//attach sockets to the server

//start the server
server.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});
