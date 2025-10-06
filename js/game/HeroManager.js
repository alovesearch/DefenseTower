// js/game/HeroManager.js
export class HeroManager {
  constructor(gameEngine, heroPosition) {
    this.gameEngine = gameEngine;
    this.hero = {
      x: heroPosition.x,
      y: heroPosition.y,
      health: 100,
      maxHealth: 100,
      experience: 0,
      level: 1,
      damage: 20,
      range: 100,
      attackSpeed: 1500, // мс между атаками
      lastAttack: 0,
      size: 25,
      color: "#4169E1",
      isAlive: true
    };
    
    this.heroProjectiles = [];
  }

  update(deltaTime) {
    if (!this.hero.isAlive) return;
    
    const currentTime = Date.now();
    
    // Проверяем, может ли герой атаковать
    if (currentTime - this.hero.lastAttack >= this.hero.attackSpeed) {
      const target = this.findTarget();
      if (target) {
        this.attackTarget(target);
        this.hero.lastAttack = currentTime;
      }
    }
    
    // Обновляем снаряды героя
    this.heroProjectiles.forEach(projectile => {
      this.updateProjectile(projectile, deltaTime);
    });
    
    // Удаляем попавшие снаряды
    this.heroProjectiles = this.heroProjectiles.filter(projectile => !projectile.hit);
  }

  findTarget() {
    const enemies = this.gameEngine.enemyManager.getEnemies();
    let closestEnemy = null;
    let closestDistance = this.hero.range;
    
    enemies.forEach(enemy => {
      if (enemy.isDead) return;
      
      const distance = this.getDistance(this.hero, enemy);
      if (distance <= this.hero.range && distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    });
    
    return closestEnemy;
  }

  attackTarget(target) {
    // Создаем снаряд героя
    const projectile = {
      x: this.hero.x,
      y: this.hero.y,
      targetX: target.x,
      targetY: target.y,
      damage: this.hero.damage,
      speed: 400,
      isHeroProjectile: true
    };
    
    this.heroProjectiles.push(projectile);
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
    let closestDistance = 30;
    
    const enemies = this.gameEngine.enemyManager.getEnemies();
    enemies.forEach(enemy => {
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
    
    // Герой получает опыт за убийство
    this.addExperience(enemy.experience);
    
    // Начисляем монеты и очки
    this.gameEngine.addCoins(enemy.coins);
    this.gameEngine.addScore(enemy.experience * 10);
    
    console.log(`Hero killed ${enemy.name}! +${enemy.experience} exp, +${enemy.coins} coins`);
  }

  addExperience(amount) {
    this.hero.experience += amount;
    
    // Проверяем повышение уровня
    const expNeeded = this.hero.level * 10;
    if (this.hero.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.hero.level++;
    this.hero.experience = 0;
    
    // Улучшаем характеристики героя
    this.hero.damage += 5;
    this.hero.range += 10;
    this.hero.attackSpeed = Math.max(500, this.hero.attackSpeed - 100);
    
    console.log(`Hero leveled up to level ${this.hero.level}!`);
    this.showLevelUpMessage();
  }

  showLevelUpMessage() {
    // Показываем сообщение о повышении уровня
    const message = document.createElement("div");
    message.textContent = `Герой достиг уровня ${this.hero.level}!`;
    message.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: #FFD700;
      padding: 20px;
      border-radius: 10px;
      font-size: 1.5em;
      z-index: 1000;
      pointer-events: none;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
  }

  getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  render(ctx) {
    if (!this.hero.isAlive) return;
    
    // Рисуем героя
    ctx.fillStyle = this.hero.color;
    ctx.beginPath();
    ctx.arc(this.hero.x, this.hero.y, this.hero.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Рисуем обводку
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Рисуем полоску здоровья
    const barWidth = this.hero.size;
    const barHeight = 4;
    const barX = this.hero.x - barWidth / 2;
    const barY = this.hero.y - this.hero.size / 2 - 8;
    
    // Фон полоски
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Здоровье
    const healthPercent = this.hero.health / this.hero.maxHealth;
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Обводка
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Рисуем уровень героя
    ctx.fillStyle = "#FFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Lv.${this.hero.level}`, this.hero.x, this.hero.y + 4);
    
    // Рисуем снаряды героя
    this.heroProjectiles.forEach(projectile => {
      if (!projectile.hit) {
        this.renderProjectile(ctx, projectile);
      }
    });
  }

  renderProjectile(ctx, projectile) {
    ctx.fillStyle = "#00BFFF";
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Добавляем свечение
    ctx.shadowColor = "#00BFFF";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  getHero() {
    return this.hero;
  }

  damageHero(damage) {
    this.hero.health -= damage;
    if (this.hero.health <= 0) {
      this.hero.isAlive = false;
      this.gameEngine.loseLife(5); // Герой дает больше жизней при смерти
    }
  }
}