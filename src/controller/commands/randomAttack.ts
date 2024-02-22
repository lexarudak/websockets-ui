import { RandomAttack } from '../../db/db';
import { randomAttackHandler } from '../../utils/helpers';

export const randomAttack = (data: string) => {
  const attackInfo: RandomAttack = JSON.parse(data);
  randomAttackHandler(attackInfo);
};
