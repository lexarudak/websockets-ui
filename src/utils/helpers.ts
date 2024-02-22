import { WebSocket, Server } from 'ws';

import {
  Attack,
  AttackAction,
  Field,
  IndexPlayer,
  RandomAttack,
  Ship,
  User,
  allFields,
  allRestLists,
  allShips,
  allTurns,
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
        roomUsers: roomUsers.map(({ name, index }) => ({ name, index })),
      };
    }),
  );
};

export const update_winners = (server: Server, ws?: WebSocket) => {
  if (ws) {
    const user = wsUsers.get(ws);
    if (user) {
      const { name } = user;
      const win = winners.get(name) || 0;
      winners.set(name, win + 1);
    }
  }
  const arr = Array.from(winners.entries());

  sendToAll(
    'update_winners',
    JSON.stringify(
      arr
        .map(([name, wins]) => ({ name, wins }))
        .sort(({ wins: a }, { wins: b }) => b - a),
    ),
    server,
  );
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

export const start_game = (gameId: number) => {
  const users = games.get(gameId);
  allTurns.set(gameId, 0);

  if (users) {
    users.forEach(({ ws }, ind) => {
      const ship = allShips.get(gameId);
      if (!ship) return;

      const data = {
        ships: ship[ind as IndexPlayer],
        currentPlayerIndex: ind,
      };

      ws.send(
        JSON.stringify({
          type: 'start_game',
          data: JSON.stringify(data),
          id: 0,
        }),
      );
    });
  }
};

export const turn = (gameId: number) => {
  const users = games.get(gameId);
  const turn = allTurns.get(gameId);

  if (users && turn !== undefined) {
    users.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: 'turn',
          id: 0,
          data: JSON.stringify({
            currentPlayer: turn ? 0 : 1,
          }),
        }),
      );
    });

    allTurns.set(gameId, turn ? 0 : 1);
  }
};

const sendAttackMessage = (
  gameId: number,
  indexPlayer: number,
  x: number,
  y: number,
  action: AttackAction,
) => {
  const users = games.get(gameId);
  if (!users) return;

  const data = JSON.stringify({
    position: {
      x,
      y,
    },
    currentPlayer: indexPlayer,
    status: action,
  });
  users.forEach(({ ws }) => {
    ws.send(
      JSON.stringify({
        type: 'attack',
        data,
        index: 0,
      }),
    );
  });
};

export const finish = (gameId: number, indexPlayer: number) => {
  const users = games.get(gameId);
  if (!users) return;

  const data = JSON.stringify({
    winPlayer: indexPlayer,
  });

  users.forEach(({ ws }) => {
    ws.send(
      JSON.stringify({
        type: 'finish',
        data,
        index: 0,
      }),
    );
  });
};

const lookAround = (
  x: number,
  y: number,
  list: Set<number>,
  gameId: number,
  indexPlayer: number,
) => {
  [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ].forEach(([newX, newY]) => {
    const dot = newX + newY * 10;
    if (list.has(dot)) {
      list.delete(dot);
      sendAttackMessage(gameId, indexPlayer, newX, newY, 'miss');
    }
  });
};

export const killShip = (
  ship: Ship,
  gameId: number,
  indexPlayer: number,
  list: Set<number>,
) => {
  for (let i = 0; i < ship.length; i++) {
    const x = ship.direction ? ship.position.x : ship.position.x + i;
    const y = ship.direction ? ship.position.y + i : ship.position.y;
    lookAround(x, y, list, gameId, indexPlayer);
    sendAttackMessage(gameId, indexPlayer, x, y, 'killed');
  }
};

export const lastShip = (field: Field) =>
  !field.some((ship) => ship.size !== 0);

export const attackHandler = ({ x, y, gameId, indexPlayer }: Attack) => {
  if (allTurns.get(gameId) !== indexPlayer) return;
  const dot = x + y * 10;

  const restLists = allRestLists.get(gameId);
  if (!restLists) return;
  const list = restLists[indexPlayer ? 0 : 1];
  if (!list) return;

  if (list.has(dot)) {
    list.delete(dot);
    sendAttackMessage(gameId, indexPlayer, x, y, 'miss');
    turn(gameId);
    return;
  }

  const fields = allFields.get(gameId);
  if (!fields) return;
  const field = fields[indexPlayer ? 0 : 1];
  if (!field) return;

  const ship = field.find((row) => row.has(dot));
  if (!ship) return;

  if (ship.size > 1) {
    sendAttackMessage(gameId, indexPlayer, x, y, 'shot');
    ship.delete(dot);
    return;
  }

  const realShips = allShips.get(gameId);
  if (!realShips) return;
  const realShip = realShips[indexPlayer ? 0 : 1];
  if (!realShip) return;
  const shipInd = ship.get(dot);
  if (shipInd === undefined) return;
  killShip(realShip[shipInd], gameId, indexPlayer, list);
  ship.delete(dot);

  if (lastShip(field)) {
    finish(gameId, indexPlayer);
    return true;
  }
  turn(gameId);
};

export const randomAttackHandler = ({ indexPlayer, gameId }: RandomAttack) => {
  const restLists = allRestLists.get(gameId);
  if (!restLists) return false;
  const list = restLists[indexPlayer ? 0 : 1];
  if (!list) return false;

  const arr = Array.from(list);
  const randomDot = arr[Math.floor(Math.random() * arr.length)];
  list.delete(randomDot);
  const stringDot = randomDot.toString();

  const x = Number(stringDot[1] || stringDot[0]);
  const y = Number(stringDot[1] ? stringDot[0] : 0);
  sendAttackMessage(gameId, indexPlayer, x, y, 'miss');
  turn(gameId);
};
