const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const moment = require("moment");

const io = new Server(server);

app.use(express.static(path.join(__dirname, "src"))); //root 경로로 src 지정
const PORT = process.env.PORT || 5000; //env에 포트정보가 있으면 쓰고 없으면 5000포트를 쓴다

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let cnt = 0; //채팅창의 유저 수

io.on("connection", (socket)=> {
    //유저가 로그인시 cnt증가후 emit보냄
    socket.on("userCnt", () => {
        cnt += 1;
        io.emit("userCnt", cnt);
    })
    //유저가 서버가 끊기면 cnt증가후 emit보냄
    socket.on("disconnect", (reason) => {
        cnt -= 1;
        io.emit("userCnt", cnt);
    });
    //chatting이벤트 발생시 서버에 연결된 모든 클라이언트에게 정보를 내린다
    socket.on("chatting", (data) => {
        const { name, msg } = data;
        io.emit("chatting", {
            name,
            msg,
            time: moment(new Date()).format("h:mm:ss A")
        });
    })
})

//지정된 포트로 서버를 열고 콜백함수 실행
server.listen(PORT, ()=> console.log(`server is running ${PORT}`));