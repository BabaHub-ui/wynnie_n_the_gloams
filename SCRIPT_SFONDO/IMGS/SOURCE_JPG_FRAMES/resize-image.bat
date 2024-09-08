REM SEGUI I PASSAGGI E CAMBIA TRY1 CON IL PERCORSO DELLA CARTELLA ESATTO

@echo off

REM Directory di origine - Sostituisci con il percorso completo della tua cartella di immagini
set source_dir="C:\Users\demen\Documents\WYNNIE N GLOAM\SCRIPT_SFONDO\IMGS\SOURCE_PNG_FRAMES\TRY1"

REM Crea le directory di destinazione per le diverse risoluzioni 
REM Commenta queste righe se le cartelle sono già state create
::mkdir 2k_IMG
::mkdir 4k_IMG
::mkdir 1080P_IMG
::mkdir HD_IMG
::mkdir 480P_IMG
::mkdir MOBILE_IMG

REM Creo cartelle per l'immagine scelta all'interno di ciascuna risoluzione
::mkdir 2k_IMG\TRY1
::mkdir 4k_IMG\TRY1
::mkdir 1080P_IMG\TRY1
::mkdir HD_IMG\TRY1
::mkdir 480P_IMG\TRY1
::mkdir MOBILE_IMG\TRY1

REM Comandi di ridimensionamento per ciascuna risoluzione
magick mogrify -path 2k_IMG\TRY1 -resize 224x112 %source_dir%\*.jpg
magick mogrify -path 4k_IMG\TRY1 -resize 336x168 %source_dir%\*.jpg
magick mogrify -path 1080P_IMG\TRY1 -resize 168x84 %source_dir%\*.jpg
magick mogrify -path HD_IMG\TRY1 -resize 112x56 %source_dir%\*.jpg
magick mogrify -path 480P_IMG\TRY1 -resize 75x37 %source_dir%\*.jpg
magick mogrify -path MOBILE_IMG\TRY1 -resize 31x16 %source_dir%\*.jpg

echo Le immagini sono state ridimensionate con successo!
pause