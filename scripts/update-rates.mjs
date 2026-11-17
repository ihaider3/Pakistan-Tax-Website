import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RATES_FILE = path.resolve(__dirname, '../src/data/rates.json');

// APIs
const GOLD_API_URL = 'https://api.gold-api.com/price/XAU';
const SILVER_API_URL = 'https://api.gold-api.com/price/XAG';
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/USD';

// Math Constants
const TROY_OUNCE_TO_GRAMS = 31.1034768;
const TOLA_TO_TROY_OUNCES = 0.374878;
const NISAB_GOLD_GRAMS = 87.48;
const NISAB_SILVER_GRAMS = 612.36;

async function fetchWithRetry(url, name, retries = 3, timeoutMs = 15000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Fetch] Fetching ${name} from ${url} (attempt ${attempt}/${retries})...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log(`[Fetch] Success: ${name}`);
      return data;
    } catch (err) {
      console.warn(`[Fetch Warning] Attempt ${attempt} failed for ${name}: ${err.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      } else {
        throw new Error(`All ${retries} attempts failed for ${name}: ${err.message}`);
      }
    }
  }
}

function getPKTDateTime() {
  const now = new Date();
  // PKT is UTC+5 (300 minutes ahead of UTC)
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const pktMs = utcMs + 5 * 3600000;
  const pktDate = new Date(pktMs);

  const pad = (n) => String(n).padStart(2, '0');
  const year = pktDate.getFullYear();
  const month = pad(pktDate.getMonth() + 1);
  const day = pad(pktDate.getDate());
  const hours = pad(pktDate.getHours());
  const minutes = pad(pktDate.getMinutes());
  const seconds = pad(pktDate.getSeconds());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[pktDate.getMonth()];

  const lastUpdated = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:00`;
  const lastUpdatedLabel = `${pktDate.getDate()} ${monthName} ${year}, ${hours}:${minutes} PKT`;

  return { lastUpdated, lastUpdatedLabel };
}

async function updateRates() {
  console.log('=== Starting Daily Gold & Silver Rates Update ===');
  
  // 1. Fetch live rates
  const goldData = await fetchWithRetry(GOLD_API_URL, 'Gold spot (XAU)');
  const silverData = await fetchWithRetry(SILVER_API_URL, 'Silver spot (XAG)');
  const fxData = await fetchWithRetry(CURRENCY_API_URL, 'Exchange rates (USD)');

  // 2. Validate API outputs
  if (!goldData || typeof goldData.price !== 'number' || isNaN(goldData.price)) {
    throw new Error('Invalid response structure from Gold API: missing price field.');
  }
  if (!silverData || typeof silverData.price !== 'number' || isNaN(silverData.price)) {
    throw new Error('Invalid response structure from Silver API: missing price field.');
  }
  if (!fxData || fxData.result !== 'success' || !fxData.rates || typeof fxData.rates.PKR !== 'number') {
    throw new Error(`Invalid response structure from Currency API: result=${fxData?.result}`);
  }

  const xauUsd = Number(goldData.price.toFixed(2));
  const xagUsd = Number(silverData.price.toFixed(2));
  const usdPkr = Number(fxData.rates.PKR.toFixed(2));

  console.log(`[Data] Raw rates: XAU/USD = $${xauUsd}, XAG/USD = $${xagUsd}, USD/PKR = Rs ${usdPkr}`);

  // 3. Range validations
  if (xauUsd < 2000 || xauUsd > 6000) {
    throw new Error(`Validation Error: XAU/USD ($${xauUsd}) outside expected range [2000, 6000].`);
  }
  if (xagUsd < 15 || xagUsd > 100) {
    throw new Error(`Validation Error: XAG/USD ($${xagUsd}) outside expected range [15, 100].`);
  }
  if (usdPkr < 200 || usdPkr > 350) {
    throw new Error(`Validation Error: USD/PKR (Rs ${usdPkr}) outside expected range [200, 350].`);
  }

  // 4. Mathematical Calculations (2 decimal places for per-tola rates to ensure exact Nisab reconciliation)
  const goldPerTolaPKR = Number((xauUsd * usdPkr * TOLA_TO_TROY_OUNCES).toFixed(2));
  const silverPerTolaPKR = Number((xagUsd * usdPkr * TOLA_TO_TROY_OUNCES).toFixed(2));
  const goldPerGramPKR = Number(((xauUsd * usdPkr) / TROY_OUNCE_TO_GRAMS).toFixed(2));
  const silverPerGramPKR = Number(((xagUsd * usdPkr) / TROY_OUNCE_TO_GRAMS).toFixed(2));
  
  // Nisab is computed directly from displayed rates so 52.5 * silverRate = silverNisab and 7.5 * goldRate = goldNisab to the rupee
  const nisabGoldPKR = Math.round(7.5 * goldPerTolaPKR);
  const nisabSilverPKR = Math.round(52.5 * silverPerTolaPKR);

  console.log(`[Computed] Gold/tola: Rs ${goldPerTolaPKR.toFixed(2)}, Silver/tola: Rs ${silverPerTolaPKR.toFixed(2)}`);
  console.log(`[Computed] Gold/gram: Rs ${goldPerGramPKR.toFixed(2)}, Silver/gram: Rs ${silverPerGramPKR.toFixed(2)}`);
  console.log(`[Computed] Nisab Gold (7.5 tola): Rs ${nisabGoldPKR}, Nisab Silver (52.5 tola): Rs ${nisabSilverPKR}`);

  // 5. Tola threshold validations
  if (goldPerTolaPKR < 250000 || goldPerTolaPKR > 600000) {
    throw new Error(`Validation Error: Gold per tola (Rs ${goldPerTolaPKR}) outside expected range [250000, 600000].`);
  }
  if (silverPerTolaPKR < 2500 || silverPerTolaPKR > 10000) {
    throw new Error(`Validation Error: Silver per tola (Rs ${silverPerTolaPKR}) outside expected range [2500, 10000].`);
  }

  // 6. Max 10% daily jump validation against previous rates.json
  let previousRates = null;
  if (fs.existsSync(RATES_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
      previousRates = existing;
      if (existing && typeof existing.goldPerTolaPKR === 'number') {
        const jump = Math.abs(goldPerTolaPKR - existing.goldPerTolaPKR) / existing.goldPerTolaPKR;
        console.log(`[Validation] Gold per tola jump vs previous: ${(jump * 100).toFixed(2)}% (limit: 10%)`);
        if (jump > 0.10) {
          throw new Error(`Validation Error: Gold rate jumped ${(jump * 100).toFixed(2)}% (from ${existing.goldPerTolaPKR} to ${goldPerTolaPKR}), exceeding the 10% safety threshold.`);
        }
      }
    } catch (err) {
      if (err.message.includes('Validation Error')) {
        throw err;
      }
      console.warn(`[Warning] Could not parse existing rates file: ${err.message}`);
    }
  }

  // 7. Write new rates.json (Always write lastChecked timestamp)
  const { lastUpdated: currentTimestamp, lastUpdatedLabel: currentLabel } = getPKTDateTime();

  const ratesChanged =
    !previousRates ||
    previousRates.goldPerTolaPKR !== goldPerTolaPKR ||
    previousRates.silverPerTolaPKR !== silverPerTolaPKR;

  const lastUpdated = ratesChanged ? currentTimestamp : (previousRates.lastUpdated || currentTimestamp);
  const lastUpdatedLabel = ratesChanged ? currentLabel : (previousRates.lastUpdatedLabel || currentLabel);
  const lastChecked = currentTimestamp;
  const lastCheckedLabel = currentLabel;

  const newRates = {
    goldPerTolaPKR,
    silverPerTolaPKR,
    goldPerGramPKR,
    silverPerGramPKR,
    nisabGoldPKR,
    nisabSilverPKR,
    usdPkr,
    xauUsd,
    xagUsd,
    source: 'International spot price (gold-api.com) + USD/PKR (open.er-api.com). NOT the Sarafa official rate.',
    lastUpdated,
    lastUpdatedLabel,
    lastChecked,
    lastCheckedLabel,
  };

  fs.writeFileSync(RATES_FILE, JSON.stringify(newRates, null, 2) + '\n', 'utf8');
  console.log(`[Success] Written new rates to ${RATES_FILE}`);
  console.log(`[Timestamp] ${lastUpdatedLabel} (${lastUpdated})`);
}

updateRates().catch((err) => {
  console.error('[Error] Rates update failed:', err.message);
  process.exit(1);
});
