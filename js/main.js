// 初始化地图
function initMap() {
    const map = new AMap.Map('map', {
        zoom: 15,
        center: [116.404, 39.915],
        viewMode: '3D',
        resizeEnable: true
    });

    // 添加地图控件
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar({
        position: 'RB'
    }));
    map.addControl(new AMap.MapType());
    
    // 添加车辆标记
    addVehicleMarkers(map);

    // 添加地图控制按钮事件
    document.getElementById('locateBtn').addEventListener('click', () => {
        locateVehicles(map);
    });

    document.getElementById('zoomInBtn').addEventListener('click', () => {
        map.zoomIn();
    });

    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        map.zoomOut();
    });
}

// 添加车辆标记
function addVehicleMarkers(map) {
    // 示例车辆位置数据
    const vehicles = [
        { point: new BMap.Point(116.404, 39.915), battery: 80 },
        { point: new BMap.Point(116.414, 39.925), battery: 60 },
        { point: new BMap.Point(116.394, 39.905), battery: 90 }
    ];

    vehicles.forEach(vehicle => {
        // 创建自定义图标
        const icon = new BMap.Icon(
            createVehicleIcon(vehicle.battery),
            new BMap.Size(32, 32),
            {
                anchor: new BMap.Size(16, 16)
            }
        );

        // 创建标记
        const marker = new BMap.Marker(vehicle.point, {
            icon: icon
        });

        // 添加点击事件
        marker.addEventListener("click", () => {
            showVehicleInfo(vehicle);
        });

        // 将标记添加到地图
        map.addOverlay(marker);
    });
}

// 创建车辆图标
function createVehicleIcon(battery) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // 绘制圆形背景
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fillStyle = getBatteryColor(battery);
    ctx.fill();

    // 绘制边框
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制电量数字
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(battery + '%', 16, 16);

    return canvas.toDataURL();
}

// 根据电量获取颜色
function getBatteryColor(battery) {
    if (battery >= 80) return '#34C759';
    if (battery >= 40) return '#FF9500';
    return '#FF3B30';
}

// 显示车辆信息
function showVehicleInfo(vehicle) {
    // 这里可以添加显示车辆详情的逻辑
    console.log('Vehicle info:', vehicle);
}

const moduleMap = {
    dashboard: 'components/dashboard.html',
    vehicle:   'components/vehicle.html',
    dispatch:  'components/dispatch.html',
    income:    'components/income.html',
    report:    'components/report.html'
};

function loadModule(module) {
    const url = moduleMap[module];
    if (!url) return;
    fetch(url)
        .then(res => res.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            // 可在此处做模块初始化
        });
}

// 事件委托，保证所有.nav-link[data-module]点击都能触发
// 包括动态插入的链接

document.body.addEventListener('click', function(e) {
    let target = e.target;
    // 兼容<i>图标等嵌套，向上查找.nav-link
    while (target && !target.classList.contains('nav-link')) {
        target = target.parentElement;
    }
    if (target && target.classList.contains('nav-link') && target.dataset.module) {
        e.preventDefault();
        const module = target.dataset.module;
        loadModule(module);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        target.classList.add('active');
    }
});

// 默认加载首页（运营概览）
document.addEventListener('DOMContentLoaded', function() {
    loadModule('dashboard');
    // 默认高亮第一个菜单
    const firstNav = document.querySelector('.nav-link[data-module="dashboard"]');
    if (firstNav) firstNav.classList.add('active');
});

// 首页事件初始化
function initDashboardEvents() {
    // 只有当dashboard.html中有#map时才初始化地图
    if (document.getElementById('map')) {
        initMap();
    }
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.onclick = function() {
            alert('详情弹窗或跳转逻辑');
        };
    });
}

// 车辆管理事件初始化（可根据实际需要补充）
function initVehicleEvents() {}
// 调度指令事件初始化
function initDispatchEvents() {}
// 收入与回款事件初始化
function initIncomeEvents() {}
// 财务报表事件初始化
function initReportEvents() {} 