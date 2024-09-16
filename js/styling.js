// 创建一个新的 QRCodeStyling 实例
const qrCode = new QRCodeStyling({
    width: 300,           // 二维码宽度
    height: 300,          // 二维码高度
    data: "https://youli.icu",  // 默认生成的二维码数据
    image: "https://youli.icu/img/xiao7.jpg", // 可选的 logo 图片 URL
    dotsOptions: {
        color: "#4267b2",  // 二维码点的颜色
        type: "rounded"    // 二维码点的形状
    },
    backgroundOptions: {
        color: "#ffffff",  // 背景颜色
    },
    imageOptions: {
        crossOrigin: "anonymous", // 允许跨域请求
        margin: 20                // logo 图片的外边距
    }
});

// 将二维码插入到页面的 canvas 元素中
qrCode.append(document.getElementById("canvas"));

// URL 正则表达式，检测用户输入是否为有效 URL
function isValidURL(string) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // 协议
      '(([a-zA-Z0-9$-_@.&+!*\'(),])+)+'+ // 域名/IP
      '(\\/[a-zA-Z0-9$-_@.&+!*\'(),]*)*\\/?$', 'i'); // 路径
    return !!pattern.test(string);
}

// 当用户点击 "生成二维码" 按钮时，生成新的二维码
document.getElementById("generateQR").addEventListener("click", function() {
    const qrData = document.getElementById("qrData").value.trim(); // 获取用户输入的二维码数据并去除首尾空格
    if (qrData) {
        let formattedData;

        // 如果输入是一个有效的 URL，确保它是一个完整的 URL
        if (isValidURL(qrData)) {
            formattedData = qrData.startsWith('http') ? qrData : `https://${qrData}`; // 如果没有协议，添加 https://
        } else {
            formattedData = qrData;  // 如果不是 URL，则保持原输入作为文本
        }

        // 更新二维码的数据
        qrCode.update({
            data: formattedData
        });
    }
});
