import { CARD_DATA } from '../data/cards';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const MODEL_NAME = 'gemini-flash-lite-latest';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const wisdomCache = new Map();

export async function fetchGeminiGitaWisdom(userWish) {
  if (!API_KEY || !userWish || typeof userWish !== 'string' || userWish.trim().length < 4) {
    return null;
  }

  const cleanText = userWish.trim();
  if (wisdomCache.has(cleanText)) {
    return wisdomCache.get(cleanText);
  }

  const prompt = `You are Lord Krishna offering timeless Bhagavad Gita guidance and divine solace.
A seeker pours out their heart with this prayer, life burden, or wish (note: the user may write in English, pure Tamil script, or Tanglish / Tamil written in English alphabet like "romba bayama irukku", "kashtama irukku", "future pathi tension"):
"${cleanText}"

Your sacred task:
1. Empathize deeply with the seeker's inner emotion regardless of whether they typed in English, Tamil, or Tanglish.
2. Choose the single most fitting, transformative verse from the Bhagavad Gita that heals their sorrow and guides their path forward.
3. Respond ONLY with valid JSON following this exact schema:
{
  "shlokaRef": "Bhagavad Gita · Chapter X, Verse Y",
  "sanskrit": "Devanagari Sanskrit verse with dandas",
  "english": "Compassionate English guidance speaking as Lord Krishna directly addressing their situation (2-3 sentences)",
  "tanglish": "Compassionate Tanglish guidance speaking as Krishna in friendly, comforting Tanglish (Tamil in English alphabet, e.g. 'En anbu selvaney, bayapadathey, un kadamaiya mattum unmaiyodu sei. Palan pathi yosikkathey, naan un koodave irukken.')",
  "tamil": "அழகான, ஆறுதலான தூய தமிழ் அருளுரை மற்றும் வழிகாட்டுதல் (2-3 வாக்கியங்கள்)",
  "positiveWords": [
    "Virtue 1 (தமிழ் / Tanglish)",
    "Virtue 2 (தமிழ் / Tanglish)",
    "Virtue 3 (தமிழ் / Tanglish)",
    "Virtue 4 (தமிழ் / Tanglish)"
  ]
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) return null;

    const parsed = JSON.parse(rawContent);

    if (parsed.shlokaRef && parsed.sanskrit && parsed.english) {
      const result = {
        shlokaRef: parsed.shlokaRef,
        sanskrit: parsed.sanskrit,
        english: parsed.english,
        tanglish: parsed.tanglish || '',
        tamil: parsed.tamil || '',
        positiveWords: Array.isArray(parsed.positiveWords) && parsed.positiveWords.length > 0
          ? parsed.positiveWords
          : [
              'Peace (சாந்தி / Shanthi)',
              'Faith (நம்பிக்கை / Nambikkai)',
              'Courage (தைரியம் / Dhairiyam)',
              'Grace (அருள் / Arul)'
            ],
        isAiGenerated: true
      };
      wisdomCache.set(cleanText, result);
      return result;
    }
  } catch (err) {
    console.error('Error fetching personalized Gita wisdom from Gemini:', err);
  }

  return null;
}
