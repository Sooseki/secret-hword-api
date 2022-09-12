const matchers = require('jest-extended')
expect.extend(matchers)
import { initRoles, createRolesArray } from '../utils/roles/roles'
import { checkIfVotePassed, isLibVictory, isFascVictory, getPlayerIndex } from '../utils/check/check'
import { NB_PLAYER } from '../utils/variables/variables'


it('init jest', () => {
  expect([1, 0]).toIncludeSameMembers([0, 1])
});

describe('Testing Game Logic - Roles', () => {
  const roles = initRoles()
  const createRoles = createRolesArray()

  it('create roles array size of nb players', () => {
    expect(createRoles).toBeArrayOfSize(NB_PLAYER)
  })

  it('init roles nb player', () => {
    expect(roles).toBeArrayOfSize(NB_PLAYER)
  });

  it('init roles players', () => {
    expect(roles).toIncludeAllMembers(['hitler', 'fascist', 'liberal']);
  });
});

describe('Testing Game Logic - Check', () => {
  let player1 = {
    host: false,
    roomId: null,
    playedCell: "",
    username: "user",
    socketId: null,
    playerId: "12345466",
    turn: false,
    win: false,
    vote: undefined
  }

  let player2 = {
    host: false,
    roomId: null,
    playedCell: "",
    username: "user",
    socketId: null,
    playerId: "gdkjddfgd",
    turn: false,
    win: false,
    vote: undefined
  }

  let player3 = {
    host: false,
    roomId: null,
    playedCell: "",
    username: "user",
    socketId: null,
    playerId: "sdfdh",
    turn: false,
    win: false,
    vote: undefined
  }

  let player4 = {
    host: false,
    roomId: null,
    playedCell: "",
    username: "user",
    socketId: null,
    playerId: "4525",
    turn: false,
    win: false,
    vote: undefined
  }

  let player5 = {
    host: false,
    roomId: null,
    playedCell: "",
    username: "user",
    socketId: null,
    playerId: "ghfherteyt4741",
    turn: false,
    win: false,
    vote: undefined
  }

  it('check if vote passed function', () => {
    player1.vote = true
    player2.vote = false
    player3.vote = false
    player4.vote = true
    player5.vote = true
  
    let players = [player1, player2, player3, player4, player5]
    const votePassed = checkIfVotePassed(players)
  
    expect(votePassed).toBeTrue
  });

  it('check if vote passed function', () => {
    player1.vote = true
    player2.vote = false
    player3.vote = false
    player4.vote = false
    player5.vote = true
  
    let players = [player1, player2, player3, player4, player5]
    const votePassed = checkIfVotePassed(players)
  
    expect(votePassed).toBeFalse
  });

  it('check all victories', () => {
    expect(isLibVictory(3)).toBeFalse
    expect(isLibVictory(5)).toBeTrue
    expect(isFascVictory(4, 123, 156)).toBeFalse
    expect(isFascVictory(6, 123, 156)).toBeTrue
    expect(isFascVictory(6, 123, 123)).toBeTrue
    expect(isFascVictory(2, 123, 123)).toBeFalse
    expect(isFascVictory(3, 123, 123)).toBeTrue
  })

  it('get players in array thanks to id', () => {

    let players = [player1, player2, player3, player4, player5]

    const index = getPlayerIndex(players, player4)

    expect(index).toEqual(3)
  })
});

