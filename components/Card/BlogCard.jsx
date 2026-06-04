"use client"
import Image from "next/image"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getBlogs, deleteBlog, toggleLike } from "@/utils/blog/helper"
import EmptyCard from "./EmptyCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faMessage, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import SuccessMessageCard from "./SuccessMessageCard"
import Loading from "./Loading"
import CreateBlogForm from "./CreateBlogForm"

const AVATAR_COLORS = [
    "bg-violet-100 text-violet-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
    "bg-teal-100 text-teal-600",
    "bg-sky-100 text-sky-600",
    "bg-pink-100 text-pink-600",
]

function getAvatarColor(name = "") {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
}

function getInitials(name = "") {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function DeleteConfirmCard({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[320px] flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faTrash} className="text-red-400 text-base" />
                </div>
                <h3 className="text-slate-800 font-semibold text-base mb-1">Delete Blog</h3>
                <p className="text-slate-400 text-sm mb-6">Are you sure you want to delete this blog?</p>
                <div className="flex gap-3 w-full">
                    <button onClick={onCancel} className="flex-1 py-2 rounded-full border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors cursor-pointer">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function BlogCard({ isRedirected = false, mine = false }) {
    const [showFull, setShowFull] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [successMsg, setSuccessMsg] = useState("")
    const router = useRouter()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()

    const token = typeof window !== "undefined" ? document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] : null
    const isLoggedIn = !!token

    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || ""
    const [editBlogId, setEditBlogId] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)

    const showSuccess = (msg) => {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(""), 3000)
    }

    useEffect(() => {
        setShowFull(null)
        setPage(1)
        setBlogs([])
        fetchData(1)
    }, [category, search, tag, mine])

    const fetchData = async (pageNum) => {
        try {
            pageNum === 1 ? setLoading(true) : setLoadingMore(true)
            const data = await getBlogs({ category, search, tag, page: pageNum, mine })
            const allBlogs = data.blogs || []
            setTotalPages(data.pagination?.pages || 1)
            setBlogs(prev => pageNum === 1 ? allBlogs : [...prev, ...allBlogs])
        } catch (err) {
            console.log(err)
            if (pageNum === 1) setBlogs([])
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchData(nextPage)
    }

    // const handleSeeMore = (index, isOpen) => {
    //     if (!isLoggedIn) {
    //         router.push("/auth/login")
    //         return
    //     }
    //     setShowFull(isOpen ? null : index)
    // }

    // {ADDED: this opens dynamic [slug] page}
    const handleReadBlog = (blog) => {
        const finalSlug = blog.slug || blog.title
            ?.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        if (!finalSlug) {
            alert("Slug is missing for this blog");
            return;
        }

        router.push(`/user/${finalSlug}`);
    };

    const handleEdit = (blogId) => {
        setEditBlogId(blogId)
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteBlog(deleteId)
            setBlogs(prev => prev.filter(b => b._id !== deleteId))
            showSuccess("Your blog has been successfully deleted.")
        } catch (err) {
            console.log(err)
        } finally {
            setDeleteId(null)
        }
    }

    const handleLike = async (e, blogId) => {
        e.stopPropagation()
        if (!isLoggedIn) {
            router.push("/auth/login")
            return
        }
        try {
            const result = await toggleLike(blogId)
            setBlogs(prev => prev.map(blog => blog._id === blogId ? {
                ...blog,
                likedByMe: result.liked,
                likeCount: result.likeCount,
            } : blog))
        } catch (err) {
            console.log(err)
        }
    }

    if (loading) {
        return <Loading />
    }

    if (!loading && blogs.length === 0) {
        return (
            <Suspense fallback={<div className="text-center mt-10 text-slate-400 text-sm">Loading...</div>}>
                <EmptyCard />
            </Suspense>
        )
    }

    return (
        <>
            {editBlogId && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm overflow-y-auto">
                    <div className="flex items-start justify-center py-10 px-4">
                        <div className="relative w-full max-w-3xl">
                            <button
                                onClick={() => setEditBlogId(null)}
                                className="absolute top-13 right-3 z-10 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                X
                            </button>

                            <CreateBlogForm
                                blogId={editBlogId}
                                onSuccess={() => {
                                    setEditBlogId(null)
                                    showSuccess("Your blog has been updated successfully.")
                                    setBlogs([])
                                    fetchData(1)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {deleteId && <DeleteConfirmCard onConfirm={handleConfirmDelete} onCancel={() => setDeleteId(null)} />}
            {successMsg && <SuccessMessageCard message={successMsg} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-8">
                {blogs.map((blog, index) => {
                    const isOpen = showFull === index
                    const authorName = blog.author?.name || ""
                    const initials = getInitials(authorName)
                    const avatarColor = getAvatarColor(authorName)

                    return (
                        <div key={blog?._id} 
                            onClick={ (e) => {
                                e.preventDefault()
                                if(isRedirected){
                                    handleReadBlog(blog)
                                }
                            }}
                            className={`hover:scale-125 bg-white rounded-2xl flex flex-col border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden
                            ${isRedirected ? "cursor-pointer" : "cursor-default"}
                            `}>
                            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-slate-50">
                                <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ring-2 ring-offset-1 ring-indigo-100">
                                    {blog.coverImage ? (
                                        <Image src={blog.coverImage} width={44} height={44} alt={blog.title} className=" object-cover w-full h-full" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center text-sm font-semibold ${avatarColor}`}>
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{authorName}</p>
                                    <span className="text-xs text-indigo-400 font-medium">{blog.category?.title}</span>
                                </div>

                                {mine && (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(blog._id) }} className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer">
                                            <FontAwesomeIcon icon={faPen} className="text-indigo-400 text-xs" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(blog._id) }} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer">
                                            <FontAwesomeIcon icon={faTrash} className="text-red-400 text-xs" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="px-5 py-4 flex flex-col flex-1">
                                <h2 className="font-bold text-sm text-slate-800 leading-snug mb-2">{blog.title}</h2>
                                {mine && (
                                    <span className={`self-start mb-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${blog.isPublic ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                        {blog.isPublic ? "Published" : "Draft"}
                                    </span>
                                )}

                                <div
                                    className="text-sm text-slate-500 leading-relaxed font-light flex-1 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: isOpen ? blog.content : `${blog.content?.slice(0, 100) || ""}...`
                                    }}
                                />

                                <div className="flex gap-4 mt-3">
                                    {/* <button
                                        onClick={() => handleSeeMore(index, isOpen)}
                                        className="self-start text-xs cursor-pointer font-medium text-indigo-500 hover:text-indigo-700 tracking-widest uppercase transition-colors duration-200"
                                    >
                                        {isOpen ? "See less" : "See more"}
                                    </button> */}

                                    {/* ADDED: Read More button for dynamic route */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReadBlog(blog) }}
                                        className="self-start text-xs cursor-pointer font-medium text-purple-500 hover:text-purple-700 tracking-widest uppercase transition-colors duration-200"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 px-5 pb-4 text-xs text-slate-500">
                                <button
                                    onClick={(e) => handleLike(e, blog._id)}
                                    className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${blog.likedByMe ? "text-rose-500" : ""}`}
                                >
                                    <FontAwesomeIcon icon={faHeart} className="text-xs" />
                                    {blog.likeCount || 0}
                                </button>
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faMessage} className="text-xs" />
                                    {blog.commentCount || 0}
                                </span>
                            </div>

                            {blog.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 px-5 pb-5">
                                    {blog.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="text-xs font-medium bg-indigo-50 text-indigo-500 px-2.5 py-0.5 rounded-full border border-indigo-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {page < totalPages && (
                <div className="flex justify-center mt-4 pb-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </>
    )
}
