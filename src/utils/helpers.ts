import { WebSocket } from 'ws';

import { db, wsUsers } from '../db/db';

const counter = () => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
};

export const getIndex = counter();
export const getRoomIndex = counter();

export const createUser = (name: string, password: string, ws: WebSocket) => {
  const newUser = {
    index: getIndex(),
    name,
    password,
  };
  db.set(name, newUser);
  wsUsers.set(ws, newUser);
  return newUser;
};
