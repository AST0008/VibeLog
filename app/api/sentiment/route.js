import { collection, addDoc } from "firebase/firestore";
import { db } from "../config";
import axios from "axios";

export async function POST(req) {
  const { title, author, text } = await req.json();

  if (!text) {
    return new Response("No text provided", { status: 400 });
  }
  console.log(title, author, text);

  try {
    console.log("Text received for sentiment analysis:", text);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FACE_API_KEY}`,
        },
      }
    );

    console.log("Hugging Face API response:", response.data);
    const sentimentData = response.data[0];
    const highestScoringSentiment = sentimentData.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    ).label;

    console.log("Sentiment analysis result:", highestScoringSentiment);

    await addDoc(collection(db, "blogs"), {
      title,
      content: text,
      author,
      sentiment: highestScoringSentiment,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ highestScoringSentiment }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in sentiment analysis or saving blog:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
