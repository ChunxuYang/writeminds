import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getContext = (
  text: string,
  question: string
): Array<ChatCompletionRequestMessage> => {
  const context: Array<ChatCompletionRequestMessage> = [
    {
      role: "user",
      content: `This is my essay now: ${text} \n\n, I want to know related writing samples to inspire me, return me 2 - 3 new writing samples related to my current essay and ${question}. \n return should be consise, each containing around 4- 5 sentences. and each end with ellipsis \n return should be a string in below format:
                Sample 1: xxxx... | Sample 2: yyyy... | Sample 3: zzzz...`,
    },
  ];
  return context;
};

export async function POST(request: Request) {
  const { text, question } = await request.json();
  const res = await openai.createChatCompletion({
    // model: "text-davinci-003",
    // prompt: "This is a new essay beginning: \n" + text,
    // stop: ["\n"],
    model: "gpt-3.5-turbo",
    messages: getContext(text, question),
  });

  const message = res.data.choices[0].message?.content;

  if (!message || message.length === 0) {
    return NextResponse.json([]);
  }

  // message like: Talk about xxxx | Talk about yyyy | Talk about zzzz
  const messages = message
    .split("...")
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m) => m + "...");

  return NextResponse.json(messages);
}
