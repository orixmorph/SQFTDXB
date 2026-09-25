import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLiveProperties, getPropertyById, getLiveAgents, getLiveAreas } from './src/server/baserow';
import { forwardLeadToGoogleSheets } from './src/server/leadProxy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

app.use(express.json());

// API Endpoints for Properties

/**
 * GET /api/properties
 * Fetches all LIVE properties from Baserow (or fallback/cache).
 * Security: Private BASEROW_API_TOKEN is strictly kept server-side.
 */
app.get('/api/properties', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const result = await getLiveProperties(forceRefresh);
    res.json({
      success: true,
      count: result.properties.length,
      source: result.source,
      data: result.properties,
    });
  } catch (error: any) {
    console.error('[API /api/properties] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties from database.',
    });
  }
});

/**
 * GET /api/agents
 * Fetches all active agents with their actual live property counts directly from database.
 */
app.get('/api/agents', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const agents = await getLiveAgents(forceRefresh);
    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error: any) {
    console.error('[API /api/agents] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve agents from database.',
    });
  }
});

/**
 * GET /api/areas
 * Fetches all Dubai areas with dynamic property counts and newly added areas (e.g. DIFC).
 */
app.get('/api/areas', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const areas = await getLiveAreas(forceRefresh);
    res.json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (error: any) {
    console.error('[API /api/areas] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve areas from database.',
    });
  }
});

/**
 * GET /api/properties/:id
 * Fetches a single property by ID or slug.
 */
app.get('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await getPropertyById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID "${propertyId}" was not found or is no longer live.`,
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    console.error(`[API /api/properties/${req.params.id}] Error:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve property details.',
    });
  }
});

/**
 * Minimized short link redirect: /p/:id or /share/:id
 * Redirects short shareable links directly to the property view.
 */
app.get(['/p/:id', '/share/:id'], (req, res) => {
  const propertyId = req.params.id;
  res.redirect(`/?property=${encodeURIComponent(propertyId)}`);
});

/**
 * POST /api/submit-lead
 * Confidential server-side lead ingestion.
 * Dispatches inquiries to the Google Apps Script Web App without exposing
 * endpoints, IDs, or tokens to the browser DevTools or Network inspector.
 */
app.post('/api/submit-lead', async (req, res) => {
  try {
    const lead = req.body || {};
    const result = await forwardLeadToGoogleSheets(lead);
    res.json({
      success: true,
      message: result.message || 'Inquiry received successfully.',
      timestamp: result.timestamp,
    });
  } catch (error: any) {
    console.error('[API /api/submit-lead] Ingestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process inquiry.',
    });
  }
});

/**
 * GET /api/status
 * Health and Baserow connection status (safe, no secret exposure).
 */
app.get('/api/status', (req, res) => {
  const hasToken = Boolean(process.env.BASEROW_API_TOKEN);
  const rawTableId = process.env.BASEROW_TABLE_ID || '1210850';
  const tableId = rawTableId === '1210846' ? '1210850' : rawTableId;
  res.json({
    status: 'ok',
    baserowConfigured: hasToken,
    tableId,
    timestamp: new Date().toISOString(),
  });
});

// Dev vs Production Setup
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    // In development mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: HOST,
        port: PORT,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built frontend from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const activeTableId = (process.env.BASEROW_TABLE_ID === '1210846' || !process.env.BASEROW_TABLE_ID) ? '1210850' : process.env.BASEROW_TABLE_ID;

  app.listen(PORT, HOST, () => {
    console.log(`[SQFT DXB Server] Server running at http://${HOST}:${PORT}`);
    console.log(`[SQFT DXB Server] Baserow API Token status: ${process.env.BASEROW_API_TOKEN ? 'Configured' : 'Pending'}`);
    console.log(`[SQFT DXB Server] Properties Table ID: ${activeTableId}`);
  });
}

startServer().catch((err) => {
  console.error('[SQFT DXB Server] Fatal startup error:', err);
  process.exit(1);
});
