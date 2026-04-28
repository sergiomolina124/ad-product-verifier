// ---- Working config (in-memory, not yet saved) ----

let workingConfig = JSON.parse(JSON.stringify(getConfig()));
let isDirty = false;

function markDirty() {
  isDirty = true;
  document.getElementById('unsavedBar').style.display = 'flex';
}

function markClean() {
  isDirty = false;
  document.getElementById('unsavedBar').style.display = 'none';
}

// Save
document.getElementById('saveBtn').addEventListener('click', () => {
  saveConfig(workingConfig);
  markClean();
  const saved = document.getElementById('topbarSaved');
  saved.classList.add('visible');
  setTimeout(() => saved.classList.remove('visible'), 2000);
});

// Discard
document.getElementById('discardBtn').addEventListener('click', () => {
  if (!confirm('Discard all unsaved changes?')) return;
  workingConfig = JSON.parse(JSON.stringify(getConfig()));
  markClean();
  renderAll();
  const activeTab = document.querySelector('.nav-btn.active')?.dataset.tab;
  if (activeTab === 'recommendations') renderMatrix();
  if (activeTab === 'settings') renderPlatforms();
});

// ---- Tab navigation ----

const tabTitles = { options: 'Options', recommendations: 'Recommendations', settings: 'Settings' };

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tab-' + this.dataset.tab).classList.add('active');
    document.getElementById('topbarTitle').textContent = tabTitles[this.dataset.tab];
    if (this.dataset.tab === 'recommendations') renderMatrix();
    if (this.dataset.tab === 'settings') renderPlatforms();
  });
});

// ---- Add buttons (options tab) ----

document.querySelectorAll('[data-action="add"]').forEach(btn => {
  btn.addEventListener('click', () => addItem(btn.dataset.section));
});

// ---- Render all option lists ----

function renderAll() {
  renderList('ssps');
  renderList('dsps');
  renderList('transactionTypes');
  renderList('geographies');
  renderList('adProducts');
}

function renderList(section) {
  const items = workingConfig[section];
  const listId = { ssps: 'ssp-list', dsps: 'dsp-list', transactionTypes: 'tx-list', geographies: 'geo-list', adProducts: 'ap-list' }[section];
  const el = document.getElementById(listId);

  if (!items.length) {
    el.innerHTML = '<p class="empty">Nothing configured yet.</p>';
    return;
  }

  el.innerHTML = items.map(item => buildItemRow(section, item)).join('');
}

function buildItemRow(section, item) {
  const nameField = `<input type="text" value="${item.name}" data-section="${section}" data-id="${item.id}" data-field="name" />`;

  let extras = '';

  if (section === 'ssps') {
    extras = `
      <select data-section="ssps" data-id="${item.id}" data-field="action">
        <option value="proceed"  ${item.action === 'proceed'  ? 'selected' : ''}>Proceed to DSP</option>
        <option value="external" ${item.action === 'external' ? 'selected' : ''}>Build externally</option>
      </select>`;
  }

  if (section === 'dsps') {
    const platformOptions = workingConfig.platforms.map(p =>
      `<option value="${p}" ${item.platform === p ? 'selected' : ''}>${p}</option>`
    ).join('');
    extras = `
      <select data-section="dsps" data-id="${item.id}" data-field="action">
        <option value="proceed" ${item.action === 'proceed' ? 'selected' : ''}>Proceed to transaction</option>
        <option value="direct"  ${item.action === 'direct'  ? 'selected' : ''}>Direct to platform</option>
      </select>
      ${item.action === 'direct' ? `<select data-section="dsps" data-id="${item.id}" data-field="platform">${platformOptions}</select>` : '<span class="row-spacer"></span>'}`;
  }

  if (section === 'transactionTypes') {
    extras = `
      <label class="checkbox-label">
        <input type="checkbox" ${item.requiresGeography ? 'checked' : ''} data-section="transactionTypes" data-id="${item.id}" data-field="requiresGeography" />
        Requires geography
      </label>`;
  }

  return `
    <div class="item-row">
      ${nameField}
      ${extras}
      <button class="btn-delete" data-action="delete" data-section="${section}" data-id="${item.id}">Delete</button>
    </div>`;
}

