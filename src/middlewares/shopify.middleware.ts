import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { shopifyApi, RequestedTokenType, ApiVersion } from '@shopify/shopify-api';
import type { JwtPayload } from '@shopify/shopify-api';

const shopifyRouter = express.Router();

// Initialize the Shopify API client for one store (merchant)
const shopify = shopifyApi({
  apiKey: process.env['SHOPIFY_API_KEY']!,
  apiSecretKey: process.env['SHOPIFY_API_SECRET'] || '',
  apiVersion: ApiVersion.Unstable,
  appUrl: process.env['SHOPIFY_APP_URL'] || '',
  scopes: process.env['SCOPES']?.split(',') || [],
  hostScheme: process.env['HOST']?.startsWith('http://') ? 'http' : 'https',
  hostName: process.env['HOST']?.replace(/https?:\/\//, '') || '',
  isEmbeddedApp: true,
});

// Helpers to extract session token from request
function getSessionTokenHeader(req: Request): string | undefined {
  const auth = req.headers['authorization'];
  if (!auth) return;
  return Array.isArray(auth) ? auth[0].replace('Bearer ', '') : auth.replace('Bearer ', '');
}

function getSessionTokenFromUrlParam(req: Request): string | undefined {
  const url = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`);
  return url.searchParams.get('id_token') || undefined;
}

function redirectToSessionTokenBouncePage(req: Request, res: Response) {
  const url = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`);
  const params = new URLSearchParams(url.search);
  params.delete('id_token');
  params.append('shopify-reload', `${req.path}?${params.toString()}`);

  res.redirect(`/session-token-bounce?${params.toString()}`);
}

// Bounce page for client-side App Bridge token reload
shopifyRouter.get('/session-token-bounce', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  const html = `
  <head>
    <meta name="shopify-api-key" content="${process.env['SHOPIFY_API_KEY']}" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  </head>
  `;
  res.send(html);
});

// Authorization route: exchanges session token for access token
shopifyRouter.get('/authorize', async (req: Request, res: Response, next: NextFunction) => {
  let encodedSessionToken: string | undefined;
  let decodedSessionToken: JwtPayload;

  try {
    encodedSessionToken =
      getSessionTokenHeader(req) || getSessionTokenFromUrlParam(req);

    if (!encodedSessionToken) {
      throw new Error('No session token provided');
    }

    decodedSessionToken = await shopify.session.decodeSessionToken(
      encodedSessionToken
    );
  } catch (err) {
    // If no auth header, redirect to bounce page
    if (!req.headers['authorization']) {
      return redirectToSessionTokenBouncePage(req, res);
    }

    // For XHR/Fetch requests, signal invalid session
    return res
      .status(401)
      .header('X-Shopify-Retry-Invalid-Session-Request', '1')
      .send('Unauthorized');
  }

  try {
    const dest = new URL(decodedSessionToken.dest);
    const shop = dest.hostname;

    // Exchange the session token for an access token
    const accessToken = await shopify.auth.tokenExchange({
      shop,
      sessionToken: encodedSessionToken,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    res.setHeader('Content-Type', 'text/html');
    const html = `
    <body>
      <h1>Retrieved Access Token</h1>
      <pre>${JSON.stringify(accessToken, null, 2)}</pre>
    </body>`;
    res.send(html);
  } catch (err) {
    next(err);
  }
});

export default shopifyRouter;
