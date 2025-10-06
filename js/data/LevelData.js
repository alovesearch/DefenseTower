// js/data/LevelData.js
export class LevelData {
  static levels = {
    1: {
      id: 1,
      name: "Первая защита",
      faction: "light",
      description: "Защитите эльфийскую деревню от нападения орков",
      background: "img/levels/level1-bg.jpg",
      paths: [
        { start: { x: 0, y: 300 }, end: { x: 400, y: 300 }, control: { x: 200, y: 250 } },
        { start: { x: 0, y: 500 }, end: { x: 400, y: 500 }, control: { x: 200, y: 550 } },
        { start: { x: 400, y: 400 }, end: { x: 800, y: 400 }, control: { x: 600, y: 350 } }
      ],
      heroPosition: { x: 750, y: 400 },
      startingCoins: 100,
      startingLives: 20,
      waves: [
        {
          id: 1,
          enemies: [
            { type: "goblin", count: 10, delay: 1000 }
          ]
        },
        {
          id: 2,
          enemies: [
            { type: "orc", count: 2, delay: 2000 }
          ]
        },
        {
          id: 3,
          enemies: [
            { type: "orc_boss", count: 1, delay: 3000 }
          ],
          isBoss: true
        }
      ],
      towerSpots: [
        { x: 100, y: 200, type: "archer" },
        { x: 300, y: 200, type: "warrior" },
        { x: 500, y: 200, type: "mage" },
        { x: 100, y: 600, type: "archer" },
        { x: 300, y: 600, type: "warrior" },
        { x: 500, y: 600, type: "mage" }
      ]
    }
  };

  static getLevel(levelId, faction) {
    const level = this.levels[levelId];
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }
    
    // Клонируем уровень и адаптируем под фракцию
    const levelCopy = JSON.parse(JSON.stringify(level));
    levelCopy.faction = faction;
    
    return levelCopy;
  }

  static getAllLevels() {
    return Object.values(this.levels);
  }
}