// js/data/TowerData.js
export class TowerData {
  static towers = {
    archer: {
      id: "archer",
      name: "Башня лучников",
      cost: 50,
      damage: 15,
      range: 150,
      attackSpeed: 1000, // мс между атаками
      projectileSpeed: 300,
      size: 30,
      color: "#8B4513",
      type: "ranged",
      description: "Дальнобойная башня с хорошей скоростью атаки",
      upgrades: [
        { cost: 75, damage: 25, range: 180, attackSpeed: 800 },
        { cost: 125, damage: 40, range: 200, attackSpeed: 600 }
      ]
    },
    warrior: {
      id: "warrior",
      name: "Казарма воинов",
      cost: 75,
      damage: 25,
      range: 80,
      attackSpeed: 1500,
      health: 100,
      maxHealth: 100,
      size: 35,
      color: "#4169E1",
      type: "melee",
      description: "Ближний бой, высокая защита",
      upgrades: [
        { cost: 100, damage: 40, range: 100, health: 150 },
        { cost: 150, damage: 60, range: 120, health: 200 }
      ]
    },
    mage: {
      id: "mage",
      name: "Башня магов",
      cost: 100,
      damage: 30,
      range: 120,
      attackSpeed: 2000,
      projectileSpeed: 200,
      size: 25,
      color: "#9370DB",
      type: "magic",
      description: "Магическая атака, наносит урон по области",
      abilities: ["area_damage"],
      upgrades: [
        { cost: 150, damage: 50, range: 140, attackSpeed: 1500 },
        { cost: 200, damage: 80, range: 160, attackSpeed: 1000 }
      ]
    }
  };

  static getTower(type) {
    const tower = this.towers[type];
    if (!tower) {
      throw new Error(`Tower type ${type} not found`);
    }
    
    return {
      ...tower,
      health: tower.maxHealth || tower.health,
      level: 1,
      x: 0,
      y: 0,
      isDestroyed: false,
      lastAttack: 0
    };
  }

  static getAllTowers() {
    return Object.values(this.towers);
  }

  static canAfford(towerType, coins) {
    const tower = this.towers[towerType];
    return tower && coins >= tower.cost;
  }

  static getUpgradeCost(towerType, currentLevel) {
    const tower = this.towers[towerType];
    if (!tower || !tower.upgrades || currentLevel >= tower.upgrades.length) {
      return null;
    }
    return tower.upgrades[currentLevel - 1].cost;
  }
}