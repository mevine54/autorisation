document.addEventListener('DOMContentLoaded', () => {
    let formAbsence = JSON.parse(localStorage.getItem("formAbsence"));

    if (!formAbsence) {
        document.getElementById("content").textContent = "Aucune donnée de formulaire trouvée.";
        return;
    }

    // Validation des données
    const nom = formAbsence.nom || "Non spécifié";
    const prenom = formAbsence.prenom || "Non spécifié";
    const formation = formAbsence.formation || "Non spécifiée";
    const reasonmissing = formAbsence.reasonmissing || "Non spécifiée";

    let outputPhrase = `
        <p>
            L'étudiant <strong>${prenom} ${nom}</strong>
            en formation <strong>${formation}</strong>
            est absent pour la raison suivante :
            <em>${reasonmissing}</em>.
        </p>
    `;

    // Insérer la phrase dans la page HTML
    document.getElementById("content").innerHTML = outputPhrase;
    console.log(formAbsence);
});
