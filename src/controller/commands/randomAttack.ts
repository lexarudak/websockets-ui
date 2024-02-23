import { RandomAttack } from '../../db/db';
import { randomAttackHandler } from '../../utils/helpers';
import { WebSocket, Server } from 'ws';

export const randomAttack = (data: string, _: WebSocket, server: Server) => {
  const attackInfo: RandomAttack = JSON.parse(data);
  randomAttackHandler(attackInfo, server);
};
