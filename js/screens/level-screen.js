/**
 * Контроллер экрана уровня
 */
class LevelScreenController {
    constructor() {
        this.levelElement = document.getElementById('level-screen');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.pauseBtn = document.getElementById('pause-btn');
        this.speedBtn = document.getElementById('speed-btn');
        this.startWaveBtn = document.getElementById('start-wave-btn');
        this.waveTitle = document.querySelector('.wave-title');
        
        this.levelData = null;
        this.hero = null;
        this.roads = [];
        this.towerPositions = [];
        this.obstacles = [];
        this.isPaused = false;
        this.gameSpeed = 1;
        this.selectedHero = false;
        this.targetPosition = null;
        this.availableMoves = [];
        
        this.bindEvents();
        this.setupCanvas();
    }
    
    /**
     * Загружает экран
     * @param {Object} data - Данные для загрузки
     */
    async load(data = {}) {
        console.log('Level screen loaded');
        this.levelData = data.levelData || this.getDefaultLevelData();
        this.initializeLevel();
        this.setupSystems();
    }
    
    /**
     * Активирует экран
     * @param {Object} data - Данные для активации
     */
    async activate(data = {}) {
        console.log('Level screen activated');
        this.startGameLoop();
    }
    
    /**
     * Деактивирует экран
     */
    async deactivate() {
        console.log('Level screen deactivated');
        this.stopGameLoop();
    }
    
    /**
     * Выгружает экран
     */
    async unload() {
        console.log('Level screen unloaded');
        this.stopGameLoop();
        this.levelData = null;
        this.hero = null;
    }
    
    /**
     * Настраивает canvas
     */
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    /**
     * Изменяет размер canvas
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    /**
     * Привязывает события
     */
    bindEvents() {
        // Кнопки управления
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.speedBtn.addEventListener('click', () => this.toggleSpeed());
        this.startWaveBtn.addEventListener('click', () => this.startWave());
        
        // События мыши для управления героем
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        
        // События касания для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => this.onCanvasTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.onCanvasTouchEnd(e));
    }
    
    /**
     * Получает данные уровня по умолчанию
     */
    getDefaultLevelData() {
        return {
            id: 1,
            name: "Первый уровень",
            width: 1200,
            height: 800,
            heroStartPos: { x: 100, y: 400 },
            attackPoint: { x: 1100, y: 400 },
            defensePoint: { x: 50, y: 400 },
            roads: [
                { start: { x: 1100, y: 400 }, end: { x: 1000, y: 400 } },
                { start: { x: 1000, y: 400 }, end: { x: 800, y: 300 } },
                { start: { x: 800, y: 300 }, end: { x: 600, y: 400 } },
                { start: { x: 600, y: 400 }, end: { x: 400, y: 500 } },
                { start: { x: 400, y: 500 }, end: { x: 200, y: 400 } },
                { start: { x: 200, y: 400 }, end: { x: 50, y: 400 } }
            ],
            towerPositions: [
                { x: 900, y: 350, available: true },
                { x: 700, y: 250, available: true },
                { x: 500, y: 350, available: true },
                { x: 300, y: 450, available: true }
            ],
            obstacles: [
                { x: 500, y: 200, width: 100, height: 100 },
                { x: 300, y: 600, width: 80, height: 80 }
            ]
        };
    }
    
    /**
     * Инициализирует уровень
     */
    initializeLevel() {
        // Создаем героя
        this.hero = {
            x: this.levelData.heroStartPos.x,
            y: this.levelData.heroStartPos.y,
            size: 20,
            color: '#00ff00',
            targetX: this.levelData.heroStartPos.x,
            targetY: this.levelData.heroStartPos.y,
            isMoving: false,
            speed: 2,
            health: 100,
            maxHealth: 100,
            level: 1,
            experience: 0
        };
        
        // Инициализируем дороги
        this.roads = this.levelData.roads;
        
        // Инициализируем позиции башен
        this.towerPositions = this.levelData.towerPositions;
        
        // Инициализируем препятствия
        this.obstacles = this.levelData.obstacles;
        
        // Инициализируем волны
        this.waves = this.levelData.waves || this.getDefaultWaves();
        
        console.log('Level initialized');
    }
    
