export type Player = {
    vote?: boolean;
    host: boolean;
    roomId: string | null;
    playedCell: string;
    username: string | null;
    socketId: string | null;
    playerId: string;
    turn: boolean;
    win: boolean;
};
  