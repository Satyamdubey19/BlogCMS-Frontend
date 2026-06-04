import { Suspense } from "react";
import BlogCard from "../../../../../components/Card/BlogCard";
import MainHeading from "../../../../../components/Heading/MainHeading";

export default function ViewBlog() {
    return(
        <div className="pb-20">
            <MainHeading heading="View Your Blogs Here..." />

            <div className="w-full px-4 py-3 lg:py-20 lg:px-20 overflow-hidden">
                <Suspense fallback={<div className="text-center mt-10 text-slate-400 text-sm">Loading...</div>}>
                    <BlogCard mine />
                </Suspense>
            </div>
        </div>
    )
}
