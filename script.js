class WordCounter {
    constructor() {
        this.text = '';
        this.stats = {};
        this.initializeEventListeners();
        this.initializeTabs();
    }

    initializeEventListeners() {
        const textInput = document.getElementById('textInput');
        const clearBtn = document.getElementById('clearBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');
        const exportTxt = document.getElementById('exportTxt');
        const exportJson = document.getElementById('exportJson');
        const exportCsv = document.getElementById('exportCsv');

        // Real-time analysis
        textInput.addEventListener('input', () => {
            this.text = textInput.value;
            this.analyzeText();
        });

        clearBtn.addEventListener('click', () => {
            this.clearText();
        });

        analyzeBtn.addEventListener('click', () => {
            this.analyzeText();
        });

        // File upload
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#667eea';
            fileUploadArea.style.backgroundColor = '#f8f9ff';
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#ccc';
            fileUploadArea.style.backgroundColor = 'transparent';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#ccc';
            fileUploadArea.style.backgroundColor = 'transparent';
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });

        // Export functionality
        exportTxt.addEventListener('click', () => this.exportAsTxt());
        exportJson.addEventListener('click', () => this.exportAsJson());
        exportCsv.addEventListener('click', () => this.exportAsCsv());
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    async handleFileUpload(file) {
        if (!file) return;

        const fileType = file.type;
        let text = '';

        try {
            if (fileType === 'text/plain' || fileType === 'text/markdown') {
                text = await this.readTextFile(file);
            } else if (fileType === 'application/pdf') {
                // For PDF files, we'll show a message since PDF parsing requires additional libraries
                alert('PDF files are not supported in this demo. Please use a text file (.txt) or markdown file (.md).');
                return;
            } else {
                alert('Unsupported file type. Please use .txt or .md files.');
                return;
            }

            this.text = text;
            document.getElementById('textInput').value = text;
            this.analyzeText();
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
        }
    }

    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    analyzeText() {
        if (!this.text.trim()) {
            this.resetStats();
            return;
        }

        this.stats = this.calculateStats(this.text);
        this.updateDisplay();
    }

    calculateStats(text) {
        // Basic counts
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);

        // Reading time (average 200 words per minute)
        const readingTime = Math.ceil(words.length / 200);

        // Advanced analysis
        const avgWordsPerSentence = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0;
        const avgCharsPerWord = words.length > 0 ? (charactersNoSpaces / words.length).toFixed(1) : 0;

        // Find longest and shortest words
        const longestWord = words.length > 0 ? words.reduce((a, b) => a.length > b.length ? a : b) : '';
        const shortestWord = words.length > 0 ? words.reduce((a, b) => a.length < b.length ? a : b) : '';

        // Word frequency analysis
        const wordFreq = this.calculateWordFrequency(words);

        return {
            words: words.length,
            characters,
            charactersNoSpaces,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            readingTime,
            avgWordsPerSentence,
            avgCharsPerWord,
            longestWord,
            shortestWord,
            wordFreq
        };
    }

    calculateWordFrequency(words) {
        const freq = {};
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
            'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
        ]);

        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
                freq[cleanWord] = (freq[cleanWord] || 0) + 1;
            }
        });

        // Sort by frequency and return top 10
        return Object.entries(freq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }

    updateDisplay() {
        // Update basic stats
        document.getElementById('wordCount').textContent = this.stats.words || 0;
        document.getElementById('charCount').textContent = this.stats.characters || 0;
        document.getElementById('charNoSpacesCount').textContent = this.stats.charactersNoSpaces || 0;
        document.getElementById('paragraphCount').textContent = this.stats.paragraphs || 0;
        document.getElementById('sentenceCount').textContent = this.stats.sentences || 0;
        document.getElementById('readingTime').textContent = this.stats.readingTime || 0;

        // Update advanced stats
        document.getElementById('avgWordsPerSentence').textContent = this.stats.avgWordsPerSentence || 0;
        document.getElementById('avgCharsPerWord').textContent = this.stats.avgCharsPerWord || 0;
        document.getElementById('longestWord').textContent = this.stats.longestWord || '-';
        document.getElementById('shortestWord').textContent = this.stats.shortestWord || '-';

        // Update word frequency
        this.updateWordFrequency();
    }

    updateWordFrequency() {
        const container = document.getElementById('wordFrequency');
        
        if (this.stats.wordFreq && this.stats.wordFreq.length > 0) {
            container.innerHTML = this.stats.wordFreq
                .map(item => `
                    <div class="word-item">
                        <span>${item.word}</span>
                        <span>${item.count}</span>
                    </div>
                `).join('');
        } else {
            container.innerHTML = '<p class="no-data">No data available</p>';
        }
    }

    resetStats() {
        const elements = [
            'wordCount', 'charCount', 'charNoSpacesCount', 'paragraphCount',
            'sentenceCount', 'readingTime', 'avgWordsPerSentence', 'avgCharsPerWord',
            'longestWord', 'shortestWord'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = id.includes('Word') ? '-' : '0';
            }
        });

        document.getElementById('wordFrequency').innerHTML = '<p class="no-data">No data available</p>';
    }

    clearText() {
        this.text = '';
        document.getElementById('textInput').value = '';
        this.resetStats();
    }

    exportAsTxt() {
        if (!this.stats.words) {
            alert('No data to export. Please analyze some text first.');
            return;
        }

        const report = this.generateTextReport();
        this.downloadFile(report, 'word-count-report.txt', 'text/plain');
    }

    exportAsJson() {
        if (!this.stats.words) {
            alert('No data to export. Please analyze some text first.');
            return;
        }

        const data = {
            timestamp: new Date().toISOString(),
            text: this.text,
            stats: this.stats
        };

        this.downloadFile(JSON.stringify(data, null, 2), 'word-count-data.json', 'application/json');
    }

    exportAsCsv() {
        if (!this.stats.words) {
            alert('No data to export. Please analyze some text first.');
            return;
        }

        const csv = this.generateCsvReport();
        this.downloadFile(csv, 'word-count-report.csv', 'text/csv');
    }

    generateTextReport() {
        return `Word Count Analysis Report
Generated: ${new Date().toLocaleString()}

BASIC STATISTICS:
- Words: ${this.stats.words}
- Characters: ${this.stats.characters}
- Characters (no spaces): ${this.stats.charactersNoSpaces}
- Sentences: ${this.stats.sentences}
- Paragraphs: ${this.stats.paragraphs}
- Reading Time: ${this.stats.readingTime} minutes

ADVANCED ANALYSIS:
- Average words per sentence: ${this.stats.avgWordsPerSentence}
- Average characters per word: ${this.stats.avgCharsPerWord}
- Longest word: ${this.stats.longestWord}
- Shortest word: ${this.stats.shortestWord}

MOST COMMON WORDS:
${this.stats.wordFreq.map(item => `- ${item.word}: ${item.count}`).join('\n')}

ORIGINAL TEXT:
${this.text}`;
    }

    generateCsvReport() {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Words', this.stats.words],
            ['Characters', this.stats.characters],
            ['Characters (no spaces)', this.stats.charactersNoSpaces],
            ['Sentences', this.stats.sentences],
            ['Paragraphs', this.stats.paragraphs],
            ['Reading Time (minutes)', this.stats.readingTime],
            ['Average words per sentence', this.stats.avgWordsPerSentence],
            ['Average characters per word', this.stats.avgCharsPerWord],
            ['Longest word', this.stats.longestWord],
            ['Shortest word', this.stats.shortestWord]
        ];

        const wordFreqRows = this.stats.wordFreq.map(item => ['Word Frequency', `${item.word}: ${item.count}`]);
        
        return [headers, ...rows, ...wordFreqRows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the word counter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordCounter();
});
