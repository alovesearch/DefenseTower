/**
 * Контроллер главного меню
 */
class MainMenuController {
    constructor() {
        this.menuElement = document.getElementById('main-menu');
        this.logoSection = this.menuElement.querySelector('.logo-section');
        this.factionSelection = this.menuElement.querySelector('.faction-selection');
        this.factionSides = this.menuElement.querySelectorAll('.faction-side');
        this.confirmButton = this.menuElement.querySelector('.confirm-button');
        this.confirmBtn = this.menuElement.querySelector('#confirm-faction');
        
        this.selectedFaction = null;
        this.isInitialized = false;
        
        this.bindEvents();
    }
    
    /**
     * Загружает экран
     * @param {Object} data - Данные для загрузки
     */
    async load(data = {}) {
        console.log('Main menu loaded');
        this.isInitialized = true;
        
        // Сбрасываем состояние
        this.resetMenu();
        
        // Устанавливаем фоновое изображение если загружено
        const mainBg = gameLoader.getResource('main-bg');
        if (mainBg) {
            this.setBackgroundImage(mainBg);
        }
    }
    
    /**
     * Активирует экран
     * @param {Object} data - Данные для активации
     */
    async activate(data = {}) {
        console.log('Main menu activated');
        
        // Показываем начальное состояние
        this.showLogoSection();
    }
    
    /**
     * Деактивирует экран
     */
    async deactivate() {
        console.log('Main menu deactivated');
        this.resetMenu();
    }
    
    /**
     * Выгружает экран
     */
    async unload() {
        console.log('Main menu unloaded');
        this.isInitialized = false;
    }
    
    /**
     * Привязывает события
     */
    bindEvents() {
        // Клик по логотипу для начала игры
        this.logoSection.addEventListener('click', () => {
            if (this.logoSection.style.display !== 'none') {
                this.startFactionSelection();
            }
        });
        
        // Клики по сторонам фракций
        this.factionSides.forEach(side => {
            side.addEventListener('click', () => {
                const faction = side.dataset.faction;
                this.selectFaction(faction);
            });
        });
        
        // Подтверждение выбора фракции
        this.confirmBtn.addEventListener('click', () => {
            this.confirmFactionSelection();
        });
    }
    
    /**
     * Сбрасывает меню в начальное состояние
     */
    resetMenu() {
        this.selectedFaction = null;
        this.showLogoSection();
        this.hideFactionSelection();
        this.clearFactionSelection();
    }
    
    /**
     * Показывает секцию с логотипом
     */
    showLogoSection() {
        this.logoSection.style.display = 'block';
        this.factionSelection.style.display = 'none';
    }
    
    /**
     * Скрывает секцию с логотипом
     */
    hideLogoSection() {
        this.logoSection.style.display = 'none';
    }
    
    /**
     * Показывает выбор фракции
     */
    showFactionSelection() {
        this.factionSelection.style.display = 'block';
    }
    
    /**
     * Скрывает выбор фракции
     */
    hideFactionSelection() {
        this.factionSelection.style.display = 'none';
    }
    
    /**
     * Начинает выбор фракции
     */
    startFactionSelection() {
        this.hideLogoSection();
        this.showFactionSelection();
        this.updateFactionLabels();
    }
    
    /**
     * Обновляет подписи фракций
     */
    updateFactionLabels() {
        const lightSide = this.menuElement.querySelector('.light-side');
        const darkSide = this.menuElement.querySelector('.dark-side');
        
        lightSide.querySelector('.faction-label').textContent = 'Свет';
        darkSide.querySelector('.faction-label').textContent = 'Тьма';
    }
    
    /**
     * Выбирает фракцию
     * @param {string} faction - ID фракции
     */
    selectFaction(faction) {
        if (this.selectedFaction === faction) return;
        
        this.selectedFaction = faction;
        this.updateFactionDisplay();
        this.showConfirmButton();
    }
    
    /**
     * Обновляет отображение выбора фракции
     */
    updateFactionDisplay() {
        this.factionSides.forEach(side => {
            const faction = side.dataset.faction;
            
            if (faction === this.selectedFaction) {
                side.classList.add('selected');
                side.classList.remove('dimmed');
                side.querySelector('.faction-lore').style.display = 'none';
            } else {
                side.classList.remove('selected');
                side.classList.add('dimmed');
                side.querySelector('.faction-lore').style.display = 'block';
            }
        });
    }
    
    /**
     * Очищает выбор фракции
     */
    clearFactionSelection() {
        this.factionSides.forEach(side => {
            side.classList.remove('selected', 'dimmed');
            side.querySelector('.faction-lore').style.display = 'none';
        });
        this.hideConfirmButton();
    }
    
    /**
     * Показывает кнопку подтверждения
     */
    showConfirmButton() {
        this.confirmButton.style.display = 'block';
    }
    
    /**
     * Скрывает кнопку подтверждения
     */
    hideConfirmButton() {
        this.confirmButton.style.display = 'none';
    }
    
    /**
     * Подтверждает выбор фракции
     */
    async confirmFactionSelection() {
        if (!this.selectedFaction) return;
        
        console.log(`Faction selected: ${this.selectedFaction}`);
        
        // Создаем новое сохранение
        const saveData = {
            faction: this.selectedFaction,
            level: 1,
            timestamp: Date.now(),
            progress: 0
        };
        
        this.saveGameData(saveData);
        
        // Переходим к экрану карты
        await screenManager.switchTo('map-screen', { faction: this.selectedFaction });
    }
    
    /**
     * Сохраняет данные игры
     * @param {Object} saveData - Данные для сохранения
     */
    saveGameData(saveData) {
        try {
            localStorage.setItem('towerDefenseSave', JSON.stringify(saveData));
            console.log('Game data saved:', saveData);
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }
    
    /**
     * Загружает данные игры
     */
    loadGameData() {
        try {
            const saveData = localStorage.getItem('towerDefenseSave');
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('Failed to load game data:', error);
            return null;
        }
    }
    
    /**
     * Устанавливает фоновое изображение
     * @param {Image} image - Изображение для фона
     */
    setBackgroundImage(image) {
        this.factionSides.forEach(side => {
            side.style.backgroundImage = `url(${image.src})`;
            side.style.backgroundSize = 'cover';
            side.style.backgroundPosition = 'center';
        });
    }
}

// Регистрируем контроллер главного меню
document.addEventListener('DOMContentLoaded', () => {
    const mainMenuController = new MainMenuController();
    screenManager.registerScreen('main-menu', mainMenuController);
});