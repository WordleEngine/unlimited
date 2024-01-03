const letters = "abcdefghijklmnopqrstuvwxyz";
const all = document.getElementsByClassName("letter");
let num = 0;
let line = 1;
const color = {
    true: '#538D4E',
    null: '#B59F3B',
    false: '#3A3A3C'
}
const wordle = document.getElementsByClassName("wordleContainer")[0];
const bodysize = document.documentElement.clientHeight
console.log(bodysize)
wordle.style.height = Math.round((5/26)*bodysize+215+(1/26)) +'px'
wordle.style.width = (Math.round((5/26)*bodysize+215+(1/26))/6)*5 +'px'
wordle.style.marginTop = (((35/312)*bodysize-(19891/312))/44.5)*46 + 'px'
wordle.style.marginBottom = (((35/312)*bodysize-(19891/312))/44.5)*40 + 'px'
const key = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
const grey = document.getElementsByClassName("letterContainer");
const game = new Game();
let words = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]
let colors = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
]
function colorKeys() {
    let truewords = []
    let truecolors = []
    for (let i = 0; i < line - 1; i++) {
        truewords.push(words[i].join(""))
        truecolors.push(colors[i])
    }
    for (let i = 0; i < 26; i++) {
        keys[i].style.backgroundColor = ''
    }
    for (let i = 0; i < truewords.length; i++) {
        for (let j = 0; j < truewords[i].length; j++) {
            if ((keys[key.indexOf(truewords[i][j])].style.backgroundColor) != 'rgb(83, 141, 78)') {
                if ((truecolors[i][j] == false && keys[key.indexOf(truewords[i][j])].style.backgroundColor == '') || truecolors[i][j] != false) {
                    keys[key.indexOf(truewords[i][j])].style.backgroundColor = color[truecolors[i][j]]
                }
            }
        }
    }
}
function getWord() {
    solver.reset()
    let truewords = []
    let truecolors = []
    for (let i = 0; i < line - 1; i++) {
        truewords.push(words[i].join(""))
        truecolors.push(colors[i])
    }
    const filter = words[truewords.length]
    for (let i = 0; i < truewords.length; i++) {
        solver.update(truewords[i], truecolors[i])
    }

    const top = solver.top()
    let truel = ""
    for (let i = 0; i < top.length; i++) {
        let w = true
        for (let j = 0; j < 5; j++) {
            if (top[i][j] != filter[j] && filter[j] != null) {
                w = false
            }
        }
        if (w) {
            truel = top[i]
            break
        }
    }
    let word = ["", "", "", "", ""]
    if (truel != "" && (!colors.some(subarray => subarray.every((value, index) => value === [true, true, true, true, true][index])))) {
        word = truel.toUpperCase().split("")
    }
    for (let i = 0; i < 26; i++) {
        keys[i].style.backgroundColor = ''
    }
    for (let i = 0; i < truewords.length; i++) {
        for (let j = 0; j < truewords[i].length; j++) {
            if ((keys[key.indexOf(truewords[i][j])].style.backgroundColor) != 'rgb(83, 141, 78)') {
                if ((truecolors[i][j] == false && keys[key.indexOf(truewords[i][j])].style.backgroundColor == '') || truecolors[i][j] != false) {
                    keys[key.indexOf(truewords[i][j])].style.backgroundColor = color[truecolors[i][j]]
                }
            }
        }
    }
    return word
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.onkeydown = async function(e) {
    e = e || window.event;
    await prosseskey(e.key)
}
async function prosseskey(key, e = false) {
    // Check if the pressed key is the backspace key
    if (key === "Backspace" && num != (line - 1) * 5) {
        if (e) {
            e.preventDefault();
        }
        num -= 1;
        all[num].innerHTML = "";
        words[line - 1][num - (line - 1) * 5] = null
    } else if (letters.includes(key) && num < line * 5) {
        // Check if the pressed key corresponds to a letter
        all[num].innerHTML = key.toUpperCase();
        words[line - 1][num - (line - 1) * 5] = key
            // Add the "lettergreen" class
        num++;
    } else if (key === "Enter" || key === "Tab") {
        if (e) {
            e.preventDefault();
        }
        let word = words[line - 1].join('')
        let score = game.score(word)
        if (score != null) {
            num = line * 5
            line++;
            for (let i = 0; i < 5; i++) {
                if (score[i] == true) {
                    grey[i + (line - 2) * 5].classList.add("togreen");
                }else if (score[i] == null) {
                    grey[i + (line - 2) * 5].classList.add("toyellow");
                }else if (score[i] == false) {
                    grey[i + (line - 2) * 5].classList.add("togrey");
                }
            }
            for (let i = 0; i < 5; i++) {
                grey[i + (line - 2) * 5].classList.add("flip1");
                if (i != 4) {
                    await sleep(200);
                }
            }
            await sleep(500);
            colorKeys()
        }
    }
};
const keys = document.getElementsByClassName('key')
for (let i = 0; i < 26; i++) {
    keys[i].addEventListener("click", function() {
        prosseskey(key[i])
    })
}
const keyb = document.getElementsByClassName('bigkey')
large = ["Enter", "Backspace"]
for (let i = 0; i < 2; i++) {
    keyb[i].addEventListener("click", function() {
        prosseskey(large[i])
    })
}

// Add click event listeners to each letter element
for (let i = 0; i < grey.length; i++) {
    grey[i].addEventListener('animationend', function() {
        if (this.classList.contains('flip1')) {
            if (this.classList.contains('toyellow')) {
                this.classList.remove('toyellow');
                this.classList.remove('lettergreen');
                this.classList.add('letteryellow');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = null
            } else if (this.classList.contains('togreen')) {
                this.classList.remove('lettergrey')
                this.classList.remove('togreen');
                this.classList.add('lettergreen');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = true
            } else if (this.classList.contains('togrey')) {
                this.classList.remove('letteryellow')
                this.classList.remove('togrey');
                this.classList.add('lettergrey');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = false
            } else if (this.classList.contains('lettergrey')) {
                this.classList.remove('lettergrey');
                this.classList.add('letteryellow');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = null
            } else if (this.classList.contains('letteryellow')) {
                this.classList.add('lettergreen');
                this.classList.remove('letteryellow');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = true
            
            } else if (this.classList.contains('lettergreen')) {
                this.classList.remove('lettergreen');
                this.classList.add('lettergrey');
                colors[Math.floor(i / 5)][i - Math.floor(i / 5) * 5] = false
            } else {
                this.classList.add('lettergrey');
            }
            this.classList.remove('flip1')
            this.classList.add('flip2')
        } else {
            this.classList.remove('flip2')
        }
    })
    /*
    grey[i].addEventListener("click", function() {
        if (this.classList.contains('flip1')) {
            if (this.classList.contains('lettergrey')) {
                this.classList.add('togreen')
            } else if (this.classList.contains('letteryellow')) {
                this.classList.add('togrey')
            } else if (this.classList.contains('lettergreen')) {
                this.classList.add('toyellow')
            }
        }
        if (!this.classList.contains('flip1') && !this.classList.contains('flip2') && (this.classList.contains('letteryellow') || this.classList.contains('lettergreen') || this.classList.contains('lettergrey'))) {
            this.classList.add('flip1')
        }
    });*/
}

const image = document.getElementsByClassName('reload')[0];

image.addEventListener('click', function(event) {
    event.preventDefault();
    location.reload();
});
const image2 = document.getElementsByClassName('infinity')[0];

image2.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'https://wordleengine.github.io';
});
