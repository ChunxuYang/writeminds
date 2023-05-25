import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getContext = (text: string): Array<ChatCompletionRequestMessage> => {
  const context: Array<ChatCompletionRequestMessage> = [
    {
      role: "user",
      content: `This is my essay now: ${text} \n\n, I want to know how to continue it, return me 2 - 3 directions based on my current essay. \n return should be consise, each containing below 10 words. \n return example:
                Talk about xxxx | Talk about yyyy | Talk about zzzz`,
    },
  ];
  return context;
};

export async function POST(request: Request) {
  const { text, choice } = await request.json();
  const res = await openai.createChatCompletion({
    // model: "text-davinci-003",
    // prompt: "This is a new essay beginning: \n" + text,
    // stop: ["\n"],
    model: "gpt-3.5-turbo",
    messages: getContext(text),
  });

  const message = res.data.choices[0].message?.content;

  if (!message || message.length === 0) {
    return NextResponse.json([]);
  }

  // message like: Talk about xxxx | Talk about yyyy | Talk about zzzz
  const messages = message.split("|").map((m) => m.trim());

  return NextResponse.json(messages);
}
