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
}

// 添加车辆标记
function addVehicleMarkers(map) {
    const vehicles = [
        { position: [116.404, 39.915], battery: 85, status: '空闲' },
        { position: [116.414, 39.925], battery: 15, status: '使用中' },
        { position: [116.394, 39.905], battery: 0, status: '充电中' }
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 地图初始化
    if (document.getElementById('map')) {
        initMap();
    }

    // 侧边栏菜单点击事件委托
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link[data-module]');
            if (!link) return;
            e.preventDefault();

            // 移除所有菜单的active状态
            document.querySelectorAll('.nav-link[data-module]').forEach(el => {
                el.classList.remove('active');
            });
            link.classList.add('active');

            // 隐藏所有内容区
            const sections = [
                'dashboard-section',
                'vehicle-manage-section', 
                'dispatch-section',
                'income-section',
                'report-section',
                'profit-sharing-section'
            ];
            
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.display = 'none';
                }
            });

            // 显示对应内容区
            const module = link.getAttribute('data-module');
            let targetSectionId = '';
            
            switch(module) {
                case 'dashboard':
                    targetSectionId = 'dashboard-section';
                    break;
                case 'vehicle':
                    targetSectionId = 'vehicle-manage-section';
                    break;
                case 'dispatch':
                    targetSectionId = 'dispatch-section';
                    break;
                case 'income':
                    targetSectionId = 'income-section';
                    break;
                case 'report':
                    targetSectionId = 'report-section';
                    break;
                case 'profit-sharing':
                    targetSectionId = 'profit-sharing-section';
                    break;
            }
            
            if (targetSectionId) {
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            }
        });
    }
    
    // 默认激活第一个菜单项
    const firstNavLink = document.querySelector('.nav-link[data-module]');
    if (firstNavLink) {
        firstNavLink.click();
    }
});

