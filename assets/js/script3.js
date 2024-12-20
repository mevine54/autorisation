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
                        const radio = document.createElement('input');
                        radio.type = 'radio';
                        radio.setAttribute("name", "reasonmissing");
                        radio.value = motifItem.label;
                        radio.setAttribute('aria-label', motifItem.label);

                        label.appendChild(radio);
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

    let formAbsence = document.getElementById("form-absence");
    formAbsence.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validation des champs
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const formation = document.getElementById('formation').value.trim();
        const duree = document.querySelector('input[name="duree"]:checked');
        const reasonmissing = document.querySelector('input[name="reasonmissing"]:checked');

        if (!nom || !prenom || !formation || !duree || !reasonmissing) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        let formData = new FormData(formAbsence);
        let formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        localStorage.setItem("formAbsence", JSON.stringify(formObject));
        console.log(formObject);
        window.location.href = "result.html";
    });

    // Calcul automatique du totalmissday
    const beginmissday = document.querySelector('input[name="beginmissday"]');
    const endmissday = document.querySelector('input[name="endmissday"]');
    const totalmissday = document.querySelector('input[name="totalmissday"]');

    function calculateTotalMissDay() {
        if (beginmissday.value && endmissday.value) {
            const startDate = new Date(beginmissday.value);
            const endDate = new Date(endmissday.value);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalmissday.value = diffDays;
        } else {
            totalmissday.value = '';
        }
    }

    beginmissday.addEventListener('change', calculateTotalMissDay);
    endmissday.addEventListener('change', calculateTotalMissDay);
}
