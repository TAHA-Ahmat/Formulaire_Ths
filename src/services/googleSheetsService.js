/**
 * Service d'interaction avec Google Sheets
 * VERSION THS avec Proxy Vercel
 *
 * Architecture SANS CORS :
 * - Front Vue.js → /api/sheets (Vercel Serverless) → Google Apps Script → Google Sheets
 * - Pas de CORS car même domaine (frontend et API sur Vercel)
 * - Fonctionne en local ET en production
 */

// En production : /api/sheets (Vercel)
// En dev local : appel direct Google Apps Script
const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_GOOGLE_SCRIPT_URL
  : '/api/sheets'

/**
 * Vérifie si une personne a déjà répondu
 * @param {string} nom - Nom de famille
 * @param {string} prenom - Prénom
 * @returns {Promise<boolean>}
 */
export async function checkIfAlreadyResponded(nom, prenom) {
  try {
    const response = await fetch(`${API_URL}?action=check&nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(prenom)}`)
    const data = await response.json()
    return data.exists || false
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    throw new Error('Impossible de vérifier si vous avez déjà répondu')
  }
}

/**
 * Soumet une nouvelle réponse au formulaire
 * @param {Object} formData - Données du formulaire
 * @param {Object} technicalData - Données techniques automatiques
 * @returns {Promise<Object>}
 */
export async function submitResponse(formData, technicalData) {
  try {
    // Combiner les données (structure THS)
    const combinedData = {
      // Données déclaratives
      nom: formData.nom,
      prenom: formData.prenom,
      service: formData.service,
      poste: formData.poste || '',
      // Nouveaux champs factuels
      frequenceProblemes: formData.frequenceProblemes,
      dureePanne: formData.dureePanne,
      momentJournee: formData.momentJournee,
      tachesImpossibles: formData.tachesImpossibles, // Array
      tempsPerdu: formData.tempsPerdu,
      impactEcheances: formData.impactEcheances,
      solutionProbleme: formData.solutionProbleme,
      delaiSolution: formData.delaiSolution,
      commentaire: formData.commentaire || '',

      // Données techniques
      browser: technicalData.browser,
      browserVersion: technicalData.browserVersion,
      os: technicalData.os,
      deviceType: technicalData.deviceType,
      screenResolution: technicalData.screenResolution,
      language: technicalData.language,
      timezone: technicalData.timezone,
      userAgent: technicalData.userAgent,
      timestamp: technicalData.timestamp
    }

    // Encoder les données en JSON puis en URL
    const encodedData = encodeURIComponent(JSON.stringify(combinedData))

    // Appeler le proxy Vercel
    const response = await fetch(`${API_URL}?action=submit&data=${encodedData}`)

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi des données')
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Erreur lors de l\'enregistrement')
    }

    return result
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    throw error
  }
}

/**
 * Récupère la liste publique des répondants
 * NE RETOURNE PAS les commentaires (admin only)
 * @returns {Promise<Array>}
 */
export async function getPublicResponses() {
  try {
    const response = await fetch(`${API_URL}?action=list`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de la récupération des données')
    }

    // Ne retourner que les données publiques
    return (data.responses || []).map(item => ({
      nom: item.nom,
      prenom: item.prenom,
      service: item.service,
      date: item.timestamp
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des réponses:', error)
    throw new Error('Impossible de charger les réponses')
  }
}

/**
 * Récupère le nombre total de réponses
 * @returns {Promise<number>}
 */
export async function getResponseCount() {
  try {
    const response = await fetch(`${API_URL}?action=count`)
    const data = await response.json()
    return data.count || 0
  } catch (error) {
    console.error('Erreur lors du comptage:', error)
    return 0
  }
}
