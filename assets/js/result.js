let formAbsence =   JSON.parse( localStorage.getItem("formAbsence") ) ;
let outputPhrase = `
            <p>
                L'étudiant <strong>${formAbsence.prenom} ${formAbsence.nom}</strong> 
                en formation <strong>${formAbsence.formation}</strong> 
                est absent pour la raison suivante : 
                <em>${formAbsence.reasonmissing || "Non spécifiée"}</em>.
            </p>
        `;

        // Insérer la phrase dans la page HTML
        document.getElementById("content").innerHTML = outputPhrase;
console.log(formAbsence)