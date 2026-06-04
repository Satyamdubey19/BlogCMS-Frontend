"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMessage } from "@fortawesome/free-solid-svg-icons";
import { addComment, getAuthToken, getBlog, getComments, toggleLike } from "@/utils/blog/helper";

export default function BlogDetail({ slug }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlog(slug);
        setBlog(data.blog);
        const commentData = await getComments(data.blog._id);
        setComments(commentData.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!getAuthToken()) {
      router.push("/auth/login");
      return;
    }

    const result = await toggleLike(blog._id);
    setBlog((current) => ({
      ...current,
      likedByMe: result.liked,
      likeCount: result.likeCount,
    }));
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!getAuthToken()) {
      router.push("/auth/login");
      return;
    }
    if (comment.trim().length < 2) return;

    const data = await addComment(blog._id, comment.trim());
    setComments((current) => [data.comment, ...current]);
    setBlog((current) => ({ ...current, commentCount: (current.commentCount || 0) + 1 }));
    setComment("");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading article...</div>;
  }

  if (error || !blog) {
    return <div className="min-h-screen flex items-center justify-center text-black text-xl">{error || "Blog not found"}</div>;
  }

  return (
    <main className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {blog.coverImage && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <Image src={blog.coverImage} alt={blog.title} width={1200} height={700} className="w-full h-100 object-cover rounded-2xl" />
          </div>
        )}

        <p className="text-sm font-medium text-purple-600 mb-2">{blog.category?.title || "General"}</p>
        <h1 className="text-4xl font-bold text-black mb-4 leading-tight">{blog.title}</h1>

        <div className="grid items-center gap-2 text-sm text-gray-500 mb-8">
          <div className="flex gap-3">
            <p>By {blog.author?.name || "Unknown Author"}</p>
            <span>&bull;</span>
            <p>{new Date(blog.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <p>Last Updated</p><span>&bull;</span><p>{new Date(blog.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <button onClick={handleLike} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${blog.likedByMe ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-600"}`}>
            <FontAwesomeIcon icon={faHeart} />
            {blog.likeCount || 0}
          </button>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <FontAwesomeIcon icon={faMessage} />
            {blog.commentCount || comments.length}
          </span>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {blog.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span key={index} className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">#{tag}</span>
            ))}
          </div>
        )}

        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Comments</h2>
          <form onSubmit={handleComment} className="mb-6 flex flex-col gap-3">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your response"
              className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
            />
            <button className="self-start rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-500">
              Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && <p className="text-sm text-slate-500">No comments yet.</p>}
            {comments.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{item.author?.name || "Reader"}</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-700">{item.content}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
