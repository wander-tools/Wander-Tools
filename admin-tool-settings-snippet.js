// This code should be added to admin.html after the loadSettings function

// Tool Settings Management
const toolsList = [
    { name: 'Image Resizer', url: 'tools/image-tools/image-resizer.html', category: 'Image Tools' },
    { name: 'Image Format Converter', url: 'tools/image-tools/image-converter.html', category: 'Image Tools' },
    { name: 'Background Remover', url: 'tools/image-tools/background-remover.html', category: 'Image Tools' },
    { name: 'Image Compressor', url: 'tools/image-tools/image-compressor.html', category: 'Image Tools' },
    { name: 'PDF to Word', url: 'tools/file-tools/pdf-to-word.html', category: 'File Tools' },
    { name: 'Word to PDF', url: 'tools/file-tools/word-to-pdf.html', category: 'File Tools' },
    { name: 'Image to PDF', url: 'tools/file-tools/image-to-pdf.html', category: 'File Tools' },
    { name: 'ZIP Extractor', url: 'tools/file-tools/zip-extractor.html', category: 'File Tools' },
    { name: 'CSV/Excel Analyzer', url: 'tools/analytics-tools/csv-excel-analyzer.html', category: 'Analytics Tools' },
    { name: 'Keyword Density & SEO Analyzer', url: 'tools/analytics-tools/keyword-seo-analyzer.html', category: 'Analytics Tools' },
    { name: 'Sentiment Analyzer', url: 'tools/analytics-tools/sentiment-analyzer.html', category: 'Analytics Tools' },
    { name: 'Log File / IP Analyzer', url: 'tools/analytics-tools/log-ip-analyzer.html', category: 'Analytics Tools' },
    { name: 'Readability & Word Frequency Analyzer', url: 'tools/analytics-tools/readability-analyzer.html', category: 'Analytics Tools' },
    { name: 'YouTube Channel Analyzer', url: 'tools/analytics-tools/youtube-analyzer.html', category: 'Analytics Tools' },
    { name: 'Meta Tag Generator', url: 'tools/seo&web-tools/meta-tag-generator.html', category: 'SEO & Web Tools' },
    { name: 'Domain WHOIS Lookup', url: 'tools/seo&web-tools/domain-whois-lookup.html', category: 'SEO & Web Tools' },
    { name: 'URL Shortener', url: 'tools/seo&web-tools/url-shortener.html', category: 'SEO & Web Tools' },
    { name: 'QR Code Generator', url: 'tools/seo&web-tools/qr-code-generator.html', category: 'SEO & Web Tools' },
    { name: 'Calculator', url: 'tools/math&utility-tools/calculator.html', category: 'Math & Utility Tools' },
    { name: 'Unit Converter', url: 'tools/math&utility-tools/unit-converter.html', category: 'Math & Utility Tools' },
    { name: 'Currency Converter', url: 'tools/math&utility-tools/currency-converter.html', category: 'Math & Utility Tools' },
    { name: 'Age Calculator', url: 'tools/math&utility-tools/age-calculator.html', category: 'Math & Utility Tools' },
    { name: 'Word Counter', url: 'tools/text-tools/word-counter.html', category: 'Text Tools' },
    { name: 'Translator', url: 'tools/text-tools/lorem-ipsum.html', category: 'Text Tools' },
    { name: 'Case Converter', url: 'tools/text-tools/case-converter.html', category: 'Text Tools' },
    { name: 'Text Generator', url: 'tools/text-tools/text-encryption.html', category: 'Text Tools' },
    { name: 'Base64 Converter', url: 'tools/developer-tools/base64-converter.html', category: 'Developer Tools' },
    { name: 'JSON to XML Converter', url: 'tools/developer-tools/json-to-xml-converter.html', category: 'Developer Tools' },
    { name: 'Hash Generator', url: 'tools/developer-tools/hash-generator.html', category: 'Developer Tools' },
    { name: 'Json Formatter', url: 'tools/developer-tools/json-formatter.html', category: 'Developer Tools' },
    { name: 'UUID Generator', url: 'tools/developer-tools/uuid-generator.html', category: 'Developer Tools' },
    { name: 'Regex Tester', url: 'tools/developer-tools/regex-tester.html', category: 'Developer Tools' },
    { name: 'Color Picker', url: 'tools/color-tools/color-picker.html', category: 'Color Tools' },
    { name: 'Color Palette Generator', url: 'tools/color-tools/color-palettes.html', category: 'Color Tools' },
    { name: 'Color Converter', url: 'tools/color-tools/color-combinator.html', category: 'Color Tools' },
    { name: 'Contrast Checker', url: 'tools/color-tools/color-code-generator.html', category: 'Color Tools' }
];

