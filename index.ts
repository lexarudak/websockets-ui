import { httpServer } from './src/http_server/index';
import { startWsServer } from './src/ws_server/index';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
startWsServer(WS_PORT);
