import { WebSocket, Server } from 'ws';

import {
  Field,
  Ship,
  User,
  db,
  games,
  rooms,
  winners,
  wsUsers,
} from '../db/db';

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
    ws,
  };
  db.set(name, newUser);
  wsUsers.set(ws, {
    index: newUser.index,
    name,
    ws,
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

export const getRoomsJson = (roomsArr: [number, User[]][]) => {
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

export const create_game = (room: User[]) => {
  const idGame = getGameIndex();
  games.set(idGame, room);

  room.forEach(({ ws }, ind) => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: 'create_game',
          id: 0,
          data: JSON.stringify({
            idGame,
            idPlayer: ind,
          }),
        }),
      );
    }
  });
};

const addShip = (
  x: number,
  y: number,
  length: number,
  direction: boolean,
  shipNumber: number,
) => {
  const map = new Map<number, number>();
  for (let i = 0; i < length; i++) {
    const value = x + y * 10 + (direction ? i * 10 : i);
    map.set(value, shipNumber);
  }
  return map;
};

export const getInitField = (ships: Ship[]): Field =>
  ships.map(({ position: { x, y }, direction, length }, id) =>
    addShip(x, y, length, direction, id),
  );

export const getRestList = (field: Field) => {
  const arr = field
    .flat(1)
    .map((map) => Array.from(map.keys()))
    .flat(1);
  const validSet = new Set(arr);
  const set = new Set<number>();
  for (let i = 0; i < 100; i++) {
    if (!validSet.has(i)) set.add(i);
  }
  return set;
};
