<template>
  <div class="public-list-container">
    <div v-if="loading" class="loading-screen">
      <div class="loading-box">
        <img src="/logoths.jpg" alt="THS Logo" class="loading-logo" />
        <div class="spinner-large"></div>
        <p class="loading-text">Chargement des réponses...</p>
        <p class="loading-subtext">Veuillez patienter</p>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <p>{{ error }}</p>
      <button @click="loadResponses" class="btn btn-secondary">Réessayer</button>
    </div>

    <div v-else-if="responses.length === 0">
      <div class="list-header">
        <h2>Liste des réponses</h2>
        <p class="list-description">
          Nombre total de réponses : <strong>0</strong>
        </p>
      </div>
      <div class="alert alert-info">
        <p>Aucune réponse pour le moment. Soyez le premier à répondre !</p>
        <router-link to="/" class="btn btn-primary">Remplir le formulaire</router-link>
      </div>
    </div>

    <div v-else>
      <div class="list-header">
        <h2>Liste des réponses</h2>
        <p class="list-description">
          Nombre total de réponses : <strong>{{ totalCount }}</strong>
        </p>
      </div>
      <div class="responses-container">
      <div class="table-responsive">
        <table class="responses-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Service</th>
              <th>Date de réponse</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(response, index) in responses" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ response.nom }}</td>
              <td>{{ response.prenom }}</td>
              <td>{{ response.service }}</td>
              <td>{{ formatDate(response.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-box">
        <h3>Informations</h3>
        <ul>
          <li>Les commentaires sont <strong>strictement confidentiels</strong> et visibles uniquement par la Direction et la Comptabilité</li>
          <li>Cette liste affiche uniquement : Nom, Prénom, Service et Date de réponse.</li>
        </ul>
      </div>

      <div class="actions">
        <button @click="loadResponses" class="btn btn-secondary">Actualiser</button>
        <router-link to="/" class="btn btn-primary">Remplir le formulaire</router-link>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPublicResponses, getResponseCount } from '@/services/googleSheetsService'
import { formatDate } from '@/utils/browserDetect'

export default {
  name: 'PublicListComponent',
  data() {
    return {
      responses: [],
      totalCount: 0,
      loading: true,
      error: null
    }
  },
  mounted() {
    this.loadResponses()
  },
  methods: {
    formatDate,
    async loadResponses() {
      this.loading = true
      this.error = null

      try {
        // Charger en parallèle les réponses et le compte
        const [responsesData, count] = await Promise.all([
          getPublicResponses(),
          getResponseCount()
        ])

        this.responses = responsesData
        this.totalCount = count
      } catch (err) {
        console.error('Erreur chargement:', err)
        this.error = err.message || 'Impossible de charger les réponses'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.public-list-container {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  text-align: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.list-description {
  color: #718096;
  font-size: 1.1rem;
}

.list-description strong {
  color: #667eea;
  font-size: 1.3rem;
}

/* Loading screen avec logo THS */
.loading-screen {
  background: white;
  padding: 4rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.loading-box {
  text-align: center;
  animation: fadeInScale 0.3s ease-out;
  max-width: 400px;
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

.loading-logo {
  width: 100px;
  height: auto;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  object-fit: contain;
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

.responses-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.responses-table {
  width: 100%;
  border-collapse: collapse;
}

.responses-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.responses-table th,
.responses-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.responses-table th {
  font-weight: 600;
}

.responses-table tbody tr:hover {
  background: #f7fafc;
}

.responses-table tbody tr:last-child td {
  border-bottom: none;
}

.info-box {
  background: #edf2f7;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
}

.info-box h3 {
  margin-top: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.info-box li {
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.alert {
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.alert-error {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.alert-info {
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  color: #2c5282;
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

@media (max-width: 768px) {
  .responses-table {
    font-size: 0.875rem;
  }

  .responses-table th,
  .responses-table td {
    padding: 0.75rem 0.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
