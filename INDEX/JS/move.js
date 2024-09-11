
const guard = document.getElementById('guard');
const rogue = document.getElementById('rogue');
const gameArea = document.getElementById('game-area');
let turnCounter = 0;
let levelCounter = 1;
let rogueGauge = 0;
let rogueMovesCounter = 0;
let guardPosition = { row: 1, col: 1 }; // Posizione iniziale della guardia
let roguePosition = { row: 9, col: 9 }; // Posizione iniziale del ladro
const gridSize = 10; // Dimensione della griglia (10x10)
const stepSize = 50; // Dimensione del passo (50px)
let playerTurn = true; // Flag per indicare di chi è il turno


newGame();

// Funzione per aggiornare la posizione di un personaggio
function updatePosition(character, position) {
    character.style.transform = `translate(${(position.col - 1) * stepSize}px, ${(position.row - 1) * stepSize}px)`;
}

// Funzione per selezionare la direzione della guardia
function selectDirection(direction) {
    clearSelectedMove(); // Cancella l'indicazione del movimento selezionato precedente
    selectedDirection = direction;
    showSelectedMove(guardPosition, direction);
}


function moveCharacters() {
    moveGuard(selectedDirection); // Muove la guardia nella direzione selezionata
    selectedDirection = null; // Resetta la direzione selezionata
    // Calcola e muove il ladro dopo aver mosso la guardia
    checkCollision();
    turnCounter++; // Incrementa il contatore dei turni
    updateGameStats(); // Aggiorna le statistiche di gioco
    setTimeout(() => {
    moveRogue();
    clearPossibleMoves();
    }, 0); // Ritardo minimo per garantire che entrambi i movimenti inizino quasi contemporaneamente

    // Ascolta l'evento di fine transizione per mostrare le mosse dopo il movimento
    guard.addEventListener('transitionend', handleTransitionEnd, { once: true });
    rogue.addEventListener('transitionend', handleTransitionEnd, { once: true });
}

function confirmMove() {
    if (selectedDirection) {
        // Richiama `moveCharacters` per gestire il movimento del ladro
        moveCharacters();
    }
}


function moveGuard(direction) {
    previousGuardDirection = direction; // Aggiorna la direzione precedente della guardia
    let nextPosition = { ...guardPosition };

    // Calcola la nuova posizione in base alla direzione
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
        case 'up-left':
            if (isDiagonalMoveAllowed()) {
                nextPosition.row--;
                nextPosition.col--;
            }
            break;
        case 'up-right':
            if (isDiagonalMoveAllowed()) {
                nextPosition.row--;
                nextPosition.col++;
            }
            break;
        case 'down-left':
            if (isDiagonalMoveAllowed()) {
                nextPosition.row++;
                nextPosition.col--;
            }
            break;
        case 'down-right':
            if (isDiagonalMoveAllowed()) {
                nextPosition.row++;
                nextPosition.col++;
            }
            break;
    }

    // Verifica se la nuova posizione è all'interno dei limiti della griglia
    if (
        nextPosition.row >= 1 && nextPosition.row <= gridSize &&
        nextPosition.col >= 1 && nextPosition.col <= gridSize &&
        !isWall(nextPosition) // Controlla anche che non sia un muro
    ) {
        guardPosition = nextPosition; // Aggiorna la posizione della guardia
        updatePosition(guard, guardPosition); // Aggiorna la posizione nel DOM
        console.log("La guardia si muove verso:", nextPosition);
    } else {
        console.log('La guardia non può muoversi nella direzione selezionata o è fuori dall\'area di gioco.');
    }
}

function isDiagonalMoveAllowed() {
    const distanceToRogue = calculateDistance(guardPosition, roguePosition);
    return distanceToRogue <= Math.sqrt(2); // Consente il movimento diagonale solo se ad una casella di distanza
}

function calculateDistance(pos1, pos2) {
    const dx = pos1.col - pos2.col;
    const dy = pos1.row - pos2.row;
    return Math.sqrt(dx * dx + dy * dy);
}


