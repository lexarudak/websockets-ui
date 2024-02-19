"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWsServer = void 0;
var ws_1 = require("ws");
var startWsServer = function (port) {
    var server = new ws_1.WebSocketServer({ port: port }, function () {
        console.log("WS server started");
    });
    server.on("connection", function () {
        console.log("hello from ws server");
    });
};
exports.startWsServer = startWsServer;
