<template>
  <div class="form-container">
    <!-- Barre de progression fixe -->
    <div v-if="!alreadyResponded && !submitted && !isChecking && !isSubmitting && !showCommentStep" class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="progress-text">{{ completedCards }}/{{ totalCards }} étapes complétées</p>
    </div>

    <div v-if="alreadyResponded" class="alert alert-warning">
      <h3>Vous avez déjà répondu</h3>
      <p>{{ formData.prenom }} {{ formData.nom }}, vous avez déjà soumis une réponse à ce formulaire.</p>
      <p>Une personne ne peut répondre qu'une seule fois (clé d'unicité : Nom + Prénom).</p>
      <router-link to="/public" class="btn btn-secondary">Voir les réponses</router-link>
    </div>

    <div v-else-if="isChecking" class="loading-screen">
      <div class="loading-box">
        <div class="spinner-large"></div>
        <p class="loading-text">Vérification en cours...</p>
        <p class="loading-subtext">Veuillez patienter</p>
      </div>
    </div>

    <div v-else-if="showCommentStep && !isSubmitting" class="comment-step">
      <div class="comment-step-header">
        <h3>Dernière étape</h3>
        <p class="comment-step-subtitle">Partagez votre expérience de l'année 2025 concernant la connexion Internet (optionnel)</p>
      </div>

      <div class="comment-textarea-container">
        <label for="commentaire-final">Votre commentaire (optionnel)</label>
        <textarea
          id="commentaire-final"
          v-model="formData.commentaire"
          rows="5"
          placeholder="Décrivez votre expérience avec la connexion Internet durant l'année 2025..."
          class="comment-textarea"
        ></textarea>
        <small class="form-help confidential-notice">
          Ce commentaire est strictement confidentiel.
          Il est visible uniquement par la direction et la comptabilité.
        </small>
      </div>

      <div class="comment-actions">
        <button type="button" @click="finalSubmit" class="btn btn-primary btn-large">
          Envoyer et terminer
        </button>
      </div>

      <div class="comment-examples">
        <p class="examples-label">Exemples de commentaires sur votre expérience 2025 :</p>
        <div class="examples-buttons">
          <button type="button" @click="useExample('En 2025, la connexion était très lente, surtout le matin')" class="btn-example">
            En 2025, la connexion était très lente, surtout le matin
          </button>
          <button type="button" @click="useExample('Coupures fréquentes plusieurs fois par jour durant toute l\'année')" class="btn-example">
            Coupures fréquentes plusieurs fois par jour durant toute l'année
          </button>
          <button type="button" @click="useExample('Impossible de télécharger ou envoyer des fichiers lourds en 2025')" class="btn-example">
            Impossible de télécharger/envoyer des fichiers lourds en 2025
          </button>
          <button type="button" @click="useExample('La connexion a été stable et satisfaisante tout au long de 2025')" class="btn-example">
            La connexion a été stable et satisfaisante tout au long de 2025
          </button>
          <button type="button" @click="useExample('Aucun problème particulier à signaler pour l\'année 2025')" class="btn-example">
            Aucun problème particulier à signaler pour l'année 2025
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="isSubmitting" class="loading-screen">
      <div class="loading-box">
        <div class="spinner-large"></div>
        <p class="loading-text">Enregistrement en cours...</p>
        <p class="loading-subtext">Veuillez patienter</p>
      </div>
    </div>

    <div v-else-if="submitted" class="alert alert-success">
      <h3>Merci pour votre participation !</h3>
      <p>Votre bilan 2025 a été enregistré avec succès.</p>
      <p><strong>Vos retours nous permettront d'améliorer l'accessibilité de nos outils de travail en 2026. Bonne année !</strong></p>
      <router-link to="/public" class="btn btn-primary">Voir toutes les réponses</router-link>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="diagnostic-form">
      <div class="form-header">
        <h2>Bilan Connexion Internet 2025 - THS</h2>
        <p class="form-description">
          <strong>Bonne année 2026 !</strong><br>
          Afin d'améliorer l'accessibilité de nos outils de travail en 2026, nous souhaitons recueillir votre retour factuel sur l'année 2025.
          Vos réponses sont strictement confidentielles et nous permettront d'identifier les axes d'amélioration prioritaires.
        </p>
      </div>

      <!-- Erreurs -->
      <div v-if="errors.length > 0" class="alert alert-error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <!-- CARTE 1 : Identification -->
      <div class="form-card" :class="{ 'card-completed': isCardCompleted('identification') }" ref="card1">
        <div class="card-header">
          <div class="card-icon">👤</div>
          <div class="card-title-group">
            <h3 class="card-title">Identification</h3>
            <p class="card-subtitle">Qui êtes-vous ?</p>
          </div>
          <div class="card-status" v-if="isCardCompleted('identification')">
            <span class="checkmark">✓</span>
          </div>
        </div>

        <div class="card-content">
          <div class="form-group">
            <label for="nom">Nom <span class="required">*</span></label>
            <input
              type="text"
              id="nom"
              v-model="formData.nom"
              @blur="checkDuplicate"
              @input="updateProgress"
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
              @input="updateProgress"
              required
              placeholder="Votre prénom"
            />
          </div>

          <div class="form-group">
            <label for="service">Service <span class="required">*</span></label>
            <select id="service" v-model="formData.service" @change="updateProgress" required>
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
        </div>
      </div>

      <!-- CARTE 2 : Fréquence des incidents -->
      <div class="form-card" :class="{ 'card-completed': isCardCompleted('frequence') }" ref="card2">
        <div class="card-header">
          <div class="card-icon">📊</div>
          <div class="card-title-group">
            <h3 class="card-title">Fréquence des incidents</h3>
            <p class="card-subtitle">À quelle fréquence avez-vous rencontré des problèmes ?</p>
          </div>
          <div class="card-status" v-if="isCardCompleted('frequence')">
            <span class="checkmark">✓</span>
          </div>
        </div>

        <div class="card-content">
          <div class="form-group">
            <label for="frequenceProblemes">
              En 2025, à quelle fréquence en moyenne la connexion a-t-elle eu des problèmes (lenteur, coupure) ?
              <span class="required">*</span>
            </label>
            <select id="frequenceProblemes" v-model="formData.frequenceProblemes" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Jamais ou presque jamais">Jamais ou presque jamais</option>
              <option value="1 à 2 fois par semaine">1 à 2 fois par semaine</option>
              <option value="3 à 5 fois par semaine">3 à 5 fois par semaine</option>
              <option value="Tous les jours">Tous les jours</option>
              <option value="Plusieurs fois par jour">Plusieurs fois par jour</option>
            </select>
          </div>

          <div class="form-group">
            <label for="dureePanne">
              Quelle était la durée moyenne d'une panne ou d'un ralentissement ?
              <span class="required">*</span>
            </label>
            <select id="dureePanne" v-model="formData.dureePanne" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Moins de 5 minutes">Moins de 5 minutes</option>
              <option value="5 à 15 minutes">5 à 15 minutes</option>
              <option value="15 à 30 minutes">15 à 30 minutes</option>
              <option value="30 minutes à 1 heure">30 minutes à 1 heure</option>
              <option value="Plus d'1 heure">Plus d'1 heure</option>
            </select>
          </div>

          <div class="form-group">
            <label for="momentJournee">
              À quel moment de la journée les problèmes étaient-ils les plus fréquents ?
              <span class="required">*</span>
            </label>
            <select id="momentJournee" v-model="formData.momentJournee" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Matin (8h-12h)">Matin (8h-12h)</option>
              <option value="Midi (12h-14h)">Midi (12h-14h)</option>
              <option value="Après-midi (14h-18h)">Après-midi (14h-18h)</option>
              <option value="Toute la journée">Toute la journée</option>
              <option value="Aucune tendance particulière">Aucune tendance particulière</option>
            </select>
          </div>
        </div>
      </div>

      <!-- CARTE 3 : Impact opérationnel -->
      <div class="form-card" :class="{ 'card-completed': isCardCompleted('impact') }" ref="card3">
        <div class="card-header">
          <div class="card-icon">💼</div>
          <div class="card-title-group">
            <h3 class="card-title">Impact opérationnel</h3>
            <p class="card-subtitle">Quel impact concret sur votre travail ?</p>
          </div>
          <div class="card-status" v-if="isCardCompleted('impact')">
            <span class="checkmark">✓</span>
          </div>
        </div>

        <div class="card-content">
          <div class="form-group">
            <label for="tachesImpossibles">
              Quelles tâches étaient impossibles ou très difficiles à cause de la connexion ?
              <span class="required">*</span>
            </label>
            <select id="tachesImpossibles" v-model="formData.tachesImpossibles" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Envoi/réception d'emails">Envoi/réception d'emails</option>
              <option value="Accès aux logiciels métier en ligne">Accès aux logiciels métier en ligne</option>
              <option value="Téléchargement/envoi de fichiers">Téléchargement/envoi de fichiers</option>
              <option value="Visioconférence">Visioconférence</option>
              <option value="Navigation web professionnelle">Navigation web professionnelle</option>
              <option value="Plusieurs de ces tâches">Plusieurs de ces tâches</option>
              <option value="Toutes ces tâches">Toutes ces tâches</option>
              <option value="Aucune difficulté particulière">Aucune difficulté particulière</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tempsPerdu">
              En moyenne, combien de temps de travail perdiez-vous par incident ?
              <span class="required">*</span>
            </label>
            <select id="tempsPerdu" v-model="formData.tempsPerdu" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Moins de 5 minutes">Moins de 5 minutes</option>
              <option value="5 à 15 minutes">5 à 15 minutes</option>
              <option value="15 à 30 minutes">15 à 30 minutes</option>
              <option value="30 minutes à 1 heure">30 minutes à 1 heure</option>
              <option value="Plus d'1 heure">Plus d'1 heure</option>
            </select>
          </div>

          <div class="form-group">
            <label for="impactEcheances">
              Les problèmes de connexion vous ont-ils fait manquer des échéances (deadlines) ?
              <span class="required">*</span>
            </label>
            <select id="impactEcheances" v-model="formData.impactEcheances" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Jamais">Jamais</option>
              <option value="Rarement (1-2 fois dans l'année)">Rarement (1-2 fois dans l'année)</option>
              <option value="Parfois (3-5 fois dans l'année)">Parfois (3-5 fois dans l'année)</option>
              <option value="Souvent (plus de 5 fois dans l'année)">Souvent (plus de 5 fois dans l'année)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- CARTE 4 : Réaction en cas de panne -->
      <div class="form-card" :class="{ 'card-completed': isCardCompleted('reaction') }" ref="card4">
        <div class="card-header">
          <div class="card-icon">🔧</div>
          <div class="card-title-group">
            <h3 class="card-title">Votre réaction en cas de panne</h3>
            <p class="card-subtitle">Comment réagissiez-vous face aux problèmes ?</p>
          </div>
          <div class="card-status" v-if="isCardCompleted('reaction')">
            <span class="checkmark">✓</span>
          </div>
        </div>

        <div class="card-content">
          <div class="form-group">
            <label for="solutionProbleme">
              En 2025, lorsque la connexion THS ne fonctionnait pas, que faisiez-vous généralement ?
              <span class="required">*</span>
            </label>
            <select id="solutionProbleme" v-model="formData.solutionProbleme" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="J'attendais que la connexion THS se rétablisse">J'attendais que la connexion THS se rétablisse</option>
              <option value="J'utilisais mon partage de connexion (téléphone)">J'utilisais mon partage de connexion (téléphone)</option>
              <option value="J'utilisais un modem/routeur externe personnel">J'utilisais un modem/routeur externe personnel</option>
              <option value="Je ne pouvais plus travailler (travail bloqué)">Je ne pouvais plus travailler (travail bloqué)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="delaiSolution">
              Combien de temps attendiez-vous en moyenne avant de trouver une solution alternative ?
              <span class="required">*</span>
            </label>
            <select id="delaiSolution" v-model="formData.delaiSolution" @change="updateProgress" required>
              <option value="">-- Sélectionnez --</option>
              <option value="Je ne cherchais pas d'alternative">Je ne cherchais pas d'alternative</option>
              <option value="Moins de 5 minutes">Moins de 5 minutes</option>
              <option value="5 à 15 minutes">5 à 15 minutes</option>
              <option value="15 à 30 minutes">15 à 30 minutes</option>
              <option value="Plus de 30 minutes">Plus de 30 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isChecking || !allCardsCompleted" class="btn btn-primary btn-submit">
          {{ isChecking ? 'Vérification...' : 'Suivant' }}
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
        frequenceProblemes: '',
        dureePanne: '',
        momentJournee: '',
        tachesImpossibles: '',
        tempsPerdu: '',
        impactEcheances: '',
        solutionProbleme: '',
        delaiSolution: '',
        commentaire: ''
      },
      errors: [],
      isSubmitting: false,
      isChecking: false,
      alreadyResponded: false,
      submitted: false,
      showCommentStep: false,
      totalCards: 4
    }
  },
  computed: {
    completedCards() {
      let count = 0
      if (this.isCardCompleted('identification')) count++
      if (this.isCardCompleted('frequence')) count++
      if (this.isCardCompleted('impact')) count++
      if (this.isCardCompleted('reaction')) count++
      return count
    },
    progressPercentage() {
      return (this.completedCards / this.totalCards) * 100
    },
    allCardsCompleted() {
      return this.completedCards === this.totalCards
    }
  },
  methods: {
    isCardCompleted(cardName) {
      switch(cardName) {
        case 'identification':
          return this.formData.nom && this.formData.prenom && this.formData.service
        case 'frequence':
          return this.formData.frequenceProblemes && this.formData.dureePanne && this.formData.momentJournee
        case 'impact':
          return this.formData.tachesImpossibles && this.formData.tempsPerdu && this.formData.impactEcheances
        case 'reaction':
          return this.formData.solutionProbleme && this.formData.delaiSolution
        default:
          return false
      }
    },
    updateProgress() {
      // Trigger reactivity update
      this.$forceUpdate()

      // Auto-scroll to next incomplete card
      this.$nextTick(() => {
        this.scrollToNextIncompleteCard()
      })
    },
    scrollToNextIncompleteCard() {
      const cards = ['identification', 'frequence', 'impact', 'reaction']
      for (let i = 0; i < cards.length; i++) {
        if (!this.isCardCompleted(cards[i])) {
          const cardRef = this.$refs[`card${i + 1}`]
          if (cardRef && cardRef !== document.activeElement) {
            setTimeout(() => {
              cardRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
          }
          break
        }
      }
    },
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Afficher l'écran de chargement
      this.isChecking = true

      try {
        // Démarrer un timer de 1.5 secondes minimum
        const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

        // Vérifier doublon
        const checkPromise = checkIfAlreadyResponded(this.formData.nom, this.formData.prenom)

        // Attendre les deux
        const [exists] = await Promise.all([checkPromise, minDelay])

        if (exists) {
          this.alreadyResponded = true
          this.isChecking = false
          return
        }

        // Afficher la page 2 pour le commentaire
        this.showCommentStep = true
        this.isChecking = false

        // Scroll vers le haut pour voir la page 2
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) {
        this.errors.push('Erreur lors de la vérification des doublons')
        this.isChecking = false
      }
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
        // Démarrer un timer de 2 secondes minimum
        const minDelay = new Promise(resolve => setTimeout(resolve, 2000))

        // Envoyer les données
        const submitPromise = submitResponse(cleanData, technicalData)

        // Attendre que les 2 soient terminés (minimum 2 secondes)
        await Promise.all([submitPromise, minDelay])

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
/* Variables CSS */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --card-spacing: 2rem;
}

.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

/* Barre de progression */
.progress-bar-container {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
  margin: 0;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.diagnostic-form {
  background: transparent;
  padding: 0;
}

.diagnostic-form h2 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 2rem;
}

.form-description {
  color: #718096;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 2rem;
}

/* Form Card Styles */
.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: var(--card-spacing);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardSlideIn 0.4s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card:hover {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  border-color: #cbd5e0;
}

.form-card.card-completed {
  border-color: #48bb78;
  background: linear-gradient(to bottom, #f0fff4 0%, white 50px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;
}

.card-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.card-completed .card-icon {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
}

.card-title-group {
  flex: 1;
}

.card-title {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-subtitle {
  margin: 0;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 400;
}

.card-status {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkmark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #48bb78;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
  animation: checkmarkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkmarkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.card-content {
  padding: 0;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-group input:valid,
.form-group select:valid:not([value=""]) {
  border-color: #48bb78;
}

.required {
  color: #e53e3e;
  font-weight: 600;
}

/* Form Actions */
.form-actions {
  margin-top: 3rem;
  text-align: center;
  padding: 2rem 0;
}

.btn {
  padding: 0.875rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-submit {
  padding: 1.125rem 3rem;
  font-size: 1.125rem;
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  color: #718096;
  font-size: 0.875rem;
}

/* Alerts */
.alert {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.alert-error {
  background: #fff5f5;
  border: 2px solid #feb2b2;
  color: #c53030;
}

.alert-error ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.alert-warning {
  background: #fffaf0;
  border: 2px solid #fbd38d;
  color: #744210;
}

.alert-warning h3 {
  margin-top: 0;
}

.alert-success {
  background: #f0fff4;
  border: 2px solid #9ae6b4;
  color: #22543d;
}

.alert-success h3 {
  margin-top: 0;
}

/* Comment Step */
.comment-step {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.comment-step-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.comment-step-header h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
}

.comment-step-subtitle {
  color: #4a5568;
  font-size: 1.1rem;
  margin: 0;
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
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-help {
  display: block;
  margin-top: 0.75rem;
  color: #718096;
  font-size: 0.875rem;
}

.confidential-notice {
  background: #f7fafc;
  padding: 0.875rem;
  border-left: 3px solid #667eea;
  border-radius: 6px;
  font-style: italic;
}

.comment-actions {
  text-align: center;
  margin: 2.5rem 0;
}

.btn-large {
  padding: 1.125rem 3.5rem;
  font-size: 1.15rem;
}

.comment-examples {
  margin: 2.5rem 0 0 0;
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
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2d3748;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.btn-example:hover {
  background: #edf2f7;
  border-color: #667eea;
  transform: translateX(6px);
}

/* Loading Screen */
.loading-screen {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-box {
  text-align: center;
  animation: fadeInScale 0.3s ease-out;
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

@keyframes spin {
  to { transform: rotate(360deg); }
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

/* Responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 0 1rem 2rem;
  }

  .form-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.75rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-subtitle {
    font-size: 0.875rem;
  }

  .diagnostic-form h2 {
    font-size: 1.5rem;
  }

  .form-description {
    font-size: 0.95rem;
  }

  .btn-submit {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .comment-step {
    padding: 2rem 1.5rem;
  }

  .comment-step-header h3 {
    font-size: 1.5rem;
  }
}
</style>
