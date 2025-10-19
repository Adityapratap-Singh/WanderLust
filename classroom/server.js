const express = require('express');
const session = require('express-session');

const app = express();

// Session setup
const sessionOptions = {
  secret: 'My super secret key',
  resave: false,
  saveUninitialized: false, // better for production
};

app.use(session(sessionOptions));

// Register route
app.get('/register', (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  res.send(`Welcome, ${name}! You have been registered.`);
});

// Request count route
app.get('/reqcount', (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  const name = req.session.name || 'Guest';
  res.send(`Hello ${name}, you have visited ${req.session.views} time(s).`);
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
