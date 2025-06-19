# 景区共享电动车系统部署指南

## 📋 部署前准备

### 1. 环境要求
- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- Git 版本控制工具
- GitHub 账号
- 高德地图开发者账号

### 2. 获取高德地图API密钥
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录开发者账号
3. 创建新应用，选择"Web端(JS API)"
4. 获取API Key
5. 设置安全域名（如：`your-username.github.io`）

## 🚀 GitHub Pages 部署步骤

### 步骤1：推送代码到GitHub
```bash
# 确保所有文件已提交
git add .
git commit -m "准备部署到GitHub Pages"
git push origin main
```

### 步骤2：配置GitHub Pages
1. 在GitHub仓库页面，点击 `Settings` 标签
2. 左侧菜单找到 `Pages`
3. 在 `Source` 部分选择 `Deploy from a branch`
4. 选择 `main` 分支和 `/ (root)` 文件夹
5. 点击 `Save`

### 步骤3：配置API密钥（新方式）
1. 编辑 `config.js` 文件中的API密钥：
   ```javascript
   AMAP: {
       KEY: 'YOUR_ACTUAL_API_KEY_HERE', // 替换为您的实际API密钥
       VERSION: '2.0',
       PLUGINS: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.MarkerClusterer']
   }
   ```

2. 提交更改：
   ```bash
   git add config.js
   git commit -m "配置高德地图API密钥"
   git push origin main
   ```

### 步骤4：配置演示功能（可选）
在 `config.js` 中可以配置演示功能：
```javascript
DEMO: {
    ENABLED: true, // 是否启用演示功能
    SHOW_BUTTONS: true, // 是否显示演示按钮
    AUTO_HIDE_BUTTONS: true, // 是否自动隐藏演示按钮
    DEMO_TIMEOUT: 30000 // 演示按钮自动隐藏时间（毫秒）
}
```

## 🔧 生产环境配置

### 1. 安全配置
- ✅ 所有API密钥已统一管理在 `config.js` 中
- ✅ 移除了所有HTML文件中的硬编码密钥
- ✅ 创建了统一的地图API加载器 `js/map-loader.js`

### 2. 演示功能配置
生产环境建议设置：
```javascript
DEMO: {
    ENABLED: true, // 保留演示功能
    SHOW_BUTTONS: true, // 显示演示按钮
    AUTO_HIDE_BUTTONS: true, // 自动隐藏演示按钮
    DEMO_TIMEOUT: 30000 // 30秒后自动隐藏
}
```

### 3. 安全检查清单
- [x] 移除所有硬编码的API密钥
- [x] 统一使用配置文件管理密钥
- [x] 保留演示功能但可配置
- [x] 确保所有链接使用相对路径
- [x] 验证所有页面功能正常
- [x] 测试移动端兼容性

### 4. 性能优化
- [ ] 压缩CSS和JavaScript文件
- [ ] 优化图片大小
- [ ] 启用浏览器缓存
- [ ] 使用CDN加速

## 📱 访问地址

部署完成后，您的系统将在以下地址可用：
- **主入口页面**: `https://your-username.github.io/repository-name/`
- **用户端**: `https://your-username.github.io/repository-name/user-app/`
- **调度端**: `https://your-username.github.io/repository-name/dispatch/`
- **后台管理**: `https://your-username.github.io/repository-name/admin/`

## 🔍 部署验证

### 功能测试清单
- [ ] 主入口页面正常显示
- [ ] 用户端扫码租车功能
- [ ] 调度端地图显示
- [ ] 后台管理数据展示
- [ ] 返回首页按钮功能
- [ ] 移动端响应式布局
- [ ] 演示功能正常工作

### 常见问题解决

#### 1. 地图无法显示
- 检查 `config.js` 中的API密钥是否正确
- 确认安全域名设置
- 检查网络连接
- 查看浏览器控制台错误信息

#### 2. 页面样式异常
- 清除浏览器缓存
- 检查CSS文件路径
- 验证CDN资源加载

#### 3. 功能无法使用
- 检查JavaScript控制台错误
- 验证API调用权限
- 确认浏览器兼容性

#### 4. 演示功能不显示
- 检查 `config.js` 中的 `DEMO.ENABLED` 设置
- 确认 `DEMO.SHOW_BUTTONS` 为 `true`
- 检查页面是否正确加载了配置文件

## 📞 技术支持

如遇部署问题，请联系：
- **联系人**: 张凯
- **电话/微信**: 15111041998
- **邮箱**: contact@example.com

## 🔄 更新部署

每次代码更新后，GitHub Pages会自动重新部署。您也可以手动触发部署：
1. 在仓库页面点击 `Actions` 标签
2. 查看部署状态
3. 如有问题，检查部署日志

## 🆕 新功能说明

### 配置文件管理
- 所有系统配置统一在 `config.js` 中管理
- 支持开发和生产环境不同配置
- API密钥安全管理，避免硬编码

### 演示功能优化
- 演示按钮样式优化，更美观
- 支持自动隐藏功能
- 可配置的演示超时时间
- 保留演示功能但更专业

### 地图API统一管理
- 创建了 `js/map-loader.js` 统一管理地图API加载
- 支持插件动态加载
- 错误处理机制
- 避免重复加载

---

*最后更新：2024年12月* 