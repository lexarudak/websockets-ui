import {
  Fields,
  InitShipsInfo,
  RestLists,
  Ships,
  allFields,
  allRestLists,
  allShips,
} from '../../db/db';
import {
  getInitField,
  getRestList,
  isSingleMode,
  start_game,
  start_single_game,
  turn,
} from '../../utils/helpers';
import { botShips as botShipsList } from '../../bot/bot_ships';

export const add_ships = (data: string) => {
  const info: InitShipsInfo = JSON.parse(data);
  const { gameId, indexPlayer, ships } = info;
  const currentShips: Ships = {};
  const currentFields: Fields = {};
  const currentRestList: RestLists = {};

  const field = getInitField(ships);

  currentShips[indexPlayer] = ships;
  currentFields[indexPlayer] = field;
  currentRestList[indexPlayer] = getRestList(field);

  if (allShips.has(gameId)) {
    const prevUserShips = allShips.get(gameId);
    allShips.set(gameId, { ...prevUserShips, ...currentShips });
    const prevUserField = allFields.get(gameId);
    allFields.set(gameId, { ...prevUserField, ...currentFields });
    const prevUserRestList = allRestLists.get(gameId);
    allRestLists.set(gameId, { ...prevUserRestList, ...currentRestList });

    start_game(gameId);
    turn(gameId);
    return;
  }

  if (isSingleMode(gameId)) {
    const botShips =
      botShipsList[Math.floor(Math.random() * botShipsList.length)];
    const botField = getInitField(botShips);

    console.log(
      botShips.map(({ position: { x, y }, direction, length }) => ({
        x,
        y,
        direction,
        length,
      })),
    );

    currentShips[1] = [...botShips];
    currentFields[1] = botField;
    currentRestList[1] = getRestList(botField);
  }

  console.log(currentShips);
  console.log(currentFields);

  allShips.set(gameId, currentShips);
  allFields.set(gameId, currentFields);
  allRestLists.set(gameId, currentRestList);

  if (isSingleMode(gameId)) {
    start_single_game(gameId);
  }
};
