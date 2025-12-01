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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

// --- LÓGICA DE COLOCACIÓN Y VALIDACIÓN (GRID) ---

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

            // 2. CHEQUEO DE ADYACENCIA
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


// --- LÓGICA PRINCIPAL DEL JUEGO (GENERACIÓN) ---

function generateCrosswordLogic() {
    const singleWords = vocabulario.filter(v => !v.palabra.includes(" ") && !v.palabra.includes("?"));
    const longWords = singleWords.filter(v => v.palabra.length >= 7); 
    
    if (longWords.length === 0) return null;

    const MAX_ATTEMPTS = 500; 
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
        attempt++;
        
        // Base
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
        
        placedWords.push({
            wordObj: baseWordObj,
            x: 0,
            y: 0,
            dir: 'H',
            normalized: baseWord
        });
        usedWords.add(baseWordObj.palabra);

        // Verticales
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

        // Horizontales Secundarias
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
            return { words: placedWords, baseWordNormalized: baseWord };
        }
    }
    
    console.log("Reintentando generación...");
    return null;
}

// --- VARIABLES GLOBALES DEL JUEGO ---

let currentWords = [];
let gridOffsetX = 0;
let gridOffsetY = 0;
let cluesVisible = false;
let solvedWordIds = new Set();

// Variables para la Rueda
let wheelLetters = []; 
let wheelOrder = [];   
let isDragging = false;
let selectedIndices = []; 

function getWordId(word) {
    return `${word.dir}-${word.x}-${word.y}-${word.wordObj.palabra}`;
}

function getWordInputs(word) {
    const inputs = [];
    for (let i = 0; i < word.normalized.length; i++) {
        const posX = (word.dir === 'H' ? word.x + i : word.x) - gridOffsetX;
        const posY = (word.dir === 'V' ? word.y + i : word.y) - gridOffsetY;
        const input = document.querySelector(`.cell-input[data-x="${posX}"][data-y="${posY}"]`);
        if (input) inputs.push(input);
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
            if (triggerAnimation) animateWordFlip(word);
        }
    });
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
    
    initWheel(result.baseWordNormalized);
}

// --- RENDERIZADO GRID & CLUES ---

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

    minX -= 1; maxX += 1;
    minY -= 1; maxY += 1;

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
                input.readOnly = true; 
                input.dataset.correct = char;
                input.dataset.x = posX;
                input.dataset.y = posY;
                
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

    cellMap.forEach((cellDiv, key) => {
        const [sx, sy] = key.split(',').map(Number); 

        const bottomKey = `${sx},${sy + 1}`;
        if (cellMap.has(bottomKey)) {
            const absX = sx + minX;
            const absY = sy + minY;
            const isConnected = words.some(w => 
                w.dir === 'V' && w.x === absX && w.y <= absY && (w.y + w.normalized.length) > absY + 1
            );
            if (!isConnected) cellDiv.classList.add('barrier-bottom');
        }

        const rightKey = `${sx + 1},${sy}`;
        if (cellMap.has(rightKey)) {
            const absX = sx + minX;
            const absY = sy + minY;
            const isConnected = words.some(w => 
                w.dir === 'H' && w.y === absY && w.x <= absX && (w.x + w.normalized.length) > absX + 1
            );
            if (!isConnected) cellDiv.classList.add('barrier-right');
        }
    });
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
        if (w.dir === 'H') hContainer.appendChild(div);
        else vContainer.appendChild(div);
    });
}

function checkAnswers() {
    const inputs = document.querySelectorAll('.cell-input');
    inputs.forEach(input => {
        const userVal = normalize(input.value);
        const correctVal = input.dataset.correct;
        const parent = input.parentElement;
        parent.classList.remove('correct', 'incorrect');
        if (userVal === '') {} 
        else if (userVal === correctVal) parent.classList.add('correct');
        else parent.classList.add('incorrect');
    });
    updateSolvedWords(true);
}

// --- LÓGICA DE LA RUEDA (WORD WHEEL) ---

