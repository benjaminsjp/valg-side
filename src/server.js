const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');


require('dotenv').config();

const app = express();  
const sql = require(__dirname + '/routes/sql.js');



const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const { harStemt } = require(__dirname + '/routes/sql.js');


// static files
app.use(express.static(__dirname + '/public'));

// session
app.use(cookieParser())

app.use(
  session({
    secret: process.env.SESSION_key,
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
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
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

        // Lagre brukerens ID i sesjonen
        req.session.passport = { user: newUser.id };

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

async function hasVoted(req, res, next) {
  const id = req.session.passport.user;
  console.log('ID:', id); // Legg til denne linjen for feilsøking
  const hasVoted = await sql.harStemt(id);
  console.log('hasVoted:', hasVoted); // Legg til denne linjen for feilsøking

  if (hasVoted) {
    return res.redirect('/stemt');
  }
  console.log("hasVoted" + " " + hasVoted + " " + id);
  return next();
}

// passport routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/takk', failureRedirect: '/' }));

app.get('/oppdaterParti/:id', hasVoted, isAuthenticated, async (req, res) => {
  const id = req.session.passport.user; // Anta at du har en måte å hente brukerens ID på.
  const partiId = req.params.id;

  try {
    const hasVoted = await sql.harStemt(id); 

    if (hasVoted) {
      return res.status(403).json({ error: 'Du har allerede stemt.' }); // Returner feilmelding hvis brukeren har stemt.
    }

    await sql.oppdaterParti(partiId);

  // Oppdater brukerens stemmetilstand
    await sql.leggTilBruker(id);
        

    res.send(`Oppdater parti for ID: ${partiId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Feil med å oppdatere parti' });
  }
});

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







app.listen(process.env.PORT || 3000);
