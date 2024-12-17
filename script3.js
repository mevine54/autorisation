// Récupérer les éléments pour le choix Heures/Jours
const heuresRadio = document.getElementById('heures');
const joursRadio = document.getElementById('jours');
const heuresContent = document.getElementById('heuresContent');
const joursContent = document.getElementById('joursContent');

function updateDisplay() {
    if (heuresRadio.checked) {
        heuresContent.classList.remove('hidden');
        joursContent.classList.add('hidden');
    } else if (joursRadio.checked) {
        joursContent.classList.remove('hidden');
        heuresContent.classList.add('hidden');
    } else {
        // Si aucun n'est sélectionné, tout reste caché
        heuresContent.classList.add('hidden');
        joursContent.classList.add('hidden');
    }
}

// Écouteurs d'événements
heuresRadio.addEventListener('change', updateDisplay);
joursRadio.addEventListener('change', updateDisplay);

// Chargement des motifs dans la colonne de gauche
const gaucheContainer = document.getElementById('gauche');

if (!gaucheContainer) {
    console.error("L'élément #gauche est introuvable.");
} else {
    fetch('motifsData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du JSON: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Données invalides ou vides.");
                gaucheContainer.textContent = "Aucun motif disponible.";
                return;
            }

            data.forEach(section => {
                if (!section || typeof section.sectionTitle !== 'string' || !Array.isArray(section.motifs)) {
                    console.warn("Section invalide:", section);
                    return;
                }

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'motif-section';

                const sectionTitle = document.createElement('h4');
                sectionTitle.textContent = section.sectionTitle;
                sectionDiv.appendChild(sectionTitle);

                if (section.motifs.length === 0) {
                    const noMotif = document.createElement('p');
                    noMotif.textContent = "Aucun motif dans cette catégorie.";
                    sectionDiv.appendChild(noMotif);
                } else {
                    section.motifs.forEach(motifItem => {
                        if (!motifItem || typeof motifItem.label !== 'string' || typeof motifItem.code !== 'string') {
                            console.warn("Motif invalide:", motifItem);
                            return;
                        }

                        const label = document.createElement('label');
                        label.style.display = "block";
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = motifItem.code;
                        checkbox.setAttribute('aria-label', motifItem.label);

                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(" " + motifItem.label));
                        sectionDiv.appendChild(label);
                    });
                }

                gaucheContainer.appendChild(sectionDiv);
            });
        })
        .catch(error => {
            console.error("Erreur fetch:", error);
            gaucheContainer.textContent = "Impossible de charger les motifs.";
        });
}