    /**
     * Настраивает системы
     */
    setupSystems() {
        // Настраиваем менеджер волн
        waveManager.setWaves(this.waves);
        waveManager.setSpawnPoints([this.levelData.attackPoint]);
        waveManager.onEnemyKilled = (enemy, killer) => this.onEnemyKilled(enemy, killer);
        waveManager.onWaveComplete = (waveIndex) => this.onWaveComplete(waveIndex);
        waveManager.onBossSpawned = (boss) => this.onBossSpawned(boss);
        
        // Настраиваем менеджер башен
        towerManager.setTowerPositions(this.towerPositions);
        towerManager.onTowerBuilt = (tower) => this.onTowerBuilt(tower);
        towerManager.onTowerSold = (tower, price) => this.onTowerSold(tower, price);
        
        // Настраиваем экономику
        economyManager.onCoinsChanged = (coins, change, source) => this.onCoinsChanged(coins, change, source);
        economyManager.onExperienceChanged = (exp, change, source) => this.onExperienceChanged(exp, change, source);
        economyManager.onLevelUp = (level, oldExp, newExp) => this.onLevelUp(level, oldExp, newExp);
        
        console.log('Systems setup completed');
    }
    
    /**
     * Получает волны по умолчанию
     */
    getDefaultWaves() {
        return [
            {
                name: "Волна 1",
                enemies: [
                    { type: "goblin", count: 10, delay: 1000 }
                ]
            },
            {
                name: "Волна 2", 
                enemies: [
                    { type: "orc", count: 2, delay: 2000 }
                ]
            },
            {
                name: "Волна босса",
                enemies: [
                    { type: "test_boss", count: 1, delay: 0 }
                ]
            }
        ];
    }
    
    /**
     * Переключает паузу
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '▶️' : '⏸️';
    }
    
    /**
     * Переключает скорость игры
     */
    toggleSpeed() {
        this.gameSpeed = this.gameSpeed === 1 ? 2 : 1;
        this.speedBtn.textContent = this.gameSpeed === 1 ? '⚡' : '⚡⚡';
    }
    
    /**
     * Начинает волну
     */
    async startWave() {
        if (waveManager.isWaveActive()) {
            console.log('Wave already active');
            return;
        }
        
        const success = await waveManager.startNextWave();
        if (success) {
            this.startWaveBtn.disabled = true;
            this.startWaveBtn.textContent = 'Волна активна...';
            this.updateWaveUI();
        }
    }
    
    /**
     * Начинает игровой цикл
     */
    startGameLoop() {
        this.gameLoop();
    }
    
    /**
     * Останавливает игровой цикл
     */
    stopGameLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Игровой цикл
     */
    gameLoop() {
        if (!this.isPaused) {
            this.update();
        }
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Обновляет состояние игры
     */
    update() {
        // Обновляем героя
        this.updateHero();
        
        // Обновляем волны
        waveManager.update();
        
        // Обновляем башни
        towerManager.updateTowers(waveManager.getAllEnemies());
        
        // Обновляем противников
        this.updateEnemies();
    }
    
    /**
     * Обновляет героя
     */
    updateHero() {
        if (!this.hero) return;
        
        // Проверяем, достиг ли герой цели
        const dx = this.hero.targetX - this.hero.x;
        const dy = this.hero.targetY - this.hero.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.hero.isMoving = false;
            this.hero.x = this.hero.targetX;
            this.hero.y = this.hero.targetY;
        } else if (this.hero.isMoving) {
            // Двигаем героя к цели
            const moveDistance = this.hero.speed * this.gameSpeed;
            const moveX = (dx / distance) * moveDistance;
            const moveY = (dy / distance) * moveDistance;
            
            this.hero.x += moveX;
            this.hero.y += moveY;
        }
    }
    
