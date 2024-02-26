import { Attack } from '../../db/db';
import {
  attackHandler,
  isSingleMode,
  singleAttackHandler,
} from '../../utils/helpers';
import { WebSocket, Server } from 'ws';

export const attack = (data: string, _: WebSocket, server: Server) => {
  const attackInfo: Attack = JSON.parse(data);

  if (isSingleMode(attackInfo.gameId)) {
    singleAttackHandler(attackInfo, server);
  } else {
    attackHandler(attackInfo, server);
  }
};
