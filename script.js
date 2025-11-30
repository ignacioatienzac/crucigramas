let vocabulario = [];

async function loadVocabulario() {
    const response = await fetch('vocabulario-a1.json');
    vocabulario = await response.json();
}

// --- UTILIDADES ---

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getCharFrequency(str) {
    const freq = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}

// Verifica que la candidata use SOLO letras de la base y en cantidades <= a las de la base
function isStrictSubset(candidateStr, baseFreq) {
    const candFreq = getCharFrequency(candidateStr);
    for (const char in candFreq) {
        // 1. ¿Existe la letra en la base?
        if (!baseFreq[char]) return false;
        // 2. ¿La cantidad en candidata supera a la base?
        if (candFreq[char] > baseFreq[char]) return false;
    }
    return true;
}

function buildBaseIndexMap(baseWord) {
    const map = {};
    for (let i = 0; i < baseWord.length; i++) {
        const char = baseWord[i];
        if (!map[char]) map[char] = [];
        map[char].push(i);
    }
    return map;
}

// Asigna a cada letra de la palabra candidata un índice concreto de la palabra base
// Se fuerza que la letra en anchorIndex use forcedBaseIndex para asegurar que
// la nueva palabra comparte letra y número de letra con la base.
function assignIndicesForWord(baseMap, candidateWord, anchorIndex, forcedBaseIndex) {
    const workingMap = {};
    Object.keys(baseMap).forEach(key => {
        workingMap[key] = [...baseMap[key]];
    });

    const mapping = new Array(candidateWord.length);
    const anchorChar = candidateWord[anchorIndex];
    const anchorList = workingMap[anchorChar];

    if (!anchorList || !anchorList.includes(forcedBaseIndex)) return null;

    workingMap[anchorChar] = anchorList.filter(idx => idx !== forcedBaseIndex);
    mapping[anchorIndex] = forcedBaseIndex;

    for (let i = 0; i < candidateWord.length; i++) {
        if (i === anchorIndex) continue;
        const char = candidateWord[i];
        const list = workingMap[char];
        if (!list || list.length === 0) return null;
        mapping[i] = list.shift();
    }

    return mapping;
}

// --- LÓGICA DEL JUEGO (ANAGRAMA ENLAZADO) ---

function generateCrosswordLogic() {
    const singleWords = vocabulario.filter(v => !v.palabra.includes(" ") && !v.palabra.includes("?"));
    const longWords = singleWords.filter(v => v.palabra.length >= 7); // Base larga para tener "inventario" suficiente

    if (longWords.length === 0) return null;

    const MAX_ATTEMPTS = 300;
    let attempt = 0;

    const getCellKey = (x, y) => `${x},${y}`;

    while (attempt < MAX_ATTEMPTS) {
        attempt++;

        const baseWordObj = getRandomElement(longWords);
        const baseWord = normalize(baseWordObj.palabra);
        const baseFreq = getCharFrequency(baseWord);
        const baseMap = buildBaseIndexMap(baseWord);

        const validPool = singleWords.filter(v => {
            const normV = normalize(v.palabra);
            if (normV.length >= baseWord.length) return false;
            if (normV.length < 2) return false;
            return isStrictSubset(normV, baseFreq);
        });

        if (validPool.length < 3) continue;

        const placedWords = [];
        const usedWords = new Set([baseWordObj.palabra]);
        const grid = new Map();

        // Colocar la palabra base en horizontal
        placedWords.push({
            wordObj: baseWordObj,
            x: 0,
            y: 0,
            dir: 'H',
            normalized: baseWord,
            baseIndices: Array.from({ length: baseWord.length }, (_, i) => i)
        });

        for (let i = 0; i < baseWord.length; i++) {
            const key = getCellKey(i, 0);
            grid.set(key, { char: baseWord[i], baseIndex: i, dirs: new Set(['H']) });
        }

        const tryPlaceDerived = (candidateObj) => {
            const candidateNorm = normalize(candidateObj.palabra);
            const anchorOptions = [];

            for (const [key, cell] of grid.entries()) {
                const [cellX, cellY] = key.split(',').map(Number);
                for (let i = 0; i < candidateNorm.length; i++) {
                    if (candidateNorm[i] === cell.char) {
                        anchorOptions.push({
                            cellX,
                            cellY,
                            anchorIndex: i,
                            forcedBaseIndex: cell.baseIndex,
                            existingDirs: cell.dirs
                        });
                    }
                }
            }

            const shuffledAnchors = anchorOptions.sort(() => Math.random() - 0.5);

            for (const anchor of shuffledAnchors) {
                if (anchor.existingDirs.size > 1) continue;

                const orientation = anchor.existingDirs.has('H') ? 'V' : 'H';
                const mapping = assignIndicesForWord(baseMap, candidateNorm, anchor.anchorIndex, anchor.forcedBaseIndex);
                if (!mapping) continue;

                const startX = orientation === 'H' ? anchor.cellX - anchor.anchorIndex : anchor.cellX;
                const startY = orientation === 'V' ? anchor.cellY - anchor.anchorIndex : anchor.cellY;

                let collision = false;

                for (let i = 0; i < candidateNorm.length; i++) {
                    const posX = orientation === 'H' ? startX + i : startX;
                    const posY = orientation === 'V' ? startY + i : startY;
                    const key = getCellKey(posX, posY);
                    const existing = grid.get(key);

                    if (existing) {
                        if (existing.char !== candidateNorm[i]) { collision = true; break; }
                        if (existing.baseIndex !== mapping[i]) { collision = true; break; }
                        if (existing.dirs.has(orientation)) { collision = true; break; }
                    }
                }

                if (collision) continue;

                for (let i = 0; i < candidateNorm.length; i++) {
                    const posX = orientation === 'H' ? startX + i : startX;
                    const posY = orientation === 'V' ? startY + i : startY;
                    const key = getCellKey(posX, posY);
                    const existing = grid.get(key);

                    if (existing) {
                        existing.dirs.add(orientation);
                    } else {
                        grid.set(key, { char: candidateNorm[i], baseIndex: mapping[i], dirs: new Set([orientation]) });
                    }
                }

                placedWords.push({
                    wordObj: candidateObj,
                    x: startX,
                    y: startY,
                    dir: orientation,
                    normalized: candidateNorm,
                    baseIndices: mapping
                });

                usedWords.add(candidateObj.palabra);
                return true;
            }

            return false;
        };

        let retries = 0;
        while (placedWords.length < 6 && retries < 200) {
            retries++;
            const candidateObj = getRandomElement(validPool);
            if (usedWords.has(candidateObj.palabra)) continue;
            tryPlaceDerived(candidateObj);
        }

        if (placedWords.length >= 3) {
            return { words: placedWords, baseWord: baseWordObj.palabra.toUpperCase() };
        }
    }

    console.log("Falló la generación, reintentando...");
    return null;
}

