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
import {draw3Cards, firstPresidentPlayer, shuffleLawCards} from './utils/playerTurn/playerTurn'
import { initRoles } from './utils/roles/roles'
import { getPlayerIndex, checkIfVotePassed } from './utils/check/check'

/**
 * @type {Socket}
 */

/**
 * On créé une nouvelle "application" express
 */
const app = express();
const http = require('http');
const port = process.env.PORT || 5555;
const nbPlayers = 2;


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
  let room = null;

  socket.on('joinRoom', (player) => {
    if (player.roomId === "") {
        room = createRoom(player);
        io.to(socket.id).emit("get room", room.id);
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
    if (room.players.length === nbPlayers) {
      room.president = firstPresidentPlayer(room.players);
      io.to(player.roomId).emit('start game', room.president);
      room.cards = shuffleLawCards();
      console.log("this is room.cards : ", room.cards);
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

      if (room && room.players.length === nbPlayers) {
          io.to(room.id).emit('play again', room.players);
      }
  });

  socket.on('selected chancelor', (chancelor) => {
    io.to(chancelor.roomId).emit('selected chancelor', chancelor)
    room.chancelor = chancelor;
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
    io.to(room.id).emit('player voted',player.player);
    room.players[getPlayerIndex(room.players, player.player)].vote = player.vote;
    if (player.hasVotedPlayersNumber === nbPlayers) {
      // io.to(room.id).emit('players votes', room.players);
      io.to(room.id).emit('votes results', checkIfVotePassed(room.players))
    }
  });
  socket.on('get cards', () => {
    console.log("this is room.cards of get cards : ", room.cards);
    const [cards, cardsToDraw] = draw3Cards(room.cards);
    room.cards = cards;
    console.log("this is room.cards of get cards² : ", room.cards);
    io.to(room.president.socketId).emit("president cards", cardsToDraw);
  })
  socket.on('president selected cards', (cards) => {
    io.to(room.chancelor.socketId).emit("chancelor cards", cards);
  })
  socket.on('chancelor selected card', (selectedLawCard) => {
    io.to(room.id).emit("selected law card", selectedLawCard);
  })

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