// 初始化地图
function initMap() {
    const map = new AMap.Map('map', {
        zoom: 15,
        center: [116.404, 39.915],
        viewMode: '3D'
    });

    // 添加地图控件
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar());
    
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
    const vehicles = [
        { position: [116.404, 39.915], battery: 85, status: '空闲', id: 'V001' },
        { position: [116.414, 39.925], battery: 15, status: '使用中', id: 'V002' },
        { position: [116.394, 39.905], battery: 0, status: '充电中', id: 'V003' }
    ];

    vehicles.forEach(vehicle => {
        const marker = new AMap.Marker({
            position: vehicle.position,
            icon: createVehicleIcon(vehicle.battery, vehicle.status),
            offset: new AMap.Pixel(-16, -16)
        });

        marker.on('click', () => {
            showVehicleInfo(vehicle);
        });

        map.add(marker);
    });
}

// 创建车辆图标
function createVehicleIcon(battery, status) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.fillStyle = getBatteryColor(battery);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

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
    console.log('Vehicle info:', vehicle);
}

// 定位所有车辆
function locateVehicles(map) {
    const bounds = new AMap.Bounds();
    map.getAllOverlays('marker').forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    map.setBounds(bounds);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initMap); 