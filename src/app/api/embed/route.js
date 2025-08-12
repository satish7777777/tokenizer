import OpenAI from "openai";

export async function POST(req) {
  try {
    const { text } = await req.json();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      encoding_format: "float",
    });

    return new Response(
      JSON.stringify({
        embedding: result.data[0].embedding,
        length: result.data[0].embedding.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
