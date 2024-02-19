import { getIndex } from '../utils/helpers';

type DbData = {
  index: number;
  name: string;
  password: string;
  memory: string[];
};

export const db = new Map<string, DbData>();

db.set('11111', {
  index: getIndex(),
  name: '11111',
  password: '11111',
  memory: [],
});

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
