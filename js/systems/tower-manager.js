/**
 * Менеджер башен
 */
class TowerManager {
    constructor() {
        this.towers = [];
        this.towerData = null;
        this.selectedTower = null;
        this.towerPositions = [];
        this.onTowerBuilt = null;
        this.onTowerSold = null;
        this.onTowerUpgraded = null;
        
        this.loadTowerData();
    }
    
    /**
     * Загружает данные башен
     */
    async loadTowerData() {
        try {
            const response = await fetch('data/towers.json');
            this.towerData = await response.json();
            console.log('Tower data loaded:', this.towerData);
        } catch (error) {
            console.error('Failed to load tower data:', error);
        }
    }
    
    /**
     * Устанавливает позиции для башен
     * @param {Array} positions - Массив позиций
     */
    setTowerPositions(positions) {
        this.towerPositions = positions.map(pos => ({
            ...pos,
            hasTower: false,
            tower: null
        }));
        console.log(`Tower positions set: ${positions.length} positions`);
    }
    
    /**
     * Строит башню
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {string} towerType - Тип башни
     */
    buildTower(x, y, towerType) {
        if (!this.towerData) {
            console.error('Tower data not loaded');
            return false;
        }
        
        const towerTemplate = this.towerData.towers.find(t => t.id === towerType);
        if (!towerTemplate) {
            console.error(`Tower type not found: ${towerType}`);
            return false;
        }
        
        // Проверяем, есть ли достаточно монет
        if (!economyManager.hasEnoughCoins(towerTemplate.cost)) {
            console.log(`Not enough coins to build ${towerTemplate.name}`);
            return false;
        }
        
        // Проверяем, свободна ли позиция
        const position = this.getTowerPosition(x, y);
        if (!position || position.hasTower) {
            console.log('Position already occupied or invalid');
            return false;
        }
        
        // Создаем башню
        const tower = {
            id: Date.now() + Math.random(),
            type: towerType,
            name: towerTemplate.name,
            x: x,
            y: y,
            level: 1,
            damage: towerTemplate.damage,
            range: towerTemplate.range,
            attackSpeed: towerTemplate.attackSpeed,
            size: towerTemplate.size,
            color: towerTemplate.color,
            cost: towerTemplate.cost,
            sellPrice: towerTemplate.sellPrice,
            upgradeCost: towerTemplate.upgradeCost,
            maxLevel: towerTemplate.maxLevel,
            icon: towerTemplate.icon,
            lastAttack: 0,
            target: null,
            projectile: towerTemplate.projectile,
            units: towerTemplate.units || null
        };
        
        // Добавляем башню
        this.towers.push(tower);
        position.hasTower = true;
        position.tower = tower;
        
        // Тратим монеты
        economyManager.spendCoins(towerTemplate.cost, `Build ${towerTemplate.name}`);
        
        console.log(`Tower built: ${tower.name} at (${x}, ${y})`);
        
        // Вызываем callback
        if (this.onTowerBuilt) {
            this.onTowerBuilt(tower);
        }
        
        return true;
    }
    
    /**
     * Продает башню
     * @param {Object} tower - Башня для продажи
     */
    sellTower(tower) {
        const position = this.getTowerPosition(tower.x, tower.y);
        if (!position) {
            console.error('Tower position not found');
            return false;
        }
        
        // Получаем цену продажи
        const sellPrice = Math.floor(tower.cost * 0.5);
        
        // Удаляем башню
        const index = this.towers.indexOf(tower);
        if (index > -1) {
            this.towers.splice(index, 1);
        }
        
        // Освобождаем позицию
        position.hasTower = false;
        position.tower = null;
        
        // Добавляем монеты
        economyManager.addCoins(sellPrice, `Sell ${tower.name}`);
        
        console.log(`Tower sold: ${tower.name} for ${sellPrice} coins`);
        
        // Вызываем callback
        if (this.onTowerSold) {
            this.onTowerSold(tower, sellPrice);
        }
        
        return true;
    }
    