// 车辆详情弹窗函数
function showVehicleDetail(vehicleId) {
    // 根据vehicleId获取车辆详细信息
    let vehicleInfo = getVehicleInfo(vehicleId);
    
    // 创建弹窗HTML
    let modalHTML = `
        <div id="vehicleDetailModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">车辆详情 - ${vehicleId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>基本信息</h6>
                                <table class="table table-sm">
                                    <tr><td>车辆编号</td><td>${vehicleInfo.id}</td></tr>
                                    <tr><td>车辆名称</td><td>${vehicleInfo.name}</td></tr>
                                    <tr><td>IOT设备ID</td><td>${vehicleInfo.iotId}</td></tr>
                                    <tr><td>品牌型号</td><td>${vehicleInfo.brand}</td></tr>
                                    <tr><td>所属区域</td><td>${vehicleInfo.area}</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6>状态信息</h6>
                                <table class="table table-sm">
                                    <tr><td>工作状态</td><td><span class="status-dot ${vehicleInfo.workStatus === '在用' ? 'status-working' : 'status-maintain'}"></span>${vehicleInfo.workStatus}</td></tr>
                                    <tr><td>IOT状态</td><td><span class="status-dot ${vehicleInfo.iotStatus === '在线' ? 'status-online' : 'status-offline'}"></span>${vehicleInfo.iotStatus}</td></tr>
                                    <tr><td>电池电量</td><td>${vehicleInfo.battery}%</td></tr>
                                    <tr><td>最新上报</td><td>${vehicleInfo.lastReport}</td></tr>
                                    <tr><td>当前位置</td><td>${vehicleInfo.location}</td></tr>
                                </table>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <h6>运营数据</h6>
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="card text-center">
                                            <div class="card-body">
                                                <h5 class="text-primary">${vehicleInfo.todayIncome}</h5>
                                                <small>今日收入</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card text-center">
                                            <div class="card-body">
                                                <h5 class="text-success">${vehicleInfo.todayOrders}</h5>
                                                <small>今日订单</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card text-center">
                                            <div class="card-body">
                                                <h5 class="text-info">${vehicleInfo.todayTime}</h5>
                                                <small>今日使用时长</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card text-center">
                                            <div class="card-body">
                                                <h5 class="text-warning">${vehicleInfo.efficiency}</h5>
                                                <small>运营效率</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary" onclick="editVehicle('${vehicleId}')">编辑车辆</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除已存在的弹窗
    const existingModal = document.getElementById('vehicleDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 添加新弹窗到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 显示弹窗
    const modal = new bootstrap.Modal(document.getElementById('vehicleDetailModal'));
    modal.show();
}

// 获取车辆信息（模拟数据）
function getVehicleInfo(vehicleId) {
    const vehicleData = {
        'EV-001': {
            id: 'EV-001',
            name: '小型电动车',
            iotId: 'iot-123456',
            brand: '玛西尔/EV100',
            area: 'A区充电站',
            workStatus: '在用',
            iotStatus: '在线',
            battery: 85,
            lastReport: '2024-06-16 13:51:57',
            location: 'A区停车点',
            todayIncome: '¥128',
            todayOrders: '6',
            todayTime: '6.5小时',
            efficiency: '高效'
        },
        'EV-002': {
            id: 'EV-002',
            name: '观光车',
            iotId: 'iot-654321',
            brand: '玛西尔/EV200',
            area: 'B区充电站',
            workStatus: '维修',
            iotStatus: '离线',
            battery: 20,
            lastReport: '2024-06-15 09:20:10',
            location: 'B区维修点',
            todayIncome: '¥0',
            todayOrders: '0',
            todayTime: '0小时',
            efficiency: '维修中'
        }
    };
    
    return vehicleData[vehicleId] || {
        id: vehicleId,
        name: '未知车辆',
        iotId: '未知',
        brand: '未知',
        area: '未知',
        workStatus: '未知',
        iotStatus: '未知',
        battery: 0,
        lastReport: '未知',
        location: '未知',
        todayIncome: '¥0',
        todayOrders: '0',
        todayTime: '0小时',
        efficiency: '未知'
    };
}

// 编辑车辆函数
function editVehicle(vehicleId) {
    alert('编辑车辆功能待开发：' + vehicleId);
}

// 车辆注册函数
function showVehicleRegister() {
    alert('车辆注册功能待开发');
}

// ========== 调度模块相关函数 ==========

// 显示发布新指令模态框
function showNewDispatchModal() {
    const modal = new bootstrap.Modal(document.getElementById('newDispatchModal'));
    modal.show();
    
    // 重置表单
    document.getElementById('newDispatchForm').reset();
    document.getElementById('dynamicContent').innerHTML = '';
    
    // 设置默认时间为1小时后
    const now = new Date();
    now.setHours(now.getHours() + 1);
    document.getElementById('expectedTime').value = now.toISOString().slice(0, 16);
}

// 显示批量操作模态框
function showBatchOperationModal() {
    const modal = new bootstrap.Modal(document.getElementById('batchOperationModal'));
    modal.show();
}

// 指令类型改变时的处理
function handleTypeChange() {
    const type = document.getElementById('instructionType').value;
    const dynamicContent = document.getElementById('dynamicContent');
    
    let html = '';
    
    switch(type) {
        case 'dispatch':
            html = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">调度区域 *</label>
                        <select class="form-select" id="dispatchArea">
                            <option value="">请选择区域</option>
                            <option value="A">A区</option>
                            <option value="B">B区</option>
                            <option value="C">C区</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">车辆数量 *</label>
                        <input type="number" class="form-control" id="vehicleCount" min="1" placeholder="需要调度的车辆数量">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">目标区域</label>
                    <select class="form-select" id="targetArea">
                        <option value="">请选择目标区域</option>
                        <option value="A">A区</option>
                        <option value="B">B区</option>
                        <option value="C">C区</option>
                    </select>
                </div>
            `;
            break;
        case 'fault':
            html = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">故障车辆 *</label>
                        <input type="text" class="form-control" id="faultVehicle" placeholder="输入车辆编号">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">故障类型 *</label>
                        <select class="form-select" id="faultType">
                            <option value="">请选择故障类型</option>
                            <option value="battery">电池故障</option>
                            <option value="motor">电机故障</option>
                            <option value="brake">刹车故障</option>
                            <option value="other">其他故障</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        case 'charge':
            html = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">充电站 *</label>
                        <select class="form-select" id="chargingStation">
                            <option value="">请选择充电站</option>
                            <option value="A1">A区充电站</option>
                            <option value="B1">B区充电站</option>
                            <option value="C1">C区充电站</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">操作类型 *</label>
                        <select class="form-select" id="chargeOperation">
                            <option value="">请选择操作</option>
                            <option value="start">开始充电</option>
                            <option value="stop">停止充电</option>
                            <option value="check">检查状态</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        case 'patrol':
            html = `
                <div class="mb-3">
                    <label class="form-label">巡检区域 *</label>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="patrolA" value="A">
                                <label class="form-check-label" for="patrolA">A区</label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="patrolB" value="B">
                                <label class="form-check-label" for="patrolB">B区</label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="patrolC" value="C">
                                <label class="form-check-label" for="patrolC">C区</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'emergency':
            html = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>紧急任务：</strong>此类型指令将立即发送给所有在线调度员
                </div>
                <div class="mb-3">
                    <label class="form-label">紧急事件位置 *</label>
                    <input type="text" class="form-control" id="emergencyLocation" placeholder="详细描述事件发生位置">
                </div>
            `;
            break;
        case 'maintenance':
            html = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">维护类型 *</label>
                        <select class="form-select" id="maintenanceType">
                            <option value="">请选择维护类型</option>
                            <option value="daily">日常保养</option>
                            <option value="repair">设备维修</option>
                            <option value="clean">清洁保养</option>
                            <option value="inspect">安全检查</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">维护对象</label>
                        <input type="text" class="form-control" id="maintenanceTarget" placeholder="车辆编号或设备编号">
                    </div>
                </div>
            `;
            break;
    }
    
    dynamicContent.innerHTML = html;
}

// 发布指令
function publishInstruction() {
    const form = document.getElementById('newDispatchForm');
    const formData = new FormData(form);
    
    // 验证必填字段
    const type = document.getElementById('instructionType').value;
    const dispatcher = document.getElementById('targetDispatcher').value;
    const desc = document.getElementById('instructionDesc').value;
    
    if (!type || !dispatcher || !desc) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 模拟发布指令
    alert('指令发布成功！已通知相关调度员。');
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('newDispatchModal'));
    modal.hide();
    
    // 这里可以添加实际的API调用
    console.log('发布指令:', {
        type: type,
        dispatcher: dispatcher,
        description: desc,
        priority: document.getElementById('priority').value,
        expectedTime: document.getElementById('expectedTime').value
    });
}

// 保存草稿
function saveAsDraft() {
    alert('草稿保存成功！');
    console.log('保存草稿');
}

// 批量发送指令
function executeBatchSend() {
    alert('批量指令发送成功！');
    console.log('批量发送指令');
}

// 批量更新状态
function executeBatchUpdate() {
    alert('批量状态更新成功！');
    console.log('批量更新状态');
}

// 处理所有预警
function handleAllAlerts() {
    alert('正在处理所有预警事件...');
    console.log('处理所有预警');
}

// 处理紧急事件
function handleEmergency(vehicleId) {
    alert(`正在处理紧急事件：${vehicleId}`);
    console.log('处理紧急事件:', vehicleId);
}

// 处理预警
function handleWarning(area) {
    alert(`正在处理预警：${area}`);
    console.log('处理预警:', area);
}

// 处理设备异常
function handleEquipment(equipmentId) {
    alert(`正在处理设备异常：${equipmentId}`);
    console.log('处理设备异常:', equipmentId);
}

// 释放车辆
function releaseVehicle(vehicleId) {
    alert(`车辆 ${vehicleId} 已释放投放`);
    console.log('释放车辆:', vehicleId);
}

// 处理用户反馈
function handleFeedback(vehicleId) {
    alert(`正在跟进用户反馈：${vehicleId}`);
    console.log('处理用户反馈:', vehicleId);
}

// ========== 收入模块相关函数 ==========

// 导出收入报表
function exportIncomeReport() {
    alert('正在导出收入报表...');
    console.log('导出收入报表');
}

// 刷新收入数据
function refreshIncomeData() {
    alert('收入数据已刷新');
    console.log('刷新收入数据');
}

// 生成财务报表
function generateReport() {
    alert('正在生成财务报表...');
    console.log('生成财务报表');
}

// 导出Excel
function exportExcel() {
    alert('正在导出Excel文件...');
    console.log('导出Excel');
}

// 导出PDF
function exportPDF() {
    alert('正在导出PDF文件...');
    console.log('导出PDF');
}

// ========== 指令跟踪相关函数 ==========

// 按指令类型筛选
function filterInstructionsByType(type) {
    const tableBody = document.getElementById('instructionTableBody');
    if (!tableBody) return;
    
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const typeCell = row.getElementsByTagName('td')[1]; // 类型列
        
        if (type === 'all') {
            row.style.display = '';
        } else {
            const badgeText = typeCell.querySelector('.badge').textContent.trim();
            const typeMap = {
                'dispatch': '车辆调度',
                'fault': '故障处理', 
                'charge': '充电管理',
                'patrol': '区域巡检',
                'emergency': '紧急任务',
                'maintenance': '维护保养'
            };
            
            if (badgeText === typeMap[type]) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
    
    console.log('按类型筛选指令:', type);
}

// 按状态筛选指令（原有函数）
function filterInstructions(status) {
    const tableBody = document.getElementById('instructionTableBody');
    if (!tableBody) return;
    
    const rows = tableBody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const statusCell = row.getElementsByTagName('td')[4]; // 状态列
        
        if (status === 'all') {
            row.style.display = '';
        } else {
            const badgeText = statusCell.querySelector('.badge').textContent.trim();
            const statusMap = {
                'pending': '待执行',
                'executing': '执行中',
                'completed': '已完成',
                'overdue': '超时'
            };
            
            if (badgeText === statusMap[status]) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
    
    console.log('按状态筛选指令:', status);
}

// 查看指令详情
function viewInstructionDetail(instructionId) {
    // 创建指令详情弹窗
    const modalHTML = `
        <div id="instructionDetailModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">指令详情 - ${instructionId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>基本信息</h6>
                                <table class="table table-sm">
                                    <tr><td>指令编号</td><td>${instructionId}</td></tr>
                                    <tr><td>指令类型</td><td>车辆调度</td></tr>
                                    <tr><td>优先级</td><td><span class="badge bg-warning">紧急</span></td></tr>
                                    <tr><td>发布时间</td><td>2024-06-16 14:30:00</td></tr>
                                    <tr><td>预计完成</td><td>2024-06-16 15:00:00</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6>执行信息</h6>
                                <table class="table table-sm">
                                    <tr><td>执行人</td><td>张三</td></tr>
                                    <tr><td>当前状态</td><td><span class="badge bg-primary">执行中</span></td></tr>
                                    <tr><td>完成进度</td><td>60% (3/5辆已调度)</td></tr>
                                    <tr><td>开始时间</td><td>2024-06-16 14:32:00</td></tr>
                                    <tr><td>最后更新</td><td>2024-06-16 14:45:00</td></tr>
                                </table>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>指令内容</h6>
                            <div class="alert alert-info">
                                A区缺车，调度5辆到A区。请优先调度电量充足的车辆，确保用户正常使用。
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>执行日志</h6>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <small class="text-muted">14:45</small> - 已调度第3辆车到A区
                                </div>
                                <div class="timeline-item">
                                    <small class="text-muted">14:38</small> - 已调度第2辆车到A区
                                </div>
                                <div class="timeline-item">
                                    <small class="text-muted">14:32</small> - 开始执行指令，已调度第1辆车
                                </div>
                                <div class="timeline-item">
                                    <small class="text-muted">14:30</small> - 指令发布
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-warning" onclick="urgentInstruction('${instructionId}')">催办</button>
                        <button type="button" class="btn btn-danger" onclick="cancelInstruction('${instructionId}')">取消指令</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除已存在的弹窗
    const existingModal = document.getElementById('instructionDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 添加新弹窗到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 显示弹窗
    const modal = new bootstrap.Modal(document.getElementById('instructionDetailModal'));
    modal.show();
    
    console.log('查看指令详情:', instructionId);
}

// 催办指令
function urgentInstruction(instructionId) {
    alert(`已对指令 ${instructionId} 发送催办通知`);
    console.log('催办指令:', instructionId);
}

// 取消指令
function cancelInstruction(instructionId) {
    if (confirm(`确定要取消指令 ${instructionId} 吗？`)) {
        alert(`指令 ${instructionId} 已取消`);
        console.log('取消指令:', instructionId);
    }
}

// 重复指令
function repeatInstruction(instructionId) {
    if (confirm(`确定要重复执行指令 ${instructionId} 吗？`)) {
        alert(`指令 ${instructionId} 已重新发布`);
        console.log('重复指令:', instructionId);
    }
}

// 重新分配指令
function reassignInstruction(instructionId) {
    const newDispatcher = prompt('请输入新的执行人：', '李四');
    if (newDispatcher) {
        alert(`指令 ${instructionId} 已重新分配给 ${newDispatcher}`);
        console.log('重新分配指令:', instructionId, '给', newDispatcher);
    }
}

// ========== 回款管理相关函数 ==========

// 处理退款
function processRefund(orderId, amount, userName, paymentMethod) {
    if (confirm(`确定要为用户 ${userName} 退款 ¥${amount} 吗？\n订单号：${orderId}\n支付方式：${paymentMethod}`)) {
        // 1. 更新原回款记录状态为"已退款"
        updatePaymentStatus(orderId, '已退款');
        
        // 2. 在退款明细中添加新记录
        addRefundRecord(orderId, amount, userName, paymentMethod);
        
        alert(`退款处理成功！\n订单号：${orderId}\n退款金额：¥${amount}\n用户：${userName}`);
        console.log('处理退款:', { orderId, amount, userName, paymentMethod });
    }
}

// 更新回款记录状态
function updatePaymentStatus(orderId, newStatus) {
    const paymentTable = document.getElementById('paymentTable');
    if (!paymentTable) return;
    
    const rows = paymentTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.getAttribute('data-order-id') === orderId) {
            const statusCell = row.getElementsByTagName('td')[5]; // 状态列
            const actionCell = row.getElementsByTagName('td')[6]; // 操作列
            
            if (statusCell && actionCell) {
                // 更新状态
                if (newStatus === '已退款') {
                    statusCell.innerHTML = '<span class="badge bg-danger">已退款</span>';
                    // 禁用退款按钮
                    actionCell.innerHTML = '<button class="btn btn-sm btn-outline-secondary" disabled><i class="bi bi-check-circle"></i> 已退款</button>';
                }
            }
            break;
        }
    }
}

