/* eslint-disable prettier/prettier */
import {LAW_FASC, LAW_LIB } from "../variables/variables";

export const firstPresidentPlayer = (players:[]) => {
  return players[Math.floor(Math.random() * players.length)];
}

export const shuffleLawCards = () => {
  const fascCards:Array<string> = new Array(LAW_FASC).fill("fascist");
  const libCards:Array<string> = new Array(LAW_LIB).fill("liberal");
  const cards = fascCards.concat(libCards);
  shuffle(cards);
  return cards;
}

export const draw3Cards = (cards:Array<string>) => {
  console.log("Card1",cards);
  const cardsToDraw = new Array(3);
  cardsToDraw[0] = cards[0];
  cardsToDraw[1] = cards[1];
  cardsToDraw[2] = cards[2];
  cards = cards.slice(3);
  console.log("CardSliced",cards);
  return [cards, cardsToDraw];
}

const shuffle = (arrayToShuffle: Array<string>) => {
  arrayToShuffle.sort(() => Math.random() - 0.5);
};
