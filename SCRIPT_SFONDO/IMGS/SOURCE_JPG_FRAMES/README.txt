@echo off

REM Directory di origine
set source_dir="/TRY1" REM Sostituisci con il percorso della cartella di immagini

REM Directory di destinazione per le diverse risoluzioni :: commenta le righe con REM all'inizio se sono già create 
mkdir 2k_IMG
mkdir 4k_IMG
mkdir 1080P_IMG
mkdir HD_IMG
mkdir 480P_IMG
mkdir MOBILE_IMG

REM Creo cartella per l'immagine scelta
mkdir 2k_IMG/TRY1
mkdir 4k_IMG/TRY1
mkdir 1080P_IMG/TRY1
mkdir HD_IMG/TRY1
mkdir 480P_IMG/TRY1
mkdir MOBILE_IMG/TRY1

REM Comandi di ridimensionamento per ciascuna risoluzione
magick mogrify -path 2k_IMG/TRY1 -resize 224x112 %source_dir%\*.png
magick mogrify -path 4k_IMG/TRY1 -resize 336x168 %source_dir%\*.png
magick mogrify -path 1080P_IMG/TRY1 -resize 168x84 %source_dir%\*.png
magick mogrify -path HD_IMG/TRY1 -resize 112x56 %source_dir%\*.png
magick mogrify -path 480P_IMG/TRY1 -resize 75x37 %source_dir%\*.png
magick mogrify -path MOBILE_IMG/TRY1 -resize 31x16 %source_dir%\*.png