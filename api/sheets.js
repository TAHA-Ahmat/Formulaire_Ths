/**
 * VERCEL SERVERLESS FUNCTION - Proxy vers Google Apps Script
 *
 * Résout le problème CORS en agissant comme intermédiaire :
 * Frontend → /api/sheets (même domaine, pas de CORS) → Google Apps Script
 *
 * Cette fonction est automatiquement déployée par Vercel.
 * Aucun serveur à maintenir.
 */

// URL du Google Apps Script (à configurer via variable d'environnement Vercel)
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

export default async function handler(req, res) {
  // Permettre CORS pour le développement local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Debug: Log de la variable d'environnement
    console.log('GOOGLE_SCRIPT_URL:', GOOGLE_SCRIPT_URL ? 'Configured' : 'MISSING');
    console.log('Full URL:', GOOGLE_SCRIPT_URL);

    // Vérifier que l'URL Google Apps Script est configurée
    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({
        success: false,
        message: 'Configuration Google Apps Script manquante'
      });
    }

    // Construire l'URL avec les paramètres de requête
    const queryString = new URLSearchParams(req.query).toString();
    const targetUrl = `${GOOGLE_SCRIPT_URL}${queryString ? '?' + queryString : ''}`;

    // Appeler Google Apps Script (serveur à serveur, pas de CORS)
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`Google Apps Script error: ${response.status}`);
    }

    const data = await response.json();

    // Retourner les données au frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Erreur proxy:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la communication avec Google Sheets'
    });
  }
}
