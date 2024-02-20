import { Fields, InitShipsInfo, Ships, allFields, allShips } from '../../db/db';
import { getInitField } from '../../utils/helpers';

export const add_ships = (data: string) => {
  const info: InitShipsInfo = JSON.parse(data);
  const { gameId, indexPlayer, ships } = info;
  const currentShips: Ships = {};
  const currentFields: Fields = {};

  currentShips[indexPlayer] = ships;
  currentFields[indexPlayer] = getInitField(ships);

  if (allShips.has(gameId)) {
    const prevUserShips = allShips.get(gameId);
    allShips.set(gameId, { ...prevUserShips, ...currentShips });
    const prevUserField = allFields.get(gameId);
    allFields.set(gameId, { ...prevUserField, ...currentFields });

    console.log('GO', allShips.get(gameId));
    return;
  }

  allShips.set(gameId, currentShips);
  allFields.set(gameId, currentFields);
  console.log('SET', allShips.get(gameId));
};
