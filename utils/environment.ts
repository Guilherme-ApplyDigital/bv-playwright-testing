export type BvEnvironment = 'dev' | 'stg' | 'prod';

const DEFAULT_URLS: Record<BvEnvironment, string> = {
  dev: 'https://develop--bv-ad.netlify.app',
  stg: '',
  prod: 'https://www.bv.com',
};

function normalizeEnvironment(raw: string | undefined): BvEnvironment {
  const value = (raw ?? 'dev').trim().toLowerCase();
  if (value === 'dev' || value === 'stg' || value === 'prod') {
    return value;
  }
  return 'dev';
}

export function resolveBaseUrl(): string {
  // Highest priority: explicit full URL override
  if (process.env.BV_BASE_URL?.trim()) {
    return process.env.BV_BASE_URL.trim();
  }

  const envName = normalizeEnvironment(process.env.BV_ENV);
  const fromEnv: Record<BvEnvironment, string | undefined> = {
    dev: process.env.BV_DEV_BASE_URL,
    stg: process.env.BV_STG_BASE_URL,
    prod: process.env.BV_PROD_BASE_URL,
  };

  const selectedUrl = fromEnv[envName]?.trim() || DEFAULT_URLS[envName];
  if (!selectedUrl) {
    throw new Error(
      'BV_ENV=stg selected, but no URL is configured. Set BV_STG_BASE_URL or BV_BASE_URL before running tests.',
    );
  }

  return selectedUrl;
}

export function shouldUseAuth(baseUrl: string): boolean {
  if (process.env.BV_USE_AUTH) {
    return process.env.BV_USE_AUTH === 'true';
  }

  // Production usually does not require auth.
  return !/https?:\/\/(www\.)?bv\.com\/?/i.test(baseUrl);
}

