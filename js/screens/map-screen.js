/**
 * Контроллер экрана карты
 */
class MapScreenController {
    constructor() {
        this.mapElement = document.getElementById('map-screen');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.settingsBtn = document.getElementById('settings-btn');
        this.factionIndicator = this.mapElement.querySelector('.faction-indicator');
        this.mapTitle = this.mapElement.querySelector('.map-title');
        
        this.currentFaction = null;
        this.mapData = null;
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        this.bindEvents();
        this.setupCanvas();
    }
    
    /**
     * Загружает экран
     * @param {Object} data - Данные для загрузки
     */
    async load(data = {}) {
        console.log('Map screen loaded');
        this.currentFaction = data.faction || 'light';
        
        // Загружаем данные карты в зависимости от фракции
        await this.loadMapData();
        
        // Настраиваем UI
        this.setupUI();
    }
    
    /**
     * Активирует экран
     * @param {Object} data - Данные для активации
     */
    async activate(data = {}) {
        console.log('Map screen activated');
        this.startRenderLoop();
    }
    
    /**
     * Деактивирует экран
     */
    async deactivate() {
        console.log('Map screen deactivated');
        this.stopRenderLoop();
    }
    
    /**
     * Выгружает экран
     */
    async unload() {
        console.log('Map screen unloaded');
        this.stopRenderLoop();
        this.mapData = null;
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
        // Кнопка настроек
        this.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });
        
        // События мыши для перемещения карты
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        
        // События касания для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }
    
    /**
     * Загружает данные карты
     */
    async loadMapData() {
        // Загружаем конфигурацию карты в зависимости от фракции
        const mapConfig = this.getMapConfig(this.currentFaction);
        this.mapData = mapConfig;
        
        console.log(`Map data loaded for faction: ${this.currentFaction}`);
    }
    
    /**
     * Получает конфигурацию карты для фракции
     * @param {string} faction - Фракция
     */
    getMapConfig(faction) {
        const baseConfig = {
            width: 2000,
            height: 1200,
            startPosition: { x: 100, y: 600 },
            levels: [
                { id: 1, x: 300, y: 200, unlocked: true, completed: false },
                { id: 2, x: 600, y: 400, unlocked: false, completed: false },
                { id: 3, x: 900, y: 300, unlocked: false, completed: false },
                { id: 4, x: 1200, y: 500, unlocked: false, completed: false },
                { id: 5, x: 1500, y: 250, unlocked: false, completed: false }
            ]
        };
        
        if (faction === 'light') {
            return {
                ...baseConfig,
                background: '#74b9ff',
                levelColor: '#0984e3',
                levelCompletedColor: '#00b894'
            };
        } else {
            return {
                ...baseConfig,
                background: '#6c5ce7',
                levelColor: '#2d3436',
                levelCompletedColor: '#e17055'
            };
        }
    }
    
    /**
     * Настраивает UI
     */
    setupUI() {
        // Устанавливаем индикатор фракции
        this.factionIndicator.className = `faction-indicator ${this.currentFaction}`;
        
        // Устанавливаем заголовок карты
        const factionName = this.currentFaction === 'light' ? 'Свет' : 'Тьма';
        this.mapTitle.textContent = `Карта мира - ${factionName}`;
    }
    
    /**
     * Открывает настройки
     */
    async openSettings() {
        await screenManager.switchTo('settings-screen');
    }
    
    /**
     * Начинает цикл рендеринга
     */
    startRenderLoop() {
        this.renderLoop();
    }
    
    /**
     * Останавливает цикл рендеринга
     */
    stopRenderLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Цикл рендеринга
     */
    renderLoop() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.renderLoop());
    }
    
    /**
     * Рендерит карту
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.mapData) return;
        
        // Сохраняем контекст
        this.ctx.save();
        
        // Применяем камеру
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Рендерим фон карты
        this.renderMapBackground();
        
        // Рендерим уровни
        this.renderLevels();
        
        // Рендерим начальную позицию
        this.renderStartPosition();
        
        // Восстанавливаем контекст
        this.ctx.restore();
    }
    
    /**
     * Рендерит фон карты
     */
    renderMapBackground() {
        this.ctx.fillStyle = this.mapData.background;
        this.ctx.fillRect(0, 0, this.mapData.width, this.mapData.height);
        
        // Добавляем сетку
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < this.mapData.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.mapData.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.mapData.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.mapData.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Рендерит уровни
     */
    renderLevels() {
        this.mapData.levels.forEach(level => {
            this.renderLevel(level);
        });
    }
    
    /**
     * Рендерит отдельный уровень
     * @param {Object} level - Данные уровня
     */
    renderLevel(level) {
        const x = level.x;
        const y = level.y;
        const radius = 30;
        
        // Цвет в зависимости от состояния
        let color = this.mapData.levelColor;
        if (level.completed) {
            color = this.mapData.levelCompletedColor;
        } else if (!level.unlocked) {
            color = '#636e72';
        }
        
        // Рендерим круг уровня
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Рендерим границу
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Рендерим номер уровня
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(level.id.toString(), x, y);
        
        // Рендерим линии соединения
        if (level.unlocked && level.id > 1) {
            const prevLevel = this.mapData.levels.find(l => l.id === level.id - 1);
            if (prevLevel && prevLevel.unlocked) {
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(prevLevel.x, prevLevel.y);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
        }
    }
    
    /**
     * Рендерит начальную позицию
     */
    renderStartPosition() {
        const pos = this.mapData.startPosition;
        const radius = 25;
        
        // Рендерим круг начальной позиции
        this.ctx.fillStyle = '#f39c12';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Рендерим границу
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Рендерим иконку
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🏠', pos.x, pos.y);
    }
    
    /**
     * Обработчик нажатия мыши
     * @param {MouseEvent} e - Событие мыши
     */
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
    
    /**
     * Обработчик движения мыши
     * @param {MouseEvent} e - Событие мыши
     */
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMousePos.x;
        const deltaY = e.clientY - this.lastMousePos.y;
        
        this.camera.x -= deltaX;
        this.camera.y -= deltaY;
        
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
    
    /**
     * Обработчик отпускания мыши
     * @param {MouseEvent} e - Событие мыши
     */
    onMouseUp(e) {
        this.isDragging = false;
    }
    
    /**
     * Обработчик колесика мыши
     * @param {WheelEvent} e - Событие колесика
     */
    onWheel(e) {
        e.preventDefault();
        
        const zoomFactor = 0.1;
        const zoom = e.deltaY > 0 ? 1 - zoomFactor : 1 + zoomFactor;
        
        this.camera.zoom = Math.max(0.5, Math.min(2, this.camera.zoom * zoom));
    }
    
    /**
     * Обработчик начала касания
     * @param {TouchEvent} e - Событие касания
     */
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }
    
    /**
     * Обработчик движения касания
     * @param {TouchEvent} e - Событие касания
     */
    onTouchMove(e) {
        e.preventDefault();
        if (this.isDragging && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - this.lastMousePos.x;
            const deltaY = e.touches[0].clientY - this.lastMousePos.y;
            
            this.camera.x -= deltaX;
            this.camera.y -= deltaY;
            
            this.lastMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }
    
    /**
     * Обработчик окончания касания
     * @param {TouchEvent} e - Событие касания
     */
    onTouchEnd(e) {
        e.preventDefault();
        this.isDragging = false;
    }
}

// Регистрируем контроллер экрана карты
document.addEventListener('DOMContentLoaded', () => {
    const mapScreenController = new MapScreenController();
    screenManager.registerScreen('map-screen', mapScreenController);
});