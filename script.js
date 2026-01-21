// অটোমেটেড প্রশ্ন ব্যাংক (আপনি চাইলে পরে আরও বাড়াতে পারবেন)
const quizData = [
    {
        question: "বাংলাদেশের জাতীয় দিবস কোনটি?",
        options: ["২১শে ফেব্রুয়ারি", "২৬শে মার্চ", "১৬ই ডিসেম্বর", "১৪ই এপ্রিল"],
        correct: 1 // Index 1 means "২৬শে মার্চ"
    },
    {
        question: "পানির রাসায়নিক সংকেত কী?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        correct: 1
    },
    {
        question: "কম্পিউটারের মস্তিষ্ক বলা হয় কোনটিকে?",
        options: ["Monitor", "RAM", "CPU", "Keyboard"],
        correct: 2
    },
    {
        question: "বিশ্বের সবচেয়ে বড় সমুদ্র কোনটি?",
        options: ["আটলান্টিক", "ভারত মহাসাগর", "প্রশান্ত মহাসাগর", "আর্কটিক"],
        correct: 2
    },
    {
        question: "মানুষের শরীরে মোট হাড়ের সংখ্যা কত?",
        options: ["২০৬", "২০৮", "৩০৬", "১০০"],
        correct: 0
    },
    {
        question: "সূর্য একটি ___?",
        options: ["গ্রহ", "নক্ষত্র", "উপগ্রহ", "ছায়াপথ"],
        correct: 1
    },
    {
        question: "বাংলাদেশের বৃহত্তম বদ্বীপ কোনটি?",
        options: ["সুন্দরবন", "দ্বীপ বদ্বীপ", "মেঘনা বদ্বীপ", "গাঙ্গেয় বদ্বীপ"],
        correct: 0
    },
    {
        question: "ভলিবল খেলায় প্রতি দলে কতজন খেলোয়াড় থাকে?",
        options: ["৫ জন", "৬ জন", "৭ জন", "১১ জন"],
        correct: 1
    },
    {
        question: "কোন প্রাণী দাঁড়িয়ে ঘুমায়?",
        options: ["হাতি", "ঘোড়া", "জিরাফ", " উট"],
        correct: 1
    },
    {
        question: "১ গিগাবাইট (GB) = কত মেগাবাইট (MB)?",
        options: ["১০০০ MB", "১০২৪ MB", "৫১২ MB", "১০৫০ MB"],
        correct: 1
    },
    {
        question: "ChatGPT কী ধরনের প্রযুক্তি?",
        options: ["Search Engine", "AI Chatbot", "Social Media", "Browser"],
        correct: 1
    },
    {
        question: "কোন রঙের তরঙ্গদৈর্ঘ্য সবচেয়ে বেশি?",
        options: ["নীল", "সবুজ", "লাল", "বেগুনী"],
        correct: 2
    },
    {
        question: "বাংলাদেশের টাকার নোটে কার ছবি থাকে?",
        options: ["জাতীয় কবি", "বঙ্গবন্ধু", "প্রধানমন্ত্রী", "রাষ্ট্রপতি"],
        correct: 1
    },
    {
        question: "পৃথিবীর ফুসফুস বলা হয় কাকে?",
        options: ["হিমালয়", "সুন্দরবন", "আমাজন জঙ্গল", "সাহারা মরুভূমি"],
        correct: 2
    },
    {
        question: "সবচেয়ে হালকা গ্যাস কোনটি?",
        options: ["অক্সিজেন", "হাইড্রোজেন", "নাইট্রোজেন", "হিলিয়াম"],
        correct: 1
    }
];

// গেম ভেরিয়েবল
let currentQuiz = 0;
let score = 0;
let level = 1;

// HTML এলিমেন্ট ধরা
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const progressEl = document.getElementById('progress');
const feedbackEl = document.getElementById('feedback');

// গেম শুরু
loadQuiz();

function loadQuiz() {
    // আগের অপশন ক্লিয়ার করা
    optionsContainer.innerHTML = '';
    feedbackEl.innerText = '';
    feedbackEl.className = 'feedback';
    
    // কুইজ শেষ হয়েছে কিনা চেক করা
    if(currentQuiz >= quizData.length) {
        endGame();
        return;
    }

    // বর্তমান প্রশ্ন সেট করা
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;

    // প্রোগ্রেস বার আপডেট
    const progressPercent = (currentQuiz / quizData.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    // অপশন বাটন তৈরি করা
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('btn-option');
        button.onclick = () => checkAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    const currentQuizData = quizData[currentQuiz];
    const allButtons = optionsContainer.children;

    // বাটন ডিজেবল করে দেওয়া যাতে দুইবার ক্লিক না করে
    for(let btn of allButtons) {
        btn.disabled = true;
        if(btn.innerText === currentQuizData.options[currentQuizData.correct]) {
            btn.classList.add('correct'); // সঠিক উত্তর সবুজ করা
        }
    }

    if (selectedIndex === currentQuizData.correct) {
        score += 10;
        feedbackEl.innerText = "চমৎকার! সঠিক উত্তর।";
        feedbackEl.style.color = "green";
        selectedButton.classList.add('correct');
        checkLevelUp();
    } else {
        feedbackEl.innerText = "ভুল উত্তর! সঠিক উত্তরটি সবুজ মার্ক করা হলো।";
        feedbackEl.style.color = "red";
        selectedButton.classList.add('wrong');
    }

    scoreEl.innerText = score;

    // ১.৫ সেকেন্ড পর পরের প্রশ্নে যাওয়া
    setTimeout(() => {
        currentQuiz++;
        loadQuiz();
    }, 1500);
}

function checkLevelUp() {
    // প্রতি ১০০ পয়েন্টে লেভেল আপ
    if (score > 0 && score % 50 === 0) {
        level++;
        levelEl.innerText = level;
        alert(`অভিনন্দন! আপনি Level ${level}-এ উঠেছেন!`);
    }
}

function endGame() {
    questionEl.innerText = "খেলা শেষ! আপনার মোট স্কোর: " + score;
    optionsContainer.innerHTML = `
        <button class="btn-option" onclick="location.reload()">আবার খেলুন</button>
    `;
    progressEl.style.width = '100%';
    feedbackEl.innerText = score > 100 ? "অসাধারণ পারফরম্যান্স!" : "আর একটু চেষ্টা করুন!";
}
