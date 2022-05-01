// ########################## DOM ##########################
const wordElem = document.querySelector(".word");
const wallElem = document.querySelector(".wall-wrap");
const ghostElem = document.querySelector("#ghost");
const faceElem = document.querySelector("#XMLID_1307_");

// ########################## Variable ##########################
let last_scroll = 0; //마지막에 스크롤한 위치
let stop_check; // 스크롤 하고 있는지 감지
let isStopped = false;

// ########################## Event ##########################
window.addEventListener("scroll", function() {
    isStopped = false;

    clearTimeout(stop_check);
    stop_check = setTimeout(function() {            
        isStopped = true;
        ghostAnim();
    }, 100);

    ghostAnim();
    moveWall(window.pageYOffset); //벽 움직이기
})
document.addEventListener("mousemove", function(e) {
    ghostElem.style.left = e.pageX + 'px';
})


// ########################## function ##########################

// 고스트를 작업 함수
function ghostAnim() {    
    if(isStopped) {
        ghostElem.style.animationDuration = 0 + "s"; //애니메이션 멈춤
        changeFace(true);
        return
    }
    ghostElem.style.animationDuration = 0.5 + "s"; //애니메이션 재생
    
    //스크롤 방향 체크후 얼굴변경
    if (window.pageYOffset > last_scroll) {
        changeFace(false);
    }else {        
        changeFace(true);
    }
    last_scroll = window.pageYOffset; //마지막 스크롤 위치 담기
}

//고스트 얼굴 바꾸는 함수
function changeFace(dir) {
    if(dir) {
        faceElem.querySelector("#XMLID_1338_").style.display = "block";
        faceElem.querySelector("#XMLID_1339_").style.display = "block";
    }else {
        faceElem.querySelector("#XMLID_1338_").style.display = "none";
        faceElem.querySelector("#XMLID_1339_").style.display = "none";
    }
}

//벽을 움직이는 함수
function moveWall(currentY) {
    const maxY = this.document.body.offsetHeight - this.innerHeight; //스크롤의 마지막 값
    const scroll_per = currentY/maxY; //스크롤 한 값을 퍼센테이지로 변경
    const total_length = 6000; //이동 최대 거리
    wallElem.style.transform = `translateZ(${total_length * scroll_per}px)`; //이동 시키기
}