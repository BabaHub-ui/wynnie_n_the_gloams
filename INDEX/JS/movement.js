// Selezione degli elementi della guardia e del ladro
const guard = document.getElementById('guard');
const rogue = document.getElementById('rogue');
const gameArea = document.getElementById('game-area');

// Variabili per le posizioni iniziali
let guardPosition = { row: 1, col: 1 }; // Posizione iniziale nella griglia
let roguePosition = { row: 9, col: 9 }; // Posizione iniziale nella griglia
const gridSize = 10; // Dimensione della griglia (10x10)
const stepSize = 50; // Dimensione del passo (50px)
let playerTurn = true; // Flag per indicare di chi è il turno
let selectedDirection = ''; // Direzione selezionata dal giocatore

// Funzione per aggiornare la posizione di un personaggio
function updatePosition(character, position) {
    character.style.transform = `translate(${(position.col - 1) * stepSize}px, ${(position.row - 1) * stepSize}px)`;
}


resetGame();

showPossibleMoves(guardPosition, 'guard'); // Mostra le possibili mosse della guardia al caricamento del gioco
showPossibleMoves(roguePosition, 'rogue'); // Mostra le possibili mosse del ladro al caricamento del gioco

// Funzione per selezionare la direzione della guardia
function selectDirection(direction) {
    clearSelectedMove(); // Cancella l'indicazione del movimento selezionato precedente
    selectedDirection = direction;
    showSelectedMove(guardPosition, direction);
}

// Funzione per confermare il movimento della guardia
function confirmMove() {
    if (!playerTurn || !selectedDirection) return; // Se non è il turno del giocatore o nessuna direzione è selezionata, esci

    clearPossibleMoves(); // Cancella temporaneamente le mosse consigliate
    moveGuard(selectedDirection); // Muove la guardia nella direzione selezionata
    selectedDirection = ''; // Resetta la direzione selezionata
    playerTurn = false; // Blocca ulteriori movimenti finché il turno non è completato
}

// Funzione per muovere sia la guardia che il ladro
function moveCharacters() {
    // Muove la guardia
    moveGuard();

    // Calcola e muove il ladro dopo aver mosso la guardia
    setTimeout(() => {
        moveRogue();
    }, 0); // Ritardo minimo per garantire che entrambi i movimenti inizino quasi contemporaneamente

    // Ascolta l'evento di fine transizione per mostrare le mosse dopo il movimento
    guard.addEventListener('transitionend', handleTransitionEnd, { once: true });
    rogue.addEventListener('transitionend', handleTransitionEnd, { once: true });
}
function confirmMove() {
    if (!playerTurn || !selectedDirection) return; // Se non è il turno del giocatore o nessuna direzione è selezionata, esci
    clearPossibleMoves(); // Cancella temporaneamente le mosse consigliate
    moveGuard(selectedDirection); // Muove la guardia nella direzione selezionata
    selectedDirection = ''; // Resetta la direzione selezionata
    playerTurn = false; // Blocca ulteriori movimenti finché il turno non è completato
}

function startPlayerTurn() {
    playerTurn = true; // Imposta il turno del giocatore su vero
    console.log('È il turno del giocatore.'); // Log per confermare che la funzione viene chiamata
    // Potresti aggiungere altre logiche qui per evidenziare il turno del giocatore, se necessario
}

function winGame() {
    alert('Hai vinto!');
    resetGame(); // Resetta il gioco
}

function startPlayerTurn() {
    playerTurn = true; // Imposta il turno del giocatore su vero
    console.log('È il turno del giocatore.'); // Log per confermare che la funzione viene chiamata
    // Potresti aggiungere altre logiche qui per evidenziare il turno del giocatore, se necessario
}
function moveGuard(direction) {
    clearSelectedMove(); // Cancella l'indicazione del movimento selezionato

    previousGuardPosition = { ...guardPosition };
    let nextPosition = { ...guardPosition };
    moveRogue();
    // Determina la nuova posizione in base alla direzione
    switch (direction) {
        case 'up':
            if (guardPosition.row > 1) nextPosition.row--;
            break;
        case 'down':
            if (guardPosition.row < gridSize) nextPosition.row++;
            break;
        case 'left':
            if (guardPosition.col > 1) nextPosition.col--;
            break;
        case 'right':
            if (guardPosition.col < gridSize) nextPosition.col++;
            break;
    }

    // Aggiorna la posizione della guardia solo se cambia
    if (nextPosition.row !== guardPosition.row || nextPosition.col !== guardPosition.col) {
        guardPosition = nextPosition; // Aggiorna la posizione della guardia
        updatePosition(guard, guardPosition); // Aggiorna la posizione nel DOM

        // Aggiungi un listener per l'evento di fine transizione
        guard.addEventListener('transitionend', handleTransitionEnd, { once: true });
    } else {
        startPlayerTurn(); // Se la guardia non si muove, ripristina immediatamente il turno del giocatore
    }
}

