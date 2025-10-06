/**
 * Контроллер экрана загрузки
 */
class LoadingScreenController {
    constructor() {
        this.loadingElement = document.getElementById('loading-screen');
        this.loadingText = this.loadingElement.querySelector('.loading-text');
        this.loadingSpinner = this.loadingElement.querySelector('.loading-spinner');
        this.isLoading = false;
    }
    
    /**
     * Загружает экран
     * @param {Object} data - Данные для загрузки
     */
    async load(data = {}) {
        console.log('Loading screen loaded');
        this.isLoading = true;
        
        // Добавляем ресурсы для загрузки
        this.addGameResources();
        
        // Начинаем загрузку
        await this.startLoading(data.nextScreen || 'main-menu');
    }
    
    /**
     * Активирует экран
     * @param {Object} data - Данные для активации
     */
    async activate(data = {}) {
        console.log('Loading screen activated');
        this.updateLoadingText('Подготовка игры...');
    }
    
    /**
     * Деактивирует экран
     */
    async deactivate() {
        console.log('Loading screen deactivated');
        this.isLoading = false;
    }
    
    /**
     * Выгружает экран
     */
    async unload() {
        console.log('Loading screen unloaded');
        this.isLoading = false;
    }
    
    /**
     * Добавляет ресурсы игры для загрузки
     */
    addGameResources() {
        // Основные изображения
        gameLoader.addResource('main-bg', 'image', 'images/main.png');
        gameLoader.addResource('light-faction', 'image', 'images/light-faction.png');
        gameLoader.addResource('dark-faction', 'image', 'images/dark-faction.png');
        
        // Иконки и UI элементы
        gameLoader.addResource('hero-icon', 'image', 'images/hero-icon.png');
        gameLoader.addResource('tower-icon', 'image', 'images/tower-icon.png');
        gameLoader.addResource('enemy-icon', 'image', 'images/enemy-icon.png');
        
        // Звуки (если есть)
        // gameLoader.addResource('bg-music', 'audio', 'audio/background-music.mp3');
        // gameLoader.addResource('click-sound', 'audio', 'audio/click.wav');
        
        // Конфигурационные файлы
        gameLoader.addResource('game-config', 'json', 'data/game-config.json');
        gameLoader.addResource('levels-data', 'json', 'data/levels.json');
    }
    
    /**
     * Начинает процесс загрузки
     * @param {string} nextScreen - Следующий экран для перехода
     */
    async startLoading(nextScreen) {
        try {
            // Загружаем ресурсы с отслеживанием прогресса
            await gameLoader.loadAll((progress, loaded, total) => {
                this.updateLoadingProgress(progress, loaded, total);
            });
            
            // Имитируем дополнительное время загрузки для плавности
            await this.delay(500);
            
            // Переходим к следующему экрану
            await screenManager.switchTo(nextScreen);
            
        } catch (error) {
            console.error('Loading failed:', error);
            this.updateLoadingText('Ошибка загрузки. Попробуйте еще раз.');
            
            // Через 3 секунды пытаемся загрузить снова
            setTimeout(() => {
                this.startLoading(nextScreen);
            }, 3000);
        }
    }
    
    /**
     * Обновляет прогресс загрузки
     * @param {number} progress - Процент загрузки
     * @param {number} loaded - Количество загруженных ресурсов
     * @param {number} total - Общее количество ресурсов
     */
    updateLoadingProgress(progress, loaded, total) {
        const progressPercent = Math.round(progress);
        this.updateLoadingText(`Загрузка... ${progressPercent}% (${loaded}/${total})`);
        
        // Анимация спиннера
        this.loadingSpinner.style.transform = `rotate(${progress * 3.6}deg)`;
    }
    
    /**
     * Обновляет текст загрузки
     * @param {string} text - Новый текст
     */
    updateLoadingText(text) {
        this.loadingText.textContent = text;
    }
    
    /**
     * Задержка выполнения
     * @param {number} ms - Миллисекунды
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Регистрируем контроллер экрана загрузки
document.addEventListener('DOMContentLoaded', () => {
    const loadingController = new LoadingScreenController();
    screenManager.registerScreen('loading-screen', loadingController);
});