    /**
     * Рендерит игру
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рендерим фон
        this.renderBackground();
        
        // Рендерим дороги
        this.renderRoads();
        
        // Рендерим препятствия
        this.renderObstacles();
        
        // Рендерим позиции башен
        this.renderTowerPositions();
        
        // Рендерим башни
        this.renderTowers();
        
        // Рендерим противников
        this.renderEnemies();
        
        // Рендерим доступные ходы
        this.renderAvailableMoves();
        
        // Рендерим героя
        this.renderHero();
        
        // Рендерим точки атаки и защиты
        this.renderPoints();
    }
    
    /**
     * Рендерит фон
     */
    renderBackground() {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Рендерит дороги
     */
    renderRoads() {
        this.ctx.strokeStyle = '#95a5a6';
        this.ctx.lineWidth = 8;
        this.ctx.setLineDash([10, 5]);
        
        this.roads.forEach(road => {
            this.ctx.beginPath();
            this.ctx.moveTo(road.start.x, road.start.y);
            this.ctx.lineTo(road.end.x, road.end.y);
            this.ctx.stroke();
        });
        
        this.ctx.setLineDash([]);
    }
    
    /**
     * Рендерит препятствия
     */
    renderObstacles() {
        this.ctx.fillStyle = '#7f8c8d';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    /**
     * Рендерит позиции башен
     */
    renderTowerPositions() {
        this.ctx.fillStyle = '#e74c3c';
        this.towerPositions.forEach(pos => {
            if (pos.available && !pos.hasTower) {
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#c0392b';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }
    
    /**
     * Рендерит башни
     */
    renderTowers() {
        const towers = towerManager.getAllTowers();
        towers.forEach(tower => {
            this.renderTower(tower);
        });
    }
    
    /**
     * Рендерит одну башню
     * @param {Object} tower - Башня
     */
    renderTower(tower) {
        // Рендерим основание башни
        this.ctx.fillStyle = tower.color;
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, tower.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Рендерим границу
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Рендерим иконку
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tower.icon, tower.x, tower.y);
        
        // Рендерим уровень
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(tower.level.toString(), tower.x, tower.y + 20);
        
        // Рендерим радиус атаки при наведении
        if (this.isTowerHovered(tower)) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    /**
     * Рендерит противников
     */
    renderEnemies() {
        const enemies = waveManager.getAllEnemies();
        enemies.forEach(enemy => {
            if (!enemy.isDead) {
                this.renderEnemy(enemy);
            }
        });
    }
    
    /**
     * Рендерит одного противника
     * @param {Object} enemy - Противник
     */
    renderEnemy(enemy) {
        // Рендерим тело противника
        this.ctx.fillStyle = enemy.color;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Рендерим границу
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Рендерим иконку
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(enemy.icon, enemy.x, enemy.y);
        
        // Рендерим полоску здоровья
        if (enemy.health < enemy.maxHealth) {
            const barWidth = enemy.size * 2;
            const barHeight = 4;
            const barX = enemy.x - barWidth / 2;
            const barY = enemy.y - enemy.size - 8;
            
            // Фон полоски
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Здоровье
            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
        
        // Рендерим облако текста для босса
        if (enemy.isBoss) {
            this.renderBossText(enemy);
        }
    }
    
    /**
     * Рендерит текст босса
     * @param {Object} boss - Босс
     */
    renderBossText(boss) {
        const text = `${boss.name} - ${boss.health}/${boss.maxHealth}`;
        const textWidth = this.ctx.measureText(text).width;
        const textX = boss.x - textWidth / 2;
        const textY = boss.y - boss.size - 20;
        
        // Фон облака
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(textX - 5, textY - 15, textWidth + 10, 20);
        
        // Текст
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(text, textX, textY);
    }
    
    /**
     * Проверяет, наведена ли мышь на башню
     * @param {Object} tower - Башня
     */
    isTowerHovered(tower) {
        // Простая проверка - можно улучшить
        return false;
    }
    
    /**
     * Рендерит доступные ходы
     */
    renderAvailableMoves() {
        if (this.availableMoves.length > 0) {
            this.availableMoves.forEach(move => {
                this.ctx.fillStyle = move.available ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(move.x, move.y, 25, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Пульсация
                const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
                this.ctx.globalAlpha = pulse;
                this.ctx.fillStyle = move.available ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
                this.ctx.beginPath();
                this.ctx.arc(move.x, move.y, 35, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            });
        }
    }
    
    /**
     * Рендерит героя
     */
    renderHero() {
        if (!this.hero) return;
        
        // Рендерим треугольник героя
        this.ctx.fillStyle = this.hero.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.hero.x, this.hero.y - this.hero.size);
        this.ctx.lineTo(this.hero.x - this.hero.size, this.hero.y + this.hero.size);
        this.ctx.lineTo(this.hero.x + this.hero.size, this.hero.y + this.hero.size);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Рендерим границу
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    /**
     * Рендерит точки атаки и защиты
     */
    renderPoints() {
        // Точка атаки
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(this.levelData.attackPoint.x, this.levelData.attackPoint.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Точка защиты
        this.ctx.fillStyle = '#27ae60';
        this.ctx.beginPath();
        this.ctx.arc(this.levelData.defensePoint.x, this.levelData.defensePoint.y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Обработчик клика по canvas
     * @param {MouseEvent} e - Событие мыши
     */
    onCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.handleClick(x, y);
    }
    
    /**
     * Обработчик движения мыши по canvas
     * @param {MouseEvent} e - Событие мыши
     */
    onCanvasMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.handleMouseMove(x, y);
    }
    
    /**
     * Обработчик начала касания
     * @param {TouchEvent} e - Событие касания
     */
    onCanvasTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            this.handleClick(x, y);
        }
    }
    
    /**
     * Обработчик окончания касания
     * @param {TouchEvent} e - Событие касания
     */
    onCanvasTouchEnd(e) {
        e.preventDefault();
    }
    
    /**
     * Обрабатывает клик
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    handleClick(x, y) {
        // Проверяем, кликнули ли по герою
        if (this.isPointInHero(x, y)) {
            this.selectHero();
            return;
        }
        
        // Если герой выбран, проверяем доступные ходы
        if (this.selectedHero) {
            const move = this.availableMoves.find(m => this.isPointInMove(x, y, m));
            if (move && move.available) {
                this.moveHero(move.x, move.y);
            }
        }
    }
    
    /**
     * Обрабатывает движение мыши
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    handleMouseMove(x, y) {
        // Обновляем доступные ходы при движении мыши
        if (this.selectedHero) {
            this.updateAvailableMoves(x, y);
        }
    }
    
    /**
     * Проверяет, находится ли точка в герое
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    isPointInHero(x, y) {
        if (!this.hero) return false;
        
        const dx = x - this.hero.x;
        const dy = y - this.hero.y;
        return Math.sqrt(dx * dx + dy * dy) < this.hero.size;
    }
    
    /**
     * Проверяет, находится ли точка в доступном ходе
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {Object} move - Объект хода
     */
    isPointInMove(x, y, move) {
        const dx = x - move.x;
        const dy = y - move.y;
        return Math.sqrt(dx * dx + dy * dy) < 25;
    }
    
    /**
     * Выбирает героя
     */
    selectHero() {
        this.selectedHero = true;
        this.updateAvailableMoves(this.hero.x, this.hero.y);
        console.log('Hero selected');
    }
    
    /**
     * Обновляет доступные ходы
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    updateAvailableMoves(x, y) {
        this.availableMoves = [];
        
        // Генерируем точки вокруг героя
        const radius = 100;
        const step = 20;
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const moveX = x + Math.cos(angle) * radius;
            const moveY = y + Math.sin(angle) * radius;
            
            // Проверяем, доступен ли ход
            const available = this.isMoveAvailable(moveX, moveY);
            
            this.availableMoves.push({
                x: moveX,
                y: moveY,
                available: available
            });
        }
    }
    
    /**
     * Проверяет, доступен ли ход
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    isMoveAvailable(x, y) {
        // Проверяем, не выходит ли за границы
        if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
            return false;
        }
        
        // Проверяем, не пересекается ли с препятствиями
        for (const obstacle of this.obstacles) {
            if (x >= obstacle.x && x <= obstacle.x + obstacle.width &&
                y >= obstacle.y && y <= obstacle.y + obstacle.height) {
                return false;
            }
        }
        
        // Проверяем, находится ли на дороге или рядом с ней
        return this.isNearRoad(x, y);
    }
    
    /**
     * Проверяет, находится ли точка рядом с дорогой
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    isNearRoad(x, y) {
        const roadThreshold = 50;
        
        for (const road of this.roads) {
            const distance = this.distanceToLine(x, y, road.start, road.end);
            if (distance <= roadThreshold) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Вычисляет расстояние от точки до линии
     * @param {number} x - X координата точки
     * @param {number} y - Y координата точки
     * @param {Object} lineStart - Начало линии
     * @param {Object} lineEnd - Конец линии
     */
    distanceToLine(x, y, lineStart, lineEnd) {
        const A = x - lineStart.x;
        const B = y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            return Math.sqrt(A * A + B * B);
        }
        
        const param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }
        
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Перемещает героя
     * @param {number} x - X координата цели
     * @param {number} y - Y координата цели
     */
    moveHero(x, y) {
        if (!this.hero) return;
        
        this.hero.targetX = x;
        this.hero.targetY = y;
        this.hero.isMoving = true;
        this.selectedHero = false;
        this.availableMoves = [];
        
        console.log(`Hero moving to (${x}, ${y})`);
    }
    
    /**
     * Обновляет противников
     */
    updateEnemies() {
        const enemies = waveManager.getAllEnemies();
        enemies.forEach(enemy => {
            if (!enemy.isDead) {
                this.updateEnemy(enemy);
            }
        });
    }
    
    /**
     * Обновляет одного противника
     * @param {Object} enemy - Противник
     */
    updateEnemy(enemy) {
        // Простое движение к точке защиты
        const dx = this.levelData.defensePoint.x - enemy.x;
        const dy = this.levelData.defensePoint.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            const moveDistance = enemy.speed;
            enemy.x += (dx / distance) * moveDistance;
            enemy.y += (dy / distance) * moveDistance;
        } else {
            // Противник достиг точки защиты
            this.onEnemyReachedDefense(enemy);
        }
    }
    
    /**
     * Обработчик убийства противника
     * @param {Object} enemy - Противник
     * @param {Object} killer - Кто убил
     */
    onEnemyKilled(enemy, killer) {
        // Добавляем монеты
        economyManager.addCoins(enemy.coins, `Kill ${enemy.name}`);
        
        // Если убил герой, добавляем опыт
        if (killer && killer === this.hero) {
            economyManager.addExperience(enemy.experience, `Kill ${enemy.name}`);
        }
        
        console.log(`Enemy killed: ${enemy.name}, coins: +${enemy.coins}`);
    }
    
    /**
     * Обработчик завершения волны
     * @param {number} waveIndex - Индекс волны
     */
    onWaveComplete(waveIndex) {
        console.log(`Wave ${waveIndex + 1} completed`);
        
        // Добавляем бонусные монеты за завершение волны
        const bonusCoins = 50 + (waveIndex + 1) * 25;
        economyManager.addCoins(bonusCoins, `Wave ${waveIndex + 1} bonus`);
        
        // Обновляем UI
        this.updateWaveUI();
        
        // Автоматически начинаем следующую волну через 3 секунды
        setTimeout(() => {
            waveManager.startNextWave();
        }, 3000);
    }
    
    /**
     * Обработчик появления босса
     * @param {Object} boss - Босс
     */
    onBossSpawned(boss) {
        console.log(`Boss spawned: ${boss.name}`);
        
        // Фокусируем камеру на боссе
        this.focusOnBoss(boss);
    }
    
    /**
     * Обработчик достижения противником точки защиты
     * @param {Object} enemy - Противник
     */
    onEnemyReachedDefense(enemy) {
        console.log(`Enemy reached defense: ${enemy.name}`);
        
        // Наносим урон герою
        if (this.hero) {
            this.hero.health -= enemy.damage;
            console.log(`Hero takes ${enemy.damage} damage, health: ${this.hero.health}`);
            
            if (this.hero.health <= 0) {
                this.gameOver();
            }
        }
        
        // Удаляем противника
        waveManager.killEnemy(enemy);
    }
    
    /**
     * Обработчик постройки башни
     * @param {Object} tower - Башня
     */
    onTowerBuilt(tower) {
        console.log(`Tower built: ${tower.name}`);
    }
    
    /**
     * Обработчик продажи башни
     * @param {Object} tower - Башня
     * @param {number} price - Цена продажи
     */
    onTowerSold(tower, price) {
        console.log(`Tower sold: ${tower.name} for ${price} coins`);
    }
    
    /**
     * Обработчик изменения монет
     * @param {number} coins - Количество монет
     * @param {number} change - Изменение
     * @param {string} source - Источник
     */
    onCoinsChanged(coins, change, source) {
        // Обновляем UI
        this.updateUI();
    }
    
    /**
     * Обработчик изменения опыта
     * @param {number} exp - Опыт
     * @param {number} change - Изменение
     * @param {string} source - Источник
     */
    onExperienceChanged(exp, change, source) {
        // Обновляем UI
        this.updateUI();
    }
    
    /**
     * Обработчик повышения уровня
     * @param {number} level - Новый уровень
     * @param {number} oldExp - Старый опыт
     * @param {number} newExp - Новый опыт
     */
    onLevelUp(level, oldExp, newExp) {
        console.log(`Hero leveled up to level ${level}`);
        
        // Улучшаем героя
        if (this.hero) {
            this.hero.level = level;
            this.hero.maxHealth += 20;
            this.hero.health = this.hero.maxHealth;
        }
        
        // Обновляем UI
        this.updateUI();
    }
    
    /**
     * Фокусирует камеру на боссе
     * @param {Object} boss - Босс
     */
    focusOnBoss(boss) {
        // Простая реализация - можно расширить
        console.log(`Focusing camera on boss: ${boss.name}`);
    }
    
    /**
     * Обновляет UI
     */
    updateUI() {
        // Обновляем информацию о герое
        if (this.hero) {
            const heroHealth = this.levelElement.querySelector('.hero-health');
            const heroMana = this.levelElement.querySelector('.hero-mana');
            const heroLevel = this.levelElement.querySelector('.hero-level');
            
            if (heroHealth) {
                heroHealth.textContent = `❤️ ${this.hero.health}/${this.hero.maxHealth}`;
            }
            
            if (heroMana) {
                heroMana.textContent = `💙 ${economyManager.getCoins()}`;
            }
            
            if (heroLevel) {
                heroLevel.textContent = `⭐ ${this.hero.level}`;
            }
        }
        
        this.updateWaveUI();
    }
    
    /**
     * Обновляет UI волн
     */
    updateWaveUI() {
        if (this.waveTitle) {
            const currentWave = waveManager.getCurrentWave();
            const maxWaves = waveManager.getMaxWaves();
            this.waveTitle.textContent = `Волна: ${currentWave}/${maxWaves}`;
        }
        
        // Обновляем кнопку начала волны
        if (this.startWaveBtn) {
            if (waveManager.isWaveActive()) {
                this.startWaveBtn.disabled = true;
                this.startWaveBtn.textContent = 'Волна активна...';
            } else if (waveManager.getCurrentWave() >= waveManager.getMaxWaves()) {
                this.startWaveBtn.disabled = true;
                this.startWaveBtn.textContent = 'Все волны завершены';
            } else {
                this.startWaveBtn.disabled = false;
                this.startWaveBtn.textContent = 'Начать волну';
            }
        }
    }
    
    /**
     * Конец игры
     */
    gameOver() {
        console.log('Game Over');
        // Здесь можно добавить экран поражения
    }
}

// Регистрируем контроллер экрана уровня
document.addEventListener('DOMContentLoaded', () => {
    const levelScreenController = new LevelScreenController();
    screenManager.registerScreen('level-screen', levelScreenController);
});