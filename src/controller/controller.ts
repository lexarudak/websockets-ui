import { WebSocket } from 'ws';
import { reg } from './commands/reg';

export const controller = {
  reg,
  create_room: (_: string, ws: WebSocket) => {
    console.log('create');
  },
};