function handleTransitionEnd() {
    checkCollision(); // Controlla se c'è una collisione
    clearPossibleMoves(); // Cancella le mosse precedenti
    showPossibleMoves(guardPosition, 'guard'); // Mostra le nuove mosse della guardia
    showPossibleMoves(roguePosition, 'rogue'); // Mostra le nuove mosse del ladro
    playerTurn = true; // Ripristina il turno del giocatore
}

function moveRogue() {
    let possibleMoves = [];

    // Verifica delle possibili direzioni di movimento per il ladro
    if (roguePosition.row > 1 && !isWall({ row: roguePosition.row - 1, col: roguePosition.col }) &&
        !(previousGuardPosition.row === roguePosition.row - 1 && previousGuardPosition.col === roguePosition.col)) {
        possibleMoves.push('up');
    }
    if (roguePosition.row < gridSize && !isWall({ row: roguePosition.row + 1, col: roguePosition.col }) &&
        !(previousGuardPosition.row === roguePosition.row + 1 && previousGuardPosition.col === roguePosition.col)) {
        possibleMoves.push('down');
    }
    if (roguePosition.col > 1 && !isWall({ row: roguePosition.row, col: roguePosition.col - 1 }) &&
        !(previousGuardPosition.row === roguePosition.row && previousGuardPosition.col === roguePosition.col - 1)) {
        possibleMoves.push('left');
    }
    if (roguePosition.col < gridSize && !isWall({ row: roguePosition.row, col: roguePosition.col + 1 }) &&
        !(previousGuardPosition.row === roguePosition.row && previousGuardPosition.col === roguePosition.col + 1)) {
        possibleMoves.push('right');
    }

    if (possibleMoves.length === 0) {
        console.log('Nessuna mossa possibile per il ladro.');
        startPlayerTurn(); // Ripristina il turno del giocatore se il ladro non può muoversi
        return;
    }

    // Seleziona una direzione casuale tra quelle possibili
    let direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    let nextPosition = { ...roguePosition };

    switch (direction) {
        case 'up':
            nextPosition.row--;
            break;
        case 'down':
            nextPosition.row++;
            break;
        case 'left':
            nextPosition.col--;
            break;
        case 'right':
            nextPosition.col++;
            break;
    }

    // Aggiorna la posizione del ladro solo se cambia
    if (nextPosition.row !== roguePosition.row || nextPosition.col !== roguePosition.col) {
        roguePosition = nextPosition; // Aggiorna la posizione del ladro
        updatePosition(rogue, roguePosition); // Aggiorna la posizione nel DOM

        // Cancella e mostra le nuove mosse possibili
        clearPossibleMoves();

        // Ripristina il turno del giocatore
        setTimeout(() => {
            startPlayerTurn();
        }, 100); // Piccolo ritardo per sincronizzare l'aggiornamento
    } else {
        startPlayerTurn(); // Ripristina immediatamente il turno del giocatore se il ladro non si muove
    }
}


function updatePosition(character, position) {
    character.style.transform = `translate(${(position.col - 1) * stepSize}px, ${(position.row - 1) * stepSize}px)`;
}

// Funzione per verificare se una posizione è un muro
function isWall(position) {
    return walls.some(wall => wall.row === position.row && wall.col === position.col);
}


function checkCollision() {
    // Verifica se la guardia ha catturato il ladro
    if (guardPosition.row === roguePosition.row && guardPosition.col === roguePosition.col) {
        alert('La guardia ha catturato il ladro!');
        winGame(); // Chiama la funzione per gestire la vittoria
        resetGame(); // Resetta il gioco dopo la vittoria
    }
}


// Funzione per mostrare la mossa selezionata
function showSelectedMove(position, direction) {
    const movePosition = { row: position.row, col: position.col };

    switch (direction) {
        case 'up':
            movePosition.row--;
            break;
        case 'down':
            movePosition.row++;
            break;
        case 'left':
            movePosition.col--;
            break;
        case 'right':
            movePosition.col++;
            break;
    }

    // Trova il quadrato corrispondente alla mossa selezionata e cambia il suo aspetto
    const moveElements = document.querySelectorAll('.possible-move');
    moveElements.forEach(element => {
        const top = parseInt(element.style.top) / stepSize + 1;
        const left = parseInt(element.style.left) / stepSize + 1;
        if (top === movePosition.row && left === movePosition.col) {
            element.classList.add('selected-move'); // Aggiungi la classe per evidenziare la mossa selezionata
        } else {
            element.classList.remove('selected-move'); // Rimuovi la classe da tutte le altre mosse
        }
    });
}

