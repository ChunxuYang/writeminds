import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getContext = (
  text: string,
  topic: string
): Array<ChatCompletionRequestMessage> => {
  const context: Array<ChatCompletionRequestMessage> = [
    {
      role: "user",
      content: `This is my essay now: ${text} \n\n, I want to know more about ${topic}, return me with more details.`,
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
    messages: getContext(text, choice),
  });

  const message = res.data.choices[0].message?.content;

  if (!message || message.length === 0) {
    return NextResponse.json("");
  }

  return NextResponse.json(message);
}
