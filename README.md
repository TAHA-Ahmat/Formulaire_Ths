# Formulaire Diagnostic Connexion Internet - Tchad

Application Vue.js permettant de collecter et administrer les diagnostics de qualité de connexion Internet des collaborateurs au Tchad.

## Caractéristiques

- Application front-end uniquement (pas de backend)
- Stockage des réponses dans Google Sheets
- Une personne = une seule réponse (clé : Nom + Prénom)
- Visibilité publique : liste des répondants + compteur
- Commentaires visibles uniquement aux administrateurs
- Collecte automatique de données techniques (navigateur, OS, etc.)
- Déploiement sur Vercel

## Stack Technique

- **Framework** : Vue.js 3
- **Build Tool** : Vite
- **Router** : Vue Router
- **Stockage** : Google Sheets (via Google Apps Script)
- **Déploiement** : Vercel
- **Version Control** : Git / GitHub

## Structure du Projet

```
FORMULAIRE_CONNEXION/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ FormComponent.vue
│  │  └─ PublicListComponent.vue
│  ├─ pages/
│  │  ├─ FormPage.vue
│  │  └─ PublicPage.vue
│  ├─ services/
│  │  └─ googleSheetsService.js
│  ├─ utils/
│  │  ├─ browserDetect.js
│  │  └─ validation.js
│  ├─ styles/
│  │  └─ main.css
│  ├─ App.vue
│  └─ main.js
├─ docs/
│  └─ google-apps-script.js
├─ index.html
├─ package.json
├─ vite.config.js
├─ .env.example
└─ README.md
```

## Installation et Configuration

### 1. Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Google (pour Google Sheets)
- Compte GitHub
- Compte Vercel

### 2. Installation des dépendances

```bash
# Cloner le projet ou initialiser
npm install
```

### 3. Configuration Google Sheets

Cette étape est CRITIQUE pour le fonctionnement de l'application.

#### 3.1 Créer un Google Sheets

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez un nouveau tableur
3. Nommez-le "Diagnostic Connexion Internet - Tchad"
4. Notez l'ID du tableur (dans l'URL)

#### 3.2 Déployer le Google Apps Script

1. Dans votre Google Sheets, allez dans **Extensions > Apps Script**
2. Supprimez le code par défaut
3. Copiez le contenu du fichier `docs/google-apps-script.js`
4. Collez-le dans l'éditeur Apps Script
5. Enregistrez le projet (nommez-le "API Formulaire Connexion")

#### 3.3 Déployer en tant que Web App

1. Cliquez sur **Déployer > Nouveau déploiement**
2. Sélectionnez le type **Application Web**
3. Configuration :
   - **Description** : "API Formulaire Connexion v1"
   - **Exécuter en tant que** : Moi
   - **Qui a accès** : Tout le monde
4. Cliquez sur **Déployer**
5. Autorisez les permissions demandées
6. **IMPORTANT** : Copiez l'URL de déploiement (elle ressemble à `https://script.google.com/macros/s/XXXXX/exec`)

#### 3.4 Configurer les variables d'environnement

1. Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

2. Modifiez `.env` et remplacez l'URL :

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec
```

### 4. Développement local

```bash
# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### 5. Build pour la production

```bash
# Créer le build de production
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

### 6. Déploiement sur Vercel

#### Option 1 : Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez le repository
4. Configuration :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. **Variables d'environnement** :
   - Ajoutez `VITE_GOOGLE_SCRIPT_URL` avec votre URL Google Apps Script
6. Cliquez sur **Deploy**

#### Option 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter la variable d'environnement
vercel env add VITE_GOOGLE_SCRIPT_URL
```

## Règles Métier

### Identification & Unicité

- Une personne = **une seule réponse**
- Clé d'unicité : **Nom + Prénom**
- Si la personne a déjà répondu → formulaire bloqué

### Service

- Le service est **obligatoire**
- Sélection via liste déroulante fermée
- Plusieurs personnes d'un même service peuvent répondre

### Visibilité

**Tous les collaborateurs peuvent voir :**
- Liste des personnes ayant répondu (Nom, Prénom, Service, Date)
- Nombre total de réponses

**Les commentaires sont STRICTEMENT invisibles aux collaborateurs**

**Les administrateurs** :
- Consultent les données complètes dans Google Sheets uniquement
- Peuvent modifier/supprimer les réponses directement dans Google Sheets

### Données Collectées

