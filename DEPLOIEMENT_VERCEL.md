# Guide de Déploiement Vercel - Solution CORS

## Architecture Finale (Sans CORS)

```
Frontend Vue.js (Vercel)
     ↓
/api/sheets (Vercel Serverless Function)
     ↓
Google Apps Script
     ↓
Google Sheets
```

**Avantage :** Pas de CORS car frontend et API sont sur le même domaine Vercel.

---

## Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

## Étape 2 : Se Connecter à Vercel

```bash
vercel login
```

## Étape 3 : Déployer le Projet

```bash
vercel
```

Répondez aux questions :
- **Set up and deploy ?** → Yes
- **Which scope ?** → Votre compte
- **Link to existing project ?** → No
- **Project name ?** → formulaire-connexion-ths (ou autre)
- **In which directory ?** → ./ (valider)
- **Override settings ?** → No

## Étape 4 : Configurer la Variable d'Environnement

### Via CLI :

```bash
vercel env add GOOGLE_SCRIPT_URL
```

Quand demandé, collez l'URL Google Apps Script :
```
https://script.google.com/macros/s/AKfycbwYjY1-ft0t3USlnrkH8-CRbT_YHI8_bWtYXitRo6gOstjQxrLlLeXq-Kt43sSbtzXe/exec
```

Scope : **Production** (sélectionnez avec espace, validez avec Entrée)

### OU via Interface Web :

1. Allez sur https://vercel.com
2. Ouvrez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez :
   - **Name :** `GOOGLE_SCRIPT_URL`
   - **Value :** `https://script.google.com/macros/s/AKfycbwYjY1-ft0t3USlnrkH8-CRbT_YHI8_bWtYXitRo6gOstjQxrLlLeXq-Kt43sSbtzXe/exec`
   - **Scope :** Production

## Étape 5 : Redéployer avec la Variable

```bash
vercel --prod
```

## Étape 6 : Tester

1. Vercel affichera l'URL de production (ex: `https://formulaire-connexion-ths.vercel.app`)
2. Ouvrez cette URL
3. Remplissez le formulaire
4. ✅ **Devrait fonctionner sans erreur CORS**

---

## Test en Local (Optionnel)

Pour tester en local avec l'environnement Vercel :

```bash
vercel dev
```

Cela démarre un serveur local qui simule exactement Vercel, y compris `/api/sheets`.

---

## Vérifications

### Si erreur persiste :

1. **Vérifiez que la variable est bien configurée :**
   ```bash
   vercel env ls
   ```

2. **Vérifiez que le fichier `api/sheets.js` est bien déployé :**
   - Allez sur `https://VOTRE-URL.vercel.app/api/sheets?action=count`
   - Devrait retourner `{"count":0}`

3. **Vérifiez les logs Vercel :**
   - Sur vercel.com → Votre projet → **Logs**

---

## Architecture Actuelle

### Fichiers Créés

1. **`api/sheets.js`** - Serverless function Vercel (proxy vers Google)
2. **`src/services/googleSheetsService.js`** - Appelle `/api/sheets` au lieu de Google direct
3. **`vercel.json`** - Configuration Vercel

### Flux de Données

1. **Frontend** : `fetch('/api/sheets?action=submit&data=...')`
2. **Vercel Function** : Reçoit la requête, appelle Google Apps Script
3. **Google Apps Script** : Traite les données, répond au serveur Vercel
4. **Vercel Function** : Retourne la réponse au frontend
5. **Frontend** : Affiche le résultat

**Pas de CORS** car tout passe par Vercel (même domaine).

---

## Support

Si erreur, vérifiez :
- ✅ Variable `GOOGLE_SCRIPT_URL` bien configurée
- ✅ Google Apps Script déployé et accessible
- ✅ Fichier `api/sheets.js` présent et correct

Testez l'API directement :
```
https://VOTRE-URL.vercel.app/api/sheets?action=count
```

Résultat attendu :
```json
{"count":0}
```
