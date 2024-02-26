import { allCleanPlaces, allCurrentAttacks, games, wsUsers } from '../../db/db';
import { getGameIndex } from '../../utils/helpers';
import { WebSocket } from 'ws';

export const single_play = (_: string, ws: WebSocket) => {
  const idGame = getGameIndex();

  const user = wsUsers.get(ws);
  if (!user) return;
  games.set(idGame, [user]);
  const cleanPlaces = new Set<number>();

  for (let i = 0; i < 100; i++) {
    cleanPlaces.add(i);
  }
  allCleanPlaces.set(idGame, cleanPlaces);
  allCurrentAttacks.set(idGame, []);

  ws.send(
    JSON.stringify({
      type: 'create_game',
      id: 0,
      data: JSON.stringify({
        idGame,
        idPlayer: 0,
      }),
    }),
  );

  console.log('Result: ', `single play starts`);
};
