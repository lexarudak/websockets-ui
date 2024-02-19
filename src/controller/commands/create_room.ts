import { WebSocket } from 'ws';
import { rooms, wsUsers } from '../../db/db';
import { getRoomIndex } from '../../utils/helpers';

export const create_room = (_: unknown, ws: WebSocket) => {
  const res = {
    type: 'update_room',
    id: 0,
    data: '',
  };

  const wsUser = wsUsers.get(ws);
  const roomId = getRoomIndex();

  if (wsUser) {
    rooms.set(roomId, [wsUser]);
    res.data = JSON.stringify([
      {
        roomId: roomId,
        roomUsers: [
          {
            name: wsUser?.name,
            index: wsUser?.index,
          },
        ],
      },
    ]);
    ws.send(JSON.stringify(res));
  }
};
