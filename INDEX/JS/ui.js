function handleTransitionEnd() {
    clearPossibleMoves();
    showPossibleMoves(guardPosition, 'guard'); // Mostra le nuove mosse della guardia
    showPossibleMoves(roguePosition, 'rogue'); // Mostra le nuove mosse del ladro
    playerTurn = true; // Ripristina il turno del giocatore
}
let currentGuardPosition = { row: 5, col: 5 }; // Posizione iniziale della guardia
let selectedDirection = '';



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
        case 'up-left':
            movePosition.row--;
            movePosition.col--;
            break;
        case 'up-right':
            movePosition.row--;
            movePosition.col++;
            break;
        case 'down-left':
            movePosition.row++;
            movePosition.col--;
            break;
        case 'down-right':
            movePosition.row++;
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


function showPossibleMoves(position, type) {
    // Cancella le mosse possibili precedentiw
    console.log(`Chiamata showPossibleMoves per: ${type} alla posizione:`, position);
    const possibleMoves = [];

    // Calcola le mosse verticali e orizzontali solo se non sono muri
    if (position.row > 1 && !isWall({ row: position.row - 1, col: position.col })) {
        possibleMoves.push({ row: position.row - 1, col: position.col }); // Su
    }
    if (position.row < gridSize && !isWall({ row: position.row + 1, col: position.col })) {
        possibleMoves.push({ row: position.row + 1, col: position.col }); // Giù
    }
    if (position.col > 1 && !isWall({ row: position.row, col: position.col - 1 })) {
        possibleMoves.push({ row: position.row, col: position.col - 1 }); // Sinistra
    }
    if (position.col < gridSize && !isWall({ row: position.row, col: position.col + 1 })) {
        possibleMoves.push({ row: position.row, col: position.col + 1 }); // Destra
    }

    // Calcola le mosse diagonali solo se il movimento diagonale è consentito
    if (isDiagonalMoveAllowed() && type ==='guard') {
        if (position.row > 1 && position.col > 1 && !isWall({ row: position.row - 1, col: position.col - 1 })) {
            possibleMoves.push({ row: position.row - 1, col: position.col - 1 }); // Su-Sinistra
        }
        if (position.row > 1 && position.col < gridSize && !isWall({ row: position.row - 1, col: position.col + 1 })) {
            possibleMoves.push({ row: position.row - 1, col: position.col + 1 }); // Su-Destra
        }
        if (position.row < gridSize && position.col > 1 && !isWall({ row: position.row + 1, col: position.col - 1 })) {
            possibleMoves.push({ row: position.row + 1, col: position.col - 1 }); // Giù-Sinistra
        }
        if (position.row < gridSize && position.col < gridSize && !isWall({ row: position.row + 1, col: position.col + 1 })) {
            possibleMoves.push({ row: position.row + 1, col: position.col + 1 }); // Giù-Destra
        }
    }

    // Visualizza le mosse possibili
    possibleMoves.forEach(move => {
        const moveElement = document.createElement('div');
        moveElement.className = 'possible-move';
        if (type === 'rogue') moveElement.classList.add('enemy-move'); // Stile diverso per il ladro
        if (levelCounter % 3 == 0 && type === 'rogue') {
            moveElement.style.backgroundColor = '#aa5c35'; // Cambia il colore per le mosse cattive
        } else {
            moveElement.style.backgroundColor = ''; // Ripristina il colore normale
        }
        moveElement.style.top = (move.row - 1) * stepSize + 'px';
        moveElement.style.left = (move.col - 1) * stepSize + 'px';
        gameArea.appendChild(moveElement);

        // Usa un timeout per attivare l'effetto di transizione e aggiungere la classe 'visible'
        setTimeout(() => {
            moveElement.classList.add('visible');
        }, 50); // Ritardo per attivare l'animazione
    });
}


// Funzione per rimuovere temporaneamente la transizione
function removeTransition(character) {
    character.style.transition = 'none'; // Rimuove la transizione
}

// Funzione per ripristinare la transizione
function restoreTransition(character) {
    character.style.transition = 'transform 0.5s'; // Ripristina la transizione
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

