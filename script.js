// কুইজ ডাটাবেস
const quizData = [
    { question: "বাংলাদেশের জাতীয় দিবস কোনটি?", options: ["২১শে ফেব্রুয়ারি", "২৬শে মার্চ", "১৬ই ডিসেম্বর", "১৪ই এপ্রিল"], correct: 1 },
    { question: "পানির রাসায়নিক সংকেত কী?", options: ["CO2", "H2O", "O2", "NaCl"], correct: 1 },
    { question: "সূর্য একটি ___?", options: ["গ্রহ", "নক্ষত্র", "উপগ্রহ", "ছায়াপথ"], correct: 1 },
    { question: "কোন প্রাণী দাঁড়িয়ে ঘুমায়?", options: ["হাতি", "ঘোড়া", "জিরাফ", "উট"], correct: 1 },
    { question: "১ গিগাবাইট (GB) = কত মেগাবাইট?", options: ["১০০০", "১০২৪", "৫১২", "২০৪৮"], correct: 1 },
    { question: "সবচেয়ে হালকা গ্যাস কোনটি?", options: ["অক্সিজেন", "হাইড্রোজেন", "নাইট্রোজেন", "হিলিয়াম"], correct: 1 },
    { question: "মানুষের শরীরে হাড়ের সংখ্যা কত?", options: ["২০৬", "২০৮", "৩০৬", "১০০"], correct: 0 },
    { question: "বিশ্বের বৃহত্তম বদ্বীপ কোনটি?", options: ["সুন্দরবন", "গ্রিনল্যান্ড", "মাদাগাস্কার", "গাঙ্গেয় বদ্বীপ"], correct: 3 },
    { question: "ChatGPT এর নির্মাতা প্রতিষ্ঠান কোনটি?", options: ["Google", "Microsoft", "OpenAI", "Meta"], correct: 2 },
    { question: "ক্রিকেট খেলায় স্ট্যাম্পের দৈর্ঘ্য কত?", options: ["২৮ ইঞ্চি", "৩০ ইঞ্চি", "২২ ইঞ্চি", "২৫ ইঞ্চি"], correct: 0 }
];

let currentQuiz = 0;
let score = 0;
let level = 1;
let timer;
let timeLeft = 15; // প্রতি প্রশ্নের জন্য ১৫ সেকেন্ড

// HTML এলিমেন্ট
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const progressEl = document.getElementById('progress');
const feedbackEl = document.getElementById('feedback');
const timerEl = document.getElementById('timer');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

// সাউন্ড সিস্টেম (ফাইল ছাড়া সাউন্ড তৈরি করবে)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine'; // মিষ্টি সাউন্ড
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth'; // কর্কশ সাউন্ড
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

// গেম শুরু
loadQuiz();

function loadQuiz() {
    clearInterval(timer);
    timeLeft = 15;
    timerEl.innerText = timeLeft;
    timerEl.style.color = "#e74c3c";
    
    optionsContainer.innerHTML = '';
    feedbackEl.innerText = '';
    
    if(currentQuiz >= quizData.length) {
        showResult();
        return;
    }

    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    
    // প্রোগ্রেস বার
    const progressPercent = ((currentQuiz) / quizData.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    // অপশন তৈরি
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('btn-option');
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if(timeLeft <= 5) timerEl.style.color = "red"; // শেষ ৫ সেকেন্ড লাল হবে
        
        if(timeLeft === 0) {
            clearInterval(timer);
            playSound('wrong');
            feedbackEl.innerText = "সময় শেষ!";
            feedbackEl.style.color = "red";
            autoNext();
        }
    }, 1000);
}

function checkAnswer(selectedIndex, selectedButton) {
    clearInterval(timer);
    const currentQuizData = quizData[currentQuiz];
    const allButtons = optionsContainer.children;

    for(let btn of allButtons) btn.disabled = true;

    if (selectedIndex === currentQuizData.correct) {
        playSound('correct');
        score += 10;
        selectedButton.classList.add('correct');
        feedbackEl.innerText = "সঠিক উত্তর!";
        feedbackEl.style.color = "green";
    } else {
        playSound('wrong');
        selectedButton.classList.add('wrong');
        gameScreen.classList.add('shake'); // ভুল হলে কাঁপবে
        setTimeout(() => gameScreen.classList.remove('shake'), 500);
        
        // সঠিক উত্তর দেখিয়ে দেওয়া
        allButtons[currentQuizData.correct].classList.add('correct');
        feedbackEl.innerText = "ভুল! সঠিক উত্তর সবুজ মার্ক করা হয়েছে।";
        feedbackEl.style.color = "red";
    }

    scoreEl.innerText = score;
    
    // লেভেল আপ লজিক
    if(score > 0 && score % 50 === 0) {
        level++;
        levelEl.innerText = level;
    }

    setTimeout(() => {
        currentQuiz++;
        loadQuiz();
    }, 2000);
}

function autoNext() {
    // সময় শেষ হলে সঠিক উত্তর দেখিয়ে পরের প্রশ্নে যাবে
    const currentQuizData = quizData[currentQuiz];
    const allButtons = optionsContainer.children;
    for(let btn of allButtons) btn.disabled = true;
    allButtons[currentQuizData.correct].classList.add('correct');
    
    setTimeout(() => {
        currentQuiz++;
        loadQuiz();
    }, 2000);
}

function showResult() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('final-score-display').innerText = score;
    
    const msg = document.getElementById('final-message');
    if(score >= 80) msg.innerText = "অসাধারণ! আপনি একজন জিনিয়াস! 🌟";
    else if(score >= 50) msg.innerText = "ভালো খেলেছেন! আর একটু চেষ্টা করুন। 👍";
    else msg.innerText = "হয়নি! আবার চেষ্টা করুন। 😢";
}

function shareOnFacebook() {
    const url = window.location.href;
    const shareText = `আমি কুইজ মাস্টারে ${score} পয়েন্ট পেয়েছি! তুমি কি আমাকে হারাতে পারবে?`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
}
