const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};

const getFallbackRecommendation = (userRequest, providers) => {
  const normalizedQuery = userRequest.toLowerCase();

  const rankedProviders = providers
    .map((provider) => {
      const haystack = `${provider.name || ""} ${provider.category || ""} ${provider.description || ""} ${provider.city || ""}`.toLowerCase();
      const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
      let score = 0;

      if (haystack.includes(normalizedQuery)) {
        score += 3;
      }

      queryTokens.forEach((token) => {
        if (haystack.includes(token)) {
          score += 1;
        }
      });

      return { provider, score };
    })
    .sort((a, b) => b.score - a.score);

  const topMatch = rankedProviders[0];

  return {
    recommendedProviderId: topMatch?.provider?._id?.toString() || providers[0]?._id?.toString(),
    reason: `Used local fallback matching for "${userRequest}" because no Groq API key was configured.`,
  };
};

const getRecommendation = async (userRequest, providers) => {
  try {
    if (!process.env.GROQ_API_KEY?.trim()) {
      return getFallbackRecommendation(userRequest, providers);
    }

    const prompt = `
You are an AI assistant for a Local Services Finder application.

User Request:
"${userRequest}"

Available Providers:
${JSON.stringify(providers, null, 2)}

Instructions:
1. Recommend ONLY ONE provider.
2. Choose the best matching provider.
3. Respond ONLY in valid JSON.
4. Do not use markdown.

Response format:

{
  "recommendedProviderId": "",
  "reason": ""
}
`;

    const completion = await getGroqClient().chat.completions.create({
    model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    let text = completion.choices[0].message.content.trim();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    if (error.message?.includes("GROQ_API_KEY")) {
      return getFallbackRecommendation(userRequest, providers);
    }

    console.error("Groq Error:", error);
    throw error;
  }
};

module.exports = {
  getRecommendation,
};