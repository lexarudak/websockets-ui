import { Server } from 'ws';
import {
  allCleanPlaces,
  allCurrentAttacks,
  allFields,
  allRestLists,
  allShips,
} from '../db/db';
import {
  finishSingle,
  killShip,
  lastShip,
  sendAttackMessage,
  xAndY,
} from '../utils/helpers';

const getRandom = (array: number[]) => {
  const randomDot = array[Math.floor(Math.random() * array.length)];
  return randomDot;
};

const randomAttack = (cleanPlaces: Set<number>) => {
  const array = Array.from(cleanPlaces);
  return getRandom(array);
};

const tryToGuess = (cleanPlaces: Set<number>, currentAttack: number[]) => {
  if (currentAttack.length === 1) {
    const dot = currentAttack[0];
    const possible = [dot - 10, dot + 10];
    if ((dot - 1).toString()[0] === dot.toString()[0] || !dot.toString()[1]) {
      possible.push(dot - 1);
    }
    if ((dot + 1).toString()[0] === dot.toString()[0] || !dot.toString()[1]) {
      possible.push(dot + 1);
    }

    const vars = possible.filter((val) => cleanPlaces.has(val));
    return getRandom(vars);
  }
  const possible: number[] = [];
  const sortArr = [...currentAttack].sort((a, b) => a - b);
  const first = sortArr[0];
  const last = sortArr[sortArr.length - 1];
  if (sortArr[1] - sortArr[0] === 10) {
    possible.push(first - 10);
    possible.push(last + 10);
  } else {
    if (!first.toString()[1] || first.toString()[0] === last.toString()[0]) {
      possible.push(first - 1);
    }
    if ((last + 1).toString()[0] === last.toString()[0]) {
      possible.push(last + 1);
    }
  }
  const vars = possible.filter((val) => cleanPlaces.has(val));
  return getRandom(vars);
};

export const botAttack = (gameId: number, server: Server) => {
  const currentAttack = allCurrentAttacks.get(gameId) || [];
  const cleanPlaces = allCleanPlaces.get(gameId);
  if (!cleanPlaces) return;
  const dot = currentAttack.length
    ? tryToGuess(cleanPlaces, currentAttack)
    : randomAttack(cleanPlaces);

  cleanPlaces.delete(dot);
  const restLists = allRestLists.get(gameId);
  if (!restLists) return;
  const list = restLists[0];
  if (!list) return;

  const { x, y } = xAndY(dot);

  if (list.has(dot)) {
    list.delete(dot);
    sendAttackMessage(gameId, 1, x, y, 'miss');
    console.log('Result: ', `BOT miss`, { x, y });
    return;
  }

  const fields = allFields.get(gameId);
  if (!fields) return;
  const field = fields[0];
  if (!field) return;

  const ship = field.find((row) => row.has(dot));
  if (!ship) return;

  if (ship.size > 1) {
    sendAttackMessage(gameId, 1, x, y, 'shot');
    currentAttack.push(dot);
    ship.delete(dot);
    botAttack(gameId, server);

    console.log('Result: ', `BOT shot`, { x, y });
    return;
  }

  const realShips = allShips.get(gameId);
  if (!realShips) return;
  const realShip = realShips[0];
  if (!realShip) return;
  const shipInd = ship.get(dot);
  if (shipInd === undefined) return;
  killShip(realShip[shipInd], gameId, 1, cleanPlaces);
  ship.delete(dot);
  allCurrentAttacks.set(gameId, []);

  if (lastShip(field)) {
    finishSingle(gameId, 1, server);
  }
};
