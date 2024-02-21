"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWsServer = void 0;
var ws_1 = require("ws");
var controller_1 = require("../controller/controller");
var startWsServer = function (port) {
    var server = new ws_1.WebSocketServer({ port: port });
    server.on('connection', function (ws) {
        ws.on('error', console.error);
        ws.on('message', function (rawData) {
            console.log(rawData.toString());
            var _a = JSON.parse(rawData.toString()), type = _a.type, data = _a.data;
            controller_1.controller[type](data, ws, server);
            console.log("Received message ".concat(type, " with data ").concat(data, " "));
        });
    });
};
exports.startWsServer = startWsServer;
