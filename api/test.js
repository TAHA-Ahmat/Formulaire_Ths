// Endpoint de test pour vérifier les variables d'environnement
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  res.status(200).json({
    message: 'Test endpoint',
    googleScriptUrlConfigured: !!googleScriptUrl,
    googleScriptUrlLength: googleScriptUrl ? googleScriptUrl.length : 0,
    googleScriptUrlFirst50: googleScriptUrl ? googleScriptUrl.substring(0, 50) : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => !key.startsWith('VERCEL_')).sort()
  });
}
