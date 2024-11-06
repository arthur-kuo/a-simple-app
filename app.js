const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const routes = require('./routes');
const passport = require('./config/passport');

if (process.env.NODE_ENV !== 'production') {
  console.log(process.env.NODE_ENV)
  require('dotenv').config();
}

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(cors(corsOptions));
app.use(routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
