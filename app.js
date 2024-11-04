const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const routes = require('./routes');

if (process.env.NODE_ENV !== 'production') {
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
app.use(methodOverride('_method'));
app.use(cors(corsOptions));
app.use(routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
