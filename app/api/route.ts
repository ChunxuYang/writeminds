import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { text } = await request.json();
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "This is a new essay beginning: \n" + text,
    stop: ["\n"],
  });

  const completion = res.data.choices[0].text?.trim() || "";

  return NextResponse.json({ completion });
}
