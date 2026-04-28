const state = {
  ssp: null,
  dsp: null,
  transaction: null,
  geography: null,
  adProduct: null,
};

const steps = ['ssp', 'dsp', 'transaction', 'geography', 'adProduct', 'result'];

const AD_PRODUCTS = ['Ad Product 1', 'Ad Product 2', 'Ad Product 3', 'Ad Product 4', 'Ad Product 5'];

function getRecommendation() {
  const { dsp, transaction, geography, adProduct } = state;

  if (dsp === 'DSP 1') {
    return 'Please build in Platform 2';
  }

  if (dsp === 'DSP 2') {
    if (transaction === 'PMP') {
      if (adProduct === 'Ad Product 2' || adProduct === 'Ad Product 3') {
        return 'Please build in Platform 1';
      }
      return 'Please build in Platform 2';
    }
    if (transaction === 'PG') {
      return 'Please build in Platform 2';
    }
  }

  return 'Please build in Platform 2';
}

function getProgress() {
  const { ssp, dsp, transaction, geography, adProduct } = state;
  if (!ssp) return 0;
  if (ssp !== 'SSP 1') return 100;
  if (!dsp) return 20;
  if (dsp === 'DSP 3') return 100;
  if (!transaction) return 40;
  if (transaction === 'PG' && !geography) return 60;
  if (!adProduct) return 80;
  return 100;
}

function getBreadcrumbs() {
  const crumbs = [];
  if (state.ssp) crumbs.push(state.ssp);
  if (state.dsp) crumbs.push(state.dsp);
  if (state.transaction) crumbs.push(state.transaction);
  if (state.geography) crumbs.push(state.geography);
  return crumbs;
}

function renderBreadcrumbs() {
  const crumbs = getBreadcrumbs();
  if (!crumbs.length) return '';
  return `<div class="breadcrumb">${crumbs.map(c => `<span class="crumb">${c}</span>`).join('')}</div>`;
}

function render() {
  const app = document.getElementById('app');
  const restartBtn = document.getElementById('restartBtn');
  const progressFill = document.getElementById('progressFill');

  progressFill.style.width = getProgress() + '%';

  const { ssp, dsp, transaction, geography, adProduct } = state;

  // Step 1: SSP
  if (!ssp) {
    restartBtn.style.display = 'none';
    app.innerHTML = `
      <div class="card">
        <div class="step-label">Step 1 of 4</div>
        <h2>Select your SSP</h2>
        <div class="options">
          ${['SSP 1', 'SSP 2', 'SSP 3'].map(s => `
            <button class="option-btn" onclick="select('ssp', '${s}')">${s}</button>
          `).join('')}
        </div>
      </div>`;
    return;
  }

  // Terminal: SSP 2 or SSP 3
  if (ssp === 'SSP 2' || ssp === 'SSP 3') {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="result-card">
        <div class="result-icon">🔗</div>
        <h2>Recommendation</h2>
        <div class="result-message external">Please build externally.</div>
        <div class="summary">
          <div class="summary-row"><span>SSP</span><span>${ssp}</span></div>
        </div>
      </div>`;
    return;
  }

  // Step 2: DSP
  if (!dsp) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 2 of 4</div>
        <h2>Select your DSP</h2>
        <div class="options">
          ${['DSP 1', 'DSP 2', 'DSP 3'].map(d => `
            <button class="option-btn" onclick="select('dsp', '${d}')">${d}</button>
          `).join('')}
        </div>
      </div>`;
    return;
  }

  // Terminal: DSP 3
  if (dsp === 'DSP 3') {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="result-card">
        <div class="result-icon">✅</div>
        <h2>Recommendation</h2>
        <div class="result-message platform">Please build in Platform 1.</div>
        <div class="summary">
          <div class="summary-row"><span>SSP</span><span>${ssp}</span></div>
          <div class="summary-row"><span>DSP</span><span>${dsp}</span></div>
        </div>
      </div>`;
    return;
  }

  // Step 3: Transaction type
  if (!transaction) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 3 of 4</div>
        <h2>Select the transaction type</h2>
        <div class="options">
          <button class="option-btn" onclick="select('transaction', 'PG')">PG</button>
          <button class="option-btn" onclick="select('transaction', 'PMP')">PMP (US Only)</button>
        </div>
      </div>`;
    return;
  }

  // Step 4 (PG only): Geography
  if (transaction === 'PG' && !geography) {
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step 4 of 5</div>
        <h2>Select the geography</h2>
        <div class="options">
          <button class="option-btn" onclick="select('geography', 'US')">US</button>
          <button class="option-btn" onclick="select('geography', 'International')">International</button>
        </div>
      </div>`;
    return;
  }

  // Step: Ad Product selection
  if (!adProduct) {
    const stepNum = transaction === 'PG' ? '5 of 5' : '4 of 4';
    restartBtn.style.display = 'block';
    app.innerHTML = `
      <div class="card">
        ${renderBreadcrumbs()}
        <div class="step-label">Step ${stepNum}</div>
        <h2>Select the ad product</h2>
        <div class="options">
          ${AD_PRODUCTS.map(p => `
            <button class="option-btn" onclick="select('adProduct', '${p}')">${p}</button>
          `).join('')}
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
        <div class="summary-row"><span>SSP</span><span>${ssp}</span></div>
        <div class="summary-row"><span>DSP</span><span>${dsp}</span></div>
        <div class="summary-row"><span>Transaction</span><span>${transaction}</span></div>
        ${geography ? `<div class="summary-row"><span>Geography</span><span>${geography}</span></div>` : ''}
        <div class="summary-row"><span>Ad Product</span><span>${adProduct}</span></div>
      </div>
    </div>`;
}

function select(key, value) {
  state[key] = value;
  render();
}

function restart() {
  state.ssp = null;
  state.dsp = null;
  state.transaction = null;
  state.geography = null;
  state.adProduct = null;
  render();
}

render();