let currentWords = [];
let gridOffsetX = 0;
let gridOffsetY = 0;
let cluesVisible = false;
let solvedWordIds = new Set();

function getWordId(word) {
    return `${word.dir}-${word.x}-${word.y}-${word.wordObj.palabra}`;
}

function getWordInputs(word) {
    const inputs = [];

    for (let i = 0; i < word.normalized.length; i++) {
        const posX = (word.dir === 'H' ? word.x + i : word.x) - gridOffsetX;
        const posY = (word.dir === 'V' ? word.y + i : word.y) - gridOffsetY;

        const input = document.querySelector(
            `.cell-input[data-x="${posX}"][data-y="${posY}"]`
        );

        if (input) {
            inputs.push(input);
        }
    }

    return inputs;
}

function isWordSolved(word) {
    const inputs = getWordInputs(word);
    if (inputs.length !== word.normalized.length) return false;

    return inputs.every((input, idx) => normalize(input.value) === word.normalized[idx]);
}

function animateWordFlip(word) {
    const inputs = getWordInputs(word);

    inputs.forEach((input, idx) => {
        const cell = input.parentElement;
        cell.classList.remove('flip-letter');
        void cell.offsetWidth;

        setTimeout(() => {
            cell.classList.add('flip-letter');
            cell.addEventListener('animationend', () => {
                cell.classList.remove('flip-letter');
            }, { once: true });
        }, idx * 120);
    });
}

function updateSolvedWords(triggerAnimation = true) {
    currentWords.forEach(word => {
        const id = getWordId(word);
        if (!solvedWordIds.has(id) && isWordSolved(word)) {
            solvedWordIds.add(id);
            if (triggerAnimation) {
                animateWordFlip(word);
            }
        }
    });
}

function setClueVisibility(visible) {
    const wrapper = document.getElementById('clues-wrapper');
    const toggleBtn = document.getElementById('toggle-clues');

    cluesVisible = visible;

    if (wrapper) {
        wrapper.classList.toggle('clues-hidden', !visible);
    }

    if (toggleBtn) {
        toggleBtn.textContent = visible ? '🙈 Ocultar pistas' : '👀 Mostrar pistas';
        toggleBtn.setAttribute('aria-expanded', visible);
    }
}

function toggleClues() {
    setClueVisibility(!cluesVisible);
}

function initGame() {
    const result = generateCrosswordLogic();

    if (!result) {
        // Reintento automático si no encuentra combinación válida
        setTimeout(initGame, 50);
        return;
    }

    currentWords = result.words;
    solvedWordIds = new Set();

    const baseWordText = document.getElementById('base-word-text');
    if (baseWordText) {
        baseWordText.textContent = `Palabra base: ${result.baseWord}`;
    }

    renderGrid(currentWords);
    renderClues(currentWords);
    setClueVisibility(false);
}

