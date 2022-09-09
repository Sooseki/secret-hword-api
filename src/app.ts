/* eslint-disable prettier/prettier */
import cors from 'cors'
import express, { json } from 'express'
import { Log } from './classes/Logging/Log'
import { DefaultErrorHandler } from './middlewares/error-handler'
import expressWs from 'express-ws'
import { USER_ROUTES } from './routes/user/UserController'
import path from 'path'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import {firstPresidentPlayer} from './utils/playerTurn/playerTurn'
import { initRoles } from './utils/roles/roles'
import { getPlayerIndex } from './utils/check/check'

/**
 * @type {Socket}
 */

/**
 * On créé une nouvelle "application" express
 */
const app = express();
const http = require('http');
const port = process.env.PORT || 5555;


const server =  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  }
})

app.use(express.static('public'));

app.get('/game',(req, res) => {
  res.sendFile(path.join(__dirname, 'template/game/morpion.html'));
})

app.get("/david", (req, res) => {
  res.send("salut")
})

server.listen(port, () => {console.log('server listening')
});

let rooms = [];

io.on('connection', (socket) => {
  console.log(`[connection] ${socket.id}`);
  let room = null;

  socket.on('joinRoom', (player) => {
    if (player.roomId === "") {
        room = createRoom(player);
        io.to(socket.id).emit("get room", room.id);
        console.log(`[create room ] - ${room.id} - ${player.username}`);
    } else {
        room = rooms.find(r => r.id === player.roomId);
        if (room === undefined) {
            return;
        }
        player.roomId = room.id;
        room.players.push(player);
    }

    socket.join(player.roomId);
    io.to(player.roomId).emit("player join", player);
    io.to(socket.id).emit('logged players', room.players);

    // Check if start game
    if (room.players.length === 2) {
      io.to(player.roomId).emit('start game', firstPresidentPlayer(room.players));
      //here roles are sent
      const roles = initRoles();
      let count = 0;
      room.players.forEach(player => {
        io.to(player.socketId).emit('player role', roles[count])
        count++;
      });
    }
  })

  // Display list of rooms
  socket.on('get rooms', () => {
      io.to(socket.id).emit('list rooms', rooms);
  });

  // Play
  socket.on('play', (player) => {
      console.log(`[play] ${player.username}`);
      io.to(player.roomId).emit('play', player);
  });

  // Restart the game
  socket.on('play again', (roomId) => {
      const room = rooms.find(r => r.id === roomId);

      if (room && room.players.length === 2) {
          io.to(room.id).emit('play again', room.players);
      }
  });

  socket.on('selected chancelor', (chancelor) => {
    io.to(chancelor.roomId).emit('selected chancelor', chancelor)
    console.log("this is chancelor (back): ", chancelor)
  });

  // Disconnect
  socket.on('disconnect', () => {
      console.log(`[disconnect] ${socket.id}`);
      let room = null;

      rooms.forEach(r => {
          r.players.forEach(p => {
              if (p.socketId === socket.id && p.host) {
                  room = r;
                  rooms = rooms.filter(r => r !== room);
              }
          })
      })
  });
  socket.on('player vote', (player) => {
    io.to(player.player.roomId).emit('player voted',player.player);
    room.players[getPlayerIndex(room.players, player.player)].vote = player.vote;
  });
});

function createRoom(player) {
  const room = { id: roomId(), players: [] };

  player.roomId = room.id;

  room.players.push(player);
  rooms.push(room);

  return room;
}

function roomId() {
  return Math.random().toString(36).substr(2, 9);
}
/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)  
 */
app.use(json())

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors())

/**
 * Toutes les routes CRUD pour les animaux seronts préfixées par `/pets`
 */
// app.ws('/user', USER_ROUTES)


/**
 * Gestion des erreurs
 */
 app.use(DefaultErrorHandler)