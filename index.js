const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// data
let logins = [
  {
    user: 'user1',
    password: 'password1'
  },
  {
    user: 'user2',
    password: 'password2'
  },
  {
    user: 'user3',
    password: 'password3'
  },
  {
    user: 'user4',
    password: 'password4'
  }
]

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));

// this creates session variable although it doesn't appear to do anything
app.use(session({
  name: 'eat shit',
  secret: 'soundsdelicious',
  resave: false,
  saveUninitialized: true
}));


app.use((req, res, next) => {
  let pathName = parseurl(req).pathname;
  console.log('pathName', pathName);

  if (!req.session.isLoggedIn && pathName != '/login') {
    res.redirect('/login');
  } else {
    // goto next route
    next();
  }
});


app.get('/login', (req, res) => {
  res.render('login', {logins: logins});
})



app.post('/login', (req, res) => {
  console.log('user', req.body.usernameField);
  console.log('password', req.body.passwordField);

  // remember why we used for loop instead of forEach
  for (var i = 0; i < logins.length; i++) {
    let login = logins[i];
    if (login.user === req.body.usernameField && login.password === req.body.passwordField) {
      console.log('bah god you did it');
      req.session.isLoggedIn = true;
      req.session.user = req.body.usernameField;
      // return;
    }
  }
  res.redirect('/'); // return to middleware
})



app.get('/', (req, res) => {
  res.render('index', {user: req.session.user});
});



app.listen(3090, (req, res) => {
  console.log('up and running on port 3090')
});
