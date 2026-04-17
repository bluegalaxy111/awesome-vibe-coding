let masterData = [];
let allTools = [];
let favorites = new Set(JSON.parse(localStorage.getItem('vibe_favorites') || '[]'));
let compareList = new Set();
let currentView = localStorage.getItem('vibe_view') || 'grid';

const CLI_SNIPPETS = {
    "Claude Code": "npm install -g @anthropic-ai/claude-code",
    "Aider": "python -m pip install aider-chat",
    "Codex CLI": "npm install -g @openai/codex-cli",
    "Gemini CLI": "npm install -g @google/gemini-cli"
};

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupSearch();
    setupShortcuts();
    setupRouting();
    applyViewMode(currentView);
});

async function loadData() {
    try {
        const response = await fetch('data/tools.json');
        const data = await response.json();
        
        data.categories.forEach(category => {
            const catObj = { name: category.name, tools: [] };
            if (category.tools) catObj.tools.push(...category.tools);
            if (category.subcategories) {
                category.subcategories.forEach(sub => {
                    if (sub.tools) catObj.tools.push(...sub.tools);
                });
            }
            masterData.push(catObj);
            allTools.push(...catObj.tools);
        });

        document.getElementById('categoryCount').innerText = masterData.length;
        renderSidebar();
        
        if (!window.location.hash) {
            renderTools(allTools, "All Tools");
        }
    } catch (e) {
        console.error("Failed to load", e);
    }
}

function renderSidebar() {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    
    // Add "All Tools"
    createSidebarItem(list, 'All Categories', allTools.length, () => {
        document.getElementById('searchInput').value = '';
        renderTools(allTools, "All Tools");
    });
    
    // Add "My Stack (Favorites)"
    const favCount = allTools.filter(t => favorites.has(t.name)).length;
    createSidebarItem(list, '💖 My Stack', favCount, () => {
        const favTools = allTools.filter(t => favorites.has(t.name));
        renderTools(favTools, "My Stack (Favorites)");
    });

    masterData.forEach(cat => {
        if (cat.tools.length > 0) {
            createSidebarItem(list, cat.name, cat.tools.length, () => renderTools(cat.tools, cat.name));
        }
    });
}

function createSidebarItem(parent, text, count, onClick) {
    const li = document.createElement('li');
    li.className = 'category-item' + (text === 'All Categories' ? ' active' : '');
    li.innerHTML = `<span>${text}</span> <span class="count-badge">${count}</span>`;
    li.onclick = () => {
        document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        document.getElementById('searchInput').value = '';
        applyFilters(); 
        
        // Smoothly scroll back to the top of the grid so user isn't stuck at bottom
        window.scrollTo({ top: document.querySelector('.results-header').offsetTop - 120, behavior: 'smooth' });
    };
    parent.appendChild(li);
}