    /**
     * Улучшает башню
     * @param {Object} tower - Башня для улучшения
     */
    upgradeTower(tower) {
        if (tower.level >= tower.maxLevel) {
            console.log('Tower already at max level');
            return false;
        }
        
        if (!economyManager.hasEnoughCoins(tower.upgradeCost)) {
            console.log('Not enough coins to upgrade tower');
            return false;
        }
        
        // Улучшаем башню
        tower.level++;
        tower.damage = Math.floor(tower.damage * 1.5);
        tower.range = Math.floor(tower.range * 1.2);
        tower.attackSpeed = Math.floor(tower.attackSpeed * 0.9);
        tower.upgradeCost = Math.floor(tower.upgradeCost * 1.5);
        tower.sellPrice = Math.floor(tower.cost * 0.5);
        
        // Тратим монеты
        economyManager.spendCoins(tower.upgradeCost, `Upgrade ${tower.name}`);
        
        console.log(`Tower upgraded: ${tower.name} to level ${tower.level}`);
        
        // Вызываем callback
        if (this.onTowerUpgraded) {
            this.onTowerUpgraded(tower);
        }
        
        return true;
    }
    
    /**
     * Получает позицию башни по координатам
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    getTowerPosition(x, y) {
        return this.towerPositions.find(pos => 
            Math.abs(pos.x - x) < 20 && Math.abs(pos.y - y) < 20
        );
    }
    
    /**
     * Получает башню по координатам
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    getTowerAt(x, y) {
        return this.towers.find(tower => 
            Math.abs(tower.x - x) < tower.size && Math.abs(tower.y - y) < tower.size
        );
    }
    
    /**
     * Обновляет башни
     * @param {Array} enemies - Массив противников
     */
    updateTowers(enemies) {
        this.towers.forEach(tower => {
            this.updateTower(tower, enemies);
        });
    }
    
    /**
     * Обновляет одну башню
     * @param {Object} tower - Башня
     * @param {Array} enemies - Массив противников
     */
    updateTower(tower, enemies) {
        if (tower.type === 'wall') return; // Стены не атакуют
        
        // Находим цель
        if (!tower.target || tower.target.isDead) {
            tower.target = this.findTarget(tower, enemies);
        }
        
        // Атакуем цель
        if (tower.target && this.canAttack(tower)) {
            this.attackTarget(tower, tower.target);
        }
    }
    
    /**
     * Находит цель для башни
     * @param {Object} tower - Башня
     * @param {Array} enemies - Массив противников
     */
    findTarget(tower, enemies) {
        const aliveEnemies = enemies.filter(e => !e.isDead);
        let closestEnemy = null;
        let closestDistance = tower.range;
        
        aliveEnemies.forEach(enemy => {
            const distance = this.getDistance(tower, enemy);
            if (distance <= tower.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        });
        
        return closestEnemy;
    }
    
    /**
     * Проверяет, может ли башня атаковать
     * @param {Object} tower - Башня
     */
    canAttack(tower) {
        const now = Date.now();
        return now - tower.lastAttack >= tower.attackSpeed;
    }
    
    /**
     * Атакует цель
     * @param {Object} tower - Башня
     * @param {Object} target - Цель
     */
    attackTarget(tower, target) {
        tower.lastAttack = Date.now();
        
        // Наносим урон
        const damage = this.calculateDamage(tower, target);
        target.health -= damage;
        
        console.log(`${tower.name} attacks ${target.name} for ${damage} damage`);
        
        // Проверяем, убит ли противник
        if (target.health <= 0) {
            waveManager.killEnemy(target, tower);
        }
    }
    
    /**
     * Вычисляет урон
     * @param {Object} tower - Башня
     * @param {Object} target - Цель
     */
    calculateDamage(tower, target) {
        let damage = tower.damage;
        
        // Учитываем броню
        if (target.armor > 0) {
            damage = Math.max(1, damage - target.armor);
        }
        
        return damage;
    }
    
    /**
     * Вычисляет расстояние между объектами
     * @param {Object} obj1 - Первый объект
     * @param {Object} obj2 - Второй объект
     */
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Получает все башни
     */
    getAllTowers() {
        return this.towers;
    }
    
    /**
     * Получает позиции башен
     */
    getTowerPositions() {
        return this.towerPositions;
    }
    
    /**
     * Очищает все башни
     */
    clearTowers() {
        this.towers = [];
        this.towerPositions.forEach(pos => {
            pos.hasTower = false;
            pos.tower = null;
        });
        console.log('All towers cleared');
    }
}

// Создаем глобальный экземпляр менеджера башен
window.towerManager = new TowerManager();