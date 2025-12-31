/**
 * Utilitaires de validation des données du formulaire
 * VERSION THS - Diagnostic connexion Internet
 */

/**
 * Valide que tous les champs obligatoires sont remplis
 */
export function validateFormData(formData) {
  const errors = []

  // Identification
  if (!formData.nom || formData.nom.trim() === '') {
    errors.push('Le nom est obligatoire')
  }

  if (!formData.prenom || formData.prenom.trim() === '') {
    errors.push('Le prénom est obligatoire')
  }

  if (!formData.service || formData.service === '') {
    errors.push('Le service est obligatoire')
  }

  // Fréquence des incidents
  if (!formData.frequenceProblemes || formData.frequenceProblemes === '') {
    errors.push('La fréquence des problèmes est obligatoire')
  }

  if (!formData.dureePanne || formData.dureePanne === '') {
    errors.push('La durée moyenne des pannes est obligatoire')
  }

  if (!formData.momentJournee || formData.momentJournee === '') {
    errors.push('Le moment de la journée est obligatoire')
  }

  // Impact opérationnel
  if (!formData.tachesImpossibles || formData.tachesImpossibles.length === 0) {
    errors.push('Vous devez sélectionner au moins une tâche')
  }

  if (!formData.tempsPerdu || formData.tempsPerdu === '') {
    errors.push('Le temps perdu par incident est obligatoire')
  }

  if (!formData.impactEcheances || formData.impactEcheances === '') {
    errors.push("L'impact sur les échéances est obligatoire")
  }

  // Réaction en cas de panne
  if (!formData.solutionProbleme || formData.solutionProbleme === '') {
    errors.push('La réaction en cas de problème est obligatoire')
  }

  if (!formData.delaiSolution || formData.delaiSolution === '') {
    errors.push('Le délai avant solution alternative est obligatoire')
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  }
}

/**
 * Nettoie et formate les données avant envoi
 */
export function sanitizeFormData(formData) {
  return {
    // Identification
    nom: formData.nom.trim(),
    prenom: formData.prenom.trim(),
    service: formData.service,
    poste: formData.poste?.trim() || '',
    // Fréquence des incidents
    frequenceProblemes: formData.frequenceProblemes,
    dureePanne: formData.dureePanne,
    momentJournee: formData.momentJournee,
    // Impact opérationnel
    tachesImpossibles: Array.isArray(formData.tachesImpossibles) ? formData.tachesImpossibles : [],
    tempsPerdu: formData.tempsPerdu,
    impactEcheances: formData.impactEcheances,
    // Réaction en cas de panne
    solutionProbleme: formData.solutionProbleme,
    delaiSolution: formData.delaiSolution,
    // Commentaire
    commentaire: formData.commentaire?.trim() || ''
  }
}

/**
 * Génère une clé unique basée sur Nom + Prénom
 * Utilisé pour vérifier si la personne a déjà répondu
 */
export function generateUserKey(nom, prenom) {
  return `${nom.trim().toLowerCase()}_${prenom.trim().toLowerCase()}`
}
