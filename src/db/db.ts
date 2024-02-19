import { WebSocket } from 'ws';

export type DbData = {
  index: number;
  name: string;
  password: string;
};

export type User = {
  name: string;
  index: number;
};

type RoomId = number;
export type RoomUsers = User[];

export const db = new Map<string, DbData>();
export const rooms = new Map<RoomId, RoomUsers>();
export const wsUsers = new Map<WebSocket, User>();

export const winners = [
  {
    name: 'valera',
    wins: '2',
  },
  {
    name: 'ivan',
    wins: '1',
  },
];
