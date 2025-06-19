// 景区共享电动车系统配置文件
const CONFIG = {
    // 高德地图API配置
    AMAP: {
        KEY: '1671538ab024a8dd4c3eeda22f81f3d1', // 当前使用的API密钥
        VERSION: '2.0',
        PLUGINS: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.MarkerClusterer']
    },
    
    // 系统配置
    SYSTEM: {
        NAME: '景区共享电动车租赁系统',
        VERSION: '1.1.0',
        CONTACT: {
            NAME: '张凯',
            PHONE: '15111041998',
            EMAIL: 'contact@example.com'
        }
    },
    
    // 业务配置
    BUSINESS: {
        // 围栏配置（示例坐标，请根据实际景区调整）
        FENCE: {
            COORDINATES: [
                [116.397, 39.91],
                [116.398, 39.91], 
                [116.398, 39.912],
                [116.397, 39.912]
            ]
        },
        
        // 客服配置
        CUSTOMER_SERVICE: {
            PHONE: '400-123-4567',
            EMERGENCY: {
                MEDICAL: '120',
                POLICE: '110'
            }
        }
    },
    
    // 演示功能配置
    DEMO: {
        ENABLED: true, // 是否启用演示功能
        SHOW_BUTTONS: true, // 是否显示演示按钮
        AUTO_HIDE_BUTTONS: true, // 是否自动隐藏演示按钮（生产环境建议设为true）
        DEMO_TIMEOUT: 30000 // 演示按钮自动隐藏时间（毫秒）
    },
    
    // 开发环境配置
    DEVELOPMENT: {
        DEBUG_MODE: false, // 生产环境请设置为 false
        SHOW_DEMO_BUTTONS: true // 保留演示功能但可配置
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 