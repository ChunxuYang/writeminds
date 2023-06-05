import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Set up your OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Instantiate the OpenAI object with your configuration
const openai = new OpenAIApi(configuration);

// Define a function to get the chat context
const getContext = (text: string): Array<ChatCompletionRequestMessage> => {
  const context: Array<ChatCompletionRequestMessage> = [
    {
      role: "user",
      content: `This is my text now: ${text} \n\n, I have this question: `,
    },
  ];
  return context;
};

// Define the POST handler for your request
export async function POST(request: Request) {
  // Extract the text and the question from the request
  const { text, question } = await request.json();

  // Get the context and add the question to it
  const context = getContext(text);
  context.push({
      role: "user",
      content: question,
  });

  // Send a chat completion request to OpenAI
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  // Extract the message from the response
  const message = res.data.choices[0].message?.content;

  // If there is no message or it's empty, return an empty array
  if (!message || message.length === 0) {
    return NextResponse.json([]);
  }

  // Clean up the message by removing "Answer:"
  const answer = message.replace("Answer:", "").trim();

  // Return the answer in a JSON response
  return NextResponse.json({ answer });
}
