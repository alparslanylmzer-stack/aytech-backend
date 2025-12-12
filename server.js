import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

// === ARIZA API ===
app.post("/ask", async (req, res) => {
    try {
        const { brand, model, year, code, type } = req.body;

        // Prompt oluştur
        const prompt = `
Sen bir otomotiv arıza uzmanısın ve sadece JSON döndürürsün.

MARKA: ${brand}
MODEL: ${model}
YIL: ${year}
KOD: ${code}

İSTENEN: ${type}

Cevap formatı:
{
  "aciklama": [],
  "nedenler": [],
  "cozum": [],
  "videolar": []
}
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Sadece JSON formatında cevap ver." },
                { role: "user", content: prompt }
            ],
            temperature: 0.2
        });

        let text = completion.choices[0].message.content;

        // JSON kontrolü
        try {
            const json = JSON.parse(text);
            return res.json(json);
        } catch (err) {
            return res.json({ error: "JSON okunamadı", raw: text });
        }

    } catch (err) {
        return res.json({ error: err.message });
    }
});

// === PORT ===
app.listen(process.env.PORT || 10000, () => {
    console.log("AYTECH Backend ÇALIŞIYOR");
});
