import { WebSocketServer, WebSocket } from 'ws';

import { controller } from '../controller/controller';
import { closeOpenedRoom } from '../utils/helpers';

export type DataObj = {
  type: keyof typeof controller;
  data: string;
  id: number;
};

export const startWsServer = (port: number) => {
  const server = new WebSocketServer({ port });

  server.on('connection', (ws: WebSocket) => {
    if (ws.protocol)
      console.log('Client connected using protocol version: ', ws.protocol);
    ws.on('error', console.error);

    ws.on('close', () => {
      closeOpenedRoom(server);
    });

    ws.on('message', (rawData) => {
      const { type, data }: DataObj = JSON.parse(rawData.toString());
      console.log('Get message with type: ', { type });
      try {
        console.log('Data: ', JSON.parse(data));
      } catch {
        console.log('No data');
      }

      controller[type](data, ws, server);
    });
  });
};
