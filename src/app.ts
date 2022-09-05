/* eslint-disable prettier/prettier */
import cors from 'cors'
import express, { json } from 'express'
import { Log } from './classes/Logging/Log'
import { DefaultErrorHandler } from './middlewares/error-handler'
import expressWs from 'express-ws'
import { USER_ROUTES } from './routes/user/UserController'
import path from 'path'

const PORT = process.env.PORT || 5555;

/**
 * On créé une nouvelle "application" express
 */
const app = expressWs(express()).app

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



// app.use('/', (req, res)=> {
//   res.sendFile(path.join(__dirname, 'template/base.html'));
// });

app.ws('/game', async (socket, req)=> {
  // res.sendFile(path.join(__dirname, 'template/game/test.html'));
  socket.on('open', (socket) => {
    console.log(`[connection] ${socket}`)
  })
  socket.on("open", function(){
    socket.send('Hello server')
  })
  socket.on('message', async(message) => {
    console.log(`${message}`)
  })
});



/**
 * Gestion des erreurs
 */
 app.use(DefaultErrorHandler)


/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(PORT, () => {
  Log(`API Listening on port ${PORT}`)

})



