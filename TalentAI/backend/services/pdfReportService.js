const PDFDocument = require('pdfkit');

const ACCENT = '#3B82F6';
const MUTED = '#64748B';
const DARK = '#0F172A';
const SUCCESS = '#16A34A';
const ERROR = '#DC2626';

const METRIC_LABELS = {
  confidence: 'Confidence',
  communication: 'Communication',
  grammar: 'Grammar',
  technicalKnowledge: 'Technical Knowledge',
  fluency: 'Fluency',
  keywordMatch: 'Keyword Match',
  voicePace: 'Voice Pace',
};

/**
 * Streams a PDF interview report directly to the given writable stream
 * (e.g. an Express response). Resolves once the document has finished writing.
 */
function streamInterviewReport(res, { interview, result }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);
    res.on('finish', resolve);
    doc.on('error', reject);
    res.on('error', reject);

    // Header
    doc.fontSize(20).fillColor(DARK).font('Helvetica-Bold').text('TalentAI — Interview Report');
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .fillColor(MUTED)
      .font('Helvetica')
      .text(
        `${interview?.role || 'Role'} · ${interview?.difficulty || ''} · ${interview?.duration || '—'} min · ${
          interview?.completedAt ? new Date(interview.completedAt).toLocaleDateString() : ''
        }`
      );
    doc.moveDown(1.2);

    // Overall score
    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text(`Overall Score: ${result.overallScore}%`);
    doc.moveDown(1);

    // Metric breakdown
    doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold').text('Metric Breakdown');
    doc.moveDown(0.4);
    doc.font('Helvetica').fontSize(11).fillColor(DARK);

    Object.entries(METRIC_LABELS).forEach(([key, label]) => {
      const value = result.metrics?.[key] ?? 0;
      const y = doc.y;
      doc.fillColor(DARK).text(label, 50, y, { continued: false, width: 200 });
      doc.fillColor(ACCENT).text(`${value}%`, 260, y);
      doc.moveDown(0.4);
    });
    doc.moveDown(0.8);

    // Strengths / weaknesses / mistakes
    const renderList = (title, items, color) => {
      doc.fontSize(13).fillColor(DARK).font('Helvetica-Bold').text(title);
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(10.5).fillColor(color || DARK);
      (items || []).forEach((item) => {
        doc.text(`•  ${item}`, { indent: 10 });
      });
      if (!items?.length) {
        doc.fillColor(MUTED).text('None recorded.');
      }
      doc.moveDown(0.8);
    };

    renderList('Strengths', result.strengths, SUCCESS);
    renderList('Areas to Improve', result.weaknesses, ERROR);
    renderList('Mistakes', result.mistakes, ERROR);
    renderList('Recommended Learning', result.recommendedLearning, ACCENT);

    // Question-by-question analysis
    doc.addPage();
    doc.fontSize(14).fillColor(DARK).font('Helvetica-Bold').text('Question-by-Question Analysis');
    doc.moveDown(0.6);

    (result.questionAnalysis || []).forEach((qa, index) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK).text(`${index + 1}. ${qa.question}`);
      doc.moveDown(0.2);
      doc.fontSize(10).font('Helvetica').fillColor(MUTED).text(`Score: ${qa.score}%`);
      if (qa.answer) {
        doc.moveDown(0.2);
        doc.fillColor(DARK).text(`Answer: ${qa.answer}`);
      }
      if (qa.feedback) {
        doc.moveDown(0.2);
        doc.fillColor(ACCENT).text(`Feedback: ${qa.feedback}`);
      }
      doc.moveDown(0.9);
    });

    doc.end();
  });
}

module.exports = { streamInterviewReport };
