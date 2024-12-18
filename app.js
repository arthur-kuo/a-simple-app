const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const routes = require('./routes');
const passport = require('./config/passport');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-output.json');
const { SwaggerUIBundle, SwaggerUIStandalonePreset } = require('swagger-ui-dist');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  // console.log(process.env.NODE_ENV)
  require('dotenv').config();
}
const corsOptions = {
  origin: [
    process.env.APP_URL,
    'https://accounts.google.com/',
    'http://localhost:3000',
    'https://a-simple-app.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(cors(corsOptions));
app.use(routes);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  console.log(`Swagger UI available on /api/docs`);
});

module.exports = app;