// ---- Delegated change/click handling for option lists ----

document.querySelector('.admin-content').addEventListener('change', function (e) {
  const el = e.target;
  const { section, id, field } = el.dataset;
  if (!section || !id || !field) return;

  const item = workingConfig[section].find(i => i.id === id);
  if (!item) return;

  if (field === 'requiresGeography') {
    item.requiresGeography = el.checked;
  } else if (field === 'action' && section === 'dsps') {
    const oldAction = item.action;
    item.action = el.value;
    if (el.value === 'proceed' && oldAction !== 'proceed') addRecsForDSP(item);
    if (el.value !== 'proceed' && oldAction === 'proceed') removeRecsForDSP(id);
    if (el.value === 'direct' && !item.platform) item.platform = workingConfig.platforms[0] || 'Platform 1';
    markDirty();
    renderList('dsps');
    return;
  } else {
    item[field] = el.value;
  }

  markDirty();
});

document.querySelector('.admin-content').addEventListener('click', function (e) {
  const btn = e.target.closest('[data-action="delete"]');
  if (!btn) return;
  const { section, id } = btn.dataset;
  if (!confirm('Delete this item?')) return;

  workingConfig[section] = workingConfig[section].filter(i => i.id !== id);
  if (section === 'dsps')             removeRecsForDSP(id);
  if (section === 'transactionTypes') removeRecsForTX(id);
  if (section === 'adProducts')       removeRecsForAP(id);
  markDirty();
  renderAll();
});

// ---- Add item ----

function addItem(section) {
  const id = generateId();
  const defaults = {
    ssps:             { id, name: 'New SSP',              action: 'proceed' },
    dsps:             { id, name: 'New DSP',              action: 'proceed' },
    transactionTypes: { id, name: 'New Transaction Type', requiresGeography: false },
    geographies:      { id, name: 'New Geography' },
    adProducts:       { id, name: 'New Ad Product' },
  };
  workingConfig[section].push(defaults[section]);
  if (section === 'dsps')             addRecsForDSP(defaults[section]);
  if (section === 'transactionTypes') addRecsForTX(defaults[section]);
  if (section === 'adProducts')       addRecsForAP(defaults[section]);
  markDirty();
  renderAll();
}

// ---- Recommendation helpers ----

function defaultPlatform() {
  return workingConfig.platforms[1] || workingConfig.platforms[0] || 'Platform 2';
}

function addRecsForDSP(dsp) {
  if (dsp.action !== 'proceed') return;
  workingConfig.transactionTypes.forEach(tx => {
    workingConfig.adProducts.forEach(ap => {
      const key = `${dsp.id}|${tx.id}|${ap.id}`;
      if (!(key in workingConfig.recommendations)) workingConfig.recommendations[key] = defaultPlatform();
    });
  });
}

function addRecsForTX(tx) {
  workingConfig.dsps.filter(d => d.action === 'proceed').forEach(dsp => {
    workingConfig.adProducts.forEach(ap => {
      const key = `${dsp.id}|${tx.id}|${ap.id}`;
      if (!(key in workingConfig.recommendations)) workingConfig.recommendations[key] = defaultPlatform();
    });
  });
}

function addRecsForAP(ap) {
  workingConfig.dsps.filter(d => d.action === 'proceed').forEach(dsp => {
    workingConfig.transactionTypes.forEach(tx => {
      const key = `${dsp.id}|${tx.id}|${ap.id}`;
      if (!(key in workingConfig.recommendations)) workingConfig.recommendations[key] = defaultPlatform();
    });
  });
}

function removeRecsForDSP(dspId) {
  Object.keys(workingConfig.recommendations).forEach(k => { if (k.startsWith(dspId + '|')) delete workingConfig.recommendations[k]; });
}

