import { WebSocket } from 'ws';

export type DbData = {
  index: number;
  name: string;
  password: string;
  ws: WebSocket;
};

export type User = {
  name: string;
  index: number;
  ws: WebSocket;
};

type RoomId = number;
type GameId = number;
type ShipType = 'small' | 'medium' | 'large' | 'huge';
type IndexPlayer = 0 | 1;

export type Field = Map<number, number>[];
export type Fields = Partial<Record<IndexPlayer, Field>>;

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: ShipType;
  length: number;
};
export type Ships = Partial<Record<IndexPlayer, Ship[]>>;

export type RestLists = Partial<Record<IndexPlayer, Set<number>>>;

export type InitShipsInfo = {
  gameId: number;
  ships: Ship[];
  indexPlayer: IndexPlayer;
};

export const db = new Map<string, DbData>();
export const rooms = new Map<RoomId, User[]>();
export const closedRooms = new Map<RoomId, User[]>();
export const wsUsers = new Map<WebSocket, User>();
export const games = new Map<GameId, User[]>();
export const allFields = new Map<GameId, Fields>();
export const allShips = new Map<GameId, Ships>();
export const allRestLists = new Map<GameId, RestLists>();

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
