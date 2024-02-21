"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attack = void 0;
var helpers_1 = require("../../utils/helpers");
var attack = function (data) {
    var attackInfo = JSON.parse(data);
    var isLastAttack = (0, helpers_1.attackHandler)(attackInfo);
    console.log(isLastAttack);
};
exports.attack = attack;
