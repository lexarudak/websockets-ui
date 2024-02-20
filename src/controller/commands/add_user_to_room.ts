import { WebSocket, Server } from 'ws';
import { closedRooms, rooms, wsUsers } from '../../db/db';
import { create_game, update_room } from '../../utils/helpers';

export const add_user_to_room = (
  data: string,
  ws: WebSocket,
  server: Server,
) => {
  const { indexRoom } = JSON.parse(data);
  const room = rooms.get(indexRoom);
  const user = wsUsers.get(ws);
  if (!user || !room) return;

  const [{ index }] = room;
  if (index !== user.index) {
    room.push(user);
    closedRooms.set(indexRoom, room);
    rooms.delete(indexRoom);
    update_room(server);
    create_game(room);
  }
};
