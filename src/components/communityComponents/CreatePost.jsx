// "use client";

// import { useState } from "react";
// import { JoditEditor } from "./JoditEditor";

// export default function PostCreate({ onPostCreate, isCreating = false }) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [showEditor, setShowEditor] = useState(false);
//   const [error, setError] = useState("");

//   const handleContentChange = (newContent) => {
//     setContent(newContent);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Validate inputs
//     if (!title.trim()) {
//       setError("Please enter a title for your post.");
//       return;
//     }

//     if (!content.trim()) {
//       setError("Please enter some content for your post.");
//       return;
//     }

//     try {
//       // Call parent handler with post data
//       await onPostCreate({ title, content });

//       // Reset form after successful submission
//       setTitle("");
//       setContent("");
//       setShowEditor(false);
//     } catch (err) {
//       setError("Failed to create post. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto mb-10 bg-white rounded-lg shadow">
//       {showEditor ? (
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="mb-4">
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Post Title
//             </label>
//             <input
//               id="title"
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter a title for your post"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               disabled={isCreating}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Post Content
//             </label>
//             <JoditEditor value={content} onChange={handleContentChange} />
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
//               {error}
//             </div>
//           )}

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={() => setShowEditor(false)}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//               disabled={isCreating}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
//               disabled={isCreating}
//             >
//               {isCreating ? "Posting..." : "Post"}
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div
//           onClick={() => setShowEditor(true)}
//           className="p-6 cursor-pointer hover:bg-gray-50"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//               <span className="text-gray-500">👤</span>
//             </div>
//             <div className="bg-gray-100 rounded-full py-2 px-4 w-full">
//               <p className="text-gray-500">
//                 Share your thoughts with the community...
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
