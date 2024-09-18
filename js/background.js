let bgUrl = null;
let autoUpdate = true;
let autoUpdateInterval = null;
let userTag = '百合'; // 默认标签

// 代理列表，依次尝试
const proxyList = ['fuck-ddos.o607th9p-285.workers.dev' , 'fuck-cors.lgc2333.top' , 'fuck-cors.yuzusoft.life']; // 添加备用代理
let currentProxyIndex = 0; // 当前使用的代理索引

// 获取背景图片函数
async function fetchBG(tag = '') {
    const params = new URLSearchParams({
        num: 1,
        proxy: proxyList[currentProxyIndex],
        tag: tag || '百合',
        excludeAI: 1,
        r18: 2,
    });

    const apiUrl = `https://${proxyList[currentProxyIndex]}/setu/v2?${params}`;
    try {
        const res = await fetch(apiUrl, {
            headers: { 'upstream-host': 'api.lolicon.app' },
        });

        if (!res.ok) throw new Error(`Failed to fetch from API (proxy: ${proxyList[currentProxyIndex]})`);
        let { data } = await res.json();
        const selectedPic = data[0];
        const picUrl = selectedPic.urls.original;

        const picRes = await fetch(picUrl, {
            headers: {
                'upstream-host': 'i.pximg.net',
                'real-referer': 'https://www.pixiv.net/',
            },
        });

        if (!picRes.ok) throw new Error('Failed to fetch image from Pixiv');
        return [selectedPic, await picRes.blob()];
    } catch (error) {
        console.error(`Error fetching background image from proxy ${proxyList[currentProxyIndex]}:`, error);

        // 尝试切换到下一个代理
        currentProxyIndex = (currentProxyIndex + 1) % proxyList.length;
        console.log(`Switching to proxy: ${proxyList[currentProxyIndex]}`);

        return fetchBG(tag); // 递归调用自身，尝试使用下一个代理
    }
}

// 更换背景图片函数
async function changeBG() {
    const bgInfoA = document.getElementById('bg-info');

    if (bgUrl) URL.revokeObjectURL(bgUrl);

    try {
        const [bgInfo, bg] = await fetchBG(userTag);
        if (!bgInfo || !bg) throw new Error('Failed to load background or info');

        bgUrl = URL.createObjectURL(bg);
        const bgElement = document.getElementById('bg');

        // 背景渐隐
        bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;

        // 等待动画结束后更换背景
        await new Promise((resolve) => {
            bgElement.addEventListener('animationend', resolve, { once: true });
        });

        bgElement.style.backgroundImage = `url("${bgUrl}")`;
        bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

        // 更新背景信息链接
        bgInfoA.innerText = bgInfo.title;
        bgInfoA.href = `https://www.pixiv.net/artworks/${bgInfo.pid}`;
    } catch (e) {
        console.error('Error changing background:', e);
    }
}

// 启动自动更新
function startAutoUpdate() {
    console.log('Auto update started');
    autoUpdateInterval = setInterval(changeBG, 10000); // 每10秒更新一次
}

// 停止自动更新
function stopAutoUpdate() {
    console.log('Auto update stopped');
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
    }
}

// 页面加载后启动自动更换背景并加载默认背景
window.onload = function () {
    changeBG(); // 加载默认背景
    startAutoUpdate(); // 启动自动更新
};

// 按钮事件处理
document.getElementById('change').onclick = function () {
    userTag = document.getElementById('image-tag').value || '百合';
    changeBG();
};

document.getElementById('toggle-update').onclick = function () {
    const toggleBtn = document.getElementById('toggle-update');
    if (autoUpdate) {
        stopAutoUpdate();
        toggleBtn.innerText = '恢复自动更换';
    } else {
        startAutoUpdate();
        toggleBtn.innerText = '暂停自动更换';
    }
    autoUpdate = !autoUpdate;
};
