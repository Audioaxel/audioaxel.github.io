window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('./sw.js');
    }
  }

/** Install Button */
if ('serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches) {
  // Wenn die PWA bereits installiert wurde, den Button ausblenden
  document.getElementById('installButton').style.display = 'none';
} else {
  // Eventlistener für das Installieren der PWA hinzufügen
  window.addEventListener('beforeinstallprompt', (event) => {
    // Button anzeigen
    document.getElementById('installButton').style.display = 'block';

    // Event abbrechen, um die Browser-eigene Installationsoption zu verhindern
    event.preventDefault();

    // Event in eine Variable speichern, um es später aufrufen zu können
    const deferredPrompt = event;

    // Event an das Klickereignis des Buttons binden
    document.getElementById('installButton').addEventListener('click', () => {
      // Installation prompt auslösen
      deferredPrompt.prompt();

      // Event abwarten
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Benutzer hat die Installation akzeptiert.');
        } else {
          console.log('Benutzer hat die Installation abgelehnt.');
        }

        // Prompt aufräumen
        deferredPrompt = null;
      });
    });
  });
}