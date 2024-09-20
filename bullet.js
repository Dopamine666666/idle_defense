import { GameConfig } from "./config.js";

export class Bullet {
  
  constructor(data) {
    this.x = data.x;
    this.y = data.y;

    this.id = data.id;
    this.camp = data.camp;
    const {power, speed, frequency, range} = GameConfig.BulletData[this.id];

    this.power = power;
    this.speed = speed;
    this.frequency = frequency;
    this.range = range;
    // this.size = size;
    // this.color = color;
  }

  update(dt) {
    
  }
}