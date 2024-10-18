"use client"

import { addDoc, collection } from "firebase/firestore";
import { db } from "../api/config";
import { useState } from "react";

const page = () => {
  
const colref = collection(db, "blogs");
  const addBlog = async (e) => {
    e.preventDefault();
    const blog = {
      title: e.target.title.value,
      content: e.target.content.value,
      name: e.target.name.value
    }
    e.target.reset();
    console.log(blog);

    addDoc(colref, blog)
    .then(() => {
      alert("Document successfully written!");
    })
    .catch((error) => {
      alert("Error writing document: ", error);
    });

    
  }




  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">
      
      Add your favourite <span className="text-rose-500">BLOG...</span>
        </h1>

      <div className="text-center border-2 border-rose-500 bg-gray-50">
            <form  onSubmit={addBlog}>
              <label htmlFor="title" className="text-rose-500">Title</label>
                <input type="text" name="title" className="text-slate-950" placeholder="Title" />

                <label htmlFor="content" className="text-rose-500">content</label>
                <input type="text" name="content" className="text-slate-950" placeholder="content" />

                <label htmlFor="name" className="text-rose-500">Author</label>
                <input type="text" name="name" className="text-slate-950" placeholder="Author" />

                <button type="submit" className="text-rose-500">Submit</button>
            </form>
      </div>
    </div>
  )
}

export default page
