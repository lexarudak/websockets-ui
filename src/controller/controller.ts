import { reg } from './commands/reg';
import { add_user_to_room } from './commands/add_user_to_room';
import { create_room } from './commands/create_room';
import { add_ships } from './commands/add_ships';
import { attack } from './commands/attack';
import { randomAttack } from './commands/randomAttack';

export const controller = {
  reg,
  create_room,
  add_user_to_room,
  add_ships,
  attack,
  randomAttack,
};
