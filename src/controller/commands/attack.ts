import { Attack } from '../../db/db';
import { attackHandler } from '../../utils/helpers';

export const attack = (data: string) => {
  const attackInfo: Attack = JSON.parse(data);

  const isLastAttack = attackHandler(attackInfo);
  console.log(isLastAttack);
};
