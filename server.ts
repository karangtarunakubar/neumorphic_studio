import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Store session tokens in-memory or cookies
const SESSION_COOKIE = 'neu_oauth_token';

// Helper to get Google Access Token from Cookie or Auth header
function getAccessToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return req.cookies?.[SESSION_COOKIE] || null;
}

// -------------------------------------------------------------
// Google OAuth Endpoints
// -------------------------------------------------------------
app.get('/api/auth/google/url', (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  if (!clientId) {
    return res.status(400).json({ error: 'OAUTH_CLIENT_ID environment variable not configured' });
  }

  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  res.json({ url: authUrl, redirectUri });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) {
    return res.status(400).send(`Authentication error: ${error || 'No code provided'}`);
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Token Exchange Error:', tokenData);
      return res.status(400).send(`Token error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // Set cookie
    res.cookie(SESSION_COOKIE, accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000
    });

    // Send HTML script to notify parent window or close popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentication Successful</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #e0e5ec;">
          <div style="text-align: center; background: #e0e5ec; padding: 20px; border-radius: 16px; box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;">
            <h2 style="color: #10b981;">Connected to Google Workspace!</h2>
            <p>You may close this window.</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token: "${accessToken}" }, '*');
              window.close();
            } else {
              setTimeout(() => { window.location.href = '/'; }, 1500);
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('OAuth Callback Exception:', err);
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

app.get('/api/auth/status', async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!userRes.ok) {
      return res.json({ authenticated: false });
    }

    const userData = await userRes.json();
    res.json({
      authenticated: true,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Google Sheets API Proxy Endpoints
// -------------------------------------------------------------

// 1. Create a brand new Neumorphic Tokens Sheet
app.post('/api/sheets/create', async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated with Google Account' });
  }

  const title = req.body.title || 'Neumorphic UI Design System - Tokens & Presets';
  const initialTokens = req.body.tokens || [];
  const initialPresets = req.body.presets || [];

  try {
    // Create Spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title },
        sheets: [
          { properties: { title: 'Design Tokens' } },
          { properties: { title: 'Theme Presets' } }
        ]
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return res.status(createRes.status).json({ error: `Google Sheets API Error: ${errText}` });
    }

    const spreadsheet = await createRes.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const spreadsheetUrl = spreadsheet.spreadsheetUrl;

    // Header rows and initial data
    const tokenHeaders = [
      'ID', 'Component Name', 'Category', 'Surface Hex', 'Accent Hex',
      'Elevation (px)', 'Blur (px)', 'Radius (px)', 'Light Angle', 'Shape',
      'CSS Box Shadow', 'Last Updated'
    ];

    const tokenRows = initialTokens.map((t: any) => [
      t.id, t.name, t.category, t.config?.bgColor || '#e0e5ec', t.config?.accentColor || '#3b82f6',
      t.config?.elevation || 8, t.config?.blur || 16, t.config?.radius || 16, t.config?.lightAngle || 'top-left', t.config?.shape || 'flat',
      t.cssShadow || '', new Date().toISOString()
    ]);

    const presetHeaders = ['ID', 'Name', 'Background Hex', 'Accent Hex', 'Is Dark', 'Elevation', 'Blur', 'Radius'];
    const presetRows = initialPresets.map((p: any) => [
      p.id, p.name, p.bgColor, p.accentColor, p.isDark ? 'TRUE' : 'FALSE', p.elevation, p.blur, p.radius
    ]);

    // Populate data
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: "'Design Tokens'!A1",
            values: [tokenHeaders, ...tokenRows]
          },
          {
            range: "'Theme Presets'!A1",
            values: [presetHeaders, ...presetRows]
          }
        ]
      })
    });

    res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      title
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Export / Update Tokens to existing sheet
app.post('/api/sheets/export', async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated with Google Account' });
  }

  const { spreadsheetId, tokens = [], presets = [] } = req.body;
  if (!spreadsheetId) {
    return res.status(400).json({ error: 'spreadsheetId is required' });
  }

  try {
    const tokenHeaders = [
      'ID', 'Component Name', 'Category', 'Surface Hex', 'Accent Hex',
      'Elevation (px)', 'Blur (px)', 'Radius (px)', 'Light Angle', 'Shape',
      'CSS Box Shadow', 'Last Updated'
    ];

    const tokenRows = tokens.map((t: any) => [
      t.id, t.name, t.category, t.config?.bgColor || '#e0e5ec', t.config?.accentColor || '#3b82f6',
      t.config?.elevation || 8, t.config?.blur || 16, t.config?.radius || 16, t.config?.lightAngle || 'top-left', t.config?.shape || 'flat',
      t.cssShadow || '', new Date().toISOString()
    ]);

    const presetHeaders = ['ID', 'Name', 'Background Hex', 'Accent Hex', 'Is Dark', 'Elevation', 'Blur', 'Radius'];
    const presetRows = presets.map((p: any) => [
      p.id, p.name, p.bgColor, p.accentColor, p.isDark ? 'TRUE' : 'FALSE', p.elevation, p.blur, p.radius
    ]);

    // Overwrite range A1:L100
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: "'Design Tokens'!A1",
            values: [tokenHeaders, ...tokenRows]
          },
          {
            range: "'Theme Presets'!A1",
            values: [presetHeaders, ...presetRows]
          }
        ]
      })
    });

    res.json({
      success: true,
      spreadsheetId,
      updatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Import Tokens from Google Sheet
app.get('/api/sheets/import/:spreadsheetId', async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated with Google Account' });
  }

  const { spreadsheetId } = req.params;

  try {
    const sheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=true`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!sheetRes.ok) {
      const text = await sheetRes.text();
      return res.status(sheetRes.status).json({ error: `Fetch failed: ${text}` });
    }

    const data = await sheetRes.json();
    const sheets = data.sheets || [];

    let tokens: any[] = [];
    let presets: any[] = [];

    sheets.forEach((sheet: any) => {
      const sheetName = sheet.properties?.title;
      const rowData = sheet.data?.[0]?.rowData || [];
      if (rowData.length < 2) return;

      if (sheetName === 'Design Tokens') {
        // Skip header at index 0
        for (let i = 1; i < rowData.length; i++) {
          const cells = rowData[i].values || [];
          if (!cells[0]?.formattedValue) continue;

          tokens.push({
            id: cells[0]?.formattedValue || `tok-${i}`,
            name: cells[1]?.formattedValue || 'Custom Component',
            category: cells[2]?.formattedValue || 'buttons',
            config: {
              bgColor: cells[3]?.formattedValue || '#e0e5ec',
              accentColor: cells[4]?.formattedValue || '#3b82f6',
              elevation: Number(cells[5]?.formattedValue || 8),
              blur: Number(cells[6]?.formattedValue || 16),
              radius: Number(cells[7]?.formattedValue || 16),
              lightAngle: cells[8]?.formattedValue || 'top-left',
              shape: cells[9]?.formattedValue || 'flat'
            },
            cssShadow: cells[10]?.formattedValue || '',
            updatedAt: cells[11]?.formattedValue || new Date().toISOString()
          });
        }
      } else if (sheetName === 'Theme Presets') {
        for (let i = 1; i < rowData.length; i++) {
          const cells = rowData[i].values || [];
          if (!cells[0]?.formattedValue) continue;

          presets.push({
            id: cells[0]?.formattedValue || `pres-${i}`,
            name: cells[1]?.formattedValue || 'Imported Theme',
            bgColor: cells[2]?.formattedValue || '#e0e5ec',
            accentColor: cells[3]?.formattedValue || '#3b82f6',
            isDark: cells[4]?.formattedValue === 'TRUE',
            elevation: Number(cells[5]?.formattedValue || 8),
            blur: Number(cells[6]?.formattedValue || 16),
            radius: Number(cells[7]?.formattedValue || 16)
          });
        }
      }
    });

    res.json({
      spreadsheetId,
      title: data.properties?.title || 'Imported Design Tokens',
      tokens,
      presets
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. List User's Google Drive Spreadsheet files
app.get('/api/drive/files', async (req, res) => {
  const token = getAccessToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated with Google Account' });
  }

  try {
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'&fields=files(id,name,webViewLink,createdTime,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=20`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!driveRes.ok) {
      const text = await driveRes.text();
      return res.status(driveRes.status).json({ error: text });
    }

    const data = await driveRes.json();
    res.json({ files: data.files || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Vite Integration & Production Static Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neumorphic Studio server listening on http://localhost:${PORT}`);
  });
}

startServer();
