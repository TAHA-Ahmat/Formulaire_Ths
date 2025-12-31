<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <img src="/logoths.jpg" alt="Logo THS" class="logo-ths" />
          <div class="header-text">
            <h1>Bilan Connexion Internet 2025</h1>
            <p class="header-subtitle">Tchad Handling Services</p>
          </div>
        </div>
        <nav class="app-nav">
          <router-link to="/" class="nav-link">Formulaire</router-link>
          <router-link to="/public" class="nav-link">Voir les réponses</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 - Tchad Handling Services (THS)</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.logo-ths {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 400;
}

.app-nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.app-main {
  min-height: calc(100vh - 250px);
  padding: 2rem 0;
}

.app-footer {
  background: #2d3748;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: 3rem;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .logo-ths {
    width: 60px;
    height: 60px;
  }

  .header-text h1 {
    font-size: 1.4rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .app-nav {
    justify-content: center;
  }
}
</style>
