const {Application, Container, Graphics} = PIXI;
import {Bullet} from "./bullet.js";
import { GameConfig } from "./config.js";

export class Field {
  app;
  unitLayer;
  bulletLayer;
  bullets = [];
  async init() {
    this.app = new Application();
    await this.app.init({background: '#1192cc'});
    document.body.appendChild(this.app.canvas);

    this.unitLayer = new Container();
    this.bulletLayer = new Container();
    this.app.stage.addChild(this.unitLayer);
    this.app.stage.addChild(this.bulletLayer);
  }

  async createUnit() {

  }

  async createBullet(data) {
    const bullet = new Bullet(data);
    this.bullets.push(bullet);
    const gfx = new Graphics();
    const {size, color} = GameConfig.BulletData[data.id];
    gfx.circle(data.x, data.y, size);
    gfx.fill(color);

    this.bulletLayer.addChild(gfx);
  }
}

const field = new Field();
await field.init();
await field.createBullet({x: 50, y: 50, id: 'b_1', camp: 'enemy'});