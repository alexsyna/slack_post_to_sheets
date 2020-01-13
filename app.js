var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var accepts = require('accepts')
const bodyParser = require('body-parser');

const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = '22172351637aea2e191b0458a0ca5edb';
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);

var indexRouter = require('./routes/index');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






app.use('/gu' , slackEvents.requestListener());

app.use(bodyParser());


// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {

  var challenge = req.body.challenge;

  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);

  res.json({"challenge":challenge});
});


slackEvents.on('error', (error) => {
  console.log(error.name);
  console.log(error)// TypeError
});

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();





/*app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});*/



module.exports = app;
