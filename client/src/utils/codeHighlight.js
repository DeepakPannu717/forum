import Prism from 'prismjs';
// Core languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-java';
// C-family languages in correct order
import 'prismjs/components/prism-c';  // Base C language must be imported before C++
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';

// Map of language aliases to their Prism.js language names
const languageMap = {
  'javascript': 'javascript',
  'js': 'javascript',
  'jsx': 'jsx',
  'python': 'python',
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'c++': 'cpp',
  'csharp': 'csharp',
  'cs': 'csharp',
  'c#': 'csharp'
};

export const highlightCode = (code, language = 'javascript') => {
  try {
    // Convert language alias to Prism language name
    const prismLanguage = languageMap[language.toLowerCase()] || 'javascript';
    
    // Ensure the language is loaded
    if (!Prism.languages[prismLanguage]) {
      console.warn(`Language ${prismLanguage} not loaded, falling back to JavaScript`);
      return Prism.highlight(
        code || '',
        Prism.languages.javascript,
        'javascript'
      );
    }
    
    return Prism.highlight(
      code || '',
      Prism.languages[prismLanguage],
      prismLanguage
    );
  } catch (e) {
    console.error('Syntax highlighting error:', e);
    return code || '';
  }
};