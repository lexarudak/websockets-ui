import { WebSocket, Server } from 'ws';
import { db } from '../../db/db';
import { createUser } from '../../utils/helpers';
import { update_winners } from './update_winners';

export interface regData {
  id: number;
  name: string;
  password: string;
}

export const reg = (data: string, ws: WebSocket, server: Server) => {
  const { name, password }: regData = JSON.parse(data);
  const user = db.get(name);
  const req = {
    type: 'reg',
    id: 0,
    data: '',
  };

  if (!user) {
    const newUser = createUser(name, password, ws);
    req.data = JSON.stringify({
      name,
      index: newUser.index,
      error: false,
      errorText: '',
    });

    ws.send(JSON.stringify(req));
    update_winners(server);
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
  update_winners(server);
};
