import { GameConfig } from "./config.js";
import { field } from "./index.js";
import { GetDistance } from "./utils.js";

export class Unit {
  x; y; angle; id; camp; hp; speed; size; bullets; gfx;

  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.id = data.id;
    this.gfx = data.gfx;
    this.camp = this.id.startsWith('e_') ? 'enemy' : 'our';
    const {hp, speed, size, bullets} = GameConfig.UnitData[this.id];

    this.hp = hp;
    this.speed = speed;
    this.size = size;
    this.bullets = [...bullets];

    this.bulletsData = this.bullets.map(b => ({id: b, delay: 0}));
  }

  delay = 0;
  bulletsData = [];
  updateState(dt) {
    // if(this.delay > 0) {
    //   this.delay -= dt * 1000;
    //   return;
    // }

    // if(!this.available || this.currentHp <= 0) return;
    this.bulletsData.forEach(b => b.delay > 0 && (b.delay -= dt * 1000));

    for(let bullet of this.bulletsData) {
      if(bullet.delay > 0) continue;

      const target = this.camp == 'enemy' ? field.fortress : field.enemies.sort((a, b) => {
        let dis_a = GetDistance(this.x, this.y, a.x, a.y);
        let dis_b = GetDistance(this.x, this.y, b.x, b.y);
        dis_a = dis_a <= GameConfig.BulletData[bullet.id].range ** 2 ? dis_a : 999999;
        dis_b = dis_b <= GameConfig.BulletData[bullet.id].range ** 2 ? dis_b : 999999;
        return dis_a - dis_b;
      })[0];
      if(target && GetDistance(this.x, this.y, target.x, target.y) <= GameConfig.BulletData[bullet.id].range ** 2) {
        // fire
        bullet.delay = GameConfig['BulletData'][bullet.id].frequency;
      }
    }

    if(this.camp == 'enemy') {
      let x = this.x - this.speed * dt * Math.cos(this.angle);
      let y = this.y - this.speed * dt * Math.sin(this.angle);
      if(GetDistance(x, y, field.fortress.x, field.fortress.y) > (field.fortress.size + this.size) ** 2) {
        this.x = x;
        this.y = y;
        this.gfx.position.set(this.x, this.y);
      }
    }
    else {

    }

  }
}