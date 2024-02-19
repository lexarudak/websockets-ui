"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./src/http_server/index");
var index_2 = require("./src/ws_server/index");
var HTTP_PORT = 8181;
var WS_PORT = 3000;
console.log("Start static http server on the ".concat(HTTP_PORT, " port!"));
index_1.httpServer.listen(HTTP_PORT);
(0, index_2.startWsServer)(WS_PORT, index_1.httpServer);
