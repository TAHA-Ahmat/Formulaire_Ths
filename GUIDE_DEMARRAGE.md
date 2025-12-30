# Guide de Démarrage Rapide

## Démarrage immédiat en 5 étapes

### 1. Configuration Google Sheets (15 minutes)

#### a. Créer le Google Sheet
- Allez sur https://sheets.google.com
- Créez un nouveau tableur
- Nommez-le "Diagnostic Connexion Internet - Tchad"

#### b. Déployer le script
1. Dans Google Sheets : **Extensions > Apps Script**
2. Supprimez le code par défaut
3. Copiez tout le contenu de `docs/google-apps-script.js`
4. Collez dans l'éditeur
5. Enregistrez (nommez : "API Formulaire Connexion")

#### c. Publier comme Web App
1. Cliquez **Déployer > Nouveau déploiement**
2. Type : **Application Web**
3. Exécuter en tant que : **Moi**
4. Qui a accès : **Tout le monde**
5. **Déployer**
6. **COPIEZ L'URL** (format : `https://script.google.com/macros/s/XXXXX/exec`)

### 2. Configuration locale

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et remplacer l'URL
# VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID/exec
```

### 3. Lancer le projet

```bash
# Les dépendances sont déjà installées
npm run dev
```

Ouvrez http://localhost:3000

### 4. Tester le formulaire

1. Allez sur http://localhost:3000
2. Remplissez le formulaire
3. Vérifiez que les données apparaissent dans Google Sheets
4. Allez sur http://localhost:3000/public
5. Vérifiez que la réponse apparaît (sans le commentaire)

### 5. Déployer sur Vercel

#### Option A : Interface web
1. Allez sur https://vercel.com
2. Connectez votre GitHub
3. Importez ce repository
4. Ajoutez la variable d'environnement :
   - `VITE_GOOGLE_SCRIPT_URL` = votre URL Google Apps Script
5. Deploy

#### Option B : CLI
```bash
npm install -g vercel
vercel login
vercel
# Suivre les instructions
vercel env add VITE_GOOGLE_SCRIPT_URL
```

## Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

## Vérifications rapides

### Le formulaire ne fonctionne pas ?
- ✅ Vérifiez que `.env` contient l'URL Google Apps Script
- ✅ Vérifiez que le script est déployé avec "Tout le monde" en accès
- ✅ Ouvrez la Console du navigateur (F12) pour voir les erreurs

### Les données n'apparaissent pas dans Google Sheets ?
- ✅ Vérifiez les logs dans Apps Script (Exécutions)
- ✅ Vérifiez que la feuille s'appelle "Reponses"
- ✅ Testez l'URL du script directement dans le navigateur

### CORS errors ?
- ✅ Redéployez le Google Apps Script
- ✅ Vérifiez "Qui a accès : Tout le monde"

## Structure simplifiée

```
Formulaire_Connexion/
├─ src/
│  ├─ components/     # FormComponent, PublicListComponent
│  ├─ pages/          # FormPage, PublicPage
│  ├─ services/       # googleSheetsService
│  ├─ utils/          # browserDetect, validation
│  └─ App.vue         # Composant principal
├─ docs/
│  └─ google-apps-script.js  # Code à déployer sur Google
├─ .env               # Configuration (URL Google Apps Script)
└─ README.md          # Documentation complète
```

## Support

Consultez `README.md` pour la documentation complète.

---

Bonne chance avec votre diagnostic de connexion Internet au Tchad !
