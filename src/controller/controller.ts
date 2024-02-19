// import { WebSocket } from 'ws';
import { reg } from './commands/reg';
import { create_room } from './commands/create_room';

export const controller = {
  reg,
  create_room,
  add_user_to_room: () => {
    console.log('add_user_to_room');
  },
};
