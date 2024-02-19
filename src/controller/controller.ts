import { WebSocket } from 'ws';
import { db } from '../db/db';
import { createUser } from '../utils/helpers';

export interface regData {
  id: number;
  name: string;
  password: string;
}

export const controller = {
  reg: ({ name, password }: regData, ws: WebSocket) => {
    const user = db.get(name);
    const req = {
      type: 'reg',
      id: 0,
      data: '',
    };

    if (!user) {
      const newUser = createUser(name, password);
      req.data = JSON.stringify({
        name,
        index: newUser.index,
        error: false,
        errorText: '',
      });

      ws.send(JSON.stringify(req));
      return;
    }

    if (user.password !== password) {
      req.data = JSON.stringify({
        name,
        index: user.index,
        error: true,
        errorText: 'Wrong password',
      });

      ws.send(JSON.stringify(req));
      return;
    }

    req.data = JSON.stringify({
      name,
      index: user.index,
      error: false,
      errorText: '',
    });

    ws.send(JSON.stringify(req));
  },
};
