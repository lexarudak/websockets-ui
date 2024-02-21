"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attackHandler = exports.lastShip = exports.killShip = exports.turn = exports.start_game = exports.getRestList = exports.getInitField = exports.create_game = exports.update_room = exports.update_winners = exports.getRoomsJson = exports.sendToAll = exports.createUser = exports.getGameIndex = exports.getRoomIndex = exports.getIndex = void 0;
var db_1 = require("../db/db");
var counter = function () {
    var id = 0;
    return function () {
        id++;
        return id;
    };
};
exports.getIndex = counter();
exports.getRoomIndex = counter();
exports.getGameIndex = counter();
var createUser = function (name, password, ws) {
    var newUser = {
        index: (0, exports.getIndex)(),
        name: name,
        password: password,
        ws: ws,
    };
    db_1.db.set(name, newUser);
    db_1.wsUsers.set(ws, {
        index: newUser.index,
        name: name,
        ws: ws,
    });
    return newUser;
};
exports.createUser = createUser;
var sendToAll = function (type, data, server) {
    var req = {
        type: type,
        id: 0,
        data: data,
    };
    server.clients.forEach(function (client) {
        client.send(JSON.stringify(req));
    });
};
exports.sendToAll = sendToAll;
var getRoomsJson = function (roomsArr) {
    return JSON.stringify(roomsArr.map(function (_a) {
        var roomId = _a[0], roomUsers = _a[1];
        return {
            roomId: roomId,
            roomUsers: roomUsers,
        };
    }));
};
exports.getRoomsJson = getRoomsJson;
var update_winners = function (server) {
    (0, exports.sendToAll)('update_winners', JSON.stringify(db_1.winners), server);
};
exports.update_winners = update_winners;
var update_room = function (server) {
    var roomsArr = Array.from(db_1.rooms);
    (0, exports.sendToAll)('update_room', roomsArr.length ? (0, exports.getRoomsJson)(roomsArr) : '[]', server);
};
exports.update_room = update_room;
var create_game = function (room) {
    var idGame = (0, exports.getGameIndex)();
    db_1.games.set(idGame, room);
    room.forEach(function (_a, ind) {
        var ws = _a.ws;
        if (ws) {
            ws.send(JSON.stringify({
                type: 'create_game',
                id: 0,
                data: JSON.stringify({
                    idGame: idGame,
                    idPlayer: ind,
                }),
            }));
        }
    });
};
exports.create_game = create_game;
var addShip = function (x, y, length, direction, shipNumber) {
    var map = new Map();
    for (var i = 0; i < length; i++) {
        var value = x + y * 10 + (direction ? i * 10 : i);
        map.set(value, shipNumber);
    }
    return map;
};
var getInitField = function (ships) {
    return ships.map(function (_a, id) {
        var _b = _a.position, x = _b.x, y = _b.y, direction = _a.direction, length = _a.length;
        return addShip(x, y, length, direction, id);
    });
};
exports.getInitField = getInitField;
var getRestList = function (field) {
    var arr = field
        .flat(1)
        .map(function (map) { return Array.from(map.keys()); })
        .flat(1);
    var validSet = new Set(arr);
    var set = new Set();
    for (var i = 0; i < 100; i++) {
        if (!validSet.has(i))
            set.add(i);
    }
    return set;
};
exports.getRestList = getRestList;
var start_game = function (gameId) {
    var users = db_1.games.get(gameId);
    db_1.allTurns.set(gameId, 0);
    if (users) {
        users.forEach(function (_a, ind) {
            var ws = _a.ws;
            var ship = db_1.allShips.get(gameId);
            if (!ship)
                return;
            var data = {
                ships: ship[ind],
                currentPlayerIndex: ind,
            };
            ws.send(JSON.stringify({
                type: 'start_game',
                data: JSON.stringify(data),
                id: 0,
            }));
        });
    }
};
exports.start_game = start_game;
var turn = function (gameId) {
    var users = db_1.games.get(gameId);
    var turn = db_1.allTurns.get(gameId);
    if (users && turn !== undefined) {
        users.forEach(function (_a) {
            var ws = _a.ws;
            ws.send(JSON.stringify({
                type: 'turn',
                id: 0,
                data: JSON.stringify({
                    currentPlayer: turn ? 0 : 1,
                }),
            }));
        });
        db_1.allTurns.set(gameId, turn ? 0 : 1);
    }
};
exports.turn = turn;
var sendAttackMessage = function (gameId, indexPlayer, x, y, action) {
    var users = db_1.games.get(gameId);
    if (!users)
        return;
    var data = JSON.stringify({
        position: {
            x: x,
            y: y,
        },
        currentPlayer: indexPlayer,
        status: action,
    });
    users.forEach(function (_a) {
        var ws = _a.ws;
        ws.send(JSON.stringify({
            type: 'attack',
            data: data,
            index: 0,
        }));
    });
};
var lookAround = function (x, y, list, gameId, indexPlayer) {
    [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
    ].forEach(function (_a) {
        var newX = _a[0], newY = _a[1];
        var dot = newX + newY * 10;
        if (list.has(dot)) {
            list.delete(dot);
            sendAttackMessage(gameId, indexPlayer, newX, newY, 'miss');
        }
    });
};
var killShip = function (ship, gameId, indexPlayer, list) {
    for (var i = 0; i < ship.length; i++) {
        var x = ship.direction ? ship.position.x : ship.position.x + i;
        var y = ship.direction ? ship.position.y + i : ship.position.y;
        lookAround(x, y, list, gameId, indexPlayer);
        sendAttackMessage(gameId, indexPlayer, x, y, 'killed');
    }
};
exports.killShip = killShip;
var lastShip = function (field) {
    return field.every(function (ship) { return ship.size === 0; });
};
exports.lastShip = lastShip;
var attackHandler = function (_a) {
    var x = _a.x, y = _a.y, gameId = _a.gameId, indexPlayer = _a.indexPlayer;
    if (db_1.allTurns.get(gameId) !== indexPlayer)
        return false;
    var dot = x + y * 10;
    var restLists = db_1.allRestLists.get(gameId);
    if (!restLists)
        return false;
    var list = restLists[indexPlayer ? 0 : 1];
    if (!list)
        return false;
    if (list.has(dot)) {
        list.delete(dot);
        sendAttackMessage(gameId, indexPlayer, x, y, 'miss');
        (0, exports.turn)(gameId);
        return false;
    }
    var fields = db_1.allFields.get(gameId);
    if (!fields)
        return false;
    var field = fields[indexPlayer ? 0 : 1];
    if (!field)
        return false;
    field.forEach(function (ship) {
        if (ship.has(dot) && ship.size > 1) {
            sendAttackMessage(gameId, indexPlayer, x, y, 'shot');
            ship.delete(dot);
        }
        if (ship.has(dot) && ship.size === 1) {
            var realShips = db_1.allShips.get(gameId);
            if (!realShips)
                return false;
            var realShip = realShips[indexPlayer ? 0 : 1];
            if (!realShip)
                return false;
            var shipInd = ship.get(dot);
            if (shipInd === undefined)
                return false;
            (0, exports.killShip)(realShip[shipInd], gameId, indexPlayer, list);
            ship.delete(dot);
            if ((0, exports.lastShip)(field)) {
                return true;
            }
            (0, exports.turn)(gameId);
        }
    });
};
exports.attackHandler = attackHandler;
