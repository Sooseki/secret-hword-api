/* eslint-disable prettier/prettier */
import { Player } from "@/types/Player";
import { LAW_FASC, LAW_LIB } from "../variables/variables";

export const firstPresidentPlayer = (players:[]) => {
  return players[Math.floor(Math.random() * players.length)];
}

export const selectNextPresident =  (players: Player[], currentPresident: Player) => {
  let nextPresident = players[0];
  players.map((player, index) => {
    if (player.playerId === currentPresident.playerId) {
      nextPresident = players[index + 1] ? players[index + 1] : players[0];
    }
  })
  return nextPresident;
}

export const shuffleLawCards = () => {
  const fascCards:Array<string> = new Array(LAW_FASC).fill("fascist");
  const libCards:Array<string> = new Array(LAW_LIB).fill("liberal");
  const cards = fascCards.concat(libCards);
  shuffle(cards);
  return cards;
}

export const draw3Cards = (cards:Array<string>) => {
  const cardsToDraw = new Array(3);
  cardsToDraw[0] = cards[0];
  cardsToDraw[1] = cards[1];
  cardsToDraw[2] = cards[2];
  cards = cards.slice(3);
  return [cards, cardsToDraw];
}

const shuffle = (arrayToShuffle: Array<string>) => {
  arrayToShuffle.sort(() => Math.random() - 0.5);
};