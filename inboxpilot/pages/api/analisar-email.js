
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const email = body.email;

  const prompt = `Você é um assistente de IA de triagem de e-mails.
Classifique a prioridade (Urgente, Importante, Pouco Importante, Ignorável).
Identifique a intenção: proposta, convite, cobrança, informação, spam ou outro.
Sugira uma resposta curta, educada e objetiva.

Email:
${email}

Formato da resposta:
Prioridade: <prioridade>
Intenção: <intenção>
Resposta: <resposta>
`;

  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 300,
    }),
  });

  const dados = await resposta.json();
  const texto = dados.choices?.[0]?.message?.content || "Erro ao gerar resposta.";

  const prioridade = texto.match(/Prioridade:\s*(.*)/i)?.[1] || "Desconhecida";
  const intencao = texto.match(/Inten[cç][aã]o:\s*(.*)/i)?.[1] || "Não identificada";
  const respostaTexto = texto.match(/Resposta:\s*([\s\S]*)/i)?.[1] || "";

  return NextResponse.json({ prioridade, intencao, resposta: respostaTexto });
}