let previousGuardDirection = null; // Variabile per tracciare la direzione precedente della guardia
function moveRogue() {
    let possibleMoves = [];
    const rogueElement = document.getElementById('rogue'); // Assicurati di avere un ID per il ladro

    // Verifica se il livello è un multiplo di 3 (il ladro è cattivo)
    const isRogueBad = levelCounter % 3 === 0;
    const escapeThreshold = 4; // Distanza minima alla quale il ladro cercherà di scappare

    // Cerca tutte le mosse possibili
    if (roguePosition.row > 1 && (isRogueBad || !isWall({ row: roguePosition.row - 1, col: roguePosition.col }))) {
        possibleMoves.push({ direction: 'up', position: { row: roguePosition.row - 1, col: roguePosition.col } });
    }
    if (roguePosition.row < gridSize && (isRogueBad || !isWall({ row: roguePosition.row + 1, col: roguePosition.col }))) {
        possibleMoves.push({ direction: 'down', position: { row: roguePosition.row + 1, col: roguePosition.col } });
    }
    if (roguePosition.col > 1 && (isRogueBad || !isWall({ row: roguePosition.row, col: roguePosition.col - 1 }))) {
        possibleMoves.push({ direction: 'left', position: { row: roguePosition.row, col: roguePosition.col - 1 } });
    }
    if (roguePosition.col < gridSize && (isRogueBad || !isWall({ row: roguePosition.row, col: roguePosition.col + 1 }))) {
        possibleMoves.push({ direction: 'right', position: { row: roguePosition.row, col: roguePosition.col + 1 } });
    }
    
    // Se non ci sono mosse valide, restituisce il turno al giocatore
    if (possibleMoves.length === 0) {
        console.log('Nessuna mossa possibile per il ladro.');
        return;
    }

    // Logica di movimento quando il ladro è cattivo
    if (isRogueBad) {
        console.log('Il ladro è cattivo e cerca di catturare la guardia!');
        rogueElement.classList.add('bad')
        // Cerca la mossa che minimizza la distanza dalla guardia
        let bestMove = possibleMoves[0];
        let minDistance = calculateDistance(bestMove.position, guardPosition);

        for (let i = 1; i < possibleMoves.length; i++) {
            let distance = calculateDistance(possibleMoves[i].position, guardPosition);
            if (distance < minDistance) {
                minDistance = distance;
                bestMove = possibleMoves[i];
            }
        }

        // Esegui la mossa che minimizza la distanza dalla guardia
        let direction = bestMove.direction;
        let nextPosition = bestMove.position;

        // Aggiorna la posizione del ladro
        roguePosition = nextPosition;
        updatePosition(rogue, roguePosition); // Aggiorna la posizione nel DOM
        checkCollision();
        console.log('Il ladro si avvicina alla guardia verso:', nextPosition);
    } else {
        // Calcola la distanza corrente dalla guardia
        const distanceToGuard = calculateDistance(roguePosition, guardPosition);
        rogueElement.classList.remove('bad')
        if (distanceToGuard < escapeThreshold) {
            console.log('Il ladro cerca di scappare dalla guardia!');

            // Cerca la mossa che massimizza la distanza dalla guardia
            let bestMove = null;
            let maxDistance = -Infinity; // Usa un valore molto basso per iniziare

            for (let i = 0; i < possibleMoves.length; i++) {
                let distance = calculateDistance(possibleMoves[i].position, guardPosition);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestMove = possibleMoves[i];
                }
            }

            // Se trova una mossa migliore, la esegue; altrimenti, sceglie una mossa casuale
            if (bestMove) {
                let direction = bestMove.direction;
                let nextPosition = bestMove.position;

                // Aggiorna la posizione del ladro
                roguePosition = nextPosition;
                updatePosition(rogue, roguePosition); // Aggiorna la posizione nel DOM
                console.log('Il ladro si allontana dalla guardia verso:', nextPosition);
            } else {
                // Movimento casuale se non trova una mossa migliore
                let randomIndex = Math.floor(Math.random() * possibleMoves.length);
                let chosenMove = possibleMoves[randomIndex];

                let direction = chosenMove.direction;
                let nextPosition = chosenMove.position;

                // Aggiorna la posizione del ladro
                roguePosition = nextPosition;
                updatePosition(rogue, roguePosition); // Aggiorna la posizione nel DOM
                console.log('Il ladro si muove casualmente verso:', nextPosition);
            }
        } else {
            // Movimento casuale se la guardia è lontana
            let randomIndex = Math.floor(Math.random() * possibleMoves.length);
            let chosenMove = possibleMoves[randomIndex];

            // Esegui la mossa selezionata casualmente
            let direction = chosenMove.direction;
            let nextPosition = chosenMove.position;

            // Aggiorna la posizione del ladro
            roguePosition = nextPosition;
            updatePosition(rogue, roguePosition); // Aggiorna la posizione nel DOM
            console.log('Il ladro si muove casualmente verso:', nextPosition);
        }
    }

    // Aggiorna il contatore dei movimenti del ladro
    rogueMovesCounter++;
    if (rogueMovesCounter % 4 === 0) {
        rogueGauge++; // Incrementa la gauge del ladro ogni 4 movimenti
        updateGameStats(); // Aggiorna le statistiche di gioco
    }
}


// Funzione per verificare se una posizione è un muro
function isWall(position) {
    return walls.some(wall => wall.row === position.row && wall.col === position.col);
}


// Funzione per ottenere una posizione casuale nella griglia
function getRandomPosition() {
    return {
        row: Math.floor(Math.random() * gridSize) + 1,
        col: Math.floor(Math.random() * gridSize) + 1
    };
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

