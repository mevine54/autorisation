// Ce script charge les données depuis le fichier JSON et génère la liste des motifs.
// On applique un codage défensif : 
// - Vérification de l'existence du conteneur avant de l'utiliser 
// - Vérification du type de données
// - Gestion des erreurs de chargement (fetch)

// Récupération du conteneur dans le DOM
const gaucheContainer = document.getElementById('gauche');

if (!gaucheContainer) {
    console.error("L'élément #gauche est introuvable. Le script ne peut pas injecter les données.");
} else {
    // Chargement du JSON
    fetch('motifsData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement du fichier JSON : ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Vérifier que data est un tableau
            if (!Array.isArray(data)) {
                console.error("Données invalides : le fichier JSON ne contient pas un tableau.");
                gaucheContainer.textContent = "Impossible d'afficher les motifs (données invalides).";
                return;
            }

            if (data.length === 0) {
                console.warn("Aucun motif disponible dans les données.");
                gaucheContainer.textContent = "Aucun motif disponible.";
                return;
            }

            // Générer les éléments HTML pour chaque section
            data.forEach(section => {
                // Vérification des données de chaque section
                if (!section || typeof section.sectionTitle !== 'string' || !Array.isArray(section.motifs)) {
                    console.warn("Section de données invalide détectée:", section);
                    return; // On passe à la section suivante
                }

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'motif-section';

                const sectionTitle = document.createElement('h4');
                sectionTitle.textContent = section.sectionTitle;
                sectionDiv.appendChild(sectionTitle);

                // Itérer sur les motifs de la section
                if (section.motifs.length === 0) {
                    // Aucun motif dans cette section
                    const noMotif = document.createElement('p');
                    noMotif.textContent = "Aucun motif dans cette catégorie.";
                    sectionDiv.appendChild(noMotif);
                } else {
                    section.motifs.forEach(motifItem => {
                        // Vérifier la validité du motif
                        if (!motifItem || typeof motifItem.label !== 'string' || typeof motifItem.code !== 'string') {
                            console.warn("Motif invalide:", motifItem);
                            return; // motif suivant
                        }

                        const label = document.createElement('label');
                        label.style.display = "block";
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = motifItem.code;

                        // Ajout d'un aria-label ou du texte après la case
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
            console.error("Erreur lors du chargement ou de l'analyse du JSON:", error);
            if (gaucheContainer) {
                gaucheContainer.textContent = "Impossible de charger les motifs. Veuillez réessayer plus tard.";
            }
        });
}
