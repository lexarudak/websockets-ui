"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWsServer = void 0;
var ws_1 = require("ws");
var startWsServer = function (port, httpServer) {
    var server = new ws_1.WebSocketServer({ port: port });
    server.on('connection', function (ws, request, client) {
        ws.on('error', console.error);
        ws.on('message', function (data) {
            console.log("Received message ".concat(data, " from user ").concat(client, ", req ").concat(request));
        });
    });
};
exports.startWsServer = startWsServer;
