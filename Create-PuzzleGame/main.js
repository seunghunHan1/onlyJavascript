//################# Dom Element #################
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");
const container = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");
const themeMenu = document.querySelector(".theme-menu");
const themeList = document.querySelector(".theme-list");
const themeClose = document.querySelector(".theme-close");
const cheatBtn = document.querySelector(".cheat");

//################# variable #################
const delayTime = 4000; //완성 사진 보여 줄 시간
const tileCount = 16; //타일수
let tiles = []; //li를 담을 배열

//드래그 되고있는 객체 정보
const dragged = {
    el: null,
    class: null,
    index: null
}
let isPlaying = false; //게임의 클리어 여부
let timeInterval = null;
let time = 0; //게임 진행 시간

//################# function #################
function checkStatus() {
    const currentList = [...container.children]; //현재의 타일 정보 배열을 만든다
    //data-index랑 현재위치랑 맞지 않는거를 unMachedList에 저장한다
    const unMachedList = currentList.filter((child,index) => Number(child.getAttribute("data-index")) !== index);
    //게임종료
    if(unMachedList.length === 0) {
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
    };
}

function setGame() {
    isPlaying = true;
    container.innerHTML = "";//화면의 타일을 모두 지운다
    time = 1;
    gameText.style.display = "none";
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {  
        time++;
        playTime.innerText = time;                
    }, 1000)
    tiles = createImageTiles(); //타일 배열에 임의로 li를 담아두는 코드
    tiles.forEach(elem => container.appendChild(elem)); //tiles배열을 돌면서 dom에 완성본을 그리는 코드

    //몇초뒤에 섞인 퍼즐을 dom에 그리는 코드
    setTimeout(() => {
        container.innerHTML = "";
        //tiles를 섞은후 dom에 그린다
        shuffle(tiles).forEach(elem => container.appendChild(elem));
    }, delayTime);
}

function choiceGame() {
    themeMenu.classList.add("active");
}


function createImageTiles() {
    const tempArray = []; //임의의 배열을 만듬

    //tileCount만큼의 어레이를 만든후 forEach로 하나씩 돌면서 li를 생성후 tempArray에 담는다
    Array(tileCount).fill().forEach((_, i) => {
        const li = document.createElement("li");
        li.setAttribute("data-index", i);
        li.setAttribute("draggable", "true");
        li.classList.add(`list${i}`);
        
        tempArray.push(li);
    });
    return tempArray;
}

function shuffle(array) {
    let index = array.length - 1;
    //배열 끝에서 부터 내려오면서 랜덤한 인덱스랑 위치를 바꾼다
    while(index > 0) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
        index--;
    }
    return array;
}


//################# events #################
[...themeList.children].forEach(child => {
    child.addEventListener("click", () => {        
        container.classList.add(child.getAttribute("data-theme"));
        themeMenu.classList.remove("active");
        startScreen.classList.add('hide');
        gameScreen.classList.add('active');
        setGame();
    });
});
themeClose.addEventListener("click", () => themeMenu.classList.remove("active"));
cheatBtn.addEventListener("click", () => {
    [...container.children].forEach(child => {
        const cheatIndex = child.getAttribute("data-index");
        const span = document.createElement("span");
        span.innerText = parseInt(cheatIndex) + 1;
        child.appendChild(span);
    })
})
container.addEventListener("dragstart", e => {
    if(!isPlaying) return;
    const obj = e.target; //편의상 obj에 담음
    //dragged객체 정보 업데이트
    dragged.el = obj;
    dragged.class = e.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
})
container.addEventListener("dragover", e => {
    e.preventDefault();
})
container.addEventListener("drop", e => {
    const obj = e.target; //편의상 obj에 담음
    //드롭된 자리가 드래그한 자리가 아니면 이라는 조건
    if(obj.className !== dragged.class) {
        let originPlace; //드래그한 자리를 기억하기위한 변수
        let isLast = false; //마지막 타일인지 아닌지를 체크하는 변수

        //드래그한 자리의 다음 타일이 있으면(마지막이 아니면) 다음 타일 저장 없으면(마지막 타일이면) 이전 타일 저장
        if(dragged.el.nextSibling) {
            originPlace = dragged.el.nextSibling;
        } else {
            originPlace = dragged.el.previousSibling;
            isLast = true;
        }

        const droppedIndex = [...obj.parentNode.children].indexOf(obj); //드롭한 자리의 index 변수
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el); // 드롭한 자리의 왼쪽 아니면 오른쪽으로 드래그한 타일 옮김
        isLast ? originPlace.after(obj) : originPlace.before(obj); // 드래그한 자리의 왼쪽 아니면 오른쪽으로 드롭 자리의 타일 옮김        
    }
    checkStatus();
})

startButton.addEventListener("click", choiceGame);