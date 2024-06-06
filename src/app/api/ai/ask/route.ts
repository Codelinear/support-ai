import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: NextRequest) => {
  try {
    const { message } = await req.json();

    const openaiAPIKey = process.env.OPENAI_API_KEY;
    const pineconeAPIKey = process.env.PINECONE_API_KEY;
    const pineconeIndexName = process.env.PINECONE_INDEX_NAME;
    const environment = process.env.ENVIRONMENT;

    if (!openaiAPIKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not set" },
        { status: 401 }
      );
    }

    if (!pineconeAPIKey) {
      return NextResponse.json(
        { error: "Pinecone API key is not set" },
        { status: 401 }
      );
    }

    if (!pineconeIndexName) {
      return NextResponse.json(
        { error: "Pinecone Index Name is not set" },
        { status: 401 }
      );
    }

    const pinecone = new Pinecone({
      apiKey: pineconeAPIKey,
    });

    const pineconeIndex = pinecone.Index(pineconeIndexName);

    let embedModel;
    let chatModel;

    if (environment === "production") {
      embedModel = new OpenAIEmbeddings({
        apiKey: openaiAPIKey,
        model: "text-embedding-3-small", // 1536 dimensions
      });

      chatModel = new ChatOpenAI({
        temperature: 0,
        apiKey: openaiAPIKey,
        model: "gpt-3.5-turbo-0125",
      });
    } else {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "Gemini API key is not set" },
          { status: 401 }
        );
      }

      embedModel = new GoogleGenerativeAIEmbeddings({
        model: "embedding-001", // 768 dimensions
        apiKey: process.env.GEMINI_API_KEY,
      });

      chatModel = new ChatGoogleGenerativeAI({
        temperature: 0,
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-pro",
      });
    }

    const vectorStore = await PineconeStore.fromExistingIndex(embedModel, {
      pineconeIndex,
    });

    // const qaSystemPrompt = `You are Support.AI - a chatbot designed to help customers with their support needs. Use the following pieces of context to answer the question.
    // \n\n
    // {context}
    // \n\n
    // You must take care the following points while answering the question:
    // \n\n
    // 1. Do not answer the question if you are not sure about the answer.
    // \n
    // 2. Understand and double check the question very well and find the similar question in the context and then answer that question from the context.
    // \n
    // 3. If the question is completely different from the context or the answer isn't there, then say that "Please ask the relevant question from customer support."
    // \n
    // 4. The question from the user may not be completely clear or congruent with the questions in the context. In that case, you would find the similar question to that of the user's question and answer that question from the context.
    // `;

    // const qaSystemPrompt = `You are Support.AI, a chatbot designed to assist customers with their support needs. Use the following pieces of context to answer the question.
    // \n\n\n
    // {context}
    // \n\n\n
    // Guidelines:
    // \n\n
    // 1. You should identify the conversational lines like Hi how are you, Thanks a lot for the help, Have a nice day etc. and should exchange pleasantries, Just like you are a customer support agent not a robot so do respond to the general talk but don't respond to any unnecessary question apart from customer support related questions.
    // \n\n
    // 2. Ensure you thoroughly understand the question. Look for a similar question in the provided context and use that to form your response.
    // \n\n
    // 3. If the question is completely different from the context, if the answer is not available in the context or most importantly if the question is not from customer care topic, respond with: "Please ask the relevant question from customer support."
    // \n\n
    // 4. If the user's question is unclear or doesn't exactly match the context, find the most similar question within the context and answer that.
    // \n\n
    // 5. If you are unsure about the answer, do not respond to the question.

    const qaSystemPrompt = `You are Support.AI, a chatbot designed to assist customers with their support needs. Use the following pieces of context to answer the question:
    \n\n\n
    {context}
    \n\n\n
    Guidelines:
    \n\n
    
    1. Identify and respond to conversational lines such as "Hi, how are you?", "Thanks a lot for the help", "Have a nice day" etc. Exchange pleasantries and respond in a friendly manner, as if you are a customer support agent, not a robot. However, do not respond to any unnecessary questions that are not related to customer support.
    \n\n
    2. Ensure you thoroughly understand the question. Look for a similar question in the provided context and use that to form your response.
    \n\n
    3. If the question is completely different from the context, if the answer is not available in the context, or if the question is not related to customer support, respond with: "Please ask a relevant question related to customer support."
    \n\n
    4. If the user's question is unclear or doesn't exactly match the context, find the most similar question within the context and answer that.
    `;

    const qaPromptTemplate = ChatPromptTemplate.fromMessages([
      ["system", qaSystemPrompt],
      ["human", "{input}"],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt: qaPromptTemplate,
    });
    const retriever = vectorStore.asRetriever();

    const retrievalChain = await createRetrievalChain({
      combineDocsChain: questionAnswerChain,
      retriever,
    });

    const response = await retrievalChain.invoke({
      input: message,
    });

    // const transformedStream = new ReadableStream({
    //   async start(controller) {
    //     const reader = answerStream.getReader();
    //     while (true) {
    //       const { done, value } = await reader.read();
    //       if (done) break;

    //       // Transform the value to match the expected structure
    //       controller.enqueue({
    //         content: value?.content || JSON.stringify(value),
    //       });
    //     }
    //     controller.close();
    //   },
    // });

    return NextResponse.json(
      {
        message: {
          id: uuidv4(),
          type: "ai",
          content: response.answer,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
