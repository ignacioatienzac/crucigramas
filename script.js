let vocabulario = [];

async function loadVocabulario() {
    try {
        const response = await fetch('vocabulario-a1-completo.json'); // Asegúrate de que el nombre coincida con tu archivo
        vocabulario = await response.json();
    } catch (e) {
        console.warn("No se pudo cargar el JSON completo, intentando con el por defecto...", e);
        // Fallback o manejo de error si el archivo cambia de nombre
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

/**
 * Comprueba si una palabra se puede colocar en la posición dada.
 * Verifica colisiones de letras incorrectas y reglas de adyacencia (espaciado).
 */
function canPlaceWord(candidateWord, x, y, dir, placedWords) {
    const len = candidateWord.length;

    // Iteramos por cada letra de la palabra candidata
    for (let i = 0; i < len; i++) {
        const cx = dir === 'H' ? x + i : x;
        const cy = dir === 'V' ? y + i : y;
        const char = candidateWord[i];

        // Verificamos contra todas las palabras ya colocadas
        for (const pw of placedWords) {
            const pLen = pw.normalized.length;
            
            // 1. CHEQUEO DE COLISIÓN (Misma celda)
            // Calculamos si la palabra 'pw' ocupa la celda (cx, cy)
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
                // Si hay intersección, la letra DEBE ser la misma
                if (pChar !== char) return false;
            }

            // 2. CHEQUEO DE ADYACENCIA (Regla de no estar contiguas)
            // Si las palabras son paralelas, debe haber al menos una fila/columna de separación.
            if (pw.dir === dir) {
                // Si es paralela, verificamos si está "pegada" lateralmente
                if (dir === 'H') {
                    // Si están en la misma fila (y se solapan, ya chequeado arriba) o filas adyacentes (y-1, y+1)
                    if (Math.abs(pw.y - cy) <= 1) {
                        // Verificamos si hay solapamiento en el eje X (longitud)
                        const xOverlap = (cx >= pw.x - 1 && cx <= pw.x + pLen); // -1 y +1 para evitar tocarse punta con punta también
                        // Nota: Ser estricto con punta con punta: (cx >= pw.x && cx < pw.x + pLen)
                        // Para evitar palabras pegadas:
                        const start1 = x, end1 = x + len;
                        const start2 = pw.x, end2 = pw.x + pLen;
                        // Hay solapamiento de rangos X si:
                        if (Math.max(start1, start2) < Math.min(end1, end2)) {
                             // Están solapadas en X y están en filas contiguas o misma fila
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
    
    // Verificación extra para "punta con punta" en la misma dirección (opcional pero estético)
    // Evita que una palabra termine donde empieza otra en la misma línea sin espacio.
    for (const pw of placedWords) {
        if (pw.dir === dir) {
            if (dir === 'H' && pw.y === y) {
                // Misma fila horizontal
                if (x === pw.x + pw.normalized.length || x + len === pw.x) return false; 
            }
            if (dir === 'V' && pw.x === x) {
                // Misma columna vertical
                if (y === pw.y + pw.normalized.length || y + len === pw.y) return false;
            }
        }
    }

    return true;
}


// --- LÓGICA PRINCIPAL DEL JUEGO ---

function generateCrosswordLogic() {
    // 1. Preparar el Pool
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

        // Filtramos todas las palabras posibles que se pueden formar con la base
        const validPool = singleWords.filter(v => {
            const normV = normalize(v.palabra);
            if (normV.length >= baseWord.length) return false; // Deben ser más cortas
            if (normV.length < 3) return false; // Mínimo 3 letras para dar juego
            return isStrictSubset(normV, baseFreq);
        });

        if (validPool.length < 5) continue; // Necesitamos variedad

        let placedWords = [];
        let usedWords = new Set();
        
        // Colocamos Base en (0,0)
        placedWords.push({
            wordObj: baseWordObj,
            x: 0,
            y: 0,
            dir: 'H',
            normalized: baseWord
        });
        usedWords.add(baseWordObj.palabra);

        // --- PASO 2: PALABRAS VERTICALES (CONECTAN CON BASE) ---
        let intersectCount = 0;
        let retries = 0;
        
        // Intentamos colocar entre 2 y 4 verticales
        while (intersectCount < 4 && retries < 100) {
            retries++;
            const candidateObj = getRandomElement(validPool);
            if (usedWords.has(candidateObj.palabra)) continue;

            const candNorm = normalize(candidateObj.palabra);
            
            // Buscar cruce con la palabra base
            // La base está en y=0, x de 0 a len-1
            const validPlacements = [];

            for (let i = 0; i < candNorm.length; i++) {
                const charCand = candNorm[i];
                // Buscamos coincidencia en la palabra base
                for (let j = 0; j < baseWord.length; j++) {
                    if (baseWord[j] === charCand) {
                        // Propuesta: Vertical cruza en la letra 'j' de la base
                        // Coordenadas de la palabra vertical:
                        // x = j (columna de la letra de la base)
                        // y = -i (para que la letra i de candidata coincida con y=0)
                        validPlacements.push({ x: j, y: -i });
                    }
                }
            }

            if (validPlacements.length > 0) {
                // Probamos una posición aleatoria válida
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

        if (intersectCount < 2) continue; // Si no logramos poner al menos 2 verticales, reiniciamos

        // --- PASO 3: PALABRAS HORIZONTALES SECUNDARIAS (CONECTAN CON VERTICALES) ---
        // Recorremos las palabras verticales ya colocadas para intentar engancharles horizontales
        const verticalWords = placedWords.filter(w => w.dir === 'V');
        let secondaryCount = 0;
        let secRetries = 0;

        // Intentamos añadir algunas horizontales extra
        while (secondaryCount < 3 && secRetries < 200) {
            secRetries++;
            
            // Elegimos una palabra vertical existente para usar de "ancla"
            const anchorWord = getRandomElement(verticalWords);
            const anchorLen = anchorWord.normalized.length;

            // Elegimos una candidata del pool
            const candidateObj = getRandomElement(validPool);
            if (usedWords.has(candidateObj.palabra)) continue;
            const candNorm = normalize(candidateObj.palabra);

            // Buscamos intersección
            const validSecPlacements = [];

            for (let i = 0; i < candNorm.length; i++) { // Letra de la candidata (Horizontal)
                const charCand = candNorm[i];
                for (let j = 0; j < anchorLen; j++) { // Letra de la ancla (Vertical)
                    // Importante: No usar la letra que ya cruza con la base (que está en y=0)
                    // La palabra vertical empieza en anchorWord.y. La letra j está en anchorWord.y + j.
                    const anchorAbsY = anchorWord.y + j;
                    if (anchorAbsY === 0) continue; // Saltamos la intersección con la Base

                    if (anchorWord.normalized[j] === charCand) {
                        // Propuesta:
                        // La ancla está en x = anchorWord.x
                        // Queremos que candNorm[i] esté en (anchorWord.x, anchorAbsY)
                        // Por tanto, el inicio de candNorm (x) será: anchorWord.x - i
                        // Y la posición y será: anchorAbsY
                        validSecPlacements.push({ x: anchorWord.x - i, y: anchorAbsY });
                    }
                }
            }

            if (validSecPlacements.length > 0) {
                const pos = getRandomElement(validSecPlacements);
                // Validamos con las reglas (especialmente la de no contiguas)
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

        // Si tenemos una estructura interesante, devolvemos
        // Mínimo: Base + 2 Verticales. (Las secundarias son bonus, si hay 0 no pasa nada, pero idealmente habrá)
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
    // Si por alguna razón de renderizado faltan inputs, no está resuelta
    if (inputs.length !== word.normalized.length) return false;

    return inputs.every((input, idx) => normalize(input.value) === word.normalized[idx]);
}

function animateWordFlip(word) {
    const inputs = getWordInputs(word);

    inputs.forEach((input, idx) => {
        const cell = input.parentElement;
        // Reiniciar animación si ya existía
        cell.classList.remove('flip-letter');
        void cell.offsetWidth; // Trigger reflow

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
        // Reintento rápido si falla la generación
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

    // Calcular límites
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

    // Margen visual de 1 celda alrededor
    minX -= 1; maxX += 1;
    minY -= 1; maxY += 1;

    gridOffsetX = minX;
    gridOffsetY = minY;

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    gridContainer.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
    gridContainer.style.gridTemplateRows = `repeat(${height}, var(--cell-size))`;

    // Mapa para evitar duplicar celdas en las intersecciones
    const cellMap = new Map();

    // Ordenamos palabras para que las horizontales se pinten "encima" si hay duda, 
    // aunque la lógica de celdas compartidas maneja esto.
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

                // Eventos de input y navegación
                input.addEventListener('input', function() {
                   // Limpiar estilos de validación al escribir
                   this.parentElement.classList.remove('incorrect');
                });

                input.addEventListener('keydown', handleKeyNavigation);
                input.addEventListener('click', () => input.select());

                cellDiv.appendChild(input);
                gridContainer.appendChild(cellDiv);
                cellMap.set(key, cellDiv);
            }

            // Añadir número pequeño a la primera letra de la palabra
            if (i === 0) {
                const numSpan = document.createElement('span');
                numSpan.className = 'cell-number';
                numSpan.innerText = index + 1;
                
                // Si la celda ya tiene un número (intersección de inicios), lo concatenamos
                const existingNum = cellDiv.querySelector('.cell-number');
                if(existingNum) {
                    existingNum.innerText += "/" + (index + 1);
                } else {
                    cellDiv.appendChild(numSpan);
                }
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

    if (key === 'Backspace' && currentInput.value === '') {
        // Mover atrás al borrar si está vacío (simple heuristic)
        // Podría mejorarse detectando la dirección de la palabra actual
    }

    if (!deltas[key]) return;

    event.preventDefault();

    const { dx, dy } = deltas[key];
    let targetX = currentX + dx;
    let targetY = currentY + dy;

    let targetInput = document.querySelector(
        `.cell-input[data-x="${targetX}"][data-y="${targetY}"]`
    );

    // Salto de huecos vacíos (opcional, para UX suave si hay huecos)
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

    // Asumimos que la palabra base es la primera Horizontal que añadimos (index 0 generalmente)
    // O la buscamos por ser la que está en y=0 relativa a la generación
    const baseWord = currentWords[0]; // Por lógica de generación es la primera
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
            // vacío, ignorar
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
