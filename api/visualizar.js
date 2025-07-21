import { OpenAI } from "openai";

export const config = { runtime: "edge" };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método inválido" }), {
      status: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const form = await req.formData();
    const pisoUrl = form.get("floor");

    const prompt = `
Substitua o piso deste ambiente por um piso vinílico com textura visual semelhante à imagem nesta URL: ${pisoUrl}.
Preserve móveis, paredes, iluminação e ângulo original da foto. A aplicação deve parecer realista, como uma reforma concluída com o novo piso instalado.
Fotografia interna, iluminação natural. Detalhes em alta definição.
    `.trim();

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return new Response(
      JSON.stringify({ image_url: response.data[0].url }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
