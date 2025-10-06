// js/game/EnemyManager.js
export class EnemyManager {
  constructor(gameEngine, paths) {
    this.gameEngine = gameEngine;
    this.paths = paths;
    this.enemies = [];
    this.projectiles = [];
  }

  addEnemy(enemyData) {
    const enemy = {
      ...enemyData,
      id: Date.now() + Math.random(),
      currentPath: 0,
      pathProgress: 0,
      x: this.paths[0].start.x,
      y: this.paths[0].start.y,
      targetX: this.paths[0].end.x,
      targetY: this.paths[0].end.y
    };
    
    this.enemies.push(enemy);
  }

  update(deltaTime) {
    // Обновляем противников
    this.enemies.forEach(enemy => {
      if (!enemy.isDead) {
        this.updateEnemy(enemy, deltaTime);
      }
    });
    
    // Обновляем снаряды
    this.projectiles.forEach(projectile => {
      this.updateProjectile(projectile, deltaTime);
    });
    
    // Удаляем мертвых противников и снаряды
    this.enemies = this.enemies.filter(enemy => !enemy.isDead);
    this.projectiles = this.projectiles.filter(projectile => !projectile.hit);
  }

  updateEnemy(enemy, deltaTime) {
    // Движение по пути
    const path = this.paths[enemy.currentPath];
    const distance = this.getDistance(enemy, { x: enemy.targetX, y: enemy.targetY });
    
    if (distance < 5) {
      // Достигли конца текущего сегмента пути
      enemy.currentPath++;
      if (enemy.currentPath >= this.paths.length) {
        // Достигли конца пути - нанесли урон игроку
        this.gameEngine.loseLife(1);
        enemy.isDead = true;
        return;
      }
      
      // Переходим к следующему сегменту
      const nextPath = this.paths[enemy.currentPath];
      enemy.targetX = nextPath.end.x;
      enemy.targetY = nextPath.end.y;
    }
    
    // Движение к цели
    const dx = enemy.targetX - enemy.x;
    const dy = enemy.targetY - enemy.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceToTarget > 0) {
      const moveX = (dx / distanceToTarget) * enemy.speed * deltaTime * 0.1;
      const moveY = (dy / distanceToTarget) * enemy.speed * deltaTime * 0.1;
      
      enemy.x += moveX;
      enemy.y += moveY;
    }
  }

  updateProjectile(projectile, deltaTime) {
    // Движение снаряда к цели
    const dx = projectile.targetX - projectile.x;
    const dy = projectile.targetY - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      // Снаряд достиг цели
      this.hitTarget(projectile);
      projectile.hit = true;
      return;
    }
    
    const moveX = (dx / distance) * projectile.speed * deltaTime * 0.1;
    const moveY = (dy / distance) * projectile.speed * deltaTime * 0.1;
    
    projectile.x += moveX;
    projectile.y += moveY;
  }

  hitTarget(projectile) {
    // Находим ближайшего противника к точке попадания
    let closestEnemy = null;
    let closestDistance = 50; // Радиус поиска
    
    this.enemies.forEach(enemy => {
      if (enemy.isDead) return;
      
      const distance = this.getDistance(projectile, enemy);
      if (distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    });
    
    if (closestEnemy) {
      this.damageEnemy(closestEnemy, projectile.damage);
    }
  }

  damageEnemy(enemy, damage) {
    const actualDamage = Math.max(1, damage - enemy.armor);
    enemy.health -= actualDamage;
    
    if (enemy.health <= 0) {
      this.killEnemy(enemy);
    }
  }

  killEnemy(enemy) {
    enemy.isDead = true;
    
    // Начисляем монеты и опыт
    this.gameEngine.addCoins(enemy.coins);
    this.gameEngine.addScore(enemy.experience * 10);
    
    // Если это босс, показываем особый эффект
    if (enemy.isBoss) {
      this.showBossDefeated(enemy);
    }
    
    console.log(`Enemy ${enemy.name} defeated! +${enemy.coins} coins, +${enemy.experience} exp`);
  }

  showBossDefeated(enemy) {
    // Здесь можно добавить спецэффекты для босса
    console.log(`BOSS ${enemy.name} DEFEATED!`);
  }

  addProjectile(projectile) {
    projectile.id = Date.now() + Math.random();
    projectile.hit = false;
    this.projectiles.push(projectile);
  }

  getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  render(ctx) {
    // Рисуем противников
    this.enemies.forEach(enemy => {
      if (!enemy.isDead) {
        this.renderEnemy(ctx, enemy);
      }
    });
    
    // Рисуем снаряды
    this.projectiles.forEach(projectile => {
      if (!projectile.hit) {
        this.renderProjectile(ctx, projectile);
      }
    });
  }

  renderEnemy(ctx, enemy) {
    // Рисуем противника
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Рисуем полоску здоровья
    const barWidth = enemy.size;
    const barHeight = 4;
    const barX = enemy.x - barWidth / 2;
    const barY = enemy.y - enemy.size / 2 - 8;
    
    // Фон полоски
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Здоровье
    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Обводка
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Если это босс, добавляем особый эффект
    if (enemy.isBoss) {
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  renderProjectile(ctx, projectile) {
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  getEnemies() {
    return this.enemies;
  }

  getEnemyCount() {
    return this.enemies.filter(enemy => !enemy.isDead).length;
  }
}