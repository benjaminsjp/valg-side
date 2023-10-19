const express = require('express');
const session = require('express-session');

const app = express();
const sql = require(__dirname + '/routes/sql.js');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const { harStemt } = require('./routes/sql');

// static assets
app.use(express.static(__dirname + '/public'));

// session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = await sql.hentBruker();

        const existingUser = users.find((user) => user.id === profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = {
          id: profile.id,
        };

        await sql.leggTilBruker(newUser.id);

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await sql.hentBrukerEtterId(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

async function hasVoted(req, res) {
  console.log(await sql.harStemt(req.session.passport.user))
  if (await sql.harStemt(req.session.passport.user || !req.session.passport)) {
    res.redirect('/stemt')
  }
}

// passport routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/takk', failureRedirect: '/' }));

// routes
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');

});

app.get('/takkjs', function (req, res) {
  res.sendFile(__dirname + '/public/script/utils/takk.js');
});

app.get('/takk', function (req, res) {
  res.sendFile(__dirname + '/views/html/Takk.html');
});

app.get("/stemtCss", function(req, res){
  res.sendFile(__dirname + "/public/css/stemt.css")
})

app.get('/resultat.css', function (req, res) {
  res.sendFile(__dirname + '/public/css/resultat.css');
});

app.get('/stemt', function(req, res){
  res.sendFile(__dirname + '/views/html/stemt.html')
})

app.get('/resultat', function (req, res) {
  res.sendFile(__dirname + '/views/html/resultattavle.html');
});

app.get('/sqlJs', function (req, res) {
  res.sendFile(__dirname + '/routes/sql.js');
});

app.get('/mainJs', function(req, res){
  res.sendFile(__dirname + "/public/script/utils/main.js")
})

app.get('/hent-data', async (req, res) => {
  try {
    const data = await sql.hentParti()
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Klarte ikke hente data'})
  }
})

app.get('/oppdaterParti/:id', async (req, res) => {
  const id = req.params.id
  if (req.session.passport) {
    if (await sql.harStemt(req.session.passport.user)) {
      res.status(500).json({ error: 'You have already voted.' })
      return
    }
    try {
      await sql.oppdaterParti(id, req.session.passport.user)
      res.send(`Incrementing data for ID: ${id}`)
    } catch (error) {
      console.error()
      res.status(500).json({ error: 'An error occured while incrementing vote.' })
    }
  } else {
    res.redirect('/')
  }
});



app.listen(process.env.PORT || 3000);
