/**
 * Главный файл приложения
 */
class GameApp {
    constructor() {
        this.isInitialized = false;
        this.currentFaction = null;
        
        this.init();
    }
    
    /**
     * Инициализирует приложение
     */
    async init() {
        console.log('Initializing Tower Defense PWA...');
        
        try {
            // Регистрируем Service Worker для PWA
            await this.registerServiceWorker();
            
            // Инициализируем приложение
            await this.initializeApp();
            
            // Запускаем игру
            await this.startGame();
            
            this.isInitialized = true;
            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
    
    /**
     * Регистрирует Service Worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
    
    /**
     * Инициализирует приложение
     */
    async initializeApp() {
        // Проверяем ориентацию экрана
        this.checkOrientation();
        
        // Добавляем обработчики событий
        this.bindEvents();
        
        // Загружаем сохраненные данные
        this.loadSavedData();
    }
    
    /**
     * Запускает игру
     */
    async startGame() {
        // Начинаем с экрана загрузки
        await screenManager.switchTo('loading-screen', {
            nextScreen: 'main-menu'
        });
    }
    
    /**
     * Проверяет ориентацию экрана
     */
    checkOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isPortrait) {
            console.warn('Game requires landscape orientation');
            // Показываем предупреждение о необходимости поворота экрана
            this.showOrientationWarning();
        }
        
        // Слушаем изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const isPortrait = window.innerHeight > window.innerWidth;
                if (isPortrait) {
                    this.showOrientationWarning();
                } else {
                    this.hideOrientationWarning();
                }
            }, 100);
        });
    }
    
    /**
     * Показывает предупреждение об ориентации
     */
    showOrientationWarning() {
        let warning = document.getElementById('orientation-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'orientation-warning';
            warning.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #1a1a1a;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    z-index: 9999;
                    text-align: center;
                    padding: 20px;
                ">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
                        <div>Поверните устройство в горизонтальное положение</div>
                        <div style="font-size: 14px; margin-top: 10px; color: #bdc3c7;">
                            Игра работает только в горизонтальном режиме
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(warning);
        }
    }
    
    /**
     * Скрывает предупреждение об ориентации
     */
    hideOrientationWarning() {
        const warning = document.getElementById('orientation-warning');
        if (warning) {
            warning.remove();
        }
    }
    
    /**
     * Привязывает события
     */
    bindEvents() {
        // Предотвращаем контекстное меню
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Предотвращаем выделение текста
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
        
        // Предотвращаем перетаскивание
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Обработка потери фокуса
        window.addEventListener('blur', () => {
            this.handleBlur();
        });
        
        // Обработка получения фокуса
        window.addEventListener('focus', () => {
            this.handleFocus();
        });
    }
    
    /**
     * Загружает сохраненные данные
     */
    loadSavedData() {
        try {
            const saveData = localStorage.getItem('towerDefenseSave');
            if (saveData) {
                const data = JSON.parse(saveData);
                this.currentFaction = data.faction;
                console.log('Loaded saved data:', data);
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
        }
    }
    
    /**
     * Сохраняет данные игры
     * @param {Object} data - Данные для сохранения
     */
    saveGameData(data) {
        try {
            localStorage.setItem('towerDefenseSave', JSON.stringify(data));
            console.log('Game data saved:', data);
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }
    
    /**
     * Обрабатывает изменение размера окна
     */
    handleResize() {
        // Обновляем размеры canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Проверяем ориентацию
        this.checkOrientation();
    }
    
    /**
     * Обрабатывает потерю фокуса
     */
    handleBlur() {
        console.log('Window lost focus');
        // Можно добавить паузу игры или другие действия
    }
    
    /**
     * Обрабатывает получение фокуса
     */
    handleFocus() {
        console.log('Window gained focus');
        // Можно возобновить игру или другие действия
    }
    
    /**
     * Получает текущую фракцию
     */
    getCurrentFaction() {
        return this.currentFaction;
    }
    
    /**
     * Устанавливает текущую фракцию
     * @param {string} faction - Фракция
     */
    setCurrentFaction(faction) {
        this.currentFaction = faction;
    }
    
    /**
     * Запускает уровень
     * @param {number} levelId - ID уровня
     */
    async startLevel(levelId) {
        console.log(`Starting level ${levelId}`);
        
        // Загружаем данные уровня
        const levelData = this.getLevelData(levelId);
        
        // Переключаемся на экран уровня
        await screenManager.switchTo('level-screen', {
            levelData: levelData
        });
    }
    
    /**
     * Получает данные уровня
     * @param {number} levelId - ID уровня
     */
    getLevelData(levelId) {
        // Здесь можно загружать данные уровня из файлов или API
        // Пока возвращаем базовые данные
        return {
            id: levelId,
            name: `Уровень ${levelId}`,
            // ... другие данные уровня
        };
    }
}

// Создаем глобальный экземпляр приложения
window.gameApp = new GameApp();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameApp;
}