// 添加退款记录
function addRefundRecord(orderId, amount, userName, paymentMethod) {
    const refundTable = document.getElementById('refundTable');
    if (!refundTable) return;
    
    const tbody = refundTable.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    
    // 获取当前时间
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
    
    // 获取支付方式图标
    let paymentIcon = '';
    if (paymentMethod.includes('微信')) {
        paymentIcon = '<i class="bi bi-wechat text-success"></i> 微信支付';
    } else if (paymentMethod.includes('支付宝')) {
        paymentIcon = '<i class="bi bi-alipay text-primary"></i> 支付宝';
    } else if (paymentMethod.includes('银行卡')) {
        paymentIcon = '<i class="bi bi-credit-card text-info"></i> 银行卡';
    } else {
        paymentIcon = paymentMethod;
    }
    
    // 提取用户手机号（如果有的话）
    let userInfo = userName;
    if (userName.includes('先生') || userName.includes('女士')) {
        const phoneNumbers = ['138****5678', '159****1234', '187****9876', '135****2468', '186****7890'];
        const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
        userInfo = `${userName}<br><small class="text-muted">${randomPhone}</small>`;
    }
    
    // 创建新的退款记录行
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${timeStr}</td>
        <td>${userInfo}</td>
        <td>¥${amount}</td>
        <td>${paymentIcon}</td>
        <td>${orderId}</td>
        <td><span class="badge bg-warning">处理中</span></td>
    `;
    
    // 插入到表格顶部
    tbody.insertBefore(newRow, tbody.firstChild);
    
    // 3秒后模拟退款完成
    setTimeout(() => {
        const statusCell = newRow.getElementsByTagName('td')[5];
        if (statusCell) {
            statusCell.innerHTML = '<span class="badge bg-success">已退款</span>';
        }
    }, 3000);
}

// 发起结算
function initiateSettlement() {
    if (confirm('确定要发起结算吗？这将处理所有待结算的款项。')) {
        alert('结算请求已提交，预计1-3个工作日内完成结算。');
        console.log('发起结算');
    }
}

// 显示退款模态框（备用功能）
function showRefundModal() {
    const modalHTML = `
        <div id="refundModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">发起退款</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="refundForm">
                            <div class="mb-3">
                                <label class="form-label">订单号 *</label>
                                <input type="text" class="form-control" id="refundOrderId" placeholder="输入要退款的订单号">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">退款金额 *</label>
                                <input type="number" class="form-control" id="refundAmount" step="0.01" placeholder="输入退款金额">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">退款原因 *</label>
                                <select class="form-select" id="refundReason">
                                    <option value="">请选择退款原因</option>
                                    <option value="user_request">用户主动申请</option>
                                    <option value="service_issue">服务问题</option>
                                    <option value="system_error">系统错误</option>
                                    <option value="other">其他原因</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">备注说明</label>
                                <textarea class="form-control" id="refundNote" rows="3" placeholder="请详细说明退款原因..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" onclick="submitRefund()">确认退款</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除已存在的弹窗
    const existingModal = document.getElementById('refundModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 添加新弹窗到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 显示弹窗
    const modal = new bootstrap.Modal(document.getElementById('refundModal'));
    modal.show();
}

// 提交退款申请
function submitRefund() {
    const orderId = document.getElementById('refundOrderId').value;
    const amount = document.getElementById('refundAmount').value;
    const reason = document.getElementById('refundReason').value;
    const note = document.getElementById('refundNote').value;
    
    if (!orderId || !amount || !reason) {
        alert('请填写所有必填字段！');
        return;
    }
    
    alert(`退款申请已提交！\n订单号：${orderId}\n退款金额：¥${amount}\n退款原因：${reason}`);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('refundModal'));
    modal.hide();
    
    console.log('提交退款申请:', { orderId, amount, reason, note });
} 