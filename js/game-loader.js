/**
 * Универсальная система загрузки игры
 * Управляет загрузкой ресурсов и инициализацией компонентов
 */
class GameLoader {
    constructor() {
        this.resources = new Map();
        this.loadingPromises = new Map();
        this.isLoaded = false;
        this.loadingProgress = 0;
        this.loadingCallbacks = [];
    }
    
    /**
     * Добавляет ресурс для загрузки
     * @param {string} id - ID ресурса
     * @param {string} type - Тип ресурса (image, audio, json, etc.)
     * @param {string} url - URL ресурса
     */
    addResource(id, type, url) {
        this.resources.set(id, { type, url, loaded: false, data: null });
    }
    
    /**
     * Загружает все ресурсы
     * @param {Function} onProgress - Callback для отслеживания прогресса
     */
    async loadAll(onProgress = null) {
        if (this.isLoaded) {
            console.log('Resources already loaded');
            return;
        }
        
        const totalResources = this.resources.size;
        let loadedCount = 0;
        
        console.log(`Loading ${totalResources} resources...`);
        
        const loadPromises = Array.from(this.resources.entries()).map(async ([id, resource]) => {
            try {
                const data = await this.loadResource(resource.type, resource.url);
                resource.data = data;
                resource.loaded = true;
                loadedCount++;
                
                this.loadingProgress = (loadedCount / totalResources) * 100;
                
                if (onProgress) {
                    onProgress(this.loadingProgress, loadedCount, totalResources);
                }
                
                console.log(`Loaded resource: ${id} (${loadedCount}/${totalResources})`);
                
            } catch (error) {
                console.error(`Failed to load resource ${id}:`, error);
                throw error;
            }
        });
        
        await Promise.all(loadPromises);
        this.isLoaded = true;
        console.log('All resources loaded successfully');
    }
    
    /**
     * Загружает отдельный ресурс
     * @param {string} type - Тип ресурса
     * @param {string} url - URL ресурса
     */
    async loadResource(type, url) {
        return new Promise((resolve, reject) => {
            switch (type) {
                case 'image':
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                    img.src = url;
                    break;
                    
                case 'audio':
                    const audio = new Audio();
                    audio.oncanplaythrough = () => resolve(audio);
                    audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
                    audio.src = url;
                    break;
                    
                case 'json':
                    fetch(url)
                        .then(response => response.json())
                        .then(data => resolve(data))
                        .catch(error => reject(new Error(`Failed to load JSON: ${url}`)));
                    break;
                    
                case 'text':
                    fetch(url)
                        .then(response => response.text())
                        .then(data => resolve(data))
                        .catch(error => reject(new Error(`Failed to load text: ${url}`)));
                    break;
                    
                default:
                    reject(new Error(`Unsupported resource type: ${type}`));
            }
        });
    }
    
    /**
     * Получает загруженный ресурс
     * @param {string} id - ID ресурса
     */
    getResource(id) {
        const resource = this.resources.get(id);
        if (!resource) {
            console.error(`Resource not found: ${id}`);
            return null;
        }
        
        if (!resource.loaded) {
            console.error(`Resource not loaded: ${id}`);
            return null;
        }
        
        return resource.data;
    }
    
    /**
     * Проверяет, загружен ли ресурс
     * @param {string} id - ID ресурса
     */
    isResourceLoaded(id) {
        const resource = this.resources.get(id);
        return resource ? resource.loaded : false;
    }
    
    /**
     * Очищает загруженные ресурсы
     */
    clearResources() {
        this.resources.clear();
        this.loadingPromises.clear();
        this.isLoaded = false;
        this.loadingProgress = 0;
        console.log('Resources cleared');
    }
    
    /**
     * Получает прогресс загрузки
     */
    getLoadingProgress() {
        return this.loadingProgress;
    }
    
    /**
     * Проверяет, загружены ли все ресурсы
     */
    isFullyLoaded() {
        return this.isLoaded;
    }
}

// Создаем глобальный экземпляр загрузчика
window.gameLoader = new GameLoader();