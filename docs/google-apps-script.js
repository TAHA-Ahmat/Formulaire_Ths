/**
 * GOOGLE APPS SCRIPT - Web App pour Formulaire Connexion Internet
 * VERSION THS - GOOGLE APPS SCRIPT COMPATIBLE
 *
 * Ce script doit être déployé en tant que Web App depuis Google Apps Script
 * Voir README.md pour les instructions de déploiement
 *
 * IMPORTANT :
 * - Ce script gère TOUTES les interactions avec Google Sheets
 * - Les commentaires ne sont JAMAIS exposés au front
 * - Une personne = une seule réponse (Nom + Prénom)
 * - Utilise GET pour éviter les problèmes de CORS preflight
 * - CORS géré automatiquement par Google si "Qui a accès : Tout le monde"
 */

// Nom de la feuille Google Sheets (à créer manuellement)
const SHEET_NAME = 'Reponses';

/**
 * Fonction appelée lors des requêtes GET
 * Actions supportées : check, list, count, submit
 */
function doGet(e) {
  const action = e.parameter.action;

  try {
    switch(action) {
      case 'check':
        return checkIfExists(e.parameter.nom, e.parameter.prenom);

      case 'list':
        return getPublicList();

      case 'count':
        return getCount();

      case 'submit':
        return submitResponseFromGet(e.parameter);

      default:
        return jsonResponse({ success: false, message: 'Action invalide' });
    }
  } catch (error) {
    Logger.log('Erreur doGet: ' + error.toString());
    return jsonResponse({ success: false, message: error.toString() });
  }
}

/**
 * Fonction appelée lors des requêtes POST (backup)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'submit') {
      return submitResponse(data.data);
    }

    return jsonResponse({ success: false, message: 'Action invalide' });
  } catch (error) {
    Logger.log('Erreur doPost: ' + error.toString());
    return jsonResponse({ success: false, message: error.toString() });
  }
}

/**
 * Vérifie si une personne a déjà répondu
 * OPTIMISÉ : Lit seulement les colonnes Nom et Prénom
 */
function checkIfExists(nom, prenom) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  // Si pas de données (seulement l'en-tête)
  if (lastRow <= 1) {
    return jsonResponse({ exists: false });
  }

  // Lire seulement les colonnes 1 et 2 (Nom, Prénom) des lignes de données
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  // Vérifier si nom + prénom existent
  for (let i = 0; i < data.length; i++) {
    const rowNom = data[i][0];
    const rowPrenom = data[i][1];

    if (rowNom.toLowerCase() === nom.toLowerCase() &&
        rowPrenom.toLowerCase() === prenom.toLowerCase()) {
      return jsonResponse({ exists: true });
    }
  }

  return jsonResponse({ exists: false });
}

/**
 * Soumet une nouvelle réponse (depuis GET avec paramètres)
 */
function submitResponseFromGet(params) {
  // Décoder les données JSON encodées en URL
  const data = JSON.parse(decodeURIComponent(params.data));
  return submitResponse(data);
}

/**
 * Soumet une nouvelle réponse
 * OPTIMISÉ : Vérification de doublon plus rapide
 */
function submitResponse(data) {
  // Vérifier doublon
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  // Si des données existent, vérifier les doublons
  if (lastRow > 1) {
    // Lire seulement les colonnes Nom et Prénom
    const existingData = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

    for (let i = 0; i < existingData.length; i++) {
      if (existingData[i][0].toLowerCase() === data.nom.toLowerCase() &&
          existingData[i][1].toLowerCase() === data.prenom.toLowerCase()) {
        return jsonResponse({
          success: false,
          message: 'Vous avez déjà répondu à ce formulaire'
        });
      }
    }
  }

  // Ajouter la réponse
  const timestamp = new Date().toISOString();
  const row = [
    data.nom,
    data.prenom,
    data.service,
    data.poste || '',
    data.solutionProbleme,
    data.qualitePercue,
    data.stabilite,
    data.impact,
    data.commentaire || '',
    data.browser,
    data.browserVersion,
    data.os,
    data.deviceType,
    data.screenResolution,
    data.language,
    data.timezone,
    data.userAgent,
    timestamp
  ];

  sheet.appendRow(row);

  return jsonResponse({
    success: true,
    message: 'Réponse enregistrée avec succès'
  });
}

/**
 * Récupère la liste publique (sans commentaires)
 * OPTIMISÉ : Lit seulement les colonnes nécessaires (Nom, Prénom, Service, Date)
 */
function getPublicList() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  // Si pas de données (seulement l'en-tête)
  if (lastRow <= 1) {
    return jsonResponse({
      success: true,
      responses: []
    });
  }

  // Lire seulement les colonnes 1, 2, 3 (Nom, Prénom, Service)
  const basicData = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  // Lire la colonne 18 (Date/Heure)
  const timestamps = sheet.getRange(2, 18, lastRow - 1, 1).getValues();

  const responses = [];

  for (let i = 0; i < basicData.length; i++) {
    responses.push({
      nom: basicData[i][0],
      prenom: basicData[i][1],
      service: basicData[i][2],
      timestamp: timestamps[i][0]
    });
  }

  return jsonResponse({
    success: true,
    responses: responses
  });
}

/**
 * Compte le nombre total de réponses
 */
function getCount() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  // Soustraire 1 pour la ligne d'en-tête
  const count = lastRow > 1 ? lastRow - 1 : 0;

  return jsonResponse({ count: count });
}

/**
 * Obtient ou crée la feuille
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Si la feuille n'existe pas, la créer avec les en-têtes
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Nom',
      'Prénom',
      'Service',
      'Poste',
      'Solution en cas de problème',
      'Qualité Perçue',
      'Stabilité',
      'Impact',
      'Commentaire (Admin)',
      'Navigateur',
      'Version Navigateur',
      'OS',
      'Type Appareil',
      'Résolution',
      'Langue',
      'Fuseau Horaire',
      'User Agent',
      'Date/Heure'
    ];
    sheet.appendRow(headers);

    // Formater les en-têtes
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#667eea');
    headerRange.setFontColor('#ffffff');
  }

  return sheet;
}

/**
 * Retourne une réponse JSON
 * CORS est géré automatiquement par Google Apps Script
 * si le déploiement est configuré avec "Qui a accès : Tout le monde"
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
