import { GameConfig } from "./config.js";
import { field } from "./index.js";
import { GetDistance } from "./utils.js";

export class Bullet {
  x; y; angle; target; id; camp; power; speed; frequency; range;

  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    // this.target = data.target;
    this.id = data.id;
    this.camp = data.camp;
    const {power, speed, frequency, range} = GameConfig.BulletData[this.id];

    this.power = power;
    this.speed = speed;
    this.frequency = frequency;
    this.range = range;
    this.size = size;
    // this.color = color;
  }

  trigger(unit) {
    
    field.bullets = field.bullets.filter(b => b != this);
  }

  update(dt) {
    for(let unit of [].concat(this.camp == 'enemy' ? field.fortress : field.enemies)) {
      if(GetDistance(this.x, this.y, unit.x, unit.y) <= (this.size + unit.size) ** 2) {
        this.trigger(unit);
        return;
      }
    }

    let x = this.x + this.speed * dt * Math.cos(this.angle);
    let y = this.y + this.speed * dt * Math.sin(this.angle);
    if(Math.abs(x) > field.app.canvas.width * 0.5 || Math.abs(y) > field.app.canvas.height * 0.5) {
      field.bullets = field.bullets.filter(b => b != this);
      return;
    }
  }
}