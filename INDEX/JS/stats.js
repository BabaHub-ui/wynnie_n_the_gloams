// Funzione per aggiornare le statistiche del gioco nel DOM
function updateGameStats() {
    document.getElementById('turn-counter').innerText = turnCounter;
    document.getElementById('level-counter').innerText = levelCounter;
    document.getElementById('rogue-gauge').innerText = rogueGauge;
}


function checkCollision() {
    // Verifica se la guardia ha catturato il ladro
    if (!(levelCounter % 3 === 0)&& guardPosition.row === roguePosition.row && guardPosition.col === roguePosition.col) {
        alert('La guardia ha catturato il ladro!');
        levelCounter++; // Incrementa il livello
        resetGame(); // Resetta il gioco per il nuovo livello
        updateGameStats(); // Aggiorna le statistiche di gioco
        return;
    }

    // Verifica se il ladro cattura la guardia ogni terzo livello
    if (levelCounter % 3 === 0 && roguePosition.row === guardPosition.row && roguePosition.col === guardPosition.col) {
        alert('Il ladro ha catturato la guardia! Livello terminato.');
        resetGame(); // Resetta il gioco per il nuovo livello
        levelCounter++; // Incrementa il livello
        updateGameStats(); // Aggiorna le statistiche di gioco
        return;
    }
}

function resetGame() {
    rogueMovesCounter = 0; // Resetta il contatore dei movimenti del ladro
    rogueGauge = 0; // Resetta la gauge del ladro
    turnCounter = 0; // Resetta il contatore dei turni

    // Rimuove la transizione temporaneamente per evitare l'animazione iniziale
    removeTransition(guard);
    removeTransition(rogue);

    // Posiziona i personaggi in posizioni casuali
    randomizeCharacters();

    // Ripristina la transizione dopo aver posizionato i personaggi
    setTimeout(() => {
        restoreTransition(guard);
        restoreTransition(rogue);
        showPossibleMoves(guardPosition, 'guard'); // Mostra le possibili mosse della guardia
        showPossibleMoves(roguePosition, 'rogue'); // Mostra le possibili mosse del ladro

    }, 50); // Attende un breve ritardo per assicurare che il browser abbia tempo di applicare le modifiche

    // Debug: Verifica che le mosse siano mostrate
    console.log("Visualizzazione delle mosse iniziali per la guardia e il ladro");

    // Mostra le mosse possibili per i personaggi dopo il reset

    // Ascolta l'evento di fine transizione per mostrare le mosse dopo il movimento

    // Genera un numero casuale di muri
    generateRandomWalls(1); // Puoi modificare il numero di muri generati

    // Aggiorna le statistiche di gioco
    updateGameStats();
}


function newGame() {
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
    showPossibleMoves(guardPosition, 'guard'); // Mostra le possibili mosse della guardia
    showPossibleMoves(roguePosition, 'rogue'); // Mostra le possibili mosse del ladro

    // Genera un numero casuale di muri
    generateRandomWalls(1); // Puoi modificare il numero di muri generati
}
