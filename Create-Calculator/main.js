//################### variable ###################
let beforeOperator = false; //이전에 연산자 입력 했는지 판단할 변수
//연산자 우선순위
const compare = {
    '+': 2,
    '-': 2,
    '*': 1,
    '/': 1,
    '(': 0
}

//################### Dom ###################
const formElem = document.querySelector("form[name='forms']");
const outputElem = formElem.querySelector("input[name='output']");
const historyBtnElem = document.querySelector(".history-btn");
const historyCloseBtnElem = document.querySelector(".history-close");
const historyBodyElem = document.querySelector(".history-body");
const historyContElem = historyBodyElem.querySelector(".history-cont");
const historyNone = historyContElem.querySelector(".history-none");

//################### Event ###################
[...formElem.childNodes].forEach(elem => {
    if(elem.type === 'button') {
        elem.addEventListener('click', () => {
            const className = elem.classList.item(0); //클릭한 노드의 클래스 이름 가져오기
            const clValue = elem.value; //클릭한 노드의 value값 가져오기
            switch(className) {
                case 'num':
                case 'dot':
                    numClick(clValue);
                    break;
                case 'operator':
                    operClick(clValue);
                    break;
                case 'clear':
                    clearClick();
                    break;
                case 'result':
                    resultClick();
                    break;
            }                           
        })
    };
})
historyBtnElem.addEventListener("click", () => {
    historyBodyElem.classList.add("active");
    if(historyContElem.children.length == 1) {
        historyNone.style.display = "block";
    };
})
historyCloseBtnElem.addEventListener("click", () => {
    historyBodyElem.classList.remove("active");
})


//################### function ###################
function numClick(value) {
    beforeOperator = false; //연산자가 입력 되지 않았다고 바꿔줌
    outputElem.value += value; //output에 붙임           
}


function operClick(value) {
    //전에 연산자가 입력 되지 않았으면
    if(!beforeOperator) {
        beforeOperator = true; //연산자가 입력 된 상태라고 바꿔 줌
        outputElem.value += value; //output에 붙임
    }
    //전에 연산자가 입력된 경우        
    else {                                        
        outputElem.value = outputElem.value.slice(0, -1); //마지막 입력값을 지움
        outputElem.value += value; //output에 붙임
    }
}


function clearClick() {
    outputElem.value = '';
}

function resultClick() {
    const result = calculate(makeBack()); // 계산 결과 값
    makeHistory([outputElem.value, result]); //기록 삽입
    outputElem.value = result; //계산기 아웃풋에 값 출력
}

function makeHistory(data = Array) {
    const li = document.createElement("li");
    const div = document.createElement("div");

    //식이랑 값을 나누어서 이벤트 주고 div에 append
    data.forEach(value => {
        const span = document.createElement("span");
        span.innerText = value;
        span.addEventListener("click", () => {
            outputElem.value = value;
            historyBodyElem.classList.remove("active");
        })
        div.appendChild(span);
    })
    div.childNodes[0].after("="); //식과 값 사이에 '='삽입

    const trash = document.createElement("a");
    trash.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>'; //
    trash.addEventListener("click", (e) => {
        e.preventDefault;
        e.target.parentNode.parentNode.remove();             
        if(historyContElem.children.length == 1) {
            historyNone.style.display = "block";
        };
    })

    li.appendChild(div);
    li.appendChild(trash);
    
    historyContElem.appendChild(li);
    historyNone.style.display = 'none'; //기록 없음을 안보이게
}

function makeBack() {
    let stack = []; //연산자 담을 스택
    let backCal = []; //결과값 담을 배열
    let temp = ''; //숫자 담을 스트링

    //output에 저장된 string을 하나씩 돌면서 
    [...outputElem.value].forEach(data => {        
        //숫자이거나 '.' temp에 누적
        if((parseInt(data) >= 0 && parseInt(data) < 10) || data == '.') {            
            temp += data;                  
        }
        //숫자가 아니면
        else {            
            //쌓아둔 숫자를 결과 값에 push
            if(temp != '') {
                backCal.push(parseFloat(temp));
                temp = '';
            }
            //스택에 들어간게 없으면 일단 넣음
            if(stack == '') stack.push(data);
            //이전 연산자와 넣을 연산자와 우선 순위 비교
            else {
                const lastIndex = stack.length - 1;
                //')'를 만나면 연산자 하나 빼고 '(' 제거
                if(data === ')'){
                    backCal.push(stack.pop());
                    stack.pop();
                }
                //이전 스택에 '('가 있으면 그냥 push
                else if(stack[lastIndex] === '(') stack.push(data);
                //우선순위가 더 낮으면 스택에 그냥 넣음     
                else if(compare[stack[lastIndex]] > compare[data]) {
                    stack.push(data);
                }
                //우선순위가 더 높으면 전껄 빼고 스택에 넣음
                else {
                    backCal.push(stack.pop());
                    stack.push(data);
                }
            }                          
        }          
    })
    //쌓아둔 숫자를 결과 값에 push
    if(temp != '') {
        backCal.push(parseFloat(temp));
        temp = '';
    }
    //스택을 돌면서 남은 연산자 결과값에 push
    while(stack != '') {
        backCal.push(stack.pop());
    }
    return backCal;
}


function calculate(backCal) {
    let stack = []; //숫자 담을 스택

    //후위표기식 하나씩 돌면서
    backCal.forEach(data => {
        if(typeof(data) == 'number') {
            stack.push(data);
        }
        else {
            const val2 = stack.pop();
            const val1 = stack.pop();
            switch(data) {
                case '+':
                    stack.push(val1 + val2);
                    break;
                case '-':
                    stack.push(val1 - val2);
                    break;
                case '*':
                    stack.push(val1 * val2);
                    break;
                case '/':
                    stack.push(val1 / val2);
                    break;
            }
        }
    })
    return stack[0];
}