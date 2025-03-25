"use strict";

let freeCookies = false;
let wins = 0;
let fails = 0;
let plays = 4;
let btnRoll = document.querySelector("button#roll");

function fixFooter(){
    let footer = document.querySelector("footer");
    if((document.body.offsetHeight - footer.offsetHeight) < window.innerHeight){
        footer.style.position = "absolute";
        footer.style.bottom = "0px";
    } else{
        footer.style.removeProperty("position");
        footer.style.removeProperty("bottom");
    }
}

function getCookie(cName){
    let arrayCookies = decodeURIComponent(document.cookie).split(";");
    let result = "";
    arrayCookies.forEach(val => {
        if(val.trimStart().indexOf(cName + "=") === 0){
            result = val.trimStart().substring(String(cName + "=").length, val.trimStart().length);
        }
    });
    return result;
}

function gameStatus(w, f){
    if(w > 99){
        w = "+99";
    }
    if(f > 99){
        f = "+99";
    }
    document.querySelector("p#youWin").innerText = `Você ganhou: ${w} vezes`;
    document.querySelector("p#youLose").innerText = `Você perdeu: ${f} vezes`;
    let p1 = document.querySelector("div#p1Die > p");
    let p2 = document.querySelector("div#p2Die > p");
    if(w+2 < f){
        p1.innerText = `Player 1 (Computador) 🔥`;
        p2.innerText = `Player 2 (Você) (azarado)`;
    } else if(f+2 < w){
        p1.innerText = "Player 1 (Computador) (azarado)";
        p2.innerText = "Player 1 (Você) 🔥";
    }
    if(freeCookies){
        let playsUpdate = {
            "win": String(wins),
            "lose": String(fails),
            "plays": String(wins + fails)
        };
        setCookie("plays", JSON.stringify(playsUpdate), 7);
    }
}

function setCookie(cName, cValue, exDays){
    const d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    document.cookie = `${cName}=${cValue}; expires=${d}; path=/`;
}

window.addEventListener("load", ()=>{
    fixFooter();
    let userStatus = getCookie("plays");
    if(userStatus != ""){
        wins = Number(JSON.parse(userStatus)["win"]);
        fails = Number(JSON.parse(userStatus)["lose"]);
        plays = Number(JSON.parse(userStatus)["plays"]);
        freeCookies = true;
        gameStatus(wins, fails);
    } else {
        document.querySelector("div#divCookie").style.display = "block";
    }
});

window.addEventListener("resize", ()=>{fixFooter()});

document.querySelector("button#cookieAccept").addEventListener("click", ()=>{
    let initPlay = {
        "win": String(wins),
        "lose": String(fails),
        "plays": String(wins + fails)
    };
    wins = Number(JSON.stringify(initPlay)["win"]) + wins;
    fails = Number(JSON.stringify(initPlay)["lose"]) + fails;
    plays = Number(JSON.stringify(initPlay)["plays"]) + plays;
    plays = fails + plays;
    document.querySelector("div#divCookie").style.display = "none";
    setCookie("plays", JSON.stringify(initPlay), 7);
    location.reload();
});

document.querySelector("button#cookieReject").addEventListener("click", ()=>{
    document.querySelector("div#divCookie").remove();
});

document.querySelector("button#closeWarning").addEventListener("click", ()=>{
    document.querySelector("div#warning").remove();
});

document.querySelector("button#closeRules").addEventListener("click", ()=>{
    document.querySelector("div#rules").remove();
});

btnRoll.addEventListener("click", ()=>{
    btnRoll.disabled = true;
    let p1 = document.querySelector("div#p1Die > img");
    let p2 = document.querySelector("div#p2Die > img");
    let result = document.querySelector("div#gameResults");
    let animetion = Math.round(Math.random());
    let rollDelay = 0.5;
    let numRandom1;
    let numRandom2;
    let degs = 90;
    let i = 1;
    let rolling = setInterval(()=>{
        if(i >= 6){
            clearInterval(rolling);
            setTimeout(
                ()=>{
                    if(numRandom1 > numRandom2){
                        if(fails <= 100){
                            fails += 1;
                        }
                        result.querySelector("p").innerText = "Você perdeu! Que pena!";
                    } else if(numRandom1 === numRandom2){
                        result.querySelector("p").innerText = "Bem... foi um empate!";
                    } else{
                        if(fails <= 100){
                            wins += 1;
                        }
                        result.querySelector("p").innerText = "Você venceu! Parabéns!";
                    }
                    result.style.display = "flex";
                    result.style.opacity = "1";
                    setTimeout(()=>{
                        result.style.opacity = "0";
                        setTimeout(()=>{
                            result.style.display = "none";
                        }, 0.15 * 2000)
                    }, 2000);

                    plays = fails + wins;

                    if(plays === 4){
                        document.querySelector("div#warning").style.display = "flex";
                    }
                    
                    p1.style.transition = "none";
                    p2.style.transition = "none";
                    p1.style.transform = `rotate(0deg)`;
                    p2.style.transform = `rotate(0deg)`;
                    setTimeout(()=>{
                        p1.style.transition = `transform ${rollDelay}s`;
                        p2.style.transition = `transform ${rollDelay}s`;
                    }, 1000);

                    gameStatus(wins, fails);

                    btnRoll.disabled = false;
                    
                    return;
                },
                0.5 * 1000
            );
        }
        numRandom1 = Math.floor(Math.random() * 6 + 1);
        numRandom2 = Math.floor(Math.random() * 6 + 1);
        if(animetion){
            p1.style.transform = `rotate(${degs}deg)`;
            p2.style.transform = `rotate(-${degs}deg)`;
        } else{
            p1.style.transform = `rotate(-${degs}deg)`;
            p2.style.transform = `rotate(${degs}deg)`;
        }
        setTimeout(()=>{
            p1.src = `imgs/dice${numRandom1}.png`;
            p1.alt = `Dado com o lado ${numRandom1}`;
            p2.src = `imgs/dice${numRandom2}.png`;
            p2.alt = `Dado com o lado ${numRandom2}`;
        }, (rollDelay - 0.1) * 1000);
        degs += 90;
        i++;
    }, (rollDelay + 0.2) * 1000);
});
