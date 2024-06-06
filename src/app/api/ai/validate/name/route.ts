import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const POST = async (req: NextRequest) => {
  try {
    const { name } = await req.json();

    const openaiAPIKey = process.env.OPENAI_API_KEY;

    if (!name) {
      return NextResponse.json(
        { error: "Please provide a name" },
        { status: 400 }
      );
    }

    const messages = [
      new SystemMessage(
        "Your job is to extract the name from the user's message which can be a sentence, word or it's name too, but if the name is invalid then return the boolean value 'false' only."
      ),
      new HumanMessage(name),
    ];

    const llm = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      apiKey: openaiAPIKey,
      temperature: 0.1,
    });

    const isCorrect = await llm.invoke(messages);

    return NextResponse.json({ isCorrect }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
