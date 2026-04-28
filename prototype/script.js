const state = {
  ssp: null,
  dsp: null,
  transaction: null,
  geography: null,
  adProduct: null,
};

function getRecommendation() {
  const cfg = getConfig();
  const dspObj = cfg.dsps.find(d => d.name === state.dsp);
  const txObj  = cfg.transactionTypes.find(t => t.name === state.transaction);
  const apObj  = cfg.adProducts.find(p => p.name === state.adProduct);
  if (!dspObj || !txObj || !apObj) return 'No recommendation found';
  const key = `${dspObj.id}|${txObj.id}|${apObj.id}`;
  return cfg.recommendations[key] || 'No recommendation found';
}

function getProgress() {
  const cfg = getConfig();
  if (!state.ssp) return 0;
  const sspObj = cfg.ssps.find(s => s.name === state.ssp);
  if (sspObj && sspObj.action === 'external') return 100;
  if (!state.dsp) return 20;
  const dspObj = cfg.dsps.find(d => d.name === state.dsp);
  if (dspObj && dspObj.action === 'direct') return 100;
  if (!state.transaction) return 40;
  const txObj = cfg.transactionTypes.find(t => t.name === state.transaction);
  if (txObj && txObj.requiresGeography && !state.geography) return 60;
  if (!state.adProduct) return 80;
  return 100;
}

function renderBreadcrumbs() {
  const crumbs = [state.ssp, state.dsp, state.transaction, state.geography].filter(Boolean);
  if (!crumbs.length) return '';
  return `<div class="breadcrumb">${crumbs.map(c => `<span class="crumb">${c}</span>`).join('')}</div>`;
}

function render() {
  const cfg = getConfig();
  document.getElementById('progressFill').style.width = getProgress() + '%';

  const app        = document.getElementById('app');
  const restartBtn = document.getElementById('restartBtn');

  // Step 1 — SSP
  if (!state.ssp) {
    restartBtn.style.display = 'none';
    app.innerHTML = `
      <div class="card">
        <div class="step-label">Step 1</div>
        <h2>Select your SSP</h2>
        <div class="options">
          ${cfg.ssps.map(s => `<button class="option-btn" data-key="ssp" data-val="${s.name}">${s.name}</button>`).join('')}
        </div>
      </div>`;
    return;
  }

  const sspObj = cfg.ssps.find(s => s.name === state.ssp);

  // Terminal — external SSP
  if (sspObj && sspObj.action === 'external') {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="result-card">
        <div class="result-icon">🔗</div>
        <h2>Recommendation</h2>
        <div class="result-message external">Please build externally.</div>
        <div class="summary">
          <div class="summary-row"><span>SSP</span><span>${state.ssp}</span></div>
        </div>
      </div>`;
    return;
  }

  // Step 2 — DSP
  if (!state.dsp) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 2</div>
        <h2>Select your DSP</h2>
        <div class="options">
          ${cfg.dsps.map(d => `<button class="option-btn" data-key="dsp" data-val="${d.name}">${d.name}</button>`).join('')}
        </div>
      </div>`;
    return;
  }

  const dspObj = cfg.dsps.find(d => d.name === state.dsp);

  // Terminal — direct DSP
  if (dspObj && dspObj.action === 'direct') {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="result-card">
        <div class="result-icon">✅</div>
        <h2>Recommendation</h2>
        <div class="result-message platform">Please build in ${dspObj.platform}.</div>
        <div class="summary">
          <div class="summary-row"><span>SSP</span><span>${state.ssp}</span></div>
          <div class="summary-row"><span>DSP</span><span>${state.dsp}</span></div>
        </div>
      </div>`;
    return;
  }

  // Step 3 — Transaction type
  if (!state.transaction) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 3</div>
        <h2>Select the transaction type</h2>
        <div class="options">
          ${cfg.transactionTypes.map(t => `<button class="option-btn" data-key="transaction" data-val="${t.name}">${t.name}</button>`).join('')}
        </div>
      </div>`;
    return;
  }

  const txObj = cfg.transactionTypes.find(t => t.name === state.transaction);

  // Step 4 — Geography (if required)
  if (txObj && txObj.requiresGeography && !state.geography) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 4</div>
        <h2>Select the geography</h2>
        <div class="options">
          ${cfg.geographies.map(g => `<button class="option-btn" data-key="geography" data-val="${g.name}">${g.name}</button>`).join('')}
        </div>
      </div>`;
    return;
  }

  // Step — Ad Product
  if (!state.adProduct) {
    const stepNum = txObj && txObj.requiresGeography ? '5' : '4';
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step ${stepNum}</div>
        <h2>Select the ad product</h2>
        <div class="options">
          ${cfg.adProducts.map(p => `<button class="option-btn" data-key="adProduct" data-val="${p.name}">${p.name}</button>`).join('')}
        </div>
      </div>`;
    return;
  }

  // Result
  const recommendation = getRecommendation();
  restartBtn.style.display = 'block';
  app.innerHTML = `
    <div class="result-card">
      <div class="result-icon">✅</div>
      <h2>Recommendation</h2>
      <div class="result-message platform">${recommendation}.</div>
      <div class="summary">
        <div class="summary-row"><span>SSP</span><span>${state.ssp}</span></div>
        <div class="summary-row"><span>DSP</span><span>${state.dsp}</span></div>
        <div class="summary-row"><span>Transaction</span><span>${state.transaction}</span></div>
        ${state.geography ? `<div class="summary-row"><span>Geography</span><span>${state.geography}</span></div>` : ''}
        <div class="summary-row"><span>Ad Product</span><span>${state.adProduct}</span></div>
      </div>
    </div>`;
}

document.getElementById('app').addEventListener('click', function(e) {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;
  const key = btn.dataset.key;
  const val = btn.dataset.val;
  state[key] = val;
  if (key === 'ssp')         { state.dsp = null; state.transaction = null; state.geography = null; state.adProduct = null; }
  if (key === 'dsp')         { state.transaction = null; state.geography = null; state.adProduct = null; }
  if (key === 'transaction') { state.geography = null; state.adProduct = null; }
  if (key === 'geography')   { state.adProduct = null; }
  render();
});

function restart() {
  Object.assign(state, { ssp: null, dsp: null, transaction: null, geography: null, adProduct: null });
  render();
}

render();
