/* eslint-disable prettier/prettier */
import cors from 'cors';
import express, { json } from 'express';
import { Log } from './classes/Logging/Log';
import { DefaultErrorHandler } from './middlewares/error-handler';
import expressWs from 'express-ws';
import { USER_ROUTES } from './routes/user/UserController';
import path from 'path';
import { Socket } from 'socket.io';

const app = express();
/**
 * @type {Socket}
 */

/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(json());

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors());

/**
 * Toutes les routes CRUD pour les animaux seronts préfixées par `/pets`
 */
// app.ws('/user', USER_ROUTES)

/**
 * On créé une nouvelle "application" express
 */

const http = require('http').createServer(app);
const port = process.env.PORT || 5555;
const io = require('socket.io')(http , {
  cors: {
    origin: "http://localhost3000",
    methods: ["GET", "POST"],
  }
});

app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'template/game/morpion.html'));
});
app.get('/david', (req, res) => {
  res.send('salut');
});

http.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

let rooms = [];

io.on('connection', socket => {
  console.log(`[connection] ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}`);
    let room = null;

    rooms.forEach(r => {
      r.players.forEach(p => {
        if (p.socketId === socket.id && p.host) {
          room = r;
          rooms = rooms.filter(r => r !== room);
        }
      });
    });
  });
});

/**
 * Gestion des erreurs
 */
app.use(DefaultErrorHandler);
