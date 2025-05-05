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
    
    // Create input fields
    createInputFields(currentWord.length);
    
    // Reset counters
    tries = 0;
    mistakes = 0;
    updateStats();
}

function createInputFields(length) {
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = '';
    
    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.index = i;
        input.addEventListener('input', handleInput);
        inputContainer.appendChild(input);
    }
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
            alert('You guessed it!');
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
    const inputs = document.querySelectorAll('#inputContainer input');
    inputs.forEach(input => input.value = '');
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