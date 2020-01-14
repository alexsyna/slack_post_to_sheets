var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var accepts = require('accepts')
const bodyParser = require('body-parser');

const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = '22172351637aea2e191b0458a0ca5edb';
const port = 3000;
const slackEvents = createEventAdapter(slackSigningSecret);
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var indexRouter = require('./routes/index');


var app = express();


app.use('/gu' , slackEvents.requestListener());

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {


  console.log('=============================================');
  console.log(event.attachments[0].fields);
  console.log('=============================================');
  console.log(event);
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);


var username = event.user;
var timestamp = event.ts;
var a1 = event.attachments[0].fields[0].title+' : '+event.attachments[0].fields[0].value;
var a2 = event.attachments[0].fields[1].title+' : '+event.attachments[0].fields[1].value;
var a3 = event.attachments[0].fields[2].title+' : '+event.attachments[0].fields[2].value;


console.log('OUTSIDE GS api' +  username);
// If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
  const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Prints the names and majors of students in a sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */
  function listMajors(auth , username, timestamp, a1,a2,a3 ) {
    const sheets = google.sheets({version: 'v4', auth});
    /*    sheets.spreadsheets.values.get({
          spreadsheetId: '1wh6qv6FkEGfF3wOpehOYxKubRA0jJq3uU6PDNabGHC4',
          range: 'Sheet1!A2:E',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const rows = res.data.values;
          if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
              console.log(`${row[0]}, ${row[4]}`);
            });
          } else {
            console.log('No data found.');
          }
        });*/

    var username = event.user;
    var timestamp = event.ts;
    var a1 = event.attachments[0].fields[0].title+' : '+event.attachments[0].fields[0].value;
    var a2 = event.attachments[0].fields[1].title+' : '+event.attachments[0].fields[1].value;
    var a3 = event.attachments[0].fields[2].title+' : '+event.attachments[0].fields[2].value;

    let values = [
      [
        // Cell values ...
        username , timestamp , a1 , a2 , a3
      ]
      // Additional rows ...
    ];
    let resource = {
      values,
    };
    sheets.spreadsheets.values.append({
      spreadsheetId:'1wh6qv6FkEGfF3wOpehOYxKubRA0jJq3uU6PDNabGHC4',
      range: 'Sheet1!A2:E',
      valueInputOption: 'USER_ENTERED',
      resource,
    }, (err, result) => {
      if (err) {
        // Handle error.
        console.log(err);
      } else {
        console.log(`${result.updates} cells appended.`);
      }
    });


  }


});


slackEvents.on('error', (error) => {
  console.log(error.name);
  console.log(error)// TypeError
});

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();




/*app.use('/', indexRouter);
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});*/



module.exports = app;
