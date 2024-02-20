import { WebSocket, Server } from 'ws';
import { rooms, wsUsers } from '../../db/db';
import { getRoomIndex, update_room } from '../../utils/helpers';

export const create_room = (_: unknown, ws: WebSocket, server: Server) => {
  const wsUser = wsUsers.get(ws);
  const roomId = getRoomIndex();

  if (wsUser) {
    rooms.set(roomId, [wsUser]);
    update_room(server);
  }
};