function removeRecsForTX(txId) {
  Object.keys(workingConfig.recommendations).forEach(k => { if (k.split('|')[1] === txId) delete workingConfig.recommendations[k]; });
}

function removeRecsForAP(apId) {
  Object.keys(workingConfig.recommendations).forEach(k => { if (k.split('|')[2] === apId) delete workingConfig.recommendations[k]; });
}

// ---- Recommendation matrix ----

function renderMatrix() {
  const el = document.getElementById('rec-matrix');
  const proceedDSPs = workingConfig.dsps.filter(d => d.action === 'proceed');

  if (!proceedDSPs.length || !workingConfig.transactionTypes.length || !workingConfig.adProducts.length) {
    el.innerHTML = '<p class="empty">Add DSPs (set to "Proceed"), transaction types, and ad products to configure recommendations.</p>';
    return;
  }

  const rows = proceedDSPs.flatMap(dsp => workingConfig.transactionTypes.map(tx => ({ dsp, tx })));

  el.innerHTML = `
    <div class="matrix-scroll">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>DSP / Transaction</th>
            ${workingConfig.adProducts.map(ap => `<th>${ap.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(({ dsp, tx }) => `
            <tr>
              <td class="row-label">${dsp.name} / ${tx.name}</td>
              ${workingConfig.adProducts.map(ap => {
                const key = `${dsp.id}|${tx.id}|${ap.id}`;
                const cur = workingConfig.recommendations[key] || defaultPlatform();
                return `<td>
                  <select data-dsp="${dsp.id}" data-tx="${tx.id}" data-ap="${ap.id}">
                    ${workingConfig.platforms.map(p => `<option ${cur === p ? 'selected' : ''}>${p}</option>`).join('')}
                  </select>
                </td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

document.getElementById('rec-matrix').addEventListener('change', function (e) {
  const sel = e.target.closest('select[data-dsp]');
  if (!sel) return;
  workingConfig.recommendations[`${sel.dataset.dsp}|${sel.dataset.tx}|${sel.dataset.ap}`] = sel.value;
  markDirty();
});

// ---- Platforms ----

document.getElementById('addPlatformBtn').addEventListener('click', () => {
  workingConfig.platforms.push('New Platform');
  markDirty();
  renderPlatforms();
});

function renderPlatforms() {
  const el = document.getElementById('platform-list');
  if (!workingConfig.platforms.length) { el.innerHTML = '<p class="empty">No platforms configured.</p>'; return; }
  el.innerHTML = workingConfig.platforms.map((p, i) => `
    <div class="item-row">
      <input type="text" value="${p}" data-platform-index="${i}" />
      <button class="btn-delete" data-platform-delete="${i}">Delete</button>
    </div>`).join('');
}

document.getElementById('platform-list').addEventListener('change', function (e) {
  const el = e.target;
  const idx = el.dataset.platformIndex;
  if (idx === undefined) return;
  const old = workingConfig.platforms[idx];
  workingConfig.platforms[idx] = el.value;
  Object.keys(workingConfig.recommendations).forEach(k => { if (workingConfig.recommendations[k] === old) workingConfig.recommendations[k] = el.value; });
  workingConfig.dsps.forEach(d => { if (d.platform === old) d.platform = el.value; });
  markDirty();
});

document.getElementById('platform-list').addEventListener('click', function (e) {
  const btn = e.target.closest('[data-platform-delete]');
  if (!btn) return;
  if (!confirm('Delete this platform?')) return;
  workingConfig.platforms.splice(Number(btn.dataset.platformDelete), 1);
  markDirty();
  renderPlatforms();
});

// ---- Reset ----

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all configuration to defaults? This cannot be undone.')) return;
  localStorage.removeItem(CONFIG_KEY);
  workingConfig = JSON.parse(JSON.stringify(getConfig()));
  markClean();
  renderAll();
  renderPlatforms();
});

// ---- Init ----

renderAll();
