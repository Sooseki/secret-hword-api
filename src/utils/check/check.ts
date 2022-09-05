import {MAJORITY} from '../variables/variables'


export const checkIfVotePassed = (votes:Array<number>) => {
  let countValidVotes = 0
  votes.map(vote =>{
    countValidVotes = vote == 1 ? countValidVotes+1 : countValidVotes
  })
  return countValidVotes >= MAJORITY
}