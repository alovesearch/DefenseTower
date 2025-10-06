/**
 * Универсальная система управления экранами
 * Обеспечивает переключение между экранами с освобождением памяти
 */
class ScreenManager {
    constructor() {
        this.screens = new Map();
        this.currentScreen = null;
        this.previousScreen = null;
        this.screenHistory = [];
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Находим все экраны
        const screenElements = document.querySelectorAll('.screen');
        screenElements.forEach(screen => {
            const screenId = screen.id;
            this.screens.set(screenId, {
                element: screen,
                controller: null,
                isLoaded: false,
                isActive: false
            });
        });
        
        console.log('ScreenManager initialized with screens:', Array.from(this.screens.keys()));
    }
    
    /**
     * Регистрирует контроллер экрана
     * @param {string} screenId - ID экрана
     * @param {Object} controller - Контроллер экрана
     */
    registerScreen(screenId, controller) {
        if (this.screens.has(screenId)) {
            this.screens.get(screenId).controller = controller;
            console.log(`Screen controller registered: ${screenId}`);
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    }
    
    /**
     * Переключает на указанный экран
     * @param {string} screenId - ID экрана для переключения
     * @param {Object} data - Данные для передачи экрану
     * @param {boolean} addToHistory - Добавить в историю
     * @param {boolean} isModal - Является ли экран модальным
     */
    async switchTo(screenId, data = {}, addToHistory = true, isModal = false) {
        if (this.isTransitioning) {
            console.warn('Transition already in progress, queuing transition to:', screenId);
            // Добавляем переход в очередь
            setTimeout(() => this.switchTo(screenId, data, addToHistory, isModal), 100);
            return;
        }
        
        if (!this.screens.has(screenId)) {
            console.error(`Screen not found: ${screenId}`);
            return;
        }
        
        this.isTransitioning = true;
        
        try {
            // Для модальных экранов не деактивируем текущий экран
            if (!isModal) {
                // Сохраняем предыдущий экран
                if (this.currentScreen && addToHistory) {
                    this.previousScreen = this.currentScreen;
                    this.screenHistory.push(this.currentScreen);
                }
                
                // Деактивируем текущий экран
                if (this.currentScreen) {
                    await this.deactivateScreen(this.currentScreen);
                }
            }
            
            // Активируем новый экран
            this.currentScreen = screenId;
            await this.activateScreen(screenId, data);
            
            console.log(`Switched to screen: ${screenId}${isModal ? ' (modal)' : ''}`);
            
        } catch (error) {
            console.error('Error switching screen:', error);
        } finally {
            this.isTransitioning = false;
        }
    }
    
    /**
     * Возвращается к предыдущему экрану
     */
    async goBack() {
        if (this.screenHistory.length > 0) {
            const previousScreen = this.screenHistory.pop();
            await this.switchTo(previousScreen, {}, false);
        }
    }
    
    /**
     * Закрывает модальный экран
     */
    async closeModal() {
        if (this.currentScreen) {
            await this.deactivateScreen(this.currentScreen);
            this.currentScreen = null;
        }
    }
    
    /**
     * Активирует экран
     * @param {string} screenId - ID экрана
     * @param {Object} data - Данные для экрана
     */
    async activateScreen(screenId, data = {}) {
        const screen = this.screens.get(screenId);
        if (!screen) return;
        
        // Показываем экран
        screen.element.classList.add('active');
        screen.isActive = true;
        
        // Загружаем экран если не загружен
        if (!screen.isLoaded && screen.controller) {
            await screen.controller.load(data);
            screen.isLoaded = true;
        }
        
        // Активируем экран
        if (screen.controller && screen.controller.activate) {
            await screen.controller.activate(data);
        }
    }
    
    /**
     * Деактивирует экран
     * @param {string} screenId - ID экрана
     */
    async deactivateScreen(screenId) {
        const screen = this.screens.get(screenId);
        if (!screen) return;
        
        // Деактивируем контроллер
        if (screen.controller && screen.controller.deactivate) {
            await screen.controller.deactivate();
        }
        
        // Скрываем экран
        screen.element.classList.remove('active');
        screen.isActive = false;
    }
    
    /**
     * Выгружает экран из памяти
     * @param {string} screenId - ID экрана
     */
    async unloadScreen(screenId) {
        const screen = this.screens.get(screenId);
        if (!screen) return;
        
        // Деактивируем если активен
        if (screen.isActive) {
            await this.deactivateScreen(screenId);
        }
        
        // Выгружаем контроллер
        if (screen.controller && screen.controller.unload) {
            await screen.controller.unload();
        }
        
        screen.isLoaded = false;
        console.log(`Screen unloaded: ${screenId}`);
    }
    
    /**
     * Очищает историю экранов
     */
    clearHistory() {
        this.screenHistory = [];
        this.previousScreen = null;
    }
    
    /**
     * Получает текущий экран
     */
    getCurrentScreen() {
        return this.currentScreen;
    }
    
    /**
     * Проверяет, активен ли экран
     * @param {string} screenId - ID экрана
     */
    isScreenActive(screenId) {
        const screen = this.screens.get(screenId);
        return screen ? screen.isActive : false;
    }
    
    /**
     * Очищает память от неиспользуемых экранов
     */
    async cleanupMemory() {
        const activeScreen = this.currentScreen;
        const historyScreens = [...this.screenHistory, this.previousScreen].filter(Boolean);
        const protectedScreens = new Set([activeScreen, ...historyScreens]);
        
        for (const [screenId, screen] of this.screens) {
            if (!protectedScreens.has(screenId) && screen.isLoaded) {
                await this.unloadScreen(screenId);
            }
        }
        
        console.log('Memory cleanup completed');
    }
}

// Создаем глобальный экземпляр менеджера экранов
window.screenManager = new ScreenManager();