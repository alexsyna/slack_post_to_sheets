var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var accepts = require('accepts')



var indexRouter = require('./routes/index');


var app = express();
const port = 4000;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






app.use('/', indexRouter);




app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});



module.exports = app;
