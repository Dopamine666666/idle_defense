const {Application, Container, Graphics} = PIXI;
import {Bullet} from "./bullet.js";
import { GameConfig } from "./config.js";
import { Unit } from "./unit.js";

const FRAME_INTERVAL = 1/60;
export class Field {

  app;
  rootLayer;
  unitLayer;
  bulletLayer;
  bullets = [];
  enemies = [];
  fortress;
  wave = 0;
  summonState;
  battleSpeed = 1;

  async init() {
    this.app = new Application();
    await this.app.init({background: '#1192cc', width: 800, height: 800});
    document.body.appendChild(this.app.canvas);
    this.rootLayer = new Container({anchor: 0.5});
    this.app.stage.addChild(this.rootLayer);
    this.rootLayer.position.set(this.app.canvas.width/2, this.app.canvas.height/2);
    this.unitLayer = new Container({anchor: 0.5});
    this.bulletLayer = new Container({anchor: 0.5});
    this.rootLayer.addChild(this.unitLayer);
    this.rootLayer.addChild(this.bulletLayer);

    this.summonState = GameConfig['BattleData'].waves[0].wave.map(w => ({enemy: w.id, count: 0}));

    this.createUnit({id: 'fortress'});
  }

  async createUnit(data) {


    const gfx = new Graphics();
    const {size, color} = GameConfig.UnitData[data.id];
    gfx.circle(data.x, data.y, size);
    gfx.fill(color);
    this.unitLayer.addChild(gfx);
    
    const angle = Math.random() * Math.PI * 2;
    const {width, height} = this.app.canvas;
    data.x =  data.id == 'fortress' ? 0 : width * 0.5 * Math.cos(angle);
    data.y =  data.id == 'fortress' ? 0 : height * 0.5 * Math.sin(angle); 
    data.angle = angle;
    data.gfx = gfx;
    const unit = new Unit(data);

    if(unit.camp == 'enemy') {
      this.enemies.push(unit);
    }
    else if(!this.fortress) {
      this.fortress = unit;
    }
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

  timer = 0;
  wave_timer = 0;
  wave_total_time = 0;
  updateState() {
    this.timer += FRAME_INTERVAL * 1000;

    let timer = this.timer;
    let wave = -1;
    let duration = 0;
    let delay = 0;
    
    this.wave_timer = 0;
    const waveData = GameConfig.BattleData.waves;
    for(let i = 0; i < waveData.length; i++) {
      duration = waveData[i].duration;
      delay = waveData[i].delay;
      if((timer -= duration + delay) < 0) {
        wave = i;
        this.wave_total_time = duration + delay;
        this.wave_timer = timer + this.wave_total_time;
        break;
      }
    }

    if(this.wave != wave) {
      const last = waveData[this.wave].wave;
      
      for(let i = 0; i < last.length; i++) {
        while(this.summonState[i].count < last[i].count) {
          this.createUnit({id: last[i].id});
          ++this.summonState[i].count;
        }
      }

      this.wave = wave;
      if(waveData[wave]) {
        this.summonState = waveData[wave].wave.map(w => ({enemy: w.id, count: 0}));
      }
    }

    if(timer >= 0 || !waveData[wave]) return;
    const ratio = Math.min((timer + duration + delay) / duration, 1);
    for(let i = 0; i < waveData[wave].wave.length; i++) {
      const summoned = this.summonState[i];
      const reserved = waveData[wave].wave[i];
      const count = reserved.count * ratio;
      while(summoned.count < count) { 
        this.createUnit({id: reserved.id});
        ++summoned.count;
      }
    }
  }

  // counter = 0;
  // counter1 = 0;
  async update(dt) {
    if((this.counter += dt) < FRAME_INTERVAL) return;
    this.counter -= FRAME_INTERVAL;

    for(let i = 0; i < this.battleSpeed; i++) {
      this.updateState();

      this.enemies.forEach(e => e.updateState(FRAME_INTERVAL));
    }
  }

}

export const field = new Field();
await field.init();
field.app.ticker.add((ticker) => {
  field.update(ticker.deltaMS / 1000);
})