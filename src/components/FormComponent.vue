<template>
  <div class="form-container">
    <div v-if="alreadyResponded" class="alert alert-warning">
      <h3>Vous avez déjà répondu</h3>
      <p>{{ formData.prenom }} {{ formData.nom }}, vous avez déjà soumis une réponse à ce formulaire.</p>
      <p>Une personne ne peut répondre qu'une seule fois (clé d'unicité : Nom + Prénom).</p>
      <router-link to="/public" class="btn btn-secondary">Voir les réponses</router-link>
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

      <!-- Section Commentaire -->
      <fieldset>
        <legend>Commentaire (Confidentiel)</legend>

        <div class="form-group">
          <label for="commentaire">Commentaire libre</label>
          <textarea
            id="commentaire"
            v-model="formData.commentaire"
            rows="4"
            placeholder="Décrivez les problèmes rencontrés, vos suggestions..."
          ></textarea>
          <small class="form-help confidential-notice">
            Ce commentaire est strictement confidentiel.
            Il est visible uniquement par les administrateurs dans Google Sheets.
            Il ne sera jamais affiché publiquement.
          </small>
        </div>
      </fieldset>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le diagnostic' }}
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
      submitted: false
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

      // Collecter données techniques
      const technicalData = getBrowserInfo()

      // Nettoyer et soumettre
      const cleanData = sanitizeFormData(this.formData)

      this.isSubmitting = true

      try {
        await submitResponse(cleanData, technicalData)
        this.submitted = true
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
</style>
