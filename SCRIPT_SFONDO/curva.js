/**
 * Genera un array di nomi di file in base a un formato predefinito
 * @param {string} prefix - Prefisso del nome del file (es. "frame_")
 * @param {string} suffix - Suffisso del nome del file (es. "_delay-0.03s")
 * @param {number} totalFiles - Numero totale di file da generare
 * @returns {Array} - Array di nomi di file generati
 */
function generateFileNames(prefix, suffix, totalFiles) {
    const fileNames = [];

    for (let i = 0; i < totalFiles; i++) {
        const fileNumber = String(i).padStart(3, '0'); // Assicura che il numero del file abbia sempre 3 cifre
        fileNames.push(`${prefix}${fileNumber}${suffix}`);
    }

    return fileNames;
}

// Utilizzo della funzione
const prefix = 'frame_';
const suffix = '_delay-0.03s.jpg'; // Modifica il suffisso in base all'estensione del file
const totalFiles = 150; // Sostituisci con il numero effettivo di file

const generatedFileNames = generateFileNames(prefix, suffix, totalFiles);
console.log(generatedFileNames);

document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.getElementById('pixel-grid');
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');

    let rows, cols;
    const basePath = 'IMGS/SOURCE_JPG_FRAMES/'; // Percorso base iniziale
    let imgPath = ''; // Percorso delle immagini per la risoluzione corrente

    // Funzione per aggiornare righe, colonne e percorso delle immagini in base ai breakpoint
    function updateGridSettings() {
        const width = window.innerWidth;

        // Determina i valori di rows e cols in base alla risoluzione dello schermo
        if (width >= 3840) { // 4K
            rows = 168;
            cols = 336;
            imgPath = '4k_IMG/TRY1';
        } else if (width >= 2560) { // 2K
            rows = 112;
            cols = 224;
            imgPath = '2k_IMG/TRY1';
        } else if (width >= 1920) { // Full HD
            rows = 84;
            cols = 168;
            imgPath = '1080P_IMG/TRY1';
        } else if (width >= 1280) { // HD
            rows = 56;
            cols = 112;
            imgPath = 'HD_IMG/TRY1';
        } else if (width >= 480) { // 480p
            rows = 37;
            cols = 75;
            imgPath = '480P_IMG/TRY1';
        } else { // Mobile
            rows = 16;
            cols = 31;
            imgPath = 'MOBILE_IMG/TRY1';
        }

        // Combina il percorso base con il percorso specifico delle immagini
        imgPath = basePath + imgPath;
        console.log(imgPath)
        // Imposta il numero di colonne e righe della griglia
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 10px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 10px)`;
    }

    // Esegui l'aggiornamento delle impostazioni della griglia
    updateGridSettings();

    // Array di nomi dei file delle immagini
    const imageNames = generateFileNames(prefix, suffix, totalFiles);

    // Array di percorsi delle immagini da utilizzare per l'animazione
    const imagePaths = imageNames.map(name => imgPath + '/' + name);

    let currentIndex = 0; // Indice dell'immagine corrente

    function loadImageAndUpdateGrid(imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        img.crossOrigin = "Anonymous"; // Questo è necessario solo se le immagini sono da un dominio diverso
    
        img.onload = function () {
            console.log("Immagine caricata correttamente:", imgSrc);
            canvas.width = cols;
            canvas.height = rows;
    
            ctx.drawImage(img, 0, 0, cols, rows);
    
            const imageData = ctx.getImageData(0, 0, cols, rows);
            const data = imageData.data;
    
            gridContainer.innerHTML = '';
    
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const pixelIndex = (i * cols + j) * 4;
                    const red = data[pixelIndex];
                    const green = data[pixelIndex + 1];
                    const blue = data[pixelIndex + 2];
                    const alpha = data[pixelIndex + 3] / 255;
    
                    const pixel = document.createElement('div');
                    pixel.classList.add('pixel');
                    pixel.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                    gridContainer.appendChild(pixel);
                }
            }
        };
    
        img.onerror = function () {
            console.error("Errore nel caricamento dell'immagine:", imgSrc);
        };
    }

    // Funzione per cambiare l'immagine ogni X millisecondi
    function changeImagePeriodically() {
        setInterval(() => {
            loadImageAndUpdateGrid(imagePaths[currentIndex]);
            currentIndex = (currentIndex + 1) % imagePaths.length;
        }, 300);
    }

    // Inizia il ciclo di cambio immagine
    changeImagePeriodically();

    // Aggiungi un listener per aggiornare la griglia al ridimensionamento della finestra
    window.addEventListener('resize', function() {
        updateGridSettings();
        currentIndex = 0; // Reimposta l'indice dell'immagine corrente
        changeImagePeriodically(); // Riavvia il ciclo di cambio immagine con le nuove impostazioni
    });
});
