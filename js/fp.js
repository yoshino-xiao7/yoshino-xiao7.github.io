let clickCount = 0; // 初始化点击计数器
const maxClicks = 5; // 设置允许的最大点击次数
const timeLimit = 10000; // 设置时间限制（毫秒），如10秒内最多点击5次

// 获取下载按钮
const downloadButton = document.getElementById('download-btn');

// 监听按钮点击事件
downloadButton.addEventListener('click', function(event) {
    clickCount++; // 每次点击增加计数

    if (clickCount >= maxClicks) {
        // 如果点击次数超过限制，直接重定向到百度
        window.location.href = 'https://www.baidu.com';
    } else {
        // 用户点击未超过限制，可以继续执行下载逻辑
        console.log('开始下载...');
        // 在此处添加你的下载逻辑
    }

    // 重置点击次数计时器，在设定的时间内恢复点击计数
    setTimeout(function() {
        clickCount = 0; // 在指定时间后重置计数
    }, timeLimit);
});
