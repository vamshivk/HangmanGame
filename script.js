// DOM elements
const questionInput = document.getElementById("question-input");
const optionInput = document.getElementById('optionContainer');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector(".play-again");
hangmanImage.src = "images/hangman-0.svg";

var qs = window.location.search;
const urlparams = new URLSearchParams(qs);
const diff = urlparams.get('difficulty')
let scorePointer = 0;
let currentIndex = 0; // To keep track of the current question index
let wrongGuessCount = 0; // To keep track of the wrong guess count
let maxGuesses = 6;

function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

console.log(diff ,`https://opentdb.com/api.php?amount=10&category=18&difficulty=${diff}&type=multiple`)
fetch(`https://opentdb.com/api.php?amount=10&category=18&difficulty=${diff}&type=multiple`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        localStorage.setItem('jsonData', JSON.stringify(data));

    })
    .catch(error => {
        console.error('Error fetching data: ', error);
    })

// Function to fetch a new question
async function fetchQuestion(index) {
    const storedJsonData = localStorage.getItem('jsonData');
    const questions = JSON.parse(storedJsonData);
    return questions.results[index];
}

// Function to display a question
async function showQuestion(index) {
    resetoptions();
    const data = await fetchQuestion(index);
    if (data) {
        let correctAnswer = data.correct_answer;
        let wrongAnswers = data.incorrect_answers;
        let optionList = wrongAnswers;
        optionList.splice(Math.floor(Math.random() * (wrongAnswers.length + 1)), 0, correctAnswer);

        questionInput.innerHTML = `${data.question}`;

        optionList.forEach((option) => {
            const opt = document.createElement('button');
            opt.innerHTML = option;
            opt.classList.add("option");
            opt.setAttribute('value', option);
            optionInput.appendChild(opt);
            opt.addEventListener('click', (e) => {
                verifyOption(correctAnswer, e);
            });
        });

    }
}

function resetoptions() {
    while (optionInput.firstChild) {
        optionInput.removeChild(optionInput.firstChild);
    }
}

// Initialize the game by showing the first question
showQuestion(currentIndex);

function verifyOption(correctAnswer, e) {
    var selectedOption = e.target;
    
    if (selectedOption.innerHTML === correctAnswer) {
        selectedOption.style.backgroundColor = "#075537";
        scorePointer++;
    }
    else {
        selectedOption.style.backgroundColor = "#C43C3C";
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;

    }

    const optionContainer = document.getElementById("optionContainer");
    const buttons = optionContainer.querySelectorAll(".option");
    buttons.forEach(button => {
        if (button.value === correctAnswer) {
            button.style.backgroundColor = "#075537";
        }
        button.disabled = true;
    });

    if (wrongGuessCount === maxGuesses) {
        gameOver(false);
    }
    else if (wrongGuessCount < maxGuesses && currentIndex >= 10) {
        gameOver(true);
    }
    else {
        setTimeout(() => {
            showQuestion(currentIndex++);
        }, 1000)
    }
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    console.log(isVictory)
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.classList.add("show");
}
playAgainBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});


