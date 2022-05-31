require('dotenv').config();
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const courseRouter = require('./routes/courses');
const adminRouter = require('./routes/adminRoutes');
const generalRouter = require('./routes/generalRoutes');
const housemaidRouter = require('./routes/housemaidRoutes');
const houseownerRouter = require('./routes/houseownerRoutes');
const chatRouter = require('./routes/chatRoutes');
const userRouter = require('./routes/userRoutes');
const methodOverride = require('method-override');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors')

var app = express();
const server = http.createServer(app);
const io = socketio(server);

// const { PeerServer } = require('peer');
// const peerServer = PeerServer({ port: 9000, path: '/myapp' });

const { ExpressPeerServer } = require('peer');
const Peer = ExpressPeerServer(server, { debug: true });

app.use(cors({
  origin: '*'
}));
app.use('/peerjs', Peer);

// default option layout for  express-upload


// for socket.io
const chatController = require('./controllers/chatContoller');
const videoChatController = require('./controllers/videoChatController');
io.sockets.on('connection', function (socket) {
  // ppass socket and io
  chatController.respond(socket, io);
  videoChatController.respond(socket, io);
});



app.use(express.static('uploads'));

// setting ejs view engine
app.set('view engine', 'ejs');

// configuring cookie pareser to manage cookies
app.use(cookieParser());
// body parser midddleware
app.use(bodyParser.json());
// access parameters in req.body
app.use(bodyParser.urlencoded({ extended: false }));
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
// override with methods in the forms having ?_method=
app.use(methodOverride('_method'));
// setting static folder //serves resuources from public folder
app.use(express.static(path.join(__dirname, 'public')));





// configuring routes
app.use('/', generalRouter);
app.use('/courses', courseRouter);
app.use('/housemaid', housemaidRouter);
app.use('/houseowner', houseownerRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.render('index');
})

const PORT = process.env.PORT || 5555;
server.listen(PORT, () => `Server started on port ${PORT}`);
