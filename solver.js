class Solver {
    constructor() {
        this.guessWords = constGuessWords
        this.letterFrequency = letterFrequency
        this.known = { word: Array(5).fill(null), contains: [], not: [], badpos: [] };
    }

    isValid(key) {
        const yell = [];
        for (const [index, char] of key.split('').entries()) {
            if (this.known.word[index] === null) {
                yell.push(char);
            }
        }

        for (const containsChar of this.known.contains) {
            if (yell.includes(containsChar)) {
                yell.splice(yell.indexOf(containsChar), 1);
            } else {
                return false;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (this.known.word[i] !== null && this.known.word[i] !== key[i]) {
                return false;
            }
        }

        for (const notChar of this.known.not) {
            if (yell.includes(notChar)) {
                return false;
            }
        }

        for (let i = 0; i < this.known.badpos.length; i++) {
            const posList = this.known.badpos[i];
            for (let j = 0; j < 5; j++) {
                if (key[j] === posList[j]) {
                    return false;
                }
            }
        }

        return true;
    }

    update(word, values) {
        const bp = values.map((value, i) => (value ? null : word[i]));
        this.known.contains = []
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            if (value) {
                this.known.word[i] = word[i];
            } else if (value === null) {
                this.known.contains.push(word[i]);
            } else if (!value) {
                this.known.not.push(word[i]);
            }
        }

        this.known.badpos.push(bp);
        this.guessWords = this.guessWords.filter(word => this.isValid(word));
    }

    score(word) {
        let score = 0;
        const already = new Set([...this.known.word, ...this.known.not]);

        for (let i = 0; i < word.length; i++) {
            const c = word[i];
            if (!already.has(c)) {
                already.add(c);
                score += this.letterFrequency[c][i];
                if (this.known.contains.includes(c)) {
                    score -= this.letterFrequency[c][i] / 2;
                }
            }
        }

        return score;
    }

    top(count = null) {
        const scores = this.guessWords.map(word => [this.score(word), word]);
        const sortedIndices = scores
            .map((_, index) => index)
            .sort((a, b) => scores[b][0] - scores[a][0] || scores[b][1].localeCompare(scores[a][1]));

        return count !== null
            ? sortedIndices.slice(0, count).map(index => this.guessWords[index])
            : sortedIndices.map(index => this.guessWords[index]);
    }
    reset() {
        this.guessWords = constGuessWords
        this.known = { word: Array(5).fill(null), contains: [], not: [], badpos: [] };
    }
}
