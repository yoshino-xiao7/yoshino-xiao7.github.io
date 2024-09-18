// 初始化变量
let bgUrl = null;
let changing = false;
let userTag = '';
let autoUpdate = true;
let autoUpdateInterval = null;
let proxyList = ['fuck-ddos.o607th9p-285.workers.dev', 'fuck-cors.lgc2333.top', 'fuck-cors.yuzusoft.life']; // 代理地址列表
let currentProxyIndex = 0; // 当前代理的索引

// 简单的 sleep 函数
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 从 API 获取背景图片信息
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

    if (!res.ok) {
      throw new Error(`API 请求失败，状态码：${res.status}`);
    }

    let { data } = await res.json();
    const selectedPic = data[0];
    const picUrl = selectedPic.urls.original;

    const picRes = await fetch(picUrl, {
      headers: {
        'upstream-host': 'i.pximg.net',
        'real-referer': 'https://www.pixiv.net/',
      },
    });

    if (!picRes.ok) {
      throw new Error(`图片加载失败，状态码：${picRes.status}`);
    }

    return [selectedPic, await picRes.blob()];
  } catch (e) {
    console.error(`代理 ${proxyList[currentProxyIndex]} 访问失败，错误信息：`, e);

    // 切换到下一个代理地址
    currentProxyIndex = (currentProxyIndex + 1) % proxyList.length;

    console.log(`切换到备用代理 ${proxyList[currentProxyIndex]}`);

    // 递归调用自身，再次尝试使用新的代理地址
    return fetchBG(tag);
  }
}

// 更换背景图片的逻辑
async function changeBG() {
  const bgInfoA = document.getElementById('bg-info');
  const changeElem = document.getElementById('change');
  const downloadBtn = document.getElementById('download-btn');
  const bgElement = document.getElementById('bg');

  if (bgUrl) URL.revokeObjectURL(bgUrl); // 释放旧的 URL

  const result = await fetchBG(userTag);
  if (!result) {
    console.log('未能成功获取背景图片');
    return;
  }

  const [bgInfo, bg] = result;
  bgUrl = URL.createObjectURL(bg);

  // 处理背景图片动画效果
  bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;

  await new Promise((resolve) => {
    bgElement.addEventListener('animationend', resolve, { once: true });
  });

  bgElement.style.backgroundImage = `url("${bgUrl}")`;
  bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

  // 更新图片信息和下载链接
  bgInfoA.innerText = bgInfo.title;
  bgInfoA.href = `https://www.pixiv.net/artworks/${bgInfo.pid}`;

  downloadBtn.href = bgUrl;
  downloadBtn.download = `${bgInfo.title}.jpg`;
  downloadBtn.style.display = 'inline';
}

// 自动更换背景图片
function startAutoUpdate() {
  autoUpdateInterval = setInterval(changeBG, 10000); // 每10秒更换一次
}

// 停止自动更新
function stopAutoUpdate() {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
  }
}

// 点击展示用户输入部分
document.getElementById('show-input').onclick = function (event) {
  event.stopPropagation(); // 阻止事件冒泡，避免点击时关闭弹出框
  const inputContainer = document.getElementById('input-container');
  inputContainer.style.display = inputContainer.style.display === 'none' ? 'block' : 'none';
};

// 点击更换背景按钮
document.getElementById('change').onclick = function () {
  userTag = document.getElementById('image-tag').value || '百合'; // 默认标签
  changeBG();
};

// 切换自动更新
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

// 初始加载默认背景图片
window.onload = async function () {
  await changeBG();
  startAutoUpdate(); // 开始自动更换
};

// 侧边栏功能
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

// 切换侧边栏的显示和隐藏
sidebarToggle.onclick = function () {
  sidebar.classList.toggle('expanded');
};

// 点击页面其他地方关闭侧边栏
document.addEventListener('click', function (event) {
  if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
    sidebar.classList.remove('expanded');
  }
});

// 点击页面其他地方关闭弹出框
document.addEventListener('click', function (event) {
  const inputContainer = document.getElementById('input-container');
  const showInputBtn = document.getElementById('show-input');

  // 检查点击是否在弹出框内
  if (!inputContainer.contains(event.target) && event.target !== showInputBtn) {
    inputContainer.style.display = 'none'; // 隐藏用户输入部分
  }
});
