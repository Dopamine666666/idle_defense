export const GameConfig = {
  'BulletData': {
    'b_1' : {power: 10, speed: 10, frequency: 250, range: 200, size: 5, color: 'red'},
    'b_2' : {power: 15, speed: 8, frequency: 400, range: 200, size: 4, color: 'blue'},
    'b_3' : {power: 20, speed: 5, frequency: 600, range: 200, size: 6, color: 'green'},
  },
  'UnitData': {
    'e_1': {hp: 20, speed: 5, size: 10, bullets: ['b_1']},
    'e_2': {hp: 20, speed: 5, size: 10, bullets: ['b_2']},
    'e_3': {hp: 20, speed: 5, size: 10, bullets: ['b_3']},
    'base': {hp: 20, speed: 5, size: 10, bullets: ['b_1', 'b_2', 'b_3']},
  }
}