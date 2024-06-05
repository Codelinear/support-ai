import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const main = async () => {
  const loader = new PDFLoader("public/documents/PDFfile.pdf", {
    splitPages: false,
  });

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitDocuments(docs);

  //   if (!process.env.PINECONE_API_KEY) {
  //     console.log("PINECONE_API_KEY is not set");
  //     return;
  //   }

  const pinecone = new Pinecone({
    apiKey: "5fe7f5e4-0985-4dac-a68b-5559b4a9d112",
  });

  const pineconeIndex = pinecone.Index("contact-gpt");

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001", // 768 dimensions
    apiKey: "AIzaSyAC7o9HlDMdf1y5c3iIIrZbfAavsyRw9IU",
  });

  //   const embeddings = new OpenAIEmbeddings({
  //     apiKey: process.env.OPENAI_API_KEY,
  //     modelName: "text-embedding-ada-002",
  //   });

  const pineconeStore = await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex,
  });

  console.log("Finished embeddings");
};

main();
