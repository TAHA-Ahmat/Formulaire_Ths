# Exemples de Données pour Tests

## Données de test pour le formulaire

### Exemple 1 - Connexion excellente

```
Nom: Oumar
Prénom: Amadou
Service: IT / Informatique
Poste: Administrateur Réseau
Type de connexion: Fibre optique
Fournisseur: Airtel
Qualité perçue: Excellente
Stabilité: Très stable
Impact: Aucun impact
Commentaire: Connexion parfaite depuis le nouveau routeur
```

### Exemple 2 - Connexion moyenne

```
Nom: Fatima
Prénom: Hassan
Service: Administration
Poste: Assistante administrative
Type de connexion: 4G
Fournisseur: Tigo
Qualité perçue: Moyenne
Stabilité: Instable
Impact: Impact modéré
Commentaire: Coupures fréquentes en fin de journée, difficile pour les visioconférences
```

### Exemple 3 - Connexion problématique

```
Nom: Mahamat
Prénom: Ibrahim
Service: Commercial
Poste: Chef des ventes
Type de connexion: ADSL
Fournisseur: Salam
Qualité perçue: Médiocre
Stabilité: Très instable
Impact: Impact important
Commentaire: Connexion très lente, impossible de télécharger les documents clients. Affecte la productivité quotidiennement.
```

### Exemple 4 - Connexion satellite

```
Nom: Mariam
Prénom: Abdallah
Service: Direction
Poste: Directrice adjointe
Type de connexion: Satellite
Fournisseur: StarLink
Qualité perçue: Bonne
Stabilité: Stable
Impact: Impact faible
Commentaire: Bonne solution de secours, mais coûteuse
```

### Exemple 5 - Connexion 5G

```
Nom: Abakar
Prénom: Moussa
Service: Technique
Poste: Ingénieur
Type de connexion: 5G
Fournisseur: Airtel
Qualité perçue: Excellente
Stabilité: Très stable
Impact: Aucun impact
Commentaire: Nouvelle technologie très performante dans notre zone
```

## Liste des services disponibles

- Direction
- Administration
- Finances
- Ressources Humaines
- IT / Informatique
- Communication
- Opérations
- Logistique
- Commercial
- Technique
- Autre

## Types de connexion

- Fibre optique
- ADSL
- 4G
- 5G
- Satellite
- Autre

## Fournisseurs au Tchad (exemples)

- Airtel
- Tigo
- Salam
- Moov
- StarLink (satellite)

## Scénarios de test

### Test 1 : Soumission normale
1. Remplir le formulaire avec l'exemple 1
2. Vérifier que les données apparaissent dans Google Sheets
3. Vérifier que le nom apparaît dans la liste publique

### Test 2 : Détection doublon
1. Essayer de soumettre à nouveau avec les mêmes Nom + Prénom
2. Vérifier que le formulaire bloque la soumission
3. Vérifier le message d'erreur

### Test 3 : Visibilité des commentaires
1. Soumettre un formulaire avec un commentaire
2. Aller sur la page publique
3. Vérifier que le commentaire n'apparaît PAS
4. Vérifier dans Google Sheets que le commentaire est bien là

### Test 4 : Validation des champs
1. Essayer de soumettre sans remplir les champs obligatoires
2. Vérifier les messages d'erreur
3. Vérifier que la soumission est bloquée

### Test 5 : Données techniques
1. Soumettre un formulaire
2. Aller dans Google Sheets
3. Vérifier les colonnes techniques (navigateur, OS, etc.)
4. Vérifier que les données sont correctes

## Résultat attendu dans Google Sheets

### Structure des colonnes

| Nom | Prénom | Service | Poste | Type Connexion | Fournisseur | Qualité Perçue | Stabilité | Impact | Commentaire | Navigateur | Version | OS | Type Appareil | Résolution | Langue | Fuseau Horaire | User Agent | Date/Heure |
|-----|--------|---------|-------|----------------|-------------|----------------|-----------|--------|-------------|------------|---------|----|--------------|-----------| ------|----------------|------------|------------|
| Oumar | Amadou | IT / Informatique | Admin Réseau | Fibre optique | Airtel | Excellente | Très stable | Aucun impact | Connexion parfaite... | Chrome | 120.0 | Windows | Desktop | 1920x1080 | fr-FR | Africa/Ndjamena | Mozilla/5.0... | 2025-12-30T... |

## Notes importantes

- Le commentaire est dans la colonne 10 (visible uniquement dans Sheets)
- Les données techniques sont dans les colonnes 11-18
- La date/heure est en format ISO 8601
- Le fuseau horaire devrait être "Africa/Ndjamena" pour le Tchad