// Funzione per cancellare l'indicazione del movimento selezionato
function clearSelectedMove() {
    const selectedMove = document.querySelectorAll('.selected-move');
    selectedMove.forEach(move => move.classList.remove('selected-move')); // Rimuove solo la classe 'selected-move'
}
// Funzione per cancellare le mosse precedenti
function clearPossibleMoves() {
    const moveElements = document.querySelectorAll('.possible-move');
    moveElements.forEach(element => element.remove()); // Rimuove tutti gli elementi con la classe 'possible-move'
}

function showPossibleMoves(position, type) {
    const possibleMoves = [];

    // Calcola le possibili mosse
    if (position.row > 1) possibleMoves.push({ row: position.row - 1, col: position.col });
    if (position.row < gridSize) possibleMoves.push({ row: position.row + 1, col: position.col });
    if (position.col > 1) possibleMoves.push({ row: position.row, col: position.col - 1 });
    if (position.col < gridSize) possibleMoves.push({ row: position.row, col: position.col + 1 });

    possibleMoves.forEach(move => {
        // Crea un nuovo elemento per ogni mossa possibile
        const moveElement = document.createElement('div');
        moveElement.className = 'possible-move';
        if (type === 'rogue') moveElement.classList.add('enemy-move');
        moveElement.style.top = (move.row - 1) * stepSize + 'px';
        moveElement.style.left = (move.col - 1) * stepSize + 'px';
        gameArea.appendChild(moveElement);

        // Usa un timeout per aggiungere la classe 'visible' e attivare l'effetto di transizione
        setTimeout(() => {
            moveElement.classList.add('visible');
        }, 50); // Ritardo minimo per attivare l'animazione
    });
}
// Assicurati di chiamare `startPlayerTurn()` quando è il turno del giocatore e `startMovement()` quando inizia un movimento.
// Funzione per resettare il gioco
function resetGame() {
    // Rimuove la transizione temporaneamente per evitare l'animazione iniziale
    removeTransition(guard);
    removeTransition(rogue);

    // Posiziona i personaggi in posizioni casuali
    randomizeCharacters();

    // Ripristina la transizione dopo aver posizionato i personaggi
    setTimeout(() => {
        restoreTransition(guard);
        restoreTransition(rogue);
    }, 50); // Attende un breve ritardo per assicurare che il browser abbia tempo di applicare le modifiche

    playerTurn = true; // Ripristina il turno del giocatore
    clearPossibleMoves();
    showPossibleMoves(guardPosition, 'guard'); // Mostra le possibili mosse della guardia
    showPossibleMoves(roguePosition, 'rogue'); // Mostra le possibili mosse del ladro

    // Genera un numero casuale di muri
    generateRandomWalls(1); // Puoi modificare il numero di muri generati
}

// Aggiungi un listener per gli eventi della tastiera
document.addEventListener('keydown', handleKeydown);

// Funzione per gestire l'input da tastiera
function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            selectDirection('up'); // Movimento verso l'alto
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            selectDirection('down'); // Movimento verso il basso
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            selectDirection('left'); // Movimento verso sinistra
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            selectDirection('right'); // Movimento verso destra
            break;
        case ' ':
        case 'Enter':
            confirmMove(); // Conferma il movimento
            break;
        default:
            break;
    }
}

// Funzione per rimuovere temporaneamente la transizione
function removeTransition(character) {
    character.style.transition = 'none'; // Rimuove la transizione
}

// Funzione per ripristinare la transizione
function restoreTransition(character) {
    character.style.transition = 'transform 0.5s'; // Ripristina la transizione
}



// Funzione per ottenere una posizione casuale nella griglia
function getRandomPosition() {
    return {
        row: Math.floor(Math.random() * gridSize) + 1,
        col: Math.floor(Math.random() * gridSize) + 1
    };
}

// Funzione per calcolare la distanza euclidea tra due posizioni cioè la distanza minima
function calculateDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2));
}

// Funzione per posizionare casualmente i personaggi sulla griglia
function randomizeCharacters() {
    const minDistance = 7; // Distanza minima tra i personaggi

    // Genera posizioni casuali per la guardia e il ladro
    do {
        guardPosition = getRandomPosition();
    } while (isWall(guardPosition)); // Assicura che la posizione della guardia non sia sopra un muro

    do {
        roguePosition = getRandomPosition();
    } while (
        isWall(roguePosition) || // Assicura che la posizione del ladro non sia sopra un muro
        calculateDistance(guardPosition, roguePosition) < minDistance // Assicura che i personaggi siano abbastanza distanti
    );

    updatePosition(guard, guardPosition);
    updatePosition(rogue, roguePosition);
}
