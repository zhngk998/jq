// 地图API加载器 - 统一管理高德地图API加载
class MapLoader {
    constructor() {
        this.loaded = false;
        this.callbacks = [];
    }

    // 加载高德地图API
    loadMapAPI(plugins = []) {
        return new Promise((resolve, reject) => {
            // 如果已经加载过，直接返回
            if (this.loaded && window.AMap) {
                resolve(window.AMap);
                return;
            }

            // 检查配置是否存在
            if (typeof CONFIG === 'undefined') {
                reject(new Error('CONFIG not found. Please include config.js before map-loader.js'));
                return;
            }

            // 构建插件参数
            const pluginStr = plugins.length > 0 ? `&plugin=${plugins.join(',')}` : '';
            
            // 创建script标签
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://webapi.amap.com/maps?v=${CONFIG.AMAP.VERSION}&key=${CONFIG.AMAP.KEY}${pluginStr}`;
            
            script.onload = () => {
                this.loaded = true;
                resolve(window.AMap);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load AMap API'));
            };

            // 添加到页面
            document.head.appendChild(script);
        });
    }

    // 获取地图API密钥
    getAPIKey() {
        return CONFIG ? CONFIG.AMAP.KEY : null;
    }

    // 获取地图版本
    getVersion() {
        return CONFIG ? CONFIG.AMAP.VERSION : '2.0';
    }

    // 获取默认插件
    getDefaultPlugins() {
        return CONFIG ? CONFIG.AMAP.PLUGINS : [];
    }
}

// 创建全局实例
window.MapLoader = new MapLoader();

// 兼容性函数
window.loadAMapAPI = (plugins) => {
    return window.MapLoader.loadMapAPI(plugins);
}; 