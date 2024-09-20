import { GameConfig } from "./config.js";

class UnitBase {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;

    this.id = data.id;
    this.camp = this.id.startsWith('e_') ? 'enemy' : 'our';
    const {hp, speed, size, bullets} = GameConfig.UnitData[this.id];

    this.hp = hp;
    this.speed = speed;
    this.size = size;
    this.bullets = [...bullets];
  }
}