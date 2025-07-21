import { OpenAI } from "openai";

export const config = { runtime: "edge" };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método inválido" }), { status: 405 });
  }
  try {
    const form = await req.formData();
    const piso = form.get("floor");

const prompt = `
Substitua o piso deste ambiente por um piso vinílico com textura visual semelhante à imagem nesta URL: ${piso}.
Preserve móveis, paredes, iluminação e ângulo original da foto. A aplicação deve parecer realista, como uma reforma concluída com o novo piso instalado.
Fotografia interna, iluminação natural. Detalhes em alta definição.
`;

    const response = await openai.images.generate({
      prompt: `Fotografia realista de um piso vinílico estilo ${piso} em um ambiente interno.`,
      n: 1,
      size: "1024x1024",
    });

    return new Response(JSON.stringify({ image_url: response.data[0].url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