let toolSettings = {};

async function loadToolSettings(){
    try {
        const doc = await db.collection('settings').doc('tools').get();
        if (doc.exists) {
            toolSettings = doc.data() || {};
        } else {
            toolSettings = {};
        }
        renderToolsList();
    } catch(_) {
        toolSettings = {};
        renderToolsList();
    }
}

function renderToolsList(){
    const container = document.getElementById('toolsList');
    if (!container) return;
    container.innerHTML = '';
    
    // Group tools by category
    const byCategory = {};
    toolsList.forEach(tool => {
        if (!byCategory[tool.category]) {
            byCategory[tool.category] = [];
        }
        byCategory[tool.category].push(tool);
    });
    
    Object.keys(byCategory).sort().forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.marginBottom = '16px';
        categoryDiv.innerHTML = `<h4 style="margin:0 0 8px 0; color:var(--primary); border-bottom:2px solid var(--primary); padding-bottom:4px;">${esc(category)}</h4>`;
        const toolsDiv = document.createElement('div');
        toolsDiv.style.display = 'grid';
        toolsDiv.style.gap = '6px';
        
        byCategory[category].forEach(tool => {
            const toolId = tool.url.replace(/[\/\.]/g, '_');
            const requireLogin = toolSettings[toolId] === true;
            const toolItem = document.createElement('label');
            toolItem.style.cssText = 'display:flex; align-items:center; gap:10px; padding:8px 12px; background:#f8f9fa; border-radius:8px; cursor:pointer; transition:background .2s;';
            toolItem.style.userSelect = 'none';
            toolItem.innerHTML = `
                <input type="checkbox" data-tool-id="${toolId}" ${requireLogin ? 'checked' : ''} style="cursor:pointer;">
                <span style="flex:1; font-weight:500;">${esc(tool.name)}</span>
                <span style="font-size:12px; color:var(--muted);">${esc(tool.url)}</span>
            `;
            toolItem.addEventListener('mouseenter', () => { toolItem.style.background = '#eef1f6'; });
            toolItem.addEventListener('mouseleave', () => { toolItem.style.background = '#f8f9fa'; });
            toolsDiv.appendChild(toolItem);
        });
        
        categoryDiv.appendChild(toolsDiv);
        container.appendChild(categoryDiv);
    });
}

document.getElementById('enableAllTools').addEventListener('click', () => {
    toolsList.forEach(tool => {
        const toolId = tool.url.replace(/[\/\.]/g, '_');
        toolSettings[toolId] = true;
    });
    renderToolsList();
    document.getElementById('toolsMsg').textContent = 'All tools enabled for login requirement. Click "Save Changes" to apply.';
    setTimeout(() => document.getElementById('toolsMsg').textContent = '', 3000);
});

document.getElementById('disableAllTools').addEventListener('click', () => {
    toolsList.forEach(tool => {
        const toolId = tool.url.replace(/[\/\.]/g, '_');
        toolSettings[toolId] = false;
    });
    renderToolsList();
    document.getElementById('toolsMsg').textContent = 'All tools disabled for login requirement. Click "Save Changes" to apply.';
    setTimeout(() => document.getElementById('toolsMsg').textContent = '', 3000);
});

document.getElementById('saveToolSettings').addEventListener('click', withLoading(document.getElementById('saveToolSettings'), async () => {
    // Collect current checkbox states
    const checkboxes = document.querySelectorAll('#toolsList input[type="checkbox"]');
    checkboxes.forEach(cb => {
        const toolId = cb.getAttribute('data-tool-id');
        toolSettings[toolId] = cb.checked;
    });
    
    try {
        await db.collection('settings').doc('tools').set(toolSettings, { merge: true });
        document.getElementById('toolsMsg').textContent = 'Tool settings saved successfully!';
        document.getElementById('toolsMsg').style.color = 'var(--success)';
        setTimeout(() => {
            document.getElementById('toolsMsg').textContent = '';
            document.getElementById('toolsMsg').style.color = '';
        }, 3000);
    } catch(_) {
        document.getElementById('toolsMsg').textContent = 'Failed to save tool settings.';
        document.getElementById('toolsMsg').style.color = 'var(--danger)';
    }
}));


