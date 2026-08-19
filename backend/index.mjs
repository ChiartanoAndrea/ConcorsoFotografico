import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import getUser from './dao_user.mjs';

import db from './data/db.mjs';
import cors from 'cors';
import { ImageList, storeVote, incrementVoteCount, getUserByEmail, createUser, getUserVoteCount, canUserVote, hasUserVoted, removeVote, decrementVoteCount } from './dao.mjs';
import { OAuth2Client } from 'google-auth-library';

// Inizializzazione express
const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

const googleClient = new OAuth2Client("102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com");

const corsOptions = {
  origin: ['http://localhost:5173', 'https://www.focusgrafica.it','https://focusgrafica.it',],
  optionsSuccessState: 200,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const user = await getUser(username, password);
    if (!user) {
      return cb(null, false, { message: 'Incorrect username or password' });
    }
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

app.set('trust proxy', 1);

app.use(session({
 secret: process.env.SESSION_SECRET || "una-stringa-segreta-molto-lunga",
 resave: false,
 saveUninitialized: false,
 cookie: {
 sameSite: 'lax', // 'lax' è perfetto per i cookie di prima parte
 domain: '.focusgrafica.it', // Il PUNTO iniziale è vitale: rende il cookie valido per www, api e root
 secure: true, // Mantiene il requisito dell'HTTPS
 httpOnly: false,
 maxAge: 1000 * 60 * 60 * 24 * 7
 }
}));

app.use(passport.initialize());
app.use(passport.session());

// Avvio server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  console.log('🔐 isLoggedIn check:', {
    isAuthenticated: req.isAuthenticated(),
    userId: req.user?.id,
    sessionId: req.sessionID,
    cookies: req.headers.cookie
  });
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.status(401).type('text').send(info?.message || 'Login failed');
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
      res.clearCookie('connect.sid');
      res.status(200).send('Logout successful');
    });
  });
});

app.post('/api/login/google', async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token mancante' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "102222121516-hck8dl13qmutfialcqmkmrvkfaige4u6.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;
    const userName = payload.name || '';

    const name = userName.split(' ')[0] || '';
    const surname = userName.split(' ')[1] || '';

    let user = await getUserByEmail(userEmail); 
    
    if (!user) {
      user = await createUser({ email: userEmail, name: name, surname: surname });
    }

    req.login(user, function(err) {
      if (err) return next(err);
      console.log('✅ Login Google success:', { userId: user.id, email: user.email, sessionID: req.sessionID });
      return res.json(user);
    });

  } catch (error) {
    console.error("Errore nella verifica del token Google:", error);
    return res.status(401).json({ error: 'Token Google non valido o scaduto' });
  }
});

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM User', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/immagini', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const images = await ImageList(userId);

    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    return res.json(images);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/vota', isLoggedIn, async (req, res) => {
  const { immagine_id } = req.body;
  const utente_id = req.user?.id;

  if (!utente_id || !immagine_id) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Controlla se l'utente ha già votato questa foto
    const alreadyVoted = await hasUserVoted(utente_id, immagine_id);

    if (alreadyVoted) {
      // Annulla il voto
      await removeVote(utente_id, immagine_id);
      await decrementVoteCount(immagine_id);
      return res.status(200).json({ message: 'Vote removed successfully', action: 'removed' });
    } else {
      // Aggiunge il voto
      const voteCount = await getUserVoteCount(utente_id);
      if (voteCount >= 3) {
        return res.status(403).json({ error: 'Hai raggiunto il massimo di 3 voti' });
      }

      await storeVote(utente_id, immagine_id);
      await incrementVoteCount(immagine_id);
      return res.status(201).json({ message: 'Vote stored successfully', action: 'added' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/voti-rimasti', isLoggedIn, async (req, res) => {
  const utente_id = req.user?.id;

  if (!utente_id) {
    return res.status(400).json({ error: 'Missing user id' });
  }

  try {
    const voteCount = await getUserVoteCount(utente_id);
    const votesRemaining = Math.max(0, 3 - voteCount);
    res.json({ votesRemaining, votesUsed: voteCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});