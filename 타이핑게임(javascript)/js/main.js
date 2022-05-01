//사용변수
let GAME_TIME = 5; //단어 제한시간
let score = 0; //점수
let time = GAME_TIME; //현재 단어 제한시간
let isPlaying = false; //게임의 상태
let timeInterval; // 1초씩 감소하는 함수 담는 변수
let words = []; // 입력할 단어 배열

// DOM ELEMENT LIST
const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");
const settingToggle = document.querySelector(".setting-toggle");
const settingWrap = document.querySelector(".setting-wrap");

init();

//초기화
function init() {
    buttonChange("게임 로딩중 ....");
    getWords();
    eventInit();
}


//이벤트 주는 함수
function eventInit() {
    wordInput.addEventListener("input", checkMatch);
    settingToggle.addEventListener("click", toggleSettings);
    settingWrap.addEventListener("submit", changeSettings);
}


//게임 실행
function run() {
    if(isPlaying) return;
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    //시작 버튼을 누를 때 부터 단어 체인지(hello먼저 나오는 부분 수정)
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.innerText = words[randomIndex];
    timeInterval = setInterval(countDown, 1000);
    timeDisplay.innerText = GAME_TIME; //게임이 시작되면 정해진 시간부터 셈
    settingWrap.classList.remove("active"); //게임이 시작되면 설정창 닫음
    buttonChange("게임중");
}


//단어 불러오기
function getWords() {
    axios.get('https://random-word-api.herokuapp.com/word?number=10')
        .then(function (response) {
            response.data.forEach(word => {
                if(word.length < 10) {
                    words.push(word)
                }
            });
            words = response.data;
            buttonChange("게임시작");
        })
        .catch(function (error) {
            console.log(error);
        })  
}


//단어 일치 체크
function checkMatch() {
    if(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if(!isPlaying) {
            return;
        }
        score++;        
        scoreDisplay.innerText = score;        
        time = GAME_TIME;
        timeDisplay.innerText = GAME_TIME; //단어가 일치하면 다시 정해진 시간부터 셈
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}


//매초 시간 줄임
function countDown() {
    time > 1 ? gameContinue() : gameOver(); //1초보다 작아지면 gameOver 아니면 gameContunue
}


//남은 시간이 1초보다 많으면
function gameContinue() {
    timeDisplay.innerText = --time; //time을 1을 뺀 후 dom에 출력
}


//게임 종료시 실행
function gameOver() {
    timeDisplay.innerText = GAME_TIME; //dom에 시간 초기화
    isPlaying = false; //게임 종료 변수 최신화
    score = 0; //점수 초기화
    wordInput.value = ""; //입력창 비움
    wordDisplay.innerText = "ReTry!!";//메인 텍스트 변경
    clearInterval(timeInterval);
    buttonChange("게임시작");
}


//버튼의 상태를 변경
function buttonChange(text) {
    button.innerText = text;
    text === "게임시작" ? button.classList.remove("loading") : button.classList.add("loading");
}


//세팅창을 show&prove 시킨다
function toggleSettings() {
    if(settingWrap.classList.contains("active")) {
        settingWrap.classList.remove("active");
    } else {
        settingWrap.classList.add("active");
    }
}


//세팅창을 적용 시킨다.
function changeSettings(event) {
    event.preventDefault(); //form 이벤트 발동안하게
    const newTime = settingWrap.querySelector("input[name='time-setting']").value;
    settingWrap.querySelector("input[name='time-setting']").value = "";
    GAME_TIME = newTime;

    settingWrap.classList.remove("active"); //설정창 닫음
}