// js/game/TowerManager.js
import { TowerData } from "../data/TowerData.js";

export class TowerManager {
  constructor(gameEngine, towerSpots) {
    this.gameEngine = gameEngine;
    this.towers = [];
    this.towerSpots = towerSpots;
  }

  update(deltaTime) {
    this.towers.forEach(tower => {
      if (!tower.isDestroyed) {
        this.updateTower(tower, deltaTime);
      }
    });
  }

  updateTower(tower, deltaTime) {
    const currentTime = Date.now();
    
    // Проверяем, можно ли атаковать
    if (currentTime - tower.lastAttack >= tower.attackSpeed) {
      const target = this.findTarget(tower);
      if (target) {
        this.attackTarget(tower, target);
        tower.lastAttack = currentTime;
      }
    }
  }

  findTarget(tower) {
    const enemies = this.gameEngine.enemyManager.getEnemies();
    let closestEnemy = null;
    let closestDistance = tower.range;
    
    enemies.forEach(enemy => {
      if (enemy.isDead) return;
      
      const distance = this.getDistance(tower, enemy);
      if (distance <= tower.range && distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    });
    
    return closestEnemy;
  }

  attackTarget(tower, target) {
    // Создаем снаряд
    const projectile = {
      x: tower.x,
      y: tower.y,
      targetX: target.x,
      targetY: target.y,
      damage: tower.damage,
      speed: tower.projectileSpeed,
      tower: tower
    };
    
    this.gameEngine.enemyManager.addProjectile(projectile);
  }

  canBuildTower(x, y, towerType) {
    const towerData = TowerData.getTower(towerType);
    
    // Проверяем, есть ли достаточно монет
    if (!this.gameEngine.spendCoins(towerData.cost)) {
      return false;
    }
    
    // Проверяем, не пересекается ли с другими башнями
    const minDistance = 60;
    for (const tower of this.towers) {
      if (this.getDistance({ x, y }, tower) < minDistance) {
        this.gameEngine.addCoins(towerData.cost); // Возвращаем монеты
        return false;
      }
    }
    
    // Проверяем, не на дороге ли
    if (this.isOnPath(x, y)) {
      this.gameEngine.addCoins(towerData.cost); // Возвращаем монеты
      return false;
    }
    
    return true;
  }

  buildTower(x, y, towerType) {
    const tower = TowerData.getTower(towerType);
    tower.x = x;
    tower.y = y;
    tower.id = Date.now() + Math.random();
    
    this.towers.push(tower);
    console.log(`Built ${tower.name} at (${x}, ${y})`);
  }

  isOnPath(x, y) {
    // Простая проверка - находится ли точка на дороге
    const pathWidth = 40;
    
    for (const path of this.gameEngine.levelData.paths) {
      // Проверяем расстояние до пути
      const distance = this.getDistanceToPath(x, y, path);
      if (distance < pathWidth / 2) {
        return true;
      }
    }
    
    return false;
  }

  getDistanceToPath(x, y, path) {
    // Упрощенная проверка расстояния до пути
    const startX = path.start.x;
    const startY = path.start.y;
    const endX = path.end.x;
    const endY = path.end.y;
    
    const A = endY - startY;
    const B = startX - endX;
    const C = endX * startY - startX * endY;
    
    return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B);
  }

  getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  render(ctx) {
    this.towers.forEach(tower => {
      if (!tower.isDestroyed) {
        this.renderTower(ctx, tower);
      }
    });
  }

  renderTower(ctx, tower) {
    // Рисуем башню
    ctx.fillStyle = tower.color;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, tower.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Рисуем обводку
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Рисуем уровень башни
    ctx.fillStyle = "#FFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(tower.level.toString(), tower.x, tower.y + 4);
  }

  destroyTower(tower) {
    tower.isDestroyed = true;
    // Возвращаем часть стоимости
    const refund = Math.floor(tower.cost * 0.5);
    this.gameEngine.addCoins(refund);
  }

  getTowers() {
    return this.towers.filter(tower => !tower.isDestroyed);
  }
}