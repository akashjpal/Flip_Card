const cards = document.querySelectorAll(".card");
const seconds = document.querySelector(".seconds");
const minute = document.querySelector(".minute");
const final = document.querySelector(".final");
const congrats = document.querySelector("#congratsSection");
const again = document.querySelector(".again");
const totalTime = document.querySelector("#final-time");

let count=0;

let interval;
let firstCard, secondCard;
let hasFlippedCard = false;
let img1,img2;
let totalSeconds = 0;
let check;
let click = -1;
let lockBoard = false; //This will not allow 3/4 Consecutive clicks
let finaltime;


// let images = document.querySelectorAll("img");

for(var i=0;i<document.querySelectorAll(".card").length;i++){
  document.querySelectorAll(".card")[i].addEventListener("click", flipcard);
    // alert(this.id);
}

function flipcard() {
  if(lockBoard){
    return;
  }
  const imgurl = this.querySelector("img");
  const src = imgurl.getAttribute("src");
  if(this === firstCard){
    return;
  }
  document.querySelector("."+this.id).classList.remove("tog");
  if(!hasFlippedCard){
    startTime();
    firstCard = this;
    img1 = src;
    hasFlippedCard = true;
    return;
  }

  console.log(src);
  img2 = src;
  secondCard = this;
  if(hasFlippedCard){
    if(img1 === img2){
      // startTime();

      firstCard.removeEventListener("click", flipcard);
      secondCard.removeEventListener("click", flipcard);
      resetBoard();
      count +=2;

    }
    else{
      lockBoard = true;
      setTimeout(() => {
        firstCard.querySelector("img").classList.add("tog");
        secondCard.querySelector("img").classList.add("tog");
          resetBoard();
      }, 700);

    }
    setTimeout(() => {
      if(count===12){
        // alert("Hoorayy! You won");
        congrats.classList.replace("hidden", "show");
        clearInterval(interval);
        finaltime = minute.innerHTML + ":" + seconds.innerHTML;
        final.innerHTML = "You won in " + finaltime + " time!";
        totalTime.innerHTML = finaltime;

      }
    }, 700);
  }

  check = document.querySelector("."+this.id);
}
again.addEventListener("click", function(){
  congratsSection.classList.replace("show", "hidden");
  location.reload();
})

function resetBoard() {
  lockBoard = false;
  hasFlippedCard = false;
  firstCard = null;
  secondCard = null;
}

function startTime(){
  if(click === -1){
    interval = setInterval(function () {
      totalSeconds++;
      seconds.innerHTML = pad(parseInt(totalSeconds % 60));
      minute.innerHTML = pad(parseInt(totalSeconds / 60));
    },1000);
  }
  click = 1;
}
function pad(val){
  const valstring = val + "";
  if(valstring.length <2){
    return "0" + valstring;
  }
  else{
    return valstring;
  }
}
(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();
