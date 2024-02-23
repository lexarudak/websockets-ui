import { Attack } from '../../db/db';
import { attackHandler } from '../../utils/helpers';
import { WebSocket, Server } from 'ws';

export const attack = (data: string, _: WebSocket, server: Server) => {
  const attackInfo: Attack = JSON.parse(data);

  attackHandler(attackInfo, server);
};
