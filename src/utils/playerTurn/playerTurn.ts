/* eslint-disable prettier/prettier */
import {LAW_FASC, LAW_LIB } from "../variables/variables";

export const firstPresidentPlayer = (players:[]) => {
  return players[Math.floor(Math.random() * players.length)];
}

export const shuffleLawCards = () => {
  const fascCards:Array<string> = new Array(LAW_FASC).fill("fascist");
  const libCards:Array<string> = new Array(LAW_LIB).fill("liberal");
  const cards = fascCards.concat(libCards);
  return shuffle(cards);
}

// export const draw3Cards = (cards:Array<string>) => {
  
// }

const shuffle = (arrayToShuffle: Array<string>) => {
  arrayToShuffle.sort(() => Math.random() - 0.5);
};
