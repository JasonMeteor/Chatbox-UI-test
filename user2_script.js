// WebSocket 連接
const ws = new WebSocket('ws://127.0.0.1:3000');

ws.addEventListener('open', function (event) {
    console.log('WebSocket connection established');
});

ws.addEventListener('message', function (event) {
    console.log('Message from server : ', event.data);
    receiveMessage(event.data);
});

ws.addEventListener('close', function (event) {
    console.log('WebSocket connection closed');
});

// 聊天介面相關元素
const chatBody = document.getElementById("msg-page");
const input = document.getElementById("form-control");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        if (event.shiftKey) {
            return; // 允許換行
        }
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    let text = input.value;
    if (!text) return; // 如果輸入框為空，則不發送訊息
    if (text.replace(/\n/g, '').trim() === '') return; // 如果輸入框只有空白或換行，則不發送訊息
    text = text.replace(/\n/g, '<br>'); // 將換行符號轉換為 <br> 標籤

    const time = getCurrentTime(); // 取得目前時間

    // 建立一則「使用者訊息」
    const msgDiv = document.createElement("div");
    msgDiv.className = "outgoing-chats";
    msgDiv.innerHTML = `
        <div class="outgoing-chats-img">
            <img src="test_icon2.png">
        </div>

        <div class="outgoing-msg">
            <div class="outgoing-msg-inbox">
                <p>${text}</p>
                <span class="time">${time}</span>
            </div>
        </div>
    `;

    chatBody.appendChild(msgDiv); // 將訊息加入聊天視窗
    chatBody.scrollTop = chatBody.scrollHeight; // 自動滾動到底部

    input.value = ""; // 清空輸入框

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(text.replace(/<br>/g, '\n')); // 發送純文字訊息到伺服器
    }

    // 模擬接收回覆訊息
    // setTimeout(() => {
    //     receiveMessage("これは自動返信メッセージです。");
    // }, 1000);
}

function receiveMessage(text) {
    text = text.replace(/\n/g, '<br>'); // 將換行符號轉換為 <br> 標籤

    const time = getCurrentTime(); // 取得目前時間

    // 建立一則「接收訊息」
    const msgDiv = document.createElement("div");
    msgDiv.className = "received-chats";
    msgDiv.innerHTML = `
        <div class="received-chats-img">
            <img src="test_icon1.png">
        </div>

        <div class="received-msg">
            <div class="received-msg-inbox">
                <p>${text}</p>
                <span class="time">${time}</span>
            </div>
        </div>
    `;

    chatBody.appendChild(msgDiv); // 將訊息加入聊天視窗
    chatBody.scrollTop = chatBody.scrollHeight; // 自動滾動到底部
}

function getCurrentTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM"; // 中午12點開始算PM

  hours = hours % 12;
  if (hours == 0) hours = 12;
  hours = hours.toString().padStart(2, "0");

  return `${hours}:${minutes} ${period}`;
}

// アイコンクリック時のアラート表示のテスト
function iconClick() {
    alert("アイコンがクリックされました！");
}