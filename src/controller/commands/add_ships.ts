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
  start_game,
  turn,
} from '../../utils/helpers';

export const add_ships = (data: string) => {
  const info: InitShipsInfo = JSON.parse(data);
  const { gameId, indexPlayer, ships } = info;
  const currentShips: Ships = {};
  const currentFields: Fields = {};
  const currentRestList: RestLists = {};

  const field = getInitField(ships);

  currentShips[indexPlayer] = ships;
  currentFields[indexPlayer] = getInitField(ships);
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

  allShips.set(gameId, currentShips);
  allFields.set(gameId, currentFields);
  allRestLists.set(gameId, currentRestList);
};
