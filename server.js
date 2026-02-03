const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
    console.log('A new client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // 回傳收到的訊息給客戶端
        // ws.send(`A message from server: You said "${message}"`);

        // 廣播訊息給所有連接的客戶端
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(`A message from server: A user said "${message}"`);
        //     }
        // });

        // 廣播訊息給所有連接的客戶端（除了發送者）
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`${message}`);
            }
        });
    });

    ws.on('close', function() {
        console.log('A client disconnected');
    });
});