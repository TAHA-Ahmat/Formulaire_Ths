<template>
  <div class="form-container">
    <div v-if="alreadyResponded" class="alert alert-warning">
      <h3>Vous avez déjà répondu</h3>
      <p>{{ formData.prenom }} {{ formData.nom }}, vous avez déjà soumis une réponse à ce formulaire.</p>
      <p>Une personne ne peut répondre qu'une seule fois (clé d'unicité : Nom + Prénom).</p>
      <router-link to="/public" class="btn btn-secondary">Voir les réponses</router-link>
    </div>

    <div v-else-if="showCommentStep" class="comment-step">
      <div class="comment-step-header">
        <div class="success-icon">✓</div>
        <h3>Merci !</h3>
        <p class="comment-step-subtitle">Dernière étape : décrivez la connexion actuelle (optionnel)</p>
      </div>

      <div class="comment-examples">
        <p class="examples-label">Exemples de commentaires :</p>
        <div class="examples-buttons">
          <button type="button" @click="useExample('La connexion est très lente, surtout le matin')" class="btn-example">
            La connexion est très lente, surtout le matin
          </button>
          <button type="button" @click="useExample('Coupures fréquentes plusieurs fois par jour')" class="btn-example">
            Coupures fréquentes plusieurs fois par jour
          </button>
          <button type="button" @click="useExample('Impossible de télécharger ou envoyer des fichiers lourds')" class="btn-example">
            Impossible de télécharger/envoyer des fichiers lourds
          </button>
          <button type="button" @click="useExample('La connexion est stable et satisfaisante')" class="btn-example">
            La connexion est stable et satisfaisante
          </button>
          <button type="button" @click="useExample('Aucun problème particulier à signaler')" class="btn-example">
            Aucun problème particulier à signaler
          </button>
        </div>
      </div>

      <div class="comment-textarea-container">
        <label for="commentaire-final">Votre commentaire (optionnel)</label>
        <textarea
          id="commentaire-final"
          v-model="formData.commentaire"
          rows="5"
          placeholder="Décrivez votre expérience avec la connexion Internet..."
          class="comment-textarea"
        ></textarea>
        <small class="form-help confidential-notice">
          Ce commentaire est strictement confidentiel.
          Il est visible uniquement par les administrateurs dans Google Sheets.
        </small>
      </div>

      <div class="comment-actions">
        <button type="button" @click="finalSubmit" :disabled="isSubmitting" class="btn btn-primary btn-large">
          <span v-if="!isSubmitting">Envoyer et terminer</span>
          <span v-else class="loading-content">
            <span class="spinner"></span>
            <span>Envoi en cours...</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Overlay de chargement -->
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-box">
        <div class="spinner-large"></div>
        <p class="loading-text">Enregistrement en cours...</p>
        <p class="loading-subtext">Veuillez patienter</p>
      </div>
    </div>

    <div v-else-if="submitted" class="alert alert-success">
      <h3>Merci pour votre réponse !</h3>
      <p>Votre diagnostic a été enregistré avec succès.</p>
      <router-link to="/public" class="btn btn-primary">Voir toutes les réponses</router-link>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="diagnostic-form">
      <h2>Diagnostic de connexion Internet THS</h2>
      <p class="form-description">
        Ce formulaire permet d'évaluer la qualité réelle de la connexion Internet au sein de THS.
        Vos réponses sont strictement confidentielles.
      </p>

      <!-- Erreurs -->
      <div v-if="errors.length > 0" class="alert alert-error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <!-- Section Identification -->
      <fieldset>
        <legend>Identification</legend>

        <div class="form-group">
          <label for="nom">Nom <span class="required">*</span></label>
          <input
            type="text"
            id="nom"
            v-model="formData.nom"
            @blur="checkDuplicate"
            required
            placeholder="Votre nom de famille"
          />
        </div>

        <div class="form-group">
          <label for="prenom">Prénom <span class="required">*</span></label>
          <input
            type="text"
            id="prenom"
            v-model="formData.prenom"
            @blur="checkDuplicate"
            required
            placeholder="Votre prénom"
          />
        </div>

        <div class="form-group">
          <label for="service">Service <span class="required">*</span></label>
          <select id="service" v-model="formData.service" required>
            <option value="">-- Sélectionnez votre service --</option>
            <option value="Service Opération">Service Opération</option>
            <option value="Service Technique">Service Technique</option>
            <option value="Service Fret">Service Fret</option>
            <option value="Service Administratif et Personnel">Service Administratif et Personnel</option>
            <option value="Service Passage">Service Passage</option>
            <option value="Service Financier">Service Financier</option>
            <option value="Service Qualité">Service Qualité</option>
            <option value="Service SMS">Service SMS</option>
            <option value="Direction Générale">Direction Générale</option>
            <option value="Service HSE">Service HSE</option>
            <option value="Service Telecom">Service Telecom</option>
            <option value="CFORMA">CFORMA</option>
            <option value="Service Matériel">Service Matériel</option>
            <option value="Service PRM">Service PRM</option>
          </select>
        </div>

        <div class="form-group">
          <label for="poste">Poste / Fonction</label>
          <input
            type="text"
            id="poste"
            v-model="formData.poste"
            placeholder="Votre fonction (optionnel)"
          />
        </div>
      </fieldset>

      <!-- Section Évaluation -->
      <fieldset>
        <legend>Évaluation de l'expérience</legend>

        <div class="form-group">
          <label for="qualitePercue">Qualité perçue <span class="required">*</span></label>
          <select id="qualitePercue" v-model="formData.qualitePercue" required>
            <option value="">-- Sélectionnez --</option>
            <option value="Très mauvaise">Très mauvaise</option>
            <option value="Médiocre">Médiocre</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Bonne">Bonne</option>
            <option value="Excellente">Excellente</option>
          </select>
        </div>

        <div class="form-group">
          <label for="stabilite">Stabilité <span class="required">*</span></label>
          <select id="stabilite" v-model="formData.stabilite" required>
            <option value="">-- Sélectionnez --</option>
            <option value="Très instable">Très instable</option>
            <option value="Instable">Instable</option>
            <option value="Stable">Stable</option>
            <option value="Très stable">Très stable</option>
          </select>
        </div>

        <div class="form-group">
          <label for="impact">Impact sur le travail <span class="required">*</span></label>
          <select id="impact" v-model="formData.impact" required>
            <option value="">-- Sélectionnez --</option>
            <option value="Aucun impact">Aucun impact</option>
            <option value="Impact faible">Impact faible</option>
            <option value="Impact modéré">Impact modéré</option>
            <option value="Impact important">Impact important</option>
            <option value="Bloquant">Bloquant</option>
          </select>
        </div>
      </fieldset>

      <!-- Section Situation en cas de problème -->
      <fieldset>
        <legend>Situation en cas de problème</legend>

        <div class="form-group">
          <label for="solutionProbleme">
            En cas de problème de connexion Internet au sein de l'entreprise, utilisez-vous :
            <span class="required">*</span>
          </label>
          <select id="solutionProbleme" v-model="formData.solutionProbleme" required>
            <option value="">-- Sélectionnez --</option>
            <option value="Connexion de l'entreprise (fonctionnelle)">Connexion de l'entreprise (fonctionnelle)</option>
            <option value="Partage de connexion (téléphone)">Partage de connexion (téléphone)</option>
            <option value="Modem / routeur externe">Modem / routeur externe</option>
            <option value="Aucune solution (travail bloqué)">Aucune solution (travail bloqué)</option>
          </select>
        </div>
      </fieldset>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          {{ isSubmitting ? 'Vérification...' : 'Suivant' }}
        </button>
      </div>

      <p class="form-footer">
        <small>
          <span class="required">*</span> Champs obligatoires |
          Une personne = une seule réponse (Nom + Prénom)
        </small>
      </p>
    </form>
  </div>
