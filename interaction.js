const letters = "abcdefghijklmnopqrstuvwxyz";
const all = document.getElementsByClassName("letter");
let num = 0;
let line = 1;
const grey = document.getElementsByClassName("letterContainer");
const solver = new Solver();
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
function getWord() {
    solver.reset()
    let truewords = []
    let truecolors = []
    for (let i =0; i < 6; i++) {
        if (! words[i].includes(null)) {
            truewords.push(words[i].join(""))
            truecolors.push(colors[i])
        }
    }
    const filter = words[truewords.length]
    for (let i =0; i < truewords.length; i++) {
        solver.update(truewords[i], truecolors[i])
    }

    const top = solver.top()
    let truel = ""
    for (let i = 0; i < top.length; i++) {
        let w = true
        for (let j=0; j < 5; j++) {
            if (top[i][j] != filter[j] && filter[j]!=null) {
                w = false
            }
        }
        if (w) {
            truel = top[i]
            break
        }
    }
    let word = ["", "", "", "", ""]
    if (truel != "" && (! colors.some(subarray => subarray.every((value, index) => value === [true, true, true, true, true][index])))) {
        word = truel.toUpperCase().split("")
    }
    return word
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.onkeydown = async function (e) {
    e = e || window.event;

    // Check if the pressed key is the backspace key
    if (e.key === "Backspace" && num != (line-1) * 5) {
        num -= 1;
        all[num].innerHTML = "";
        words[line-1][num-(line-1)*5] = null
        all[num].classList.add("guess")
        const wordi = getWord()
        for (let j = 0; j < 5; j++) {
            if (all[((line-1)*5)+j].classList.contains("guess")) {
                all[((line-1)*5)+j].innerHTML = wordi[j]
            }
        }
    } else if (letters.includes(e.key) && num <= line * 5) {
        // Check if the pressed key corresponds to a letter
        all[num].innerHTML = e.key.toUpperCase();
        words[line-1][num-(line-1)*5] = e.key
        all[num].classList.remove("guess")
        // Add the "lettergreen" class
        num++;
        const wordi = getWord()
        for (let j = 0; j < 5; j++) {
            if (all[((line-1)*5)+j].classList.contains("guess")) {
                all[((line-1)*5)+j].innerHTML = wordi[j]
            }
        }
    } else if (e.key === "Enter" || e.key === "Tab") {
        if (num != line * 5) {
            let word = []
            for (i=0; i<5;i++) {
                word.push(all[(line-1)*5+i].innerHTML.toLowerCase())
                all[(line-1)*5+i].classList.remove("guess")
            }
            words[line-1] = word
        }
        e.preventDefault(); // Prevent the default action of the "Enter" key
        num=line * 5
        line++;
        const wordi = getWord()
        for (let j = 0; j < 5; j++) {
            all[((line-1)*5)+j].innerHTML = wordi[j]
        }
        for (let i = 0; i < 5; i++) {
            grey[i + (line - 2) * 5].classList.add("flip1");
            if (i !=4) {
                await sleep(200);
            }
        }
    }
};

// Add click event listeners to each letter element
for (let i = 0; i < grey.length; i++) {
    grey[i].addEventListener('animationend', function () {
        if (this.classList.contains('flip1')) {
            if (this.classList.contains('toyellow')) {
                this.classList.remove('toyellow');
                this.classList.remove('lettergreen');
                this.classList.add('letteryellow');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = null
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            } else if (this.classList.contains('togreen')) {
                this.classList.remove('lettergrey')
                this.classList.remove('togreen');
                this.classList.add('lettergreen');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = true
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            }else if (this.classList.contains('togrey')) {
                this.classList.remove('letteryellow')
                this.classList.remove('togrey');
                this.classList.add('lettergrey');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = false
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            }else if (this.classList.contains('lettergrey')) {
                this.classList.remove('lettergrey');
                this.classList.add('letteryellow');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = null
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            } else if (this.classList.contains('letteryellow')) {
                this.classList.add('lettergreen');
                this.classList.remove('letteryellow');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = true
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            }else if (this.classList.contains('lettergreen')) {
                this.classList.remove('lettergreen');
                this.classList.add('lettergrey');
                colors[Math.floor(i/5)][i-Math.floor(i/5)*5] = false
                const wordi = getWord()
                for (let j = 0; j < 5; j++) {
                    if (all[((line-1)*5)+j].classList.contains("guess")) {
                        all[((line-1)*5)+j].innerHTML = wordi[j]
                    }
                }
            }else {
                this.classList.add('lettergrey');
            }
            this.classList.remove('flip1')
            this.classList.add('flip2')
        } else {
            this.classList.remove('flip2')
        }
    })
    grey[i].addEventListener("click", function () {
        if (this.classList.contains('flip1')) {
            if (this.classList.contains('lettergrey')) {
                this.classList.add('togreen')
            } else if (this.classList.contains('letteryellow')) {
                this.classList.add('togrey')
            } else if (this.classList.contains('lettergreen')) {
                this.classList.add('toyellow')
            }
        }
        if (! this.classList.contains('flip1') && ! this.classList.contains('flip2')&&(this.classList.contains('letteryellow') || this.classList.contains('lettergreen')||this.classList.contains('lettergrey'))) {
            this.classList.add('flip1')
        }
    });
}
