import { BillingFrequency, Category } from '@/types';

export interface SubscriptionTemplate {
  name: string;
  cost: number;
  currency: string;
  billingFrequency: BillingFrequency;
  category: Category;
  domain?: string;
  popularityRank?: number;
}

export const SUBSCRIPTION_TEMPLATES: SubscriptionTemplate[] = [
  // ─── STREAMING ─────────────────────────────────────────────
  { name: 'Netflix', cost: 12.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'netflix.com', popularityRank: 1 },
  { name: 'Disney+', cost: 8.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'disneyplus.com', popularityRank: 3 },
  { name: 'HBO Max', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'max.com', popularityRank: 6 },
  { name: 'Amazon Prime', cost: 49.90, currency: 'EUR', billingFrequency: BillingFrequency.YEARLY, category: Category.STREAMING, domain: 'primevideo.com', popularityRank: 4 },
  { name: 'YouTube Premium', cost: 11.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'youtube.com', popularityRank: 5 },
  { name: 'Hulu', cost: 7.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'hulu.com', popularityRank: 10 },
  { name: 'Paramount+', cost: 5.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'paramountplus.com', popularityRank: 12 },
  { name: 'Crunchyroll', cost: 7.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'crunchyroll.com', popularityRank: 15 },
  { name: 'Apple TV+', cost: 6.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'tv.apple.com', popularityRank: 11 },
  { name: 'DAZN', cost: 12.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.STREAMING, domain: 'dazn.com', popularityRank: 14 },

  // ─── MÚSICA ────────────────────────────────────────────────
  { name: 'Spotify', cost: 10.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'spotify.com', popularityRank: 2 },
  { name: 'Apple Music', cost: 10.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'music.apple.com', popularityRank: 8 },
  { name: 'YouTube Music', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'music.youtube.com', popularityRank: 13 },
  { name: 'Tidal', cost: 10.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'tidal.com', popularityRank: 25 },
  { name: 'Deezer', cost: 10.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'deezer.com', popularityRank: 26 },
  { name: 'SoundCloud Go', cost: 5.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'soundcloud.com', popularityRank: 35 },
  { name: 'Amazon Music', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.MUSIC, domain: 'music.amazon.com', popularityRank: 20 },

  // ─── GAMING ────────────────────────────────────────────────
  { name: 'Xbox Game Pass', cost: 12.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.GAMING, domain: 'xbox.com', popularityRank: 7 },
  { name: 'PlayStation Plus', cost: 8.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.GAMING, domain: 'playstation.com', popularityRank: 9 },
  { name: 'Nintendo Switch Online', cost: 19.99, currency: 'EUR', billingFrequency: BillingFrequency.YEARLY, category: Category.GAMING, domain: 'nintendo.com', popularityRank: 16 },
  { name: 'EA Play', cost: 3.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.GAMING, domain: 'ea.com', popularityRank: 22 },
  { name: 'Twitch', cost: 4.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.GAMING, domain: 'twitch.tv', popularityRank: 18 },

  // ─── PRODUCTIVIDAD ────────────────────────────────────────
  { name: 'ChatGPT Plus', cost: 20.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'openai.com', popularityRank: 2 },
  { name: 'Claude Pro', cost: 20.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'claude.ai', popularityRank: 17 },
  { name: 'Microsoft 365', cost: 69.99, currency: 'EUR', billingFrequency: BillingFrequency.YEARLY, category: Category.PRODUCTIVITY, domain: 'microsoft.com', popularityRank: 8 },
  { name: 'Notion', cost: 8.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'notion.so', popularityRank: 19 },
  { name: 'Figma', cost: 12.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'figma.com', popularityRank: 23 },
  { name: 'Canva', cost: 12.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'canva.com', popularityRank: 21 },
  { name: 'Grammarly', cost: 12.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'grammarly.com', popularityRank: 24 },
  { name: 'Slack', cost: 7.25, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'slack.com', popularityRank: 27 },
  { name: 'Zoom', cost: 13.33, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'zoom.us', popularityRank: 28 },
  { name: 'Linear', cost: 8.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'linear.app', popularityRank: 38 },
  { name: 'GitHub Copilot', cost: 10.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'github.com', popularityRank: 20 },
  { name: 'Cursor', cost: 20.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'cursor.com', popularityRank: 30 },
  { name: 'Midjourney', cost: 10.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.PRODUCTIVITY, domain: 'midjourney.com', popularityRank: 29 },

  // ─── CLOUD STORAGE ─────────────────────────────────────────
  { name: 'iCloud+', cost: 0.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.CLOUD_STORAGE, domain: 'icloud.com', popularityRank: 10 },
  { name: 'Google One', cost: 1.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.CLOUD_STORAGE, domain: 'one.google.com', popularityRank: 11 },
  { name: 'Dropbox', cost: 11.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.CLOUD_STORAGE, domain: 'dropbox.com', popularityRank: 30 },
  { name: 'OneDrive', cost: 1.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.CLOUD_STORAGE, domain: 'onedrive.com', popularityRank: 31 },

  // ─── SEGURIDAD / VPN ──────────────────────────────────────
  { name: 'NordVPN', cost: 12.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.UTILITIES, domain: 'nordvpn.com', popularityRank: 18 },
  { name: '1Password', cost: 2.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.UTILITIES, domain: '1password.com', popularityRank: 32 },
  { name: 'ExpressVPN', cost: 12.95, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.UTILITIES, domain: 'expressvpn.com', popularityRank: 33 },

  // ─── SALUD & FITNESS ──────────────────────────────────────
  { name: 'Strava', cost: 7.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.HEALTH_FITNESS, domain: 'strava.com', popularityRank: 22 },
  { name: 'Headspace', cost: 12.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.HEALTH_FITNESS, domain: 'headspace.com', popularityRank: 34 },
  { name: 'Calm', cost: 14.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.HEALTH_FITNESS, domain: 'calm.com', popularityRank: 36 },

  // ─── APRENDIZAJE ──────────────────────────────────────────
  { name: 'Duolingo', cost: 7.49, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'duolingo.com', popularityRank: 15 },
  { name: 'Audible', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'audible.com', popularityRank: 19 },
  { name: 'Kindle Unlimited', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'amazon.com', popularityRank: 37 },
  { name: 'Medium', cost: 5.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'medium.com', popularityRank: 39 },
  { name: 'Coursera', cost: 49.00, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'coursera.org', popularityRank: 40 },

  // ─── NOTICIAS ─────────────────────────────────────────────
  { name: 'New York Times', cost: 4.25, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'nytimes.com', popularityRank: 41 },
  { name: 'The Athletic', cost: 7.99, currency: 'USD', billingFrequency: BillingFrequency.MONTHLY, category: Category.NEWS_LEARNING, domain: 'theathletic.com', popularityRank: 42 },

  // ─── SOCIAL / OTROS ───────────────────────────────────────
  { name: 'Tinder', cost: 9.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.OTHER, domain: 'tinder.com', popularityRank: 43 },
  { name: 'Bumble', cost: 16.99, currency: 'EUR', billingFrequency: BillingFrequency.MONTHLY, category: Category.OTHER, domain: 'bumble.com', popularityRank: 44 },
];
