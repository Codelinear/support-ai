"use server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const validateName = async (name: string) => {
  try {
    const openaiAPIKey = process.env.OPENAI_API_KEY;

    const messages = [
      new SystemMessage(
        "Your job is to extract the name from the user's message which can be a sentence, word or it's name too, but if the name is invalid or not a human name then return the boolean value 'false' only."
      ),
      new HumanMessage(name),
    ];

    const llm = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      apiKey: openaiAPIKey,
      temperature: 0.1,
    });

    const isCorrect = await llm.invoke(messages);

    return { isCorrect: isCorrect.content };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
