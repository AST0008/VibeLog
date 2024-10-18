"use client";
import { getDocs, collection, deleteDoc,addDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./api/config";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  const colref = collection(db, "blogs");

  const addBlog = async (e) => {
    e.preventDefault();
    const blog = {
      title: e.target.title.value,
      content: e.target.content.value,
      name: e.target.name.value,
    };
    e.target.reset();
    console.log(blog);

    addDoc(colref, blog)
      .then(() => {
        alert("Document successfully written!");
      })
      .catch((error) => {
        alert("Error writing document: ", error);
      });
  };
  const getDocsAsync = async () => {
    try {
      const querySnapshot = await getDocs(colref);
      const docsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(docsArray);
      console.log(docsArray);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

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
          />

          <label htmlFor="content" className="text-slate-950">
            Content
          </label>
          <input
            type="text"
            name="content"
            className="text-slate-950 w-full text-wrap bg-red-200 h-52 overflow-x-scroll"
            placeholder="Start Writing..."
          />

          <label htmlFor="name" className="text-slate-950">
            Author
          </label>
          <input
            type="text"
            name="name"
            className="text-slate-950 bg-red-200"
            placeholder="Who's there?"
          />

          <button
            type="submit"
            className="text-slate-950 bg-red-200 flex w-1/6 justify-center self-end   border "
          >
            Submit
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
          <div className="grid grid-cols-1 gap-4 bg-rose-500  font-mono text-2xl m-2 max-w-5xl">
            <div key={blog.id} className="p-4 m-2 bg-red-200 text-neutral-700 ">
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              <p>--{blog.name}</p>
            </div>

            <button onClick={deleteBlog.bind(null, blog.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
}
