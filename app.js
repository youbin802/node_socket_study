const express = require('express');
const listen = require('socket.io');

const app = express();
const port = 3002;

const color = [
    "yellow",
    "green",
    "red",
    "blue",
    "white",
    "black"
]

app.get('/', ( _ ,res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = app.listen( port, () => {
    console.log('Express listening on port', port);
});

// 소켓 변수 (웹 서버를 감싸고 있음)
const io = listen(server);
// 여기까지가 바인드 끝남

// on 받는 것 emit 전송
io.on('connection', (socket)=> {
    const username = color[ Math.floor(Math.random()*6)];

    // 메시지 접속한 사람은 못읽음 브로드캐스트
    socket.broadcast.emit('join', { username });

    // 클라이언트가 접속 되고 실행되는 영역
    socket.on('client message', (data)=> {
        // 클라이언트의 메시지를 받아서 처리할 부분
        io.emit('server message', {
            username,
            message : data.message
        });
    });

    socket.on('disconnect',()=> {
        socket.broadcast.emit('leave', {username});
    });
});