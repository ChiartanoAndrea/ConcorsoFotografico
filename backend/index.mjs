// imports
import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import getUser from './dao_user.mjs';

import db from './db.mjs';
import cors from 'cors';
import { ImageList, storeVote, incrementVoteCount, getUserByEmail, createUser } from './dao.mjs';
import { OAuth2Client } from 'google-auth-library';


// init express
const app = new express();
app.use(express.json());
const port = 3001;


const googleClient = new OAuth2Client("102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com");



const corsOptions={
  origin : 'http://localhost:5173',
  optionsSuccessState:200,
  credentials: true
}
app.use(cors(corsOptions));;


passport.use(new LocalStrategy(async function verify(username,password,cb ){
  const user =await getUser(username,password);

  if(!user)
    return cb(null,false,{message:'Incorrect username or password'})// null perchè non tori errori

  return cb(null,user);
  
  })
)

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

passport.serializeUser(function(user,cb) {//prende dati dell utente per salvare la sessione
  cb(null,user)
});

passport.deserializeUser(function(user,cb){
  cb(null,user);
});


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};



app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      // Autenticazione fallita: restituisci 401 + messaggio
      return res.status(401).type('text').send(info.message || 'Login failed');
    }

    req.login(user, function(err) {
      if (err) return next(err);
      return res.json(user);
    });
  })(req, res, next);
});

app.get('/api/session/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not Authenticated' });
  }
});

app.delete('/api/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout failed');

    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // <-- nome cookie di sessione
      res.status(200).send('Logout successful');
    });
  });
});

app.post('/api/login/google', async (req, res, next) => {
    const { token } = req.body; // Questo è il token inviato dal frontend

    if (!token) {
        return res.status(400).json({ error: 'Token mancante' });
    }

    try {
        // 1. Il backend verifica il token con i server di Google
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: "102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com", // Deve coincidere col tuo Client ID
        });

        // 2. Estrai i dati dell'utente dal payload del token
        const payload = ticket.getPayload();
        const userEmail = payload.email;
        const userName = payload.name;

        const name= userName.split(' ')[0];
        const surname= userName.split(' ')[1] || '';

        console.log(`Utente autenticato con Google: ${userName} (${userEmail})`);

        // 3.  TODO!!! Gestione Database
        // Qui devi cercare se l'utente esiste già nel tuo DB tramite l'email.
        let user = await getUserByEmail(userEmail); 
        
        // Se non esiste, registralo in automatico nel DB.
        if (!user) {
            user = await createUser({ email: userEmail, name: name, surname: surname });
        }

        // 4. Crea la sessione Passport!
        // req.login fa esattamente ciò che farebbe il login locale, 
        // serializzando l'utente nel cookie connect.sid
        req.login(user, function(err) {
            if (err) return next(err);
            return res.json(user); // Rispondi al frontend con i dati dell'utente loggato
        });

    } catch (error) {
        console.error("Errore nella verifica del token Google:", error);
        return res.status(401).json({ error: 'Token Google non valido o scaduto' });
    }
});

  // DEBUG: list all users
  app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM User', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });


app.get('/api/immagini', async (req, res) => {
    try {
        const images = await ImageList();

        if (!images || images.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        return res.json(images);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Endpoint per votare
app.post('/api/vota', isLoggedIn, async (req, res) => {
    const { immagine_id } = req.body;
    const utente_id = req.user?.id;

    if (!utente_id || !immagine_id) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const voteId = await storeVote(utente_id, immagine_id);
        await incrementVoteCount(immagine_id);
        res.status(201).json({ message: 'Vote stored successfully', voteId, utente_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

