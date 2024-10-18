"use client";
import { getDocs, collection, deleteDoc, addDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./api/config";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(false);
  const colref = collection(db, "blogs");

  // Adding blog to Firestore after sentiment analysis
  const addBlog = async (e) => {
    e.preventDefault();

    if (!newBlog.title || !newBlog.content || !newBlog.author) {  
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Sentiment analysis API call
    try {
      setLoading(true);
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: newBlog.title,
          text: newBlog.content,
          author: newBlog.author,  }),
      });
      const data = await response.json();

      if (data.sentiment) {
        const blog = {
          title: newBlog.title,
          text: newBlog.content,
          author: newBlog.author,  
          sentiment: data.sentiment, 
        };

        await addDoc(colref, blog);
        alert("Blog successfully added with sentiment!");
        setNewBlog({ title: "", content: "", author: "" }); 
        getDocsAsync(); 
      } else {
        alert("Failed to analyze sentiment.");
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      alert("Error analyzing sentiment.");
    } finally {
      setLoading(false);
    }
  };

  // Fetching blogs from Firestore
  const getDocsAsync = async () => {
    try {
      const querySnapshot = await getDocs(colref);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(docsArray);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Deleting a blog from Firestore
  const deleteBlog = async (id) => {
    const docRef = doc(db, "blogs", id);
    await deleteDoc(docRef);
    getDocsAsync(); 
  };

  useEffect(() => {
    getDocsAsync();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-mono">
      <h1 className="text-4xl font-bold">
        Add your favourite <span className="text-rose-500">BLOG...</span>
      </h1>

      <div className="text-center w-3/5 border-2 border-x-cyan-800 text-3xl bg-rose-500 p-4">
        <form onSubmit={addBlog} className="flex flex-col gap-4">
          <label htmlFor="title" className="text-slate-950">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="text-slate-950 bg-red-200"
            placeholder="Name Me!"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />

          <label htmlFor="content" className="text-slate-950">
            Content
          </label>
          <textarea
            name="content"
            className="text-slate-950 w-full bg-red-200 h-52"
            placeholder="Start Writing..."
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          />

          <label htmlFor="author" className="text-slate-950">
            Author
          </label>
          <input
            type="text"
            name="author"   
            className="text-slate-950 bg-red-200"
            placeholder="Who's there?"
            value={newBlog.author}  
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}  
          />

          <button
            type="submit"
            disabled={loading}
            className="text-slate-950 bg-red-200 flex w-1/6 justify-center self-end border"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-rose-500">BLOG</span>
        </h1>
      </div>

      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="grid grid-cols-1 gap-4 bg-rose-500 font-mono text-2xl m-2 max-w-5xl">
            <div className="p-4 m-2 bg-red-200 text-neutral-700">
              <h2 className="font-bold">{blog.title}</h2> 
              <p>{blog.content}</p>
              <p>-- {blog.author}</p> 
              <p>Sentiment: {blog.sentiment}</p>  
            </div>
            <button onClick={() => deleteBlog(blog.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
}