function initWheel(baseWord) {
    const lettersContainer = document.getElementById('wheel-letters');
    const svgContainer = document.getElementById('wheel-svg');
    const wheelContainer = document.getElementById('wheel-container');
    const selectionDisplay = document.getElementById('current-selection');

    lettersContainer.innerHTML = '';
    svgContainer.innerHTML = ''; 
    selectionDisplay.innerText = '';
    selectionDisplay.classList.remove('visible');

    const chars = baseWord.split('');
    shuffleArray(chars);
    wheelOrder = chars;
    
    // --- CORRECCIÓN: Cálculo dinámico basado en el tamaño real del contenedor ---
    const containerWidth = wheelContainer.offsetWidth || 260; // Fallback al valor CSS
    const containerHeight = wheelContainer.offsetHeight || 260;
    
    // El tamaño de la letra es aprox 45px. 
    // Radio = (Mitad del contenedor) - (Mitad de la letra) - (Margen de seguridad)
    const letterSize = 45;
    const padding = 10;
    const radius = (containerWidth / 2) - (letterSize / 2) - padding;
    
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const count = chars.length;
    const angleStep = (2 * Math.PI) / count;

    wheelLetters = [];

    chars.forEach((char, i) => {
        const angle = i * angleStep - Math.PI / 2; 
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const btn = document.createElement('div');
        btn.className = 'wheel-letter';
        btn.innerText = char.toUpperCase();
        
        // Centrar el elemento restando la mitad de su tamaño (22.5px aprox)
        btn.style.left = (x - (letterSize / 2)) + 'px';
        btn.style.top = (y - (letterSize / 2)) + 'px';
        
        btn.dataset.index = i;
        btn.dataset.char = char;
        
        // Guardamos las coordenadas centrales RELATIVAS al contenedor para el SVG
        btn.dataset.cx = x;
        btn.dataset.cy = y;

        btn.addEventListener('mousedown', handleStart);
        btn.addEventListener('touchstart', handleStart, {passive: false});

        lettersContainer.appendChild(btn);
        wheelLetters.push(btn);
    });

    wheelContainer.addEventListener('mousemove', handleMove);
    wheelContainer.addEventListener('touchmove', handleMove, {passive: false});
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
}

function handleStart(e) {
    e.preventDefault(); 
    isDragging = true;
    selectedIndices = [];
    const index = parseInt(e.target.dataset.index);
    selectLetter(index);
}

function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const element = document.elementFromPoint(clientX, clientY);
    
    if (element && element.classList.contains('wheel-letter')) {
        const index = parseInt(element.dataset.index);
        if (!selectedIndices.includes(index)) {
            selectLetter(index);
        } else {
            if (selectedIndices.length > 1 && index === selectedIndices[selectedIndices.length - 2]) {
                unselectLast();
            }
        }
    }
    
    drawPath(clientX, clientY);
}

function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const word = selectedIndices.map(i => wheelLetters[i].dataset.char).join('');
    checkWheelAttempt(word);

    selectedIndices = [];
    wheelLetters.forEach(l => l.classList.remove('active'));
    document.getElementById('wheel-svg').innerHTML = '';
    
    const display = document.getElementById('current-selection');
    display.classList.remove('visible');
}

function selectLetter(index) {
    selectedIndices.push(index);
    wheelLetters[index].classList.add('active');
    updateSelectionDisplay();
}

function unselectLast() {
    const removedIndex = selectedIndices.pop();
    wheelLetters[removedIndex].classList.remove('active');
    updateSelectionDisplay();
}

function updateSelectionDisplay() {
    const display = document.getElementById('current-selection');
    const word = selectedIndices.map(i => wheelLetters[i].dataset.char).join('').toUpperCase();
    display.innerText = word;
    display.classList.add('visible');
}

function drawPath(cursorX, cursorY) {
    const svg = document.getElementById('wheel-svg');
    svg.innerHTML = ''; 

    if (selectedIndices.length === 0) return;

    let points = "";
    
    selectedIndices.forEach(i => {
        const btn = wheelLetters[i];
        points += `${btn.dataset.cx},${btn.dataset.cy} `;
    });

    const containerRect = document.getElementById('wheel-container').getBoundingClientRect();
    const relX = cursorX - containerRect.left;
    const relY = cursorY - containerRect.top;
    
    points += `${relX},${relY}`;

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", points);
    polyline.style.fill = "none";
    polyline.style.stroke = "#f39c12"; 
    polyline.style.strokeWidth = "8";
    polyline.style.strokeLinecap = "round";
    polyline.style.strokeLinejoin = "round";
    polyline.style.opacity = "0.7";

    svg.appendChild(polyline);
}

function checkWheelAttempt(wordAttempt) {
    if (wordAttempt.length < 2) return; 

    let found = false;
    currentWords.forEach(w => {
        if (w.normalized === wordAttempt) {
            fillWordInGrid(w);
            found = true;
        }
    });
}

function fillWordInGrid(word) {
    const inputs = getWordInputs(word);
    const id = getWordId(word);
    if (solvedWordIds.has(id)) return;

    inputs.forEach((input, i) => {
        input.value = word.normalized[i];
        input.parentElement.classList.add('correct');
        input.parentElement.classList.remove('incorrect');
    });

    solvedWordIds.add(id);
    animateWordFlip(word);
}

function solveBaseWord() {
    if (!currentWords.length) return;
    const baseWord = currentWords[0];
    fillWordInGrid(baseWord);
}

function setClueVisibility(visible) {
    const wrapper = document.getElementById('clues-wrapper');
    const toggleBtn = document.getElementById('toggle-clues');
    cluesVisible = visible;
    if (wrapper) wrapper.classList.toggle('clues-hidden', !visible);
    if (toggleBtn) {
        toggleBtn.textContent = visible ? '🙈 Ocultar pistas' : '👀 Mostrar pistas';
        toggleBtn.setAttribute('aria-expanded', visible);
    }
}
function toggleClues() { setClueVisibility(!cluesVisible); }

window.onload = async () => {
    await loadVocabulario();
    initGame();
};
