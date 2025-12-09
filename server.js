import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// ARIZA API
app.post("/api", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "JSON cevap veren otomotiv arıza uzmanısın." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    return res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

// PORT Render tarafından otomatik atanır
app.listen(process.env.PORT || 3000, () => console.log("AYTECH Backend Çalışıyor"));
