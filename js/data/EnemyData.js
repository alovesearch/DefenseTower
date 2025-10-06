// js/data/EnemyData.js
export class EnemyData {
  static enemies = {
    goblin: {
      id: "goblin",
      name: "Гоблин",
      health: 50,
      maxHealth: 50,
      armor: 0,
      speed: 1.5,
      coins: 5,
      experience: 2,
      damage: 1,
      size: 20,
      color: "#8B4513",
      abilities: [],
      description: "Слабый, но быстрый противник"
    },
    orc: {
      id: "orc",
      name: "Орк",
      health: 120,
      maxHealth: 120,
      armor: 5,
      speed: 1.0,
      coins: 15,
      experience: 5,
      damage: 3,
      size: 25,
      color: "#228B22",
      abilities: ["berserker"],
      description: "Сильный и выносливый противник"
    },
    orc_boss: {
      id: "orc_boss",
      name: "Вожак орков",
      health: 500,
      maxHealth: 500,
      armor: 15,
      speed: 0.8,
      coins: 100,
      experience: 25,
      damage: 8,
      size: 40,
      color: "#006400",
      abilities: ["berserker", "regeneration", "rage"],
      description: "Мощный босс с особыми способностями",
      isBoss: true
    }
  };

  static getEnemy(type) {
    const enemy = this.enemies[type];
    if (!enemy) {
      throw new Error(`Enemy type ${type} not found`);
    }
    
    // Возвращаем копию с полным здоровьем
    return {
      ...enemy,
      health: enemy.maxHealth,
      currentPath: 0,
      pathProgress: 0,
      isDead: false,
      isBoss: enemy.isBoss || false
    };
  }

  static getAllEnemies() {
    return Object.values(this.enemies);
  }

  static getBossEnemies() {
    return Object.values(this.enemies).filter(enemy => enemy.isBoss);
  }
}