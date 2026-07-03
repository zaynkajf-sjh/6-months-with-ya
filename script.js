// CONFETTI PAS MASUK HALAMAN HOME
function makeConfetti() {
    for(let i=0; i<25; i++){
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random()*100+'vw';
        c.style.background = ['#E9C4D2','#D8E7F3','#C8AD7F'][Math.floor(Math.random()*3)];
        c.style.animation = `confettiFall ${2+Math.random()*2}s linear ${Math.random()}s`;
        document.body.appendChild(c);
        setTimeout(()=>c.remove(), 4000);
    }
}
// Panggil pas load
window.addEventListener('load', makeConfetti);

// LOGIC GAME 3 STAGE
const lockScreen = document.getElementById('lockScreen');
const stageDesc = document.getElementById('stageDesc');
const errorText = document.getElementById('error');
let stage = 1;
const seq = [1,3,2,1,2,3,];
let userSeq = []; let playing = false;
document.getElementById('startSeq').onclick = playSequence;
document.querySelectorAll('.color-btn').forEach(btn=>{
    btn.onclick = ()=>{ if(playing) return;
        userSeq.push(parseInt(btn.id[1]));
        btn.classList.add('active'); setTimeout(()=>btn.classList.remove('active'), 200);
        if(userSeq.length === seq.length){
            if(JSON.stringify(userSeq) === JSON.stringify(seq)) nextStage();
            else { errorText.textContent = 'Salah urutan! Ulangi.'; userSeq=[]; }
        }
    }
});
function playSequence(){
    playing=true; userSeq=[]; errorText.textContent=''; document.getElementById('startSeq').disabled=true;
    let i=0; const int=setInterval(()=>{
        const id = 'c'+seq[i]; document.getElementById(id).classList.add('active');
        setTimeout(()=>document.getElementById(id).classList.remove('active'), 400);
        i++; if(i>=seq.length){ clearInterval(int); playing=false; document.getElementById('startSeq').disabled=false; }
    }, 600);
}
let clicks = 0;
function nextStage(){
    document.getElementById('stage'+stage).classList.remove('active');
    stage++; stageDesc.textContent = `Stage ${stage}/3: `;
    document.getElementById('stage'+stage).classList.add('active');
    errorText.textContent='';
    if(stage===2){ stageDesc.textContent+='Klik 5 target'; spawnTarget(); }
    if(stage===3){ stageDesc.textContent+='Tebak Angka'; }
}
function spawnTarget(){
    if(clicks>=5) return nextStage();
    const area = document.getElementById('clickArea'); area.innerHTML='';
    const t = document.createElement('div'); t.className='target';
    t.style.left = Math.random()*(area.clientWidth-40)+'px';
    t.style.top = Math.random()*(area.clientHeight-40)+'px';
    t.onclick = ()=>{ clicks++; document.getElementById('clickScore').textContent=clicks; spawnTarget(); }
    area.appendChild(t);
}
const secret = Math.floor(Math.random()*15)+1;
let lives = 10;
document.getElementById('guessBtn').onclick=()=>{
    const val = parseInt(document.getElementById('guessInput').value);
    if(isNaN(val)) return;
    if(val===secret){ lockScreen.classList.add('hide'); makeConfetti(); } // playMusic() dihapus
    else {
        lives--; document.getElementById('lives').textContent = `Nyawa: ${lives}`;
        document.getElementById('guessHint').textContent = val<secret?'Terlalu kecil ⬆️':'Terlalu besar ⬇️';
        if(lives<=0){ errorText.textContent='Game Over. Refresh buat ulang.'; document.getElementById('guessBtn').disabled=true; }
    }

}
function switchPage(pageId){
    document.querySelectorAll('.page,.menu-btn').forEach(x=>x.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    event.target.classList.add('active');
    if(pageId==='game') resetGame();
    if(pageId==='home') makeConfetti(); // confetti lagi pas balik ke home
}
const emojis = ['🧸','🧸','🌸','🌸','🤍','🤍','☁️','☁️','🍦','🍦','🪐','🪐','🔔','🔔','🎀','🎀'];
let hasFlippedCard=false,lockBoard=false,firstCard,secondCard,matchedPairs=0;
function shuffle(a){return a.sort(()=>Math.random()-.5)}
function createGameBoard(){ const g=document.getElementById('grid');g.innerHTML='';shuffle([...emojis]).forEach(e=>{const c=document.createElement('div');c.className='card';c.dataset.emoji=e;c.innerHTML=`<div class="card-front">${e}</div><div class="card-back"></div>`;c.onclick=flipCard;g.appendChild(c)})}
function flipCard(){if(lockBoard||this===firstCard)return;this.classList.add('flipped');if(!hasFlippedCard){hasFlippedCard=true;firstCard=this;return}secondCard=this;checkForMatch()}
function checkForMatch(){firstCard.dataset.emoji===secondCard.dataset.emoji?disableCards():unflipCards()}
function disableCards(){firstCard.onclick=null;secondCard.onclick=null;matchedPairs++;if(matchedPairs===8){document.getElementById('winBox').style.display='block'}resetBoard()}
function unflipCards(){lockBoard=true;setTimeout(()=>{firstCard.classList.remove('flipped');secondCard.classList.remove('flipped');resetBoard()},1000)}
function resetBoard(){[hasFlippedCard,lockBoard]=[false,false];[firstCard,secondCard]=[null,null]}
function resetGame(){document.getElementById('winBox').style.display='none';matchedPairs=0;resetBoard();createGameBoard()}
createGameBoard();