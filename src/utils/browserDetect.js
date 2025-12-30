/**
 * Détecte automatiquement les informations techniques du navigateur
 * FRONT-ONLY - Pas de géolocalisation GPS, pas de tracking caché
 */

export function getBrowserInfo() {
  const ua = navigator.userAgent

  // Détection du navigateur
  let browserName = 'Inconnu'
  let browserVersion = 'N/A'

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
    browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'N/A'
  } else if (ua.indexOf('Edg') > -1) {
    browserName = 'Edge'
    browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'N/A'
  } else if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
    browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'N/A'
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari'
    browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'N/A'
  }

  // Détection de l'OS
  let os = 'Inconnu'
  if (ua.indexOf('Windows') > -1) os = 'Windows'
  else if (ua.indexOf('Mac') > -1) os = 'MacOS'
  else if (ua.indexOf('Linux') > -1) os = 'Linux'
  else if (ua.indexOf('Android') > -1) os = 'Android'
  else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS'

  // Type d'appareil
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua)
  let deviceType = 'Desktop'
  if (isTablet) deviceType = 'Tablette'
  else if (isMobile) deviceType = 'Mobile'

  // Autres infos
  const screenResolution = `${window.screen.width}x${window.screen.height}`
  const language = navigator.language || 'N/A'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return {
    browser: browserName,
    browserVersion: browserVersion,
    os: os,
    deviceType: deviceType,
    screenResolution: screenResolution,
    language: language,
    timezone: timezone,
    userAgent: ua,
    timestamp: new Date().toISOString()
  }
}

/**
 * Formate une date en format lisible français
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
