/**
 * Менеджер волн врагов
 */
class WaveManager {
    constructor() {
        this.currentWave = 0;
        this.maxWaves = 0;
        this.waves = [];
        this.isWaveActive = false;
        this.isWavePaused = false;
        this.enemies = [];
        this.spawnPoints = [];
        this.enemyData = null;
        this.onWaveComplete = null;
        this.onEnemySpawned = null;
        this.onEnemyKilled = null;
        this.onBossSpawned = null;
        
        this.loadEnemyData();
    }
    
    /**
     * Загружает данные противников
     */
    async loadEnemyData() {
        try {
            const response = await fetch('data/enemies.json');
            this.enemyData = await response.json();
            console.log('Enemy data loaded:', this.enemyData);
        } catch (error) {
            console.error('Failed to load enemy data:', error);
        }
    }
    
    /**
     * Устанавливает волны для уровня
     * @param {Array} waves - Массив волн
     */
    setWaves(waves) {
        this.waves = waves;
        this.maxWaves = waves.length;
        this.currentWave = 0;
        console.log(`Waves set: ${this.maxWaves} waves`);
    }
    
    /**
     * Устанавливает точки спавна
     * @param {Array} spawnPoints - Массив точек спавна
     */
    setSpawnPoints(spawnPoints) {
        this.spawnPoints = spawnPoints;
        console.log(`Spawn points set: ${spawnPoints.length} points`);
    }
    
    /**
     * Начинает следующую волну
     */
    async startNextWave() {
        if (this.currentWave >= this.maxWaves) {
            console.log('All waves completed');
            return false;
        }
        
        if (this.isWaveActive) {
            console.log('Wave already active');
            return false;
        }
        
        const wave = this.waves[this.currentWave];
        console.log(`Starting wave ${this.currentWave + 1}:`, wave);
        
        this.isWaveActive = true;
        this.isWavePaused = false;
        
        // Спавним противников волны
        await this.spawnWave(wave);
        
        return true;
    }
    
    /**
     * Спавнит противников волны
     * @param {Object} wave - Данные волны
     */
    async spawnWave(wave) {
        for (const enemyGroup of wave.enemies) {
            const enemyType = this.enemyData.enemies.find(e => e.id === enemyGroup.type);
            if (!enemyType) {
                console.error(`Enemy type not found: ${enemyGroup.type}`);
                continue;
            }
            
            for (let i = 0; i < enemyGroup.count; i++) {
                await this.spawnEnemy(enemyType, enemyGroup.delay * i);
            }
        }
    }
    
    /**
     * Спавнит одного противника
     * @param {Object} enemyType - Тип противника
     * @param {number} delay - Задержка перед спавном
     */
    async spawnEnemy(enemyType, delay = 0) {
        if (delay > 0) {
            await this.delay(delay);
        }
        
        if (this.isWavePaused) {
            // Ждем пока волна не будет возобновлена
            while (this.isWavePaused) {
                await this.delay(100);
            }
        }
        
        // Выбираем случайную точку спавна
        const spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        
        // Создаем противника
        const enemy = {
            id: Date.now() + Math.random(),
            type: enemyType.id,
            name: enemyType.name,
            health: enemyType.health,
            maxHealth: enemyType.maxHealth,
            armor: enemyType.armor,
            speed: enemyType.speed,
            damage: enemyType.damage,
            coins: enemyType.coins,
            experience: enemyType.experience,
            size: enemyType.size,
            color: enemyType.color,
            x: spawnPoint.x,
            y: spawnPoint.y,
            targetX: spawnPoint.x,
            targetY: spawnPoint.y,
            isMoving: false,
            isDead: false,
            abilities: enemyType.abilities || [],
            icon: enemyType.icon,
            isBoss: enemyType.isBoss || false,
            cameraFocus: enemyType.cameraFocus || false
        };
        
        this.enemies.push(enemy);
        
        // Вызываем callback
        if (this.onEnemySpawned) {
            this.onEnemySpawned(enemy);
        }
        
        // Если это босс, вызываем специальный callback
        if (enemy.isBoss && this.onBossSpawned) {
            this.onBossSpawned(enemy);
        }
        
        console.log(`Enemy spawned: ${enemy.name} at (${enemy.x}, ${enemy.y})`);
    }
    
    /**
     * Обновляет состояние волн
     */
    update() {
        if (!this.isWaveActive) return;
        
        // Проверяем, завершена ли волна
        const aliveEnemies = this.enemies.filter(e => !e.isDead);
        if (aliveEnemies.length === 0 && this.enemies.length > 0) {
            this.completeWave();
        }
    }
    
    /**
     * Завершает текущую волну
     */
    completeWave() {
        console.log(`Wave ${this.currentWave + 1} completed`);
        
        this.isWaveActive = false;
        this.currentWave++;
        
        // Очищаем массив противников
        this.enemies = [];
        
        // Вызываем callback
        if (this.onWaveComplete) {
            this.onWaveComplete(this.currentWave - 1);
        }
    }
    
    /**
     * Убивает противника
     * @param {Object} enemy - Противник
     * @param {Object} killer - Кто убил (герой или башня)
     */
    killEnemy(enemy, killer = null) {
        if (enemy.isDead) return;
        
        enemy.isDead = true;
        enemy.health = 0;
        
        console.log(`Enemy killed: ${enemy.name} by ${killer ? killer.type || 'unknown' : 'unknown'}`);
        
        // Вызываем callback
        if (this.onEnemyKilled) {
            this.onEnemyKilled(enemy, killer);
        }
    }
    
    /**
     * Паузит волну
     */
    pauseWave() {
        this.isWavePaused = true;
        console.log('Wave paused');
    }
    
    /**
     * Возобновляет волну
     */
    resumeWave() {
        this.isWavePaused = false;
        console.log('Wave resumed');
    }
    
    /**
     * Останавливает волну
     */
    stopWave() {
        this.isWaveActive = false;
        this.isWavePaused = false;
        this.enemies = [];
        console.log('Wave stopped');
    }
    
    /**
     * Получает текущую волну
     */
    getCurrentWave() {
        return this.currentWave;
    }
    
    /**
     * Получает максимальное количество волн
     */
    getMaxWaves() {
        return this.maxWaves;
    }
    
    /**
     * Проверяет, активна ли волна
     */
    isWaveActive() {
        return this.isWaveActive;
    }
    
    /**
     * Получает всех живых противников
     */
    getAliveEnemies() {
        return this.enemies.filter(e => !e.isDead);
    }
    
    /**
     * Получает всех противников
     */
    getAllEnemies() {
        return this.enemies;
    }
    
    /**
     * Задержка выполнения
     * @param {number} ms - Миллисекунды
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Создаем глобальный экземпляр менеджера волн
window.waveManager = new WaveManager();