let vocabulario = [];

async function loadVocabulario() {
    try {
        const response = await fetch('vocabulario-a1-completo.json'); 
        vocabulario = await response.json();
    } catch (e) {
        console.warn("No se pudo cargar el JSON completo, intentando con el por defecto...", e);
        try {
            const response = await fetch('vocabulario-a1.json');
            vocabulario = await response.json();
        } catch (e2) {
            console.error("Error cargando vocabulario");
        }
    }
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
        if (!baseFreq[char]) return false;
        if (candFreq[char] > baseFreq[char]) return false;
    }
    return true;
}

// --- LÓGICA DE COLOCACIÓN Y VALIDACIÓN ---

function canPlaceWord(candidateWord, x, y, dir, placedWords) {
    const len = candidateWord.length;

    for (let i = 0; i < len; i++) {
        const cx = dir === 'H' ? x + i : x;
        const cy = dir === 'V' ? y + i : y;
        const char = candidateWord[i];

        for (const pw of placedWords) {
            const pLen = pw.normalized.length;
            
            // 1. CHEQUEO DE COLISIÓN (Misma celda)
            let isIntersecting = false;
            let pChar = '';

            if (pw.dir === 'H') {
                if (cy === pw.y && cx >= pw.x && cx < pw.x + pLen) {
                    isIntersecting = true;
                    pChar = pw.normalized[cx - pw.x];
                }
            } else { // pw.dir === 'V'
                if (cx === pw.x && cy >= pw.y && cy < pw.y + pLen) {
                    isIntersecting = true;
                    pChar = pw.normalized[cy - pw.y];
                }
            }

            if (isIntersecting) {
                if (pChar !== char) return false;
            }

            // 2. CHEQUEO DE ADYACENCIA (Regla de no estar contiguas)
            // Permitimos que estén contiguas, pero la lógica de renderizado las marcará visualmente.
            // Sin embargo, para evitar aglomeraciones excesivas, mantenemos cierta restricción
            // si son paralelas y se solapan mucho.
            if (pw.dir === dir) {
                if (dir === 'H') {
                    if (Math.abs(pw.y - cy) <= 1) {
                        const start1 = x, end1 = x + len;
                        const start2 = pw.x, end2 = pw.x + pLen;
                        if (Math.max(start1, start2) < Math.min(end1, end2)) {
                             return false;
                        }
                    }
                } else { // dir === 'V'
                    if (Math.abs(pw.x - cx) <= 1) {
                        const start1 = y, end1 = y + len;
                        const start2 = pw.y, end2 = pw.y + pLen;
                        if (Math.max(start1, start2) < Math.min(end1, end2)) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    
    // Evita punta con punta exacto en la misma dirección (opcional)
    for (const pw of placedWords) {
        if (pw.dir === dir) {
            if (dir === 'H' && pw.y === y) {
                if (x === pw.x + pw.normalized.length || x + len === pw.x) return false; 
            }
            if (dir === 'V' && pw.x === x) {
                if (y === pw.y + pw.normalized.length || y + len === pw.y) return false;
            }
        }
    }

    return true;
}


// --- LÓGICA PRINCIPAL DEL JUEGO ---

function generateCrosswordLogic() {
    const singleWords = vocabulario.filter(v => !v.palabra.includes(" ") && !v.palabra.includes("?"));
    const longWords = singleWords.filter(v => v.palabra.length >= 7); 
    
    if (longWords.length === 0) return null;

    const MAX_ATTEMPTS = 500; 
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
        attempt++;
        
        // --- PASO 1: PALABRA BASE (HORIZONTAL) ---
        const baseWordObj = getRandomElement(longWords);
        const baseWord = normalize(baseWordObj.palabra);
        const baseFreq = getCharFrequency(baseWord);

        const validPool = singleWords.filter(v => {
            const normV = normalize(v.palabra);
            if (normV.length >= baseWord.length) return false; 
            if (normV.length < 3) return false; 
            return isStrictSubset(normV, baseFreq);
        });

        if (validPool.length < 5) continue;

        let placedWords = [];
        let usedWords = new Set();
        
        // Base en (0,0)
        placedWords.push({
            wordObj: baseWordObj,
            x: 0,
            y: 0,
            dir: 'H',
            normalized: baseWord
        });
        usedWords.add(baseWordObj.palabra);

        // --- PASO 2: PALABRAS VERTICALES ---
        let intersectCount = 0;
        let retries = 0;
        
        while (intersectCount < 4 && retries < 100) {
            retries++;
            const candidateObj = getRandomElement(validPool);
            if (usedWords.has(candidateObj.palabra)) continue;

            const candNorm = normalize(candidateObj.palabra);
            const validPlacements = [];

            for (let i = 0; i < candNorm.length; i++) {
                const charCand = candNorm[i];
                for (let j = 0; j < baseWord.length; j++) {
                    if (baseWord[j] === charCand) {
                        validPlacements.push({ x: j, y: -i });
                    }
                }
            }

            if (validPlacements.length > 0) {
                const pos = getRandomElement(validPlacements);
                if (canPlaceWord(candNorm, pos.x, pos.y, 'V', placedWords)) {
                    placedWords.push({
                        wordObj: candidateObj,
                        x: pos.x,
                        y: pos.y,
                        dir: 'V',
                        normalized: candNorm
                    });
                    usedWords.add(candidateObj.palabra);
                    intersectCount++;
                }
            }
        }

        if (intersectCount < 2) continue;

        // --- PASO 3: PALABRAS HORIZONTALES SECUNDARIAS ---
        const verticalWords = placedWords.filter(w => w.dir === 'V');
        let secondaryCount = 0;
        let secRetries = 0;

        while (secondaryCount < 3 && secRetries < 200) {
            secRetries++;
            const anchorWord = getRandomElement(verticalWords);
            const anchorLen = anchorWord.normalized.length;

            const candidateObj = getRandomElement(validPool);
            if (usedWords.has(candidateObj.palabra)) continue;
            const candNorm = normalize(candidateObj.palabra);

            const validSecPlacements = [];

            for (let i = 0; i < candNorm.length; i++) { 
                const charCand = candNorm[i];
                for (let j = 0; j < anchorLen; j++) { 
                    const anchorAbsY = anchorWord.y + j;
                    if (anchorAbsY === 0) continue; 

                    if (anchorWord.normalized[j] === charCand) {
                        validSecPlacements.push({ x: anchorWord.x - i, y: anchorAbsY });
                    }
                }
            }

            if (validSecPlacements.length > 0) {
                const pos = getRandomElement(validSecPlacements);
                if (canPlaceWord(candNorm, pos.x, pos.y, 'H', placedWords)) {
                    placedWords.push({
                        wordObj: candidateObj,
                        x: pos.x,
                        y: pos.y,
                        dir: 'H',
                        normalized: candNorm
                    });
                    usedWords.add(candidateObj.palabra);
                    secondaryCount++;
                }
            }
        }

        if (placedWords.length >= 3) {
            return { words: placedWords, baseWord: baseWordObj.palabra.toUpperCase() };
        }
    }
    
    console.log("No se pudo generar un crucigrama válido tras varios intentos.");
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
        }, idx * 100);
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
        setTimeout(initGame, 100);
        return;
    }

    currentWords = result.words;
    solvedWordIds = new Set();

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

    // Margen visual de 1 celda
    minX -= 1; maxX += 1;
    minY -= 1; maxY += 1;

    gridOffsetX = minX;
    gridOffsetY = minY;

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    gridContainer.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
    gridContainer.style.gridTemplateRows = `repeat(${height}, var(--cell-size))`;

    const cellMap = new Map();

    // 1. Renderizado de Celdas
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
                   this.parentElement.classList.remove('incorrect');
                });

                input.addEventListener('keydown', handleKeyNavigation);
                input.addEventListener('click', () => input.select());

                cellDiv.appendChild(input);
                gridContainer.appendChild(cellDiv);
                cellMap.set(key, cellDiv);
            }

            if (i === 0) {
                const numSpan = document.createElement('span');
                numSpan.className = 'cell-number';
                numSpan.innerText = index + 1;
                
                const existingNum = cellDiv.querySelector('.cell-number');
                if(existingNum) {
                    existingNum.innerText += "/" + (index + 1);
                } else {
                    cellDiv.appendChild(numSpan);
                }
            }
        }
    });

    // 2. Renderizado de Barreras (Separadores visuales para palabras contiguas)
    // Recorremos todas las celdas generadas y verificamos sus vecinos.
    cellMap.forEach((cellDiv, key) => {
        const [sx, sy] = key.split(',').map(Number); // Coordenadas relativas en la Grid visual

        // --- Chequeo Abajo (Vertical) ---
        // Si hay una celda justo abajo, pero NO hay una palabra vertical que las conecte.
        const bottomKey = `${sx},${sy + 1}`;
        if (cellMap.has(bottomKey)) {
            // Convertir a coordenadas absolutas para buscar en 'words'
            const absX = sx + minX;
            const absY = sy + minY;

            // Buscamos si existe alguna palabra Vertical en esa columna (absX)
            // que cubra tanto absY como absY + 1
            const isConnected = words.some(w => 
                w.dir === 'V' && 
                w.x === absX && 
                w.y <= absY && 
                (w.y + w.normalized.length) > absY + 1
            );

            if (!isConnected) {
                cellDiv.classList.add('barrier-bottom');
            }
        }

        // --- Chequeo Derecha (Horizontal) ---
        // Si hay una celda a la derecha, pero NO hay una palabra horizontal que las conecte.
        const rightKey = `${sx + 1},${sy}`;
        if (cellMap.has(rightKey)) {
            const absX = sx + minX;
            const absY = sy + minY;

            const isConnected = words.some(w => 
                w.dir === 'H' && 
                w.y === absY && 
                w.x <= absX && 
                (w.x + w.normalized.length) > absX + 1
            );

            if (!isConnected) {
                cellDiv.classList.add('barrier-right');
            }
        }
    });
}

function handleKeyNavigation(event) {
    const { key } = event;
    const currentInput = event.target;
    const currentX = parseInt(currentInput.dataset.x, 10);
    const currentY = parseInt(currentInput.dataset.y, 10);

    const deltas = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 }
    };

    if (!deltas[key]) return;

    event.preventDefault();

    const { dx, dy } = deltas[key];
    let targetX = currentX + dx;
    let targetY = currentY + dy;

    let targetInput = document.querySelector(
        `.cell-input[data-x="${targetX}"][data-y="${targetY}"]`
    );

    if (!targetInput) {
        targetX += dx;
        targetY += dy;
        targetInput = document.querySelector(
            `.cell-input[data-x="${targetX}"][data-y="${targetY}"]`
        );
    }

    if (targetInput) {
        targetInput.focus();
    }
}

function solveBaseWord() {
    if (!currentWords.length) return;
    const baseWord = currentWords[0];
    if (!baseWord) return;

    for (let i = 0; i < baseWord.normalized.length; i++) {
        const posX = (baseWord.dir === 'H' ? baseWord.x + i : baseWord.x) - gridOffsetX;
        const posY = (baseWord.dir === 'V' ? baseWord.y + i : baseWord.y) - gridOffsetY;

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
