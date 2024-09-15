// 初始化变量
let bgUrl = null;
let changing = false;
let userTag = '';
let autoUpdate = true;
let autoUpdateInterval = null;

// 简单的 sleep 函数
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 从 API 获取背景图片信息
async function fetchBG(tag = '') {
  const params = new URLSearchParams({
    num: 1,
    proxy: 'fuck-cors.yuzusoft.life',
    tag: tag || '百合',
    excludeAI: 1,
    r18: 2,
  });

  const apiUrl = `https://fuck-cors.yuzusoft.life/setu/v2?${params}`;
  const res = await fetch(apiUrl, {
    headers: { 'upstream-host': 'api.lolicon.app' },
  });
  let { data } = await res.json();
  const selectedPic = data[0];
  const picUrl = selectedPic.urls.original;

  const picRes = await fetch(picUrl, {
    headers: {
      'upstream-host': 'i.pximg.net',
      'real-referer': 'https://www.pixiv.net/',
    },
  });

  return [selectedPic, await picRes.blob()];
}

// 更换背景图片的逻辑
async function changeBG() {
  const bgInfoA = document.getElementById('bg-info');
  const changeElem = document.getElementById('change');
  const downloadBtn = document.getElementById('download-btn');

  if (bgUrl) URL.revokeObjectURL(bgUrl);

  try {
    const [bgInfo, bg] = await fetchBG(userTag);
    bgUrl = URL.createObjectURL(bg);
    const bgElement = document.getElementById('bg');
    bgElement.style.animation = `bg-fade-out 1s cubic-bezier(0, 0, 0.2, 1)`;

    await new Promise((resolve) => {
      bgElement.addEventListener('animationend', resolve, { once: true });
    });

    bgElement.style.backgroundImage = `url("${bgUrl}")`;
    bgElement.style.animation = `bg-fade-in 1s cubic-bezier(0, 0, 0.2, 1)`;

    bgInfoA.innerText = bgInfo.title;
    bgInfoA.href = `https://www.pixiv.net/artworks/${bgInfo.pid}`;

    downloadBtn.href = bgUrl;
    downloadBtn.download = `${bgInfo.title}.jpg`;
    downloadBtn.style.display = 'inline';
  } catch (e) {
    console.error(e);
  }
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

