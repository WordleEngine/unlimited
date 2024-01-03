const YELLOW = null;
const GRAY = false;
const GREEN = true;

class Game {
    constructor() {
        this.word = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
    }

    score(userWord) {
        if (! (possibleGuesses.includes(userWord) ||possibleAnswers.includes(userWord))) {
            return null;
        }
        userWord = userWord.split('')
        const realWord = this.word.split(''); // Convert this.word to an array

        let score = userWord.map((letter, index) => letter === realWord[index] ? GREEN : GRAY);

        let letters = realWord.map((letter, index) => ({ letter, color: score[index] })).filter(({ color }) => color === GRAY).map(({ letter }) => letter);

        for (let i = 0; i < 5; i++) {
            if (score[i] === GREEN) {
                continue;
            }
            if (letters.includes(userWord[i])) { // Use includes() instead of contains()
                letters.splice(letters.indexOf(userWord[i]), 1);
                score[i] = YELLOW;
            }
        }

        return score;
    }
}
