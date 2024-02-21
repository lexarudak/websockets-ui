"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_ships = void 0;
var db_1 = require("../../db/db");
var helpers_1 = require("../../utils/helpers");
var add_ships = function (data) {
    var info = JSON.parse(data);
    var gameId = info.gameId, indexPlayer = info.indexPlayer, ships = info.ships;
    var currentShips = {};
    var currentFields = {};
    var currentRestList = {};
    var field = (0, helpers_1.getInitField)(ships);
    currentShips[indexPlayer] = ships;
    currentFields[indexPlayer] = (0, helpers_1.getInitField)(ships);
    currentRestList[indexPlayer] = (0, helpers_1.getRestList)(field);
    if (db_1.allShips.has(gameId)) {
        var prevUserShips = db_1.allShips.get(gameId);
        db_1.allShips.set(gameId, __assign(__assign({}, prevUserShips), currentShips));
        var prevUserField = db_1.allFields.get(gameId);
        db_1.allFields.set(gameId, __assign(__assign({}, prevUserField), currentFields));
        var prevUserRestList = db_1.allRestLists.get(gameId);
        db_1.allRestLists.set(gameId, __assign(__assign({}, prevUserRestList), currentRestList));
        (0, helpers_1.start_game)(gameId);
        (0, helpers_1.turn)(gameId);
        return;
    }
    db_1.allShips.set(gameId, currentShips);
    db_1.allFields.set(gameId, currentFields);
    db_1.allRestLists.set(gameId, currentRestList);
};
exports.add_ships = add_ships;
