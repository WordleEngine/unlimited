class Solver {
    constructor() {
        this.known = { word: Array(5).fill(null), contains: new Set(), not: new Set(), badpos: [] };
        this.guessWords = constGuessWords
    }

    isValid(key) {
        return this.known.word.every((val, i) => val === null || val === key[i]) &&
            [...this.known.contains].every(i => key.includes(i)) &&
            [...this.known.not].every(i => !key.includes(i)) &&
            this.known.badpos.every((posList) => posList.every((char, j) => key[j] !== char));
    }

    reset() {
        this.guessWords = constGuessWords
        this.known = { word: Array(5).fill(null), contains: new Set(), not: new Set(), badpos: [] };
    }

    update(word, values) {
        let bp = values.map((value, i) => (value ? null : word[i]));
        values.forEach((value, i) => {
            if (value) {
                this.known.word[i] = word[i];
            } else if (value === null) {
                this.known.contains.add(word[i]);
            } else if (!value) {
                this.known.not.add(word[i]);
            }
        });

        this.known.badpos.push(bp);
        this.guessWords = this.guessWords.filter(word => this.isValid(word));
    }

    score(word) {
        let score = 0;
        let already = new Set([...this.known.word, ...this.known.not]);
        word.split('').forEach((c, i) => {
            if (!already.has(c)) {
                already.add(c);
                score += letterFrequency[c][i];
                if (this.known.contains.has(c)) {
                    score -= letterFrequency[c][i] / 2;
                }
            }
        });
        return score;
    }

    top(count = null) {
        const scores = this.guessWords.map(word => [this.score(word), word]);
        const sortedIndices = scores.map((_, i) => i)
            .sort((a, b) => scores[b][0] - scores[a][0] || scores[a][1].localeCompare(scores[b][1]));
        return (count !== null ? sortedIndices.slice(0, count) : sortedIndices)
            .map(i => this.guessWords[i]);
    }
}
