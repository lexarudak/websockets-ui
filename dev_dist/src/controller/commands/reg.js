"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reg = void 0;
var db_1 = require("../../db/db");
var helpers_1 = require("../../utils/helpers");
var reg = function (data, ws, server) {
    var _a = JSON.parse(data), name = _a.name, password = _a.password;
    var user = db_1.db.get(name);
    var req = {
        type: 'reg',
        id: 0,
        data: '',
    };
    if (!user) {
        var newUser = (0, helpers_1.createUser)(name, password, ws);
        req.data = JSON.stringify({
            name: name,
            index: newUser.index,
            error: false,
            errorText: '',
        });
        ws.send(JSON.stringify(req));
        (0, helpers_1.update_winners)(server);
        (0, helpers_1.update_room)(server);
        return;
    }
    if (user.password !== password) {
        req.data = JSON.stringify({
            name: name,
            index: user.index,
            error: true,
            errorText: 'Wrong password',
        });
        ws.send(JSON.stringify(req));
        return;
    }
    req.data = JSON.stringify({
        name: name,
        index: user.index,
        error: false,
        errorText: '',
    });
    ws.send(JSON.stringify(req));
    (0, helpers_1.update_winners)(server);
    (0, helpers_1.update_room)(server);
};
exports.reg = reg;
