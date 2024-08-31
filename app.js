const sentenceTyped = document.querySelector(".sentence-typed");
sentenceTyped.value = "Start typing here ...";

sentenceTyped.addEventListener("focus", () => {
	sentenceTyped.classList.add("active");
	sentenceTyped.value = "";
});

let timerInterval;

document.addEventListener("keydown", (e) => {
	if (e.key === 'Escape') {
		init();
	}
});

function init() {
	sentenceTyped.value = "";
	score = 0;
	updateScore();
	if (timerInterval) {
		clearInterval(timerInterval);
	}
	getSentenceToWrite().then((sentence) => {
		sentenceToWrite = sentence;
	});
	startTimer();
}

const APIEndpoint = "http://api.quotable.io/random";
const sentenceToWritePlaceholder = document.querySelector(".sentence-to-type");
let sentenceToWrite = '';

async function getSentenceToWrite() {
	const response = await fetch(APIEndpoint);
	const data = await response.json();
	const sentence = data.content;
	sentenceToWritePlaceholder.textContent = sentence;
	return sentence;
}

function startTimer() {
	const timer = document.querySelector(".time");
	let time = 0;
	timer.textContent = `Time : ${time}`; // Réinitialiser l'affichage du timer
	timerInterval = setInterval(() => {
		time++;
		timer.textContent = `Time : ${time}`;
	}, 1000);
}




sentenceTyped.addEventListener("input", handleInput);

let score = 0;

function handleInput() {
    const typedText = sentenceTyped.value;
    let formattedSentence = '';
    let newScore = 0;

    for (let index = 0; index < sentenceToWrite.length; index++) {
        if (index < typedText.length) {
            if (typedText[index] === sentenceToWrite[index]) {
                formattedSentence += `<span style="background-color: green">${sentenceToWrite[index]}</span>`;
                newScore++;
            } else {
                formattedSentence += `<span style="background-color: red">${sentenceToWrite[index]}</span>`;
                newScore--;
            }
        } else {
            formattedSentence += sentenceToWrite[index];
        }
    }
    sentenceToWritePlaceholder.innerHTML = formattedSentence;
    score = Math.max(newScore, score);
    updateScore();
    checkGameEnd(typedText);
}

const scoreElement = document.querySelector(".score");

function updateScore() {
	scoreElement.textContent = `Score : ${score}`;
}

function checkGameEnd(typedText) {
	if (typedText === sentenceToWrite) {
		clearInterval(timerInterval);
		const timer = document.querySelector(".time");
		const finalTime = parseInt(timer.textContent.split(":")[1].trim());
		const wordsPerMinute = calculateWordsPerMinute(sentenceToWrite, finalTime);
		displayEndGameMessage(wordsPerMinute);
	}
}

function calculateWordsPerMinute(text, seconds) {
	const words = text.trim().split(/\s+/).length;
	console.log(words);
	const minutes = seconds / 60;
	return Math.round(words / minutes);
}

function displayEndGameMessage(wordsPerMinute) {
	sentenceTyped.value = "";
	sentenceTyped.value = `Game finished ! Your speed is ${wordsPerMinute} words per minute. Congratulations ! 🎉`;
}
