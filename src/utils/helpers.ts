import { WebSocket, Server } from 'ws';

import { RoomUsers, db, games, rooms, winners, wsUsers } from '../db/db';

const counter = () => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
};

export const getIndex = counter();
export const getRoomIndex = counter();
export const getGameIndex = counter();

export const createUser = (name: string, password: string, ws: WebSocket) => {
  const newUser = {
    index: getIndex(),
    name,
    password,
  };
  db.set(name, newUser);
  wsUsers.set(ws, {
    index: newUser.index,
    name,
  });
  return newUser;
};

export const sendToAll = (type: string, data: string, server: Server) => {
  const req = {
    type,
    id: 0,
    data,
  };

  server.clients.forEach((client) => {
    client.send(JSON.stringify(req));
  });
};

export const getRoomsJson = (roomsArr: [number, RoomUsers][]) => {
  return JSON.stringify(
    roomsArr.map(([roomId, roomUsers]) => {
      return {
        roomId,
        roomUsers,
      };
    }),
  );
};

export const update_winners = (server: Server) => {
  sendToAll('update_winners', JSON.stringify(winners), server);
};

export const update_room = (server: Server) => {
  const roomsArr = Array.from(rooms);

  sendToAll(
    'update_room',
    roomsArr.length ? getRoomsJson(roomsArr) : '[]',
    server,
  );
};

export const create_game = (room: RoomUsers, server: Server) => {
  const [, user2] = room;
  const idGame = getGameIndex();
  games.set(idGame, room);

  sendToAll(
    'create_game',
    JSON.stringify({
      idGame,
      idPlayer: user2.index,
    }),
    server,
  );
};
