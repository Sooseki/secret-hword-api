import { MAJORITY } from '../variables/variables';

export const checkIfVotePassed = (votes: Array<number>) => {
  let countValidVotes = 0;
  votes.map(vote => {
    countValidVotes = vote == 1 ? countValidVotes + 1 : countValidVotes;
  });
  return countValidVotes >= MAJORITY;
};

export const isNextPresidentKillSomeone = (NB_FASC_LAW: number) => {
  return NB_FASC_LAW === 4 || NB_FASC_LAW === 5;
};

// LIB VICTORY
export const isLibVictory = (NB_LIB_LAW: number) => {
  return NB_LIB_LAW === 5;
};

export const isHitlerKilled = (KILLED_ID: number, HITLER_ID: number) => {
  return KILLED_ID === HITLER_ID;
};

// FASC VICTORY

export const isFascVictory = (NB_FASC_LAW: number, CHANCELOR_ID: number, HITLER_ID: number) => {
  return NB_FASC_LAW === 6 || (NB_FASC_LAW >= 3 && CHANCELOR_ID === HITLER_ID);
};

export const getPlayerIndex = (players: any, playerToGet: any): number => {
  let count = 0;
  let index = -1;
  players.map(player => {
    if (player.playerId == playerToGet.playerId) {
      index = count;
    }
    count++;
  });
  return index;
};
