// 页面加载时初始化默认歌单
window.onload = async function () {
    await initDefaultPlaylist();
    await changeBG();
    startAutoUpdate(); // 开始自动更换
};

// 初始加载默认歌单
async function initDefaultPlaylist() {
    loadPlaylist('9639561853');
}

// 加载歌单
function loadPlaylist(id) {
    const playerContainer = document.getElementById('player-container');

    // 移除当前的播放器元素
    playerContainer.innerHTML = '';

    // 创建新的播放器元素并插入
    const newPlayer = document.createElement('meting-js');
    newPlayer.setAttribute('server', 'netease');
    newPlayer.setAttribute('type', 'playlist');
    newPlayer.setAttribute('id', id);
    newPlayer.setAttribute('fixed', 'true');
    newPlayer.setAttribute('autoplay', 'true');
    newPlayer.setAttribute('order', 'random');
    playerContainer.appendChild(newPlayer);

    // 重新加载新的播放器
    new Meting(newPlayer);
}

// 显示/隐藏输入框的逻辑
document.getElementById('toggle-input').addEventListener('click', function(event) {
    const inputContainer = document.getElementById('playlist-input-container');
    // 切换输入框显示/隐藏
    if (inputContainer.style.display === 'none' || inputContainer.style.display === '') {
        inputContainer.style.display = 'block';
    } else {
        inputContainer.style.display = 'none';
    }
});

// 点击页面其他地方隐藏输入框
document.addEventListener('click', function(event) {
    const inputContainer = document.getElementById('playlist-input-container');
    const toggleButton = document.getElementById('toggle-input');

    // 如果点击的不是输入框或者按钮，隐藏输入框
    if (!inputContainer.contains(event.target) && !toggleButton.contains(event.target)) {
        inputContainer.style.display = 'none';
    }
});

// 加载用户输入的歌单ID
document.getElementById('load-playlist').addEventListener('click', function() {
    const inputId = document.getElementById('playlist-id-input').value.trim();
    if (inputId) {
        loadPlaylist(inputId);
    }
});

// 加载用户输入的歌单ID，如果没输入则使用默认ID
document.getElementById('load-playlist').addEventListener('click', function() {
    const inputId = document.getElementById('playlist-id-input').value.trim();
    const defaultPlaylistId = '9639561853'; // 默认歌单ID

    // 如果用户没有输入，则使用默认ID
    const playlistId = inputId || defaultPlaylistId;

    // 加载歌单
    loadPlaylist(playlistId);
});

