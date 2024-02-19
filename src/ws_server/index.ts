import { WebSocketServer } from "ws"

export const startWsServer = (port: number) => {
  const server = new WebSocketServer({ port }, () => {
    console.log("WS server started");
  })
  server.on("connection", () => {
    console.log("hello from ws server");
  })
}