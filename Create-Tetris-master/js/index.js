import BLOCKS from "./blocks.js";

//DOM
const playground = document.querySelector('.playground');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const restartBtn = gameText.querySelector('button');

//setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
const scorePlus = 100;
let score = 0;
let duration = 500;
let downInterval = null;
let tempMovingItem;
let randomIndex = null;
const blockArray = Object.entries(BLOCKS);
const movingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 0,
}


//처음 시작 할 때 테트리스 판 그리기
for(let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
}


//functionts
function init() {
    tempMovingItem = { ...movingItem };
    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
    randomIndex = Math.floor(Math.random() * blockArray.length);
    generateNewBlock();
}


function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');

    for(let j = 0; j < GAME_COLS; j++){
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}


function renderBlocks(moveType = '') {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, 'moving');
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, 'moving');   
        } else {
            tempMovingItem = { ...movingItem};
            if(moveType === 'retry') {
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(moveType === 'top') {
                    seizeBlock();
                }
            }, 0)   
            return true;         
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}


function showGameoverText() {
    gameText.querySelector('span').innerText = '게임 종료';
    gameText.querySelector('button').innerText = '다시시작';
    gameText.style.display = 'flex';
}


function seizeBlock() {
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove('moving');
        moving.classList.add('seized');
    })
    checkMatch();
}

function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains('seized')) {
                matched = false;
            }
        })
        if(matched) {
            score += scorePlus;
            scoreDisplay.innerText = score;
            child.remove();
            prependNewLine();
        }
    })

    generateNewBlock();
}

function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1);
    }, duration);

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
    renderNextBlock();
}


function renderNextBlock() {
    document.querySelectorAll('.next-block').forEach(block => {
        block.classList.remove('next-block');
    })
    randomIndex = Math.floor(Math.random() * blockArray.length);
    const nextItem = blockArray[randomIndex]
    nextItem[1][0].forEach(block => {
        const x = block[1];
        const y = block[0];
        document.querySelector(`.next-model > li:nth-child(${x+1}) > ul > li:nth-child(${y+1})`).classList.add('next-block');
    })
}


function checkEmpty(target) {
    if(!target || target.classList.contains('seized')) {
        return false;
    }
    return true;
}


function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    
    tempMovingItem.direction = direction >= 3 ? 0 : direction + 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1);
    }, 10)
}

//event handling
document.addEventListener('keydown', e => {
    switch(e.keyCode) {
        case 39:
            moveBlock('left', 1);
            break;
        case 37:
            moveBlock('left', -1);
            break;
        case 40:
            moveBlock('top', 1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})

restartBtn.addEventListener('click',() => {
    playground.innerHTML = '';
    gameText.style.display = 'none';
    score = 0;
    scoreDisplay.innerText = '0';
    init()
})