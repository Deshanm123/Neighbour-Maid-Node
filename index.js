require('dotenv').config();
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const courseRouter = require('./routes/courses');
const adminRouter = require('./routes/adminRoutes');
const generalRouter = require('./routes/generalRoutes');
const housemaidRouter = require('./routes/housemaidRoutes');
const houseownerRouter = require('./routes/houseownerRoutes');
const methodOverride = require('method-override');




var app = express();
// default option layout for  express-upload

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

app.get('/', (req, res) => {
  res.render(index);
})

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => `Server started on port ${PORT}`);
