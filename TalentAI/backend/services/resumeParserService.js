const pdfParse = require('pdf-parse');

const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node', 'express', 'mongodb', 'sql',
  'python', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'git', 'html', 'css',
  'tailwind', 'redux', 'graphql', 'next.js', 'vue', 'angular', 'django', 'flask',
];

/**
 * Extracts raw text from a PDF buffer.
 */
const extractText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

/**
 * Very lightweight heuristic parser: looks for section headers and known
 * skill keywords. This is a placeholder — swap in a Gemini-based structured
 * extraction call in a later phase for higher accuracy.
 */
const parseResumeText = (text) => {
  const lower = text.toLowerCase();

  const skills = SKILL_KEYWORDS.filter((skill) => lower.includes(skill));

  const extractSection = (label) => {
    const regex = new RegExp(`${label}[:\\n]([\\s\\S]{0,600}?)(\\n[A-Z][a-zA-Z ]{2,30}\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim().split('\n').filter(Boolean) : [];
  };

  return {
    skills,
    education: extractSection('education'),
    experience: extractSection('experience'),
    projects: extractSection('projects'),
    technologies: skills,
  };
};

module.exports = { extractText, parseResumeText };
