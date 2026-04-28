const CONFIG_KEY = 'adVerifier_config';
const AUTH_KEY = 'adVerifier_auth';

const DEFAULT_CONFIG = {
  password: 'admin',
  ssps: [
    { id: 'ssp1', name: 'SSP 1', action: 'proceed' },
    { id: 'ssp2', name: 'SSP 2', action: 'external' },
    { id: 'ssp3', name: 'SSP 3', action: 'external' },
  ],
  dsps: [
    { id: 'dsp1', name: 'DSP 1', action: 'proceed' },
    { id: 'dsp2', name: 'DSP 2', action: 'proceed' },
    { id: 'dsp3', name: 'DSP 3', action: 'direct', platform: 'Platform 1' },
  ],
  transactionTypes: [
    { id: 'pg',  name: 'PG',  requiresGeography: true  },
    { id: 'pmp', name: 'PMP', requiresGeography: false },
  ],
  geographies: [
    { id: 'us',   name: 'US'            },
    { id: 'intl', name: 'International' },
  ],
  adProducts: [
    { id: 'ap1', name: 'Ad Product 1' },
    { id: 'ap2', name: 'Ad Product 2' },
    { id: 'ap3', name: 'Ad Product 3' },
    { id: 'ap4', name: 'Ad Product 4' },
    { id: 'ap5', name: 'Ad Product 5' },
  ],
  platforms: ['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4'],
  recommendations: {
    'dsp1|pg|ap1':  'Platform 2',
    'dsp1|pg|ap2':  'Platform 2',
    'dsp1|pg|ap3':  'Platform 2',
    'dsp1|pg|ap4':  'Platform 2',
    'dsp1|pg|ap5':  'Platform 2',
    'dsp1|pmp|ap1': 'Platform 2',
    'dsp1|pmp|ap2': 'Platform 2',
    'dsp1|pmp|ap3': 'Platform 2',
    'dsp1|pmp|ap4': 'Platform 2',
    'dsp1|pmp|ap5': 'Platform 2',
    'dsp2|pg|ap1':  'Platform 2',
    'dsp2|pg|ap2':  'Platform 2',
    'dsp2|pg|ap3':  'Platform 2',
    'dsp2|pg|ap4':  'Platform 2',
    'dsp2|pg|ap5':  'Platform 2',
    'dsp2|pmp|ap1': 'Platform 2',
    'dsp2|pmp|ap2': 'Platform 1',
    'dsp2|pmp|ap3': 'Platform 1',
    'dsp2|pmp|ap4': 'Platform 2',
    'dsp2|pmp|ap5': 'Platform 2',
  },
};

function getConfig() {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
}

function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function authenticate(password) {
  const config = getConfig();
  if (password === config.password) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
