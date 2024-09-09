let walls = []; // Array per tenere traccia delle posizioni dei muri

// Funzione per creare e posizionare un muro
function createWall(row, col) {
    const wallElement = document.createElement('div');
    wallElement.className = 'wall';
    wallElement.style.top = (row - 1) * stepSize + 'px';
    wallElement.style.left = (col - 1) * stepSize + 'px';
    gameArea.appendChild(wallElement);

    // Aggiungi il muro all'array delle posizioni dei muri
    walls.push({ row, col });
}
// Funzione per generare muri in posizioni casuali
function generateRandomWalls(numberOfWalls) {
    for (let i = 0; i < numberOfWalls; i++) {
        let wallPosition;
        do {
            wallPosition = getRandomPosition();
        } while (
            (wallPosition.row === guardPosition.row && wallPosition.col === guardPosition.col) || // Evita la posizione della guardia
            (wallPosition.row === roguePosition.row && wallPosition.col === roguePosition.col) || // Evita la posizione del ladro
            isWall(wallPosition) // Evita sovrapposizione con altri muri
        );
        
        createWall(wallPosition.row, wallPosition.col); // Crea il muro in una posizione valida
    }
}