function renderTools(toolsToRender, title) {
    const grid = document.getElementById('toolsGrid');
    document.getElementById('currentCategoryTitle').innerText = title;
    document.getElementById('resultsCount').innerText = `${toolsToRender.length} tools found`;
    document.getElementById('didYouMean').style.display = 'none';
    
    // Apply checkboxes filters natively
    const freeOnly = document.getElementById('filterFree').checked;
    const osOnly = document.getElementById('filterOpenSource').checked;
    const noCodeOnly = document.getElementById('filterNoCode').checked;
    
    toolsToRender = toolsToRender.filter(t => {
        if (freeOnly && (!t.tags || (!t.tags.includes('Free') && !t.tags.includes('Free, open-source')))) return false;
        if (osOnly && (!t.tags || !t.tags.some(tag => tag.toLowerCase().includes('open-source')))) return false;
        if (noCodeOnly && (!t.tags || !t.tags.includes('No-Code'))) return false;
        return true;
    });

    grid.innerHTML = '';
    if (toolsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p class="tool-desc" style="font-size:1.1rem; margin-bottom:1rem;">No tools found matching your filters.</p>
                <button class="tool-link-btn" onclick="setSearchQuery(''); document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false); applyFilters();">Clear Filters</button>
            </div>`;
        
        // Did you mean logic
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (query.length > 3 && !freeOnly && !osOnly && !noCodeOnly) {
            const bestMatch = findBestMatch(query);
            if (bestMatch) {
                const dym = document.getElementById('didYouMean');
                dym.innerHTML = `0 results. Did you mean: <button onclick="setSearchQuery('${bestMatch.name}')">${bestMatch.name}</button>?`;
                dym.style.display = 'block';
            }
        }
        return;
    }

    toolsToRender.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.id = `tool-${tool.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
        
        const isFav = favorites.has(tool.name);
        const isComp = compareList.has(tool.name);
        
        let tagsHtml = tool.personal_pick ? `<span class="tool-tag personal-pick" onclick="setSearchQuery('⭐ Personal Pick')">⭐ Personal Pick</span>` : '';
        if (tool.tags) {
            tool.tags.forEach(tag => {
                let cleanTag = tag.trim().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('Mac Only', 'Mac');
                tagsHtml += `<span class="tool-tag" onclick="setSearchQuery('${cleanTag}')">${cleanTag}</span>`;
            });
        }

        let cliHtml = '';
        if (CLI_SNIPPETS[tool.name]) {
            cliHtml = `
            <div class="cli-snippet" onclick="event.stopPropagation()">
                <code>${CLI_SNIPPETS[tool.name]}</code>
                <button onclick="copyText('${CLI_SNIPPETS[tool.name]}', this)">Copy</button>
            </div>`;
        }

        card.innerHTML = `
            <div class="tool-header">
                <div>
                    <a href="${tool.url}" target="_blank" class="tool-title">${tool.name}</a>
                    <div class="tool-actions-top">
                        <button class="btn-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite('${tool.name}', this)" title="Save to My Stack">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                        <button class="btn-icon" onclick="shareTool('${card.id}', this)" title="Copy Link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        </button>
                    </div>
                </div>
                <a href="${tool.url}" target="_blank" class="tool-link-btn">
                    Visit <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
            <p class="tool-desc">${tool.description}</p>
            ${cliHtml}
            <div class="tool-footer">
                ${tagsHtml}
                <label class="compare-checkbox-container" style="margin-left:auto;">
                    <input type="checkbox" ${isComp ? 'checked' : ''} onchange="toggleCompare('${tool.name}', this.checked)"> Compare
                </label>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => applyFilters());
    
    // Escape key to clear search instantly
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setSearchQuery('');
            input.blur();
        }
    });
}

window.applyFilters = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    // Find active category text by strictly reading the first span (ignoring the count span)
    const activeCatEl = document.querySelector('.category-item.active');
    const firstSpan = activeCatEl ? activeCatEl.querySelector('span') : null;
    const activeText = firstSpan ? firstSpan.innerText : 'All Categories';
    
    let baseTools = allTools;
    if (activeText === '💖 My Stack') {
        baseTools = allTools.filter(t => favorites.has(t.name));
    } else if (activeText !== 'All Categories') {
        const catObj = masterData.find(c => c.name === activeText);
        if (catObj) baseTools = catObj.tools;
    }

    const filtered = baseTools.filter(tool => {
        if (query.includes('personal pick') || query.includes('⭐')) return tool.personal_pick;
        const nameMatch = tool.name.toLowerCase().includes(query);
        const descMatch = tool.description.toLowerCase().includes(query);
        const tagMatch = tool.tags ? tool.tags.some(t => t.toLowerCase().replace('-',' ').includes(query) || query.includes(t.toLowerCase())) : false;
        return nameMatch || descMatch || tagMatch;
    });
    
    let title = query ? `Search in ${activeText}` : activeText;
    renderTools(filtered, title);
}

window.setSearchQuery = function(query) {
    document.getElementById('searchInput').value = query;
    // When doing a global click via feeling lucky or tags or quick filters, usually want to search ALL
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.category-item').classList.add('active'); // Reset to "All Categories"
    applyFilters();
    window.scrollTo({ top: document.querySelector('.results-header').offsetTop - 120, behavior: 'smooth' });
};

window.feelingLucky = function() {
    setSearchQuery(allTools[Math.floor(Math.random() * allTools.length)].name);
};

/* View Mode Toggle */
window.setViewMode = function(mode) {
    currentView = mode;
    localStorage.setItem('vibe_view', mode);
    applyViewMode(mode);
}

function applyViewMode(mode) {
    const grid = document.getElementById('toolsGrid');
    document.getElementById('btnGrid').classList.toggle('active', mode === 'grid');
    document.getElementById('btnList').classList.toggle('active', mode === 'list');
    if (mode === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

/* LocalStorage Favorites */
window.toggleFavorite = function(toolName, btn) {
    if (favorites.has(toolName)) {
        favorites.delete(toolName);
        btn.classList.remove('active');
        showToast("Removed from My Stack");
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    } else {
        favorites.add(toolName);
        btn.classList.add('active');
        showToast("Saved to My Stack ❤️");
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    }
    localStorage.setItem('vibe_favorites', JSON.stringify([...favorites]));
    
    // Update My Stack count
    const favCount = document.querySelectorAll('.category-item')[1].querySelector('.count-badge');
    if (favCount) favCount.innerText = favorites.size;
}

/* Comparisons */
window.toggleCompare = function(toolName, isChecked) {
    if (isChecked) {
        if (compareList.size >= 3) {
            alert("You can only compare up to 3 tools at once.");
            event.target.checked = false;
            return;
        }
        compareList.add(toolName);
    } else {
        compareList.delete(toolName);
    }
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compareBar');
    document.getElementById('compareCount').innerText = compareList.size;
    if (compareList.size > 0) bar.classList.remove('hidden');
    else bar.classList.add('hidden');
}

window.clearCompare = function() {
    compareList.clear();
    updateCompareBar();
    applyFilters(); // Re-render to uncheck boxes
}

window.openCompareModal = function() {
    const modal = document.getElementById('compareModal');
    const table = document.getElementById('compareTable');
    
    let html = `<tr><th>Feature</th>`;
    const tools = Array.from(compareList).map(name => allTools.find(t => t.name === name));
    
    tools.forEach(t => html += `<th><h3>${t.name}</h3><a href="${t.url}" target="_blank" style="color:var(--primary); font-size:0.8rem;">Visit Site</a></th>`);
    html += `</tr><tr><td>Description</td>`;
    tools.forEach(t => html += `<td>${t.description}</td>`);
    html += `</tr><tr><td>Tags / Pricing</td>`;
    tools.forEach(t => html += `<td>${t.tags ? t.tags.join(', ') : 'N/A'}</td>`);
    html += `</tr><tr><td>Personal Pick</td>`;
    tools.forEach(t => html += `<td>${t.personal_pick ? '⭐ Yes' : '-'}</td>`);
    html += `</tr>`;
    
    table.innerHTML = html;
    modal.showModal();
}

window.closeCompareModal = function() {
    document.getElementById('compareModal').close();
}

/* Utilities (Routing, Shortcuts, Copy) */
function setupRouting() {
    window.addEventListener('hashchange', handleHash);
    setTimeout(handleHash, 500); // Wait for render
}

function handleHash() {
    if (window.location.hash.startsWith('#tool-')) {
        const id = window.location.hash.substring(1);
        const card = document.getElementById(id);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.boxShadow = '0 0 0 2px var(--primary)';
            setTimeout(() => card.style.boxShadow = '', 2000);
        }
    }
}

window.shareTool = function(cardId, btn) {
    const url = window.location.origin + window.location.pathname + '#' + cardId;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard! 📋");
}

window.copyText = function(text, btn) {
    navigator.clipboard.writeText(text);
    showToast("Command copied! 🚀");
}

window.showToast = function(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function setupShortcuts() {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
}

/* Lightweight Levenshtein Distance for "Did You Mean?" */
function findBestMatch(query) {
    let bestMatch = null;
    let minDistance = Infinity;
    
    allTools.forEach(t => {
        const d = levenshtein(query, t.name.toLowerCase());
        if (d < minDistance && d <= 3) { // Max 3 typos allowed
            minDistance = d;
            bestMatch = t;
        }
    });
    return bestMatch;
}

function levenshtein(a, b) {
    const matrix = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i-1] === b[j-1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i-1][j]+1, matrix[i][j-1]+1, matrix[i-1][j-1]+cost);
        }
    }
    return matrix[a.length][b.length];
}
