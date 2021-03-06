const express = require('express');
const cors = require('cors');
//const client = require('./client.js');
const app = express();
const request = require('superagent');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/search', async(req, res) => {
  const quoteData = await request.get(`http://ron-swanson-quotes.herokuapp.com/v2/quotes/search/${req.query.searchQuery}`);

  res.json(quoteData.body);
});

app.use(require('./middleware/error'));

module.exports = app;
