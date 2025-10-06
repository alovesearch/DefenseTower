/**
 * Менеджер экономики игры
 */
class EconomyManager {
    constructor() {
        this.coins = 100; // Начальные монеты
        this.experience = 0; // Опыт героя
        this.level = 1; // Уровень героя
        this.experienceToNextLevel = 100; // Опыт до следующего уровня
        
        this.onCoinsChanged = null;
        this.onExperienceChanged = null;
        this.onLevelUp = null;
        
        console.log('Economy manager initialized');
    }
    
    /**
     * Добавляет монеты
     * @param {number} amount - Количество монет
     * @param {string} source - Источник монет
     */
    addCoins(amount, source = 'unknown') {
        this.coins += amount;
        console.log(`Coins added: +${amount} (${source}), total: ${this.coins}`);
        
        if (this.onCoinsChanged) {
            this.onCoinsChanged(this.coins, amount, source);
        }
    }
    
    /**
     * Тратит монеты
     * @param {number} amount - Количество монет
     * @param {string} purpose - Назначение трат
     */
    spendCoins(amount, purpose = 'unknown') {
        if (this.coins >= amount) {
            this.coins -= amount;
            console.log(`Coins spent: -${amount} (${purpose}), remaining: ${this.coins}`);
            
            if (this.onCoinsChanged) {
                this.onCoinsChanged(this.coins, -amount, purpose);
            }
            
            return true;
        } else {
            console.log(`Not enough coins: need ${amount}, have ${this.coins}`);
            return false;
        }
    }
    
    /**
     * Проверяет, достаточно ли монет
     * @param {number} amount - Количество монет
     */
    hasEnoughCoins(amount) {
        return this.coins >= amount;
    }
    
    /**
     * Добавляет опыт
     * @param {number} amount - Количество опыта
     * @param {string} source - Источник опыта
     */
    addExperience(amount, source = 'unknown') {
        this.experience += amount;
        console.log(`Experience added: +${amount} (${source}), total: ${this.experience}`);
        
        // Проверяем повышение уровня
        this.checkLevelUp();
        
        if (this.onExperienceChanged) {
            this.onExperienceChanged(this.experience, amount, source);
        }
    }
    
    /**
     * Проверяет повышение уровня
     */
    checkLevelUp() {
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    /**
     * Повышает уровень
     */
    levelUp() {
        this.level++;
        const oldExp = this.experienceToNextLevel;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        console.log(`Level up! New level: ${this.level}, exp needed: ${this.experienceToNextLevel}`);
        
        if (this.onLevelUp) {
            this.onLevelUp(this.level, oldExp, this.experienceToNextLevel);
        }
    }
    
    /**
     * Получает текущее количество монет
     */
    getCoins() {
        return this.coins;
    }
    
    /**
     * Получает текущий опыт
     */
    getExperience() {
        return this.experience;
    }
    
    /**
     * Получает текущий уровень
     */
    getLevel() {
        return this.level;
    }
    
    /**
     * Получает опыт до следующего уровня
     */
    getExperienceToNextLevel() {
        return this.experienceToNextLevel;
    }
    
    /**
     * Получает прогресс до следующего уровня (0-1)
     */
    getLevelProgress() {
        const currentLevelExp = this.level === 1 ? 0 : this.getExperienceForLevel(this.level - 1);
        const nextLevelExp = this.getExperienceForLevel(this.level);
        const progress = (this.experience - currentLevelExp) / (nextLevelExp - currentLevelExp);
        return Math.max(0, Math.min(1, progress));
    }
    
    /**
     * Получает опыт, необходимый для уровня
     * @param {number} level - Уровень
     */
    getExperienceForLevel(level) {
        if (level <= 1) return 0;
        return Math.floor(100 * Math.pow(1.5, level - 2));
    }
    
    /**
     * Сбрасывает экономику
     */
    reset() {
        this.coins = 100;
        this.experience = 0;
        this.level = 1;
        this.experienceToNextLevel = 100;
        console.log('Economy reset');
    }
    
    /**
     * Сохраняет состояние экономики
     */
    save() {
        const data = {
            coins: this.coins,
            experience: this.experience,
            level: this.level,
            experienceToNextLevel: this.experienceToNextLevel
        };
        
        try {
            localStorage.setItem('towerDefenseEconomy', JSON.stringify(data));
            console.log('Economy saved');
        } catch (error) {
            console.error('Failed to save economy:', error);
        }
    }
    
    /**
     * Загружает состояние экономики
     */
    load() {
        try {
            const data = localStorage.getItem('towerDefenseEconomy');
            if (data) {
                const parsed = JSON.parse(data);
                this.coins = parsed.coins || 100;
                this.experience = parsed.experience || 0;
                this.level = parsed.level || 1;
                this.experienceToNextLevel = parsed.experienceToNextLevel || 100;
                console.log('Economy loaded');
            }
        } catch (error) {
            console.error('Failed to load economy:', error);
        }
    }
}

// Создаем глобальный экземпляр менеджера экономики
window.economyManager = new EconomyManager();