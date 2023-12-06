import cors = require('cors');
import morgan = require('morgan');
import express = require('express');
import session = require('express-session');
import * as csrf from 'csurf';
import csrfCookieSetter from './utils/set-csrf-cookie';
import passport from './app/auth/passport';
import routes from './routes';
import config from './config';
import errorHandler from './utils/error-handler';
import serveIndex from './utils/serve-index';
import logger from './utils/logger';
import { User } from './models/user';
import fs  =  require('fs');
import https = require('https');
import path = require('path');
import 'localstorage-polyfill'

global['localStorage'] = localStorage;
declare module 'express-session' {
  interface SessionData { user: User | null | undefined }
}
console.log("ssl at : "+path.resolve(__dirname, '../ssl.key/server.key'))

if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}

localStorage.setItem('myFirstKey', 'myFirstValue');
console.log(localStorage.getItem('myFirstKey'));

var privateKey  = fs.readFileSync(path.resolve(__dirname, '../ssl.key/server.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname,'../ssl.crt/server.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();
// app.use(express.static('../angular/dist/'));
var httpsServer = https.createServer(credentials, app);
var ip = '0.0.0.0'; //'192.168.32.1';
app.use(session(config.sessionConfig));
app.use(morgan(config.morganPattern, { stream: config.morganStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
// app.use(csrf());
// app.use(csrfCookieSetter());
app.use(errorHandler());
app.use(logger.initialize());
app.use(routes);
// app.get('*', serveIndex());
httpsServer.listen(8080, ip || 'localhost'  , () => {
  console.log("The HTTP SSL server started on port 8080");
});
//app.listen(8080, ip || 'localhost' ,() => logger.info('main.app_start'));