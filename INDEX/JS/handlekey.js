let keysPressed = {};


// Ascoltatore per i tasti premuti
// Ascoltatore per i tasti premuti
document.addEventListener('keydown', function(event) {
    keysPressed[event.key] = true; // Segna il tasto come premuto
    let buttonId; // Variabile per tracciare quale bottone è collegato all'azione

    // Verifica delle combinazioni per le direzioni diagonali
    if ((keysPressed['w'] || keysPressed['ArrowUp']) && (keysPressed['a'] || keysPressed['ArrowLeft'])) {
        if (isDiagonalMoveAllowed()) {
            selectedDirection = 'up-left';
            buttonId = 'up-left'; // Bottone associato
        }
    } else if ((keysPressed['w'] || keysPressed['ArrowUp']) && (keysPressed['d'] || keysPressed['ArrowRight'])) {
        if (isDiagonalMoveAllowed()) {
            selectedDirection = 'up-right';
            buttonId = 'up-right';
        }
    } else if ((keysPressed['s'] || keysPressed['ArrowDown']) && (keysPressed['a'] || keysPressed['ArrowLeft'])) {
        if (isDiagonalMoveAllowed()) {
            selectedDirection = 'down-left';
            buttonId = 'down-left';
        }
    } else if ((keysPressed['s'] || keysPressed['ArrowDown']) && (keysPressed['d'] || keysPressed['ArrowRight'])) {
        if (isDiagonalMoveAllowed()) {
            selectedDirection = 'down-right';
            buttonId = 'down-right';
        }
    } else if (event.key === 'w' || event.key === 'ArrowUp') {
        selectedDirection = 'up';
        buttonId = 'up';
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        selectedDirection = 'down';
        buttonId = 'down';
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        selectedDirection = 'left';
        buttonId = 'sx';
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
        selectedDirection = 'right';
        buttonId = 'dx';
    } else if (event.key === 'Enter' || event.key === ' ') {
        // Conferma il movimento con Enter o Spazio
        if (selectedDirection) {
            confirmMove();
            selectedDirection = null; // Resetta la direzione selezionata
            buttonId = 'go'; // Bottone associato al "Go"
        }
    }

    // Aggiorna `currentGuardPosition` in base alla posizione della guardia
    currentGuardPosition = { ...guardPosition }; 

    if (selectedDirection) {
        showSelectedMove(currentGuardPosition, selectedDirection); // Mostra la mossa selezionata
    }

    // Applica l'effetto di pressione del bottone
    if (buttonId) {
        simulateButtonPress(buttonId);
    }
});

// Funzione per simulare la pressione del bottone
function simulateButtonPress(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 500); // Rimuove l'effetto dopo 100 ms
    }
}

// Ascoltatore per i tasti rilasciati
document.addEventListener('keyup', function(event) {
    delete keysPressed[event.key]; // Rimuove il tasto dallo stato quando viene rilasciato
});

// Aggiungi gli event listener per i bottoni di movimento
document.getElementById('up').addEventListener('click', () => handleButtonPress('up'));
document.getElementById('down').addEventListener('click', () => handleButtonPress('down'));
document.getElementById('sx').addEventListener('click', () => handleButtonPress('left'));
document.getElementById('dx').addEventListener('click', () => handleButtonPress('right'));

// Aggiungi gli event listener per i bottoni diagonali
document.getElementById('up-left').addEventListener('click', () => handleButtonPress('up-left'));
document.getElementById('up-right').addEventListener('click', () => handleButtonPress('up-right'));
document.getElementById('down-left').addEventListener('click', () => handleButtonPress('down-left'));
document.getElementById('down-right').addEventListener('click', () => handleButtonPress('down-right'));

// Aggiungi event listener per i bottoni numerici e "Go"
document.getElementById('go').addEventListener('click', handleGoButton);
document.getElementById('num1').addEventListener('click', () => handleNumberButtonPress(1));
document.getElementById('num2').addEventListener('click', () => handleNumberButtonPress(2));
document.getElementById('num3').addEventListener('click', () => handleNumberButtonPress(3));
document.getElementById('num4').addEventListener('click', () => handleNumberButtonPress(4));
function handleButtonPress(direction) {
    moveGuard(direction); // Chiama la funzione per muovere la guardia nella direzione selezionata
    simulateButtonPress(direction);
}

function handleGoButton() {
    if (selectedDirection) {
        confirmMove();
        simulateButtonPress('go');
        selectedDirection = null; // Resetta la direzione selezionata dopo aver confermato
    }
}

function handleButtonPress(direction) {
    selectedDirection = direction; // Imposta la direzione selezionata
    simulateButtonPress(direction); // Simula la pressione del bottone
    // Mostra la mossa selezionata in base alla direzione
    showSelectedMove(currentGuardPosition, selectedDirection);
}
