require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: "Say hello.",
        },
      ],
    });

    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

test();
