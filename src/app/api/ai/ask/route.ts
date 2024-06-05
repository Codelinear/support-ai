import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LangChainAdapter, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
  try {
    const { message } = await req.json();

    // const lastMessage = messages[messages.length - 1];

    // if (!lastMessage.content) {
    //   return new NextResponse("No message content", {
    //     status: 400,
    //   });
    // }

    const pineconeAPIKey = process.env.PINECONE_API_KEY;
    const pineconeIndexName = process.env.PINECONE_INDEX;
    const geminiAPIKey = process.env.GEMINI_API_KEY;

    if (!pineconeIndexName || !pineconeAPIKey || !geminiAPIKey) {
      return new NextResponse("env variables is not set properly", {
        status: 400,
      });
    }

    const pinecone = new Pinecone({
      apiKey: pineconeAPIKey,
    });

    const pineconeIndex = pinecone.Index(pineconeIndexName);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001", // 768 dimensions
      apiKey: geminiAPIKey,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: geminiAPIKey,
      model: "gemini-pro",
    });

    const qaSystemPrompt = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
  \n\n
  {context}`;

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

    // const answerStream = await retrievalChain.stream({
    //   input: lastMessage.content,
    // });

    const response = await retrievalChain.invoke({
      // input: lastMessage.content,
      input: message,
    });

    console.log(response);
    console.log(response.answer);

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

    // const stream = LangChainAdapter.toAIStream(transformedStream);

    // return new StreamingTextResponse(stream);
    return NextResponse.json(
      {
        message: {
          type: "ai",
          content: response.answer,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(`error is happening in the backend: ${error}`);
    return NextResponse.json({ error }, { status: 500 });
  }
};
