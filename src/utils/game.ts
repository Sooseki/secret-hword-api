import {checkIfVotePassed} from './check/check'
import {initRoles} from './roles/roles'
import {NB_PLAYER} from './variables/variables'




// Les trucs que l'api doit nous envoyer

// 0 nn 1 ui
let votes:Array<number> = [0,1,0,1,1]

// ======================================

const players = initRoles()

const voted = checkIfVotePassed(votes)
