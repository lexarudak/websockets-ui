// import { WebSocket } from 'ws';

import { db } from '../db/db';

const counter = () => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
};

export const getIndex = counter();

export const createUser = (name: string, password: string) => {
  const newUser = {
    index: getIndex(),
    name,
    password,
    memory: [],
  };
  db.set(name, newUser);
  return newUser;
};