function renderGrid(words) {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = '';

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    words.forEach(w => {
        const len = w.normalized.length;
        const xEnd = w.dir === 'H' ? w.x + len - 1 : w.x;
        const yEnd = w.dir === 'V' ? w.y + len - 1 : w.y;

        minX = Math.min(minX, w.x);
        maxX = Math.max(maxX, xEnd);
        minY = Math.min(minY, w.y);
        maxY = Math.max(maxY, yEnd);
    });

    gridOffsetX = minX;
    gridOffsetY = minY;

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    gridContainer.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
    gridContainer.style.gridTemplateRows = `repeat(${height}, var(--cell-size))`;

    const cellMap = new Map();

    words.forEach((w, index) => {
        const len = w.normalized.length;
        for (let i = 0; i < len; i++) {
            const posX = (w.dir === 'H' ? w.x + i : w.x) - minX;
            const posY = (w.dir === 'V' ? w.y + i : w.y) - minY;
            const char = w.normalized[i];
            const key = `${posX},${posY}`;

            let cellDiv = cellMap.get(key);
            
            if (!cellDiv) {
                cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.gridColumnStart = posX + 1;
                cellDiv.style.gridRowStart = posY + 1;

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'cell-input';
                input.dataset.correct = char;
                input.dataset.x = posX;
                input.dataset.y = posY;

                input.addEventListener('input', function() {
                    // Lógica visual opcional
                });

                input.addEventListener('keydown', function(event) {
                    const { key } = event;
                    const currentX = parseInt(event.target.dataset.x, 10);
                    const currentY = parseInt(event.target.dataset.y, 10);

                    const deltas = {
                        ArrowUp: { dx: 0, dy: -1 },
                        ArrowDown: { dx: 0, dy: 1 },
                        ArrowLeft: { dx: -1, dy: 0 },
                        ArrowRight: { dx: 1, dy: 0 }
                    };

                    if (!deltas[key]) return;

                    event.preventDefault();

                    const { dx, dy } = deltas[key];
                    const targetX = currentX + dx;
                    const targetY = currentY + dy;

                    const targetInput = document.querySelector(
                        `.cell-input[data-x="${targetX}"][data-y="${targetY}"]`
                    );

                    if (targetInput) {
                        targetInput.focus();
                    }
                });

                cellDiv.appendChild(input);
                gridContainer.appendChild(cellDiv);
                cellMap.set(key, cellDiv);
            }

            if (i === 0) {
                const numSpan = document.createElement('span');
                numSpan.className = 'cell-number';
                numSpan.innerText = index + 1;
                if(!cellDiv.querySelector('.cell-number')) {
                    cellDiv.appendChild(numSpan);
                }
            }
        }
    });
}

function solveBaseWord() {
    if (!currentWords.length) return;

    const baseWord = currentWords.find(w => w.dir === 'H');
    if (!baseWord) return;

    for (let i = 0; i < baseWord.normalized.length; i++) {
        const posX = (baseWord.x + i) - gridOffsetX;
        const posY = baseWord.y - gridOffsetY;

        const input = document.querySelector(
            `.cell-input[data-x="${posX}"][data-y="${posY}"]`
        );

        if (input) {
            input.value = baseWord.normalized[i];
            input.parentElement.classList.remove('incorrect', 'correct');
        }
    }

    const baseId = getWordId(baseWord);
    if (!solvedWordIds.has(baseId)) {
        solvedWordIds.add(baseId);
        animateWordFlip(baseWord);
    }
}

function renderClues(words) {
    const hContainer = document.getElementById('clues-horizontal');
    const vContainer = document.getElementById('clues-vertical');
    hContainer.innerHTML = '';
    vContainer.innerHTML = '';

    words.forEach((w, index) => {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.innerHTML = `<span class="clue-badge">${index + 1}</span> ${w.wordObj.traduccion_ingles}`;
        
        if (w.dir === 'H') {
            hContainer.appendChild(div);
        } else {
            vContainer.appendChild(div);
        }
    });
}

function checkAnswers() {
    const inputs = document.querySelectorAll('.cell-input');
    inputs.forEach(input => {
        const userVal = normalize(input.value);
        const correctVal = input.dataset.correct;
        const parent = input.parentElement;

        parent.classList.remove('correct', 'incorrect');

        if (userVal === '') {
            // vacío
        } else if (userVal === correctVal) {
            parent.classList.add('correct');
        } else {
            parent.classList.add('incorrect');
        }
    });

    updateSolvedWords(true);
}

window.onload = async () => {
    await loadVocabulario();
    initGame();
};
