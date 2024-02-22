import { Attack } from '../../db/db';
import { attackHandler, update_winners } from '../../utils/helpers';
import { WebSocket, Server } from 'ws';

export const attack = (data: string, ws: WebSocket, server: Server) => {
  const attackInfo: Attack = JSON.parse(data);

  const isLastAttack = attackHandler(attackInfo);
  if (isLastAttack) {
    update_winners(server, ws);
  }
};