**Données déclaratives (saisies par l'utilisateur) :**
- Nom
- Prénom
- Service (liste fermée)
- Poste / fonction
- Type de connexion
- Fournisseur Internet
- Qualité perçue
- Stabilité
- Impact sur le travail
- Commentaire libre (admin only)

**Données techniques automatiques (front-only) :**
- Navigateur
- Version du navigateur
- Système d'exploitation
- Type d'appareil (Desktop/Mobile/Tablette)
- Résolution écran
- Langue navigateur
- Fuseau horaire
- User-Agent complet
- Date & heure exactes (ISO)

## Architecture Technique

### Front-End (Vue.js)

**Pages :**
- `/` - Formulaire de diagnostic
- `/public` - Liste publique des réponses

**Composants :**
- `FormComponent` - Formulaire de saisie avec validation
- `PublicListComponent` - Liste des répondants (sans commentaires)

**Services :**
- `googleSheetsService` - Communication avec Google Apps Script

**Utilitaires :**
- `browserDetect` - Détection automatique des infos techniques
- `validation` - Validation des données du formulaire

### Backend (Google Apps Script)

**Actions supportées :**
- `GET ?action=check` - Vérifie si une personne a déjà répondu
- `GET ?action=list` - Récupère la liste publique (sans commentaires)
- `GET ?action=count` - Compte le nombre de réponses
- `POST action=submit` - Soumet une nouvelle réponse

**Sécurité :**
- Les commentaires ne sont JAMAIS exposés au front
- Validation des doublons côté serveur
- Pas de modification/suppression depuis le front

## CRUD Autorisé

| Action | Front-End | Administrateur |
|--------|-----------|----------------|
| CREATE | ✅ Via formulaire | ✅ Google Sheets |
| READ (public) | ✅ Liste + compteur | ✅ Google Sheets |
| READ (complet) | ❌ | ✅ Google Sheets |
| UPDATE | ❌ | ✅ Google Sheets |
| DELETE | ❌ | ✅ Google Sheets |

## Gestion Git & GitHub

### Initialiser le repository

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Formulaire Connexion Internet"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/VOTRE_USERNAME/formulaire-connexion.git
git branch -M main
git push -u origin main
```

### Workflow recommandé

```bash
# Avant de commencer à travailler
git pull

# Après modifications
git add .
git commit -m "Description des changements"
git push
```

## Dépannage

### Problème : "GOOGLE_SCRIPT_URL non configuré"

**Solution :**
- Vérifiez que le fichier `.env` existe et contient `VITE_GOOGLE_SCRIPT_URL`
- Sur Vercel, vérifiez que la variable d'environnement est bien configurée
- Redéployez après ajout de la variable

### Problème : "Erreur CORS"

**Solution :**
- Vérifiez que le Google Apps Script est déployé avec "Qui a accès : Tout le monde"
- Redéployez le script si nécessaire

### Problème : Les données ne s'affichent pas

**Solution :**
- Vérifiez que la feuille "Reponses" existe dans Google Sheets
- Vérifiez les logs dans Apps Script (Exécutions)
- Testez l'URL du script dans le navigateur

### Problème : Le formulaire ne bloque pas les doublons

**Solution :**
- Vérifiez la fonction `checkIfExists` dans Google Apps Script
- Assurez-vous que Nom et Prénom sont bien renseignés
- Vérifiez les logs du navigateur (Console)

## Maintenance

### Mettre à jour le Google Apps Script

1. Modifiez le code dans Apps Script
2. Enregistrez
3. **Déployer > Gérer les déploiements**
4. Cliquez sur l'icône ✏️ du déploiement actif
5. **Nouvelle version**
6. **Déployer**

### Exporter les données

Les données sont dans Google Sheets :
- **Fichier > Télécharger > .xlsx** ou **.csv**

### Sauvegarder le projet

```bash
# Sauvegarder régulièrement sur GitHub
git add .
git commit -m "Sauvegarde des données"
git push
```

## Sécurité

- Pas de géolocalisation GPS précise
- Pas de tracking caché
- Pas de données personnelles sensibles
- Les commentaires ne sont jamais exposés publiquement
- Validation côté client ET côté serveur

## Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs dans la Console du navigateur
3. Consultez les logs dans Google Apps Script (Exécutions)

## Licence

Projet interne - Tous droits réservés

---

**Dernière mise à jour** : 2025
**Version** : 1.0.0
**Localisation** : Tchad
