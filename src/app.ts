/* eslint-disable prettier/prettier */
import cors from 'cors'
import express, { json } from 'express'
import { DefaultErrorHandler } from './middlewares/error-handler'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { draw3Cards, firstPresidentPlayer, shuffleLawCards, selectNextPresident } from './utils/playerTurn/playerTurn'
import { initRoles } from './utils/roles/roles'
import { getPlayerIndex, checkIfVotePassed, isLibVictory, isFascVictory } from './utils/check/check'
import { Player } from './types/Player'
import { NB_PLAYER } from './utils/variables/variables'

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

server.listen(port, () => {
  console.log('server listening')
});

let rooms = [];

io.on('connection', (socket: Socket) => {
  let room = null;

  // when a player wants to join a room
  socket.on('joinRoom', (player: Player) => {
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
    if (room.players.length === NB_PLAYER) {
      room.president = firstPresidentPlayer(room.players);
      io.to(player.roomId).emit('start game', room.president);
      room.cards = shuffleLawCards();
      //here roles are sent
      const roles: Array<string> = initRoles();
      let count = 0;
      room.players.forEach(player => {
        io.to(player.socketId).emit('player role', roles[count]);
        if (roles[count] === "hitler") {
          room.hitler = player;
        }
        count++;
      });
    }
  })

  // Display list of rooms
  socket.on('get rooms', () => {
      io.to(socket.id).emit('list rooms', rooms);
  });

  // Restart the game
  socket.on('play again', (roomId: string) => {
      const room = rooms.find(r => r.id === roomId);

      if (room && room.players.length === NB_PLAYER) {
          io.to(room.id).emit('play again', room.players);
      }
  });

  // President request for chosing a chancelor
  socket.on('selected chancelor', (chancelor: Player) => {
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

  // Every time a player votes to elect or not
  socket.on('player vote', (player: {player: Player, vote: string, hasVotedPlayersNumber: number}) => {
    io.to(room.id).emit('player voted', player.player);
    room.players[getPlayerIndex(room.players, player.player)].vote = player.vote;
    if (player.hasVotedPlayersNumber === NB_PLAYER) {
      const votePassed = checkIfVotePassed(room.players)
      io.to(room.id).emit('votes results', votePassed)
      if (!votePassed) {
        room.president = selectNextPresident(room.players, room.president);
        io.to(room.id).emit('new turn', room.president);
      }
    }
  });

  // Presient request to get first three cards
  socket.on('get cards', () => {
    const [cards, cardsToDraw] = draw3Cards(room.cards);
    room.cards = cards;
    io.to(room.president.socketId).emit("president cards", cardsToDraw);
  })

  // President request to send his two selected cards
  socket.on('president selected cards', (cards) => {
    io.to(room.chancelor.socketId).emit("chancelor cards", cards);
  })

  // Chancelor request to send his selected card
  socket.on('chancelor selected card', (selectedLawCard) => {
    io.to(room.id).emit("selected law card", selectedLawCard);
  })

  // Called every turn to check if there is a victory
  socket.on('check victory', (countLibLaw: number, countFascLaw: number) => {
    const hasLibWon = isLibVictory(countLibLaw)
    const hasFascWon = isFascVictory(countFascLaw, room.chancelor.playerId, room.hitler.playerId)
    if (hasLibWon) {
      io.to(socket.id).emit("victory","liberals");
    }
    if (hasFascWon) {
      io.to(socket.id).emit("victory", "fascists");
    }
    if(!hasFascWon && !hasLibWon) {
      io.to(socket.id).emit('no victory')
    }
  })

  socket.on('new turn', () => {
    room.president = selectNextPresident(room.players, room.president);
    io.to(room.id).emit('new turn', room.president);
  })
});


const createRoom = (player: Player) => {
  const room = { id: roomId(), players: [] };

  player.roomId = room.id;

  room.players.push(player);
  rooms.push(room);

  return room;
}

const roomId = () => {
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
 * Gestion des erreurs
 */
 app.use(DefaultErrorHandler)