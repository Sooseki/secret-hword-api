import {NB_PLAYER, NB_LIB, NB_FASC} from '../variables/variables'

// 0 = Hitler
// 1 = Fascist
// 2 = Lib

export const initRoles = () => {
  let playersArray = createRolesArray()
  return playersArray
}

const createRolesArray = () => {
  let players = new Array<number>(NB_PLAYER)
  players[0] = 0
  for (let i = 0; i < NB_LIB; i++) {
    players[i+1] = 2
  }
  for (let i = 0; i < NB_FASC; i++) {
    players[i + NB_LIB + 1] = 1
  }
  shuffle(players)
  return players
}

// Randomize the role sinon david est toujours Hitler

const shuffle = (arrayToShuffle:Array<number>) => {
  arrayToShuffle.sort(() => Math.random() - 0.5);
}