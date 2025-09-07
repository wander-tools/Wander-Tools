# Advanced Word Counter Tool

A comprehensive, modern web-based word counting tool with advanced text analysis features. Built with vanilla HTML, CSS, and JavaScript.

## Features

### Core Functionality
- **Real-time word counting** - Updates as you type
- **Multiple input methods** - Text input and file upload
- **Comprehensive statistics** - Words, characters, sentences, paragraphs
- **Reading time estimation** - Based on average reading speed

### Advanced Analysis
- **Text metrics** - Average words per sentence, characters per word
- **Word analysis** - Longest and shortest words
- **Word frequency** - Most common words (excluding stop words)
- **Smart filtering** - Removes common words for better insights

### Export Options
- **TXT format** - Human-readable report
- **JSON format** - Machine-readable data
- **CSV format** - Spreadsheet-compatible data

### User Experience
- **Modern UI** - Beautiful, responsive design
- **Tabbed interface** - Easy switching between input methods
- **Drag & drop** - File upload with visual feedback
- **Mobile-friendly** - Responsive design for all devices

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local server) or any web server

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Start a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Node.js (if you have it installed)
npx serve .

# Or using PHP
php -S localhost:8000
```

4. Open your browser and go to `http://localhost:8000`

### Usage

1. **Text Input**: Type or paste your text in the text area
2. **File Upload**: Click "Browse Files" or drag and drop a text file
3. **Analysis**: Statistics update automatically as you type
4. **Export**: Use the export buttons to download your analysis

## Supported File Types

- `.txt` - Plain text files
- `.md` - Markdown files
- `.doc` / `.docx` - Word documents (basic support)
- `.pdf` - PDF files (limited support)

## Technical Details

### Architecture
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **No dependencies** - Pure client-side application
- **Responsive design** - CSS Grid and Flexbox
- **Modern JavaScript** - ES6 classes and modules

### Performance
- **Real-time analysis** - Optimized for live updates
- **Efficient algorithms** - Fast text processing
- **Memory efficient** - Handles large texts smoothly

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## API Reference

The tool exposes a `WordCounter` class that can be used programmatically:

```javascript
const counter = new WordCounter();
counter.text = "Your text here";
counter.analyzeText();
console.log(counter.stats);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Basic word counting functionality
- Advanced text analysis
- Export capabilities
- Modern UI design
- File upload support

## Support

If you encounter any issues or have questions, please:
1. Check the browser console for errors
2. Ensure you're using a supported browser
3. Try refreshing the page
4. Create an issue on GitHub

## Roadmap

- [ ] PDF text extraction
- [ ] More export formats (XML, RTF)
- [ ] Text comparison tools
- [ ] Writing goals and progress tracking
- [ ] Cloud storage integration
- [ ] Advanced text statistics
- [ ] Multi-language support
