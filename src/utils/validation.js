/**
 * Utilitaires de validation des données du formulaire
 * VERSION THS - Diagnostic connexion Internet
 */

/**
 * Valide que tous les champs obligatoires sont remplis
 */
export function validateFormData(formData) {
  const errors = []

  // Champs obligatoires
  if (!formData.nom || formData.nom.trim() === '') {
    errors.push('Le nom est obligatoire')
  }

  if (!formData.prenom || formData.prenom.trim() === '') {
    errors.push('Le prénom est obligatoire')
  }

  if (!formData.service || formData.service === '') {
    errors.push('Le service est obligatoire')
  }

  if (!formData.solutionProbleme || formData.solutionProbleme === '') {
    errors.push('La solution en cas de problème est obligatoire')
  }

  if (!formData.qualitePercue || formData.qualitePercue === '') {
    errors.push('La qualité perçue est obligatoire')
  }

  if (!formData.stabilite || formData.stabilite === '') {
    errors.push('La stabilité est obligatoire')
  }

  if (!formData.impact || formData.impact === '') {
    errors.push("L'impact sur le travail est obligatoire")
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
    nom: formData.nom.trim(),
    prenom: formData.prenom.trim(),
    service: formData.service,
    poste: formData.poste?.trim() || '',
    solutionProbleme: formData.solutionProbleme,
    qualitePercue: formData.qualitePercue,
    stabilite: formData.stabilite,
    impact: formData.impact,
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
