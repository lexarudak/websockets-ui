import { WebSocketServer, WebSocket } from 'ws';

import { controller } from '../controller/controller';

export type DataObj = {
  type: keyof typeof controller;
  data: string;
  id: number;
};

export const startWsServer = (port: number) => {
  const server = new WebSocketServer({ port });

  server.on('connection', (ws: WebSocket) => {
    ws.on('error', console.error);

    ws.on('message', (rawData) => {
      const { type, data }: DataObj = JSON.parse(rawData.toString());
      controller[type](JSON.parse(data), ws);
      console.log(`Received message ${data} `);
    });
  });
};
