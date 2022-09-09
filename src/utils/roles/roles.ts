import { NB_PLAYER, NB_LIB, NB_FASC } from '../variables/variables';

export const initRoles = () => {
  const playersArray = createRolesArray();
  return playersArray;
};

const createRolesArray = () => {
  const players = new Array<string>(NB_PLAYER);
  players[0] = 'hitler';
  for (let i = 0; i < NB_LIB; i++) {
    players[i + 1] = 'liberal';
  }
  for (let i = 0; i < NB_FASC; i++) {
    players[i + NB_LIB + 1] = 'fascist';
  }
  shuffle(players);
  return players;
};

// Randomize the role sinon david est toujours Hitler

const shuffle = (arrayToShuffle: Array<string>) => {
  arrayToShuffle.sort(() => Math.random() - 0.5);
};
