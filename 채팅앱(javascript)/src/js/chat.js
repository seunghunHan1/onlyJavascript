"use strict"
//variable
let isLogin = false;
let nickname = "";

//dom Element
const inputNicknameWrapper = document.querySelector(".input-nickname-wrapper");
const nicknameElem = document.querySelector("#nickname");
const userNameShow = document.querySelector(".user-name-show");
const userCnt = document.querySelector(".user-cnt");
const nicknameBtn = document.querySelector("#nickname-btn");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");

//LiModel이라는 생성자 함수 정의
function LiModel(name, msg, time) {
    this.name = name;
    this.msg = msg;
    this.time = time;

    //DOM에 li삽임 함수
    this.makeLi = ()=>{
        const li = document.createElement("li");
        //클라이언트에 있는 nickname이랑 넘겨받은 name이랑 같으면 sent 아니면 received
        li.classList.add(nickname === this.name ? "sent" : "received");
        //li안의 마크업 텍스트
        const dom = `<span class="profile">
            <span class="user">${this.name}</span>
            <img src="https://placeimg.com/50/50/any" alt="any">                        
        </span>
        <span class="massage">${this.msg}</span>
        <span class="time">${this.time}</span>`;
        //삽입
        li.innerHTML = dom;
        //dom에 적용
        chatList.appendChild(li);
    }
}


//############## 채팅 시작 부분 ##############
nicknameBtn.addEventListener("click", ()=>{
    nickname = nicknameElem.value; //현재 로그인 정보에 입력 값 담기
    inputNicknameWrapper.classList.add("hide"); //닉네임 입력창 숨김
    userNameShow.innerText = nickname; //채팅창 상단 닉네임 부분에 값 삽입
    isLogin = true; //로그인 여부 변수 변경
    afterLogin(); //로그인 이후 함수
})




function afterLogin() {    
    const socket = io(); //서버에 연결을 시도하기 위한 io제공 함수        
    
    userCntRelation(); //유저수 관련
    massageRelation(); //메세지 관련

    function userCntRelation() {
        //서버랑 연결시 user수를 알려주는 emit 전송
        socket.on("connect", () => {
            socket.emit("userCnt");
        });
        //userCnt 이벤트 발생시 유저수 dom에 출력
        socket.on("userCnt", (data)=>{
            userCnt.innerText = data;
        })
    }

    function massageRelation() {
        //채팅 보내는 이벤트
        chatInput.addEventListener("keypress", (event)=>{
            //EnterKey이면 서버에 채팅 전송
            if(event.keyCode == 13) {
                send()
            }
        })
        sendButton.addEventListener("click", ()=>{
            send()
        })

        function send() {
            //전송 정보
            const param = {
                name: nickname,
                msg: chatInput.value
            }
            //서버에 보낼 이벤트명과 보낼 정보를 인자로 넘겨준다
            socket.emit("chatting", param);
            //입력창 비움
            chatInput.value = "";
        }

        //chatting이벤트 발생시 li그려주는
        socket.on("chatting", (data)=>{
            //닉네임이 입력되지 않은 상태면 실행 하지 않기
            if(isLogin) {
                const { name, msg, time} = data;
                const item = new LiModel(name, msg, time); //넘겨 받은 인자로 LiModel 인스턴스 생성
                item.makeLi();//넘겨 받은 정보로 dom에 추가하는 함수
                displayContainer.scrollTo(0, displayContainer.scrollHeight); //스크롤을 항상 제일 끝으로 유지
            }
        })
    }
}