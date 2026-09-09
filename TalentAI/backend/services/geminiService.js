const groq = require("../config/groq");

/**
 * Generates a set of interview questions tailored to the role, experience
 * level, difficulty, and (optionally) the candidate's parsed resume.
 */
const generateInterviewQuestions = async ({
  role,
  experienceLevel,
  difficulty,
  duration,
  resumeContext,
}) => {
  const questionCount = Math.max(3, Math.round(duration / 4));

  const prompt = `
You are an expert technical interviewer.

Generate ${questionCount} interview questions for a
${experienceLevel} level "${role}" candidate at "${difficulty}" difficulty.

${resumeContext ? `Tailor a few questions to this candidate's background:\n${resumeContext}` : ""}

Return ONLY valid JSON.

Format:
[
  {
    "question": "string",
    "category": "string"
  }
]
`.trim();

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.error(text);
    throw new Error("Failed to parse Groq response into questions JSON");
  }
};

/**
 * Evaluates a candidate's interview.
 */
const evaluateInterview = async ({ role, questions }) => {
  const prompt = `
You are an expert interview evaluator.

Role:
${role}

Question and Answer pairs:
${JSON.stringify(questions)}

Return ONLY valid JSON in this format:

{
  "overallScore": number,
  "metrics": {
    "confidence": number,
    "communication": number,
    "grammar": number,
    "technicalKnowledge": number,
    "fluency": number,
    "keywordMatch": number,
    "voicePace": number
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "mistakes": ["string"],
  "recommendedLearning": ["string"],
  "questionAnalysis": [
    {
      "question": "string",
      "answer": "string",
      "score": number,
      "feedback": "string"
    }
  ]
}
`.trim();

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  const text = completion.choices[0].message.content;

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.error(text);
    throw new Error("Failed to parse Groq response into evaluation JSON");
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterview,
};
