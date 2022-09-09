import {checkIfVotePassed, isFascVictory, isLibVictory, isNextPresidentKillSomeone, isHitlerKilled} from './check/check'
import {initRoles} from './roles/roles'
import {NB_PLAYER} from './variables/variables'

// Les trucs que l'api doit nous envoyer

// 0 nn 1 ui
let votes:Array<number> = [0,1,0,1,1]
// Quand une loi passe le joueur qui passe la loi nature de la loi, NB_FASC_LAW NB_LIB_LAW
const NB_FASC_LAW:number = 0
const NB_LIB_LAW:number = 0
const NEW_LAW:number = 0
// Quand checkIfVotePassed == true, vérifier role chancelier -> id Joueur Chancelier
const CHANCELOR_ID = 0
const HITLER_ID = 1
const KILLED_ID = 2

// ======================================

const players = initRoles()

const voted = checkIfVotePassed(votes)

const hasFascWon = isFascVictory(NB_FASC_LAW, CHANCELOR_ID, HITLER_ID)

const hasLibWon = isLibVictory(NB_LIB_LAW)

const hasNextPresidentKillSomeone = isNextPresidentKillSomeone(NB_FASC_LAW)

const hasHitlerDead = isHitlerKilled(HITLER_ID, KILLED_ID)