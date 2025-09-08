# backend/app/ai_engine.py
import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

qa_chain = None

def initialize_ai_engine():
    global qa_chain
    if qa_chain is not None:
        print("AI Engine is already initialized.")
        return

    try:
        print("Initializing AI Engine...")

        # --- FIX 1 & 2: Update model name and remove deprecated argument ---
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.3)
        # --- END FIX 1 & 2 ---

        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        script_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(script_dir)
        knowledge_base_path = os.path.join(backend_dir, "knowledge_base.txt")
        print(f"Loading knowledge base from: {knowledge_base_path}")
        loader = TextLoader(file_path=knowledge_base_path, encoding="utf-8")
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = text_splitter.split_documents(documents)
        vector_store = Chroma.from_documents(texts, embeddings)
        prompt_template = """
        You are Vaidya Dhara, a helpful and respectful public health assistant.
        Your goal is to provide clear and accurate health information based ONLY on the context provided.
        Do not answer any questions outside of the given context.
        If the user asks for a medical diagnosis, or asks a question you cannot answer from the context,
        politely refuse and advise them to consult a qualified medical professional.
        Never invent information.

        CONTEXT:
        {context}

        QUESTION:
        {question}

        ANSWER:
        """
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(),
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=False
        )
        print("AI Engine initialized successfully.")
    except Exception as e:
        print(f"Error initializing AI Engine: {e}")
        raise

def get_ai_response(query: str) -> str:
    if qa_chain is None:
        return "Sorry, the AI engine is not available at the moment. Please try again later."
    try:
        # --- FIX 3: Use the modern .invoke() method ---
        result = qa_chain.invoke({"query": query})
        # --- END FIX 3 ---
        return result.get("result", "I could not find an answer in my knowledge base.")
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return "Sorry, an error occurred while processing your request."