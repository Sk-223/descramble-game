const wordLists = {
    easy: ["cat", "dog", "sun", "hat", "run", "book", "tree", "fish", "bird", "cake"],
    medium: ["python", "coding", "garden", "window", "puzzle", "basket", "market", "school", "family", "summer"],
    hard: ["javascript", "challenge", "computer", "elephant", "beautiful", "mountain", "adventure", "knowledge", "experience", "technology"]
};

let currentWord = "";
let tries = 0;
let mistakes = 0;
let currentDifficulty = "easy";

function scrambleWord(word) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
}

function generateRandomWord() {
    const words = wordLists[currentDifficulty];
    currentWord = words[Math.floor(Math.random() * words.length)];
    const scrambledWord = scrambleWord(currentWord);
    
    // Display scrambled word
    document.getElementById('scrambledWord').textContent = scrambledWord;
    
    // Clear and create input fields
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = ''; // Clear existing inputs
    createInputFields(currentWord.length);
    
    // Reset counters
    tries = 0;
    mistakes = 0;
    updateStats();
}

function createInputFields(length) {
    
    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.index = i;
        input.addEventListener('input', handleInput);
        inputContainer.appendChild(input);
    }
}

function showWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message';
    winMessage.innerHTML = `
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You guessed the word correctly!</p>
        <p>Word: ${currentWord}</p>
        <p>Tries: ${tries}</p>
        <p>Mistakes: ${mistakes}</p>
        <button onclick="resetGame()">Play Again</button>
    `;
    document.body.appendChild(winMessage);

    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti from left
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Confetti from right
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

function handleInput(event) {
    const input = event.target;
    const index = parseInt(input.dataset.index);
    
    // Move to next input if character is entered
    if (input.value.length === 1 && index < currentWord.length - 1) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
        nextInput.focus();
    }
    
    // Check if word is complete
    const inputs = document.querySelectorAll('#inputContainer input');
    const guessedWord = Array.from(inputs).map(input => input.value).join('');
    
    if (guessedWord.length === currentWord.length) {
        tries++;
        if (guessedWord.toLowerCase() === currentWord.toLowerCase()) {
            showWinMessage();
        } else {
            mistakes++;
            alert('❌ Wrong guess! Try again.');
        }
        updateStats();
    }
}

function updateStats() {
    document.getElementById('tries').textContent = tries;
    document.getElementById('mistakes').textContent = mistakes;
    document.getElementById('difficulty').textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
}

function resetGame() {
    // Remove win message if it exists
    const winMessage = document.querySelector('.win-message');
    if (winMessage) {
        winMessage.remove();
    }

    // Clear inputs
    const inputs = document.querySelectorAll('#inputContainer input');
    inputs.forEach(input => input.value = '');

    // Reset stats and generate new word
    tries = 0;
    mistakes = 0;
    updateStats();
    generateRandomWord();
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    // Update active button state
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${difficulty}Btn`).classList.add('active');
    // Generate new word with new difficulty
    generateRandomWord();
}

// Event Listeners
document.getElementById("randomButton").addEventListener("click", generateRandomWord);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("easyBtn").addEventListener("click", () => setDifficulty("easy"));
document.getElementById("mediumBtn").addEventListener("click", () => setDifficulty("medium"));
document.getElementById("hardBtn").addEventListener("click", () => setDifficulty("hard"));

// Initialize the game
generateRandomWord();