</template>

<script>
import { getBrowserInfo } from '@/utils/browserDetect'
import { validateFormData, sanitizeFormData } from '@/utils/validation'
import { checkIfAlreadyResponded, submitResponse } from '@/services/googleSheetsService'

export default {
  name: 'FormComponent',
  data() {
    return {
      formData: {
        nom: '',
        prenom: '',
        service: '',
        poste: '',
        solutionProbleme: '',
        qualitePercue: '',
        stabilite: '',
        impact: '',
        commentaire: ''
      },
      errors: [],
      isSubmitting: false,
      alreadyResponded: false,
      submitted: false,
      showCommentStep: false
    }
  },
  methods: {
    async checkDuplicate() {
      if (this.formData.nom && this.formData.prenom) {
        try {
          const exists = await checkIfAlreadyResponded(this.formData.nom, this.formData.prenom)
          this.alreadyResponded = exists
        } catch (error) {
          console.error('Erreur vérification doublon:', error)
        }
      }
    },
    async handleSubmit() {
      this.errors = []

      // Validation
      const validation = validateFormData(this.formData)
      if (!validation.isValid) {
        this.errors = validation.errors
        return
      }

      // Vérifier doublon
      try {
        const exists = await checkIfAlreadyResponded(this.formData.nom, this.formData.prenom)
        if (exists) {
          this.alreadyResponded = true
          return
        }
      } catch (error) {
        this.errors.push('Erreur lors de la vérification des doublons')
        return
      }

      // Afficher la page 2 pour le commentaire
      this.showCommentStep = true

      // Scroll vers le haut pour voir la page 2
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    useExample(text) {
      // Pré-remplit le commentaire avec l'exemple cliqué
      this.formData.commentaire = text
    },

    async finalSubmit() {
      this.errors = []

      // Collecter données techniques
      const technicalData = getBrowserInfo()

      // Nettoyer et soumettre
      const cleanData = sanitizeFormData(this.formData)

      this.isSubmitting = true

      try {
        await submitResponse(cleanData, technicalData)
        this.showCommentStep = false
        this.submitted = true

        // Scroll vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        this.errors.push(error.message || 'Erreur lors de l\'envoi des données')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.diagnostic-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diagnostic-form h2 {
  margin-top: 0;
  color: #2d3748;
}

.form-description {
  color: #718096;
  margin-bottom: 2rem;
}

fieldset {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

legend {
  font-weight: 600;
  color: #2d3748;
  padding: 0 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.required {
  color: #e53e3e;
}

.form-help {
  display: block;
  margin-top: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
}

.confidential-notice {
  background: #f7fafc;
  padding: 0.75rem;
  border-left: 3px solid #667eea;
  border-radius: 4px;
  font-style: italic;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  color: #718096;
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.alert-error {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.alert-error ul {
  margin: 0;
  padding-left: 1.5rem;
}

.alert-warning {
  background: #fffaf0;
  border: 1px solid #fbd38d;
  color: #744210;
}

.alert-warning h3 {
  margin-top: 0;
}

.alert-success {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  color: #22543d;
}

.alert-success h3 {
  margin-top: 0;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* Page 2 - Étape commentaire */
.comment-step {
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.comment-step-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.success-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.comment-step-header h3 {
  margin: 0.5rem 0;
  color: #2d3748;
  font-size: 1.8rem;
}

.comment-step-subtitle {
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0;
}

.comment-examples {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.examples-label {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.examples-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-example {
  padding: 0.875rem 1.25rem;
  background: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2d3748;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.btn-example:hover {
  background: #edf2f7;
  border-color: #667eea;
  transform: translateX(4px);
}

.comment-textarea-container {
  margin: 2rem 0;
}

.comment-textarea-container label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.comment-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comment-actions {
  text-align: center;
  margin-top: 2rem;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

/* Loader et spinner */
.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-box {
  background: white;
  padding: 3rem 4rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.loading-subtext {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
}
</style>
