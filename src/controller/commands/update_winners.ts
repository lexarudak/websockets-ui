import { winners } from '../../db/db';
import { Server } from 'ws';

export const update_winners = (server: Server) => {
  const req = {
    type: 'update_winners',
    id: 0,
    data: '',
  };
  req.data = JSON.stringify(winners);

  server.clients.forEach((client) => {
    client.send(JSON.stringify(req));
  });
};
