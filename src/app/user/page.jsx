import Image from "next/image";
import LoginButton from "../../../components/Buttons/LoginButton";
import BlogCard from "../../../components/Card/BlogCard";
import CreateBlogButton from "../../../components/Buttons/CreateBlogButton";
import FilterButton from "../../../components/Buttons/FilterButton";
import SearchFilter from "../../../components/Buttons/SearchFilter";
import MainHeading from "../../../components/Heading/MainHeading";
import FeaturesCard from "../../../components/Card/FeaturesCard";
import { Suspense } from "react";

export default function Dashboard() {
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const token = typeof window !== "undefined" ? document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1] : null
  return (
    <main>

      <section className="relative w-full px-4 py-3 lg:py-2 lg:px-20 min-h-screen overflow-hidden">

        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{ objectPosition: '75% 40%' }} src="/assets/heroVideo.mp4" />

          <div className="relative z-20 w-full lg:w-lg py-16 lg:py-8 ">
            <div className="flex flex-col gap-5 max-w-3xl">
              <h1 className="font-semibold text-5xl lg:text-7xl text-white leading-tight tracking-normal">
                Stop Writing Blindly. Start Publishing Smartly.
              </h1>
              <p className="text-white/70 text-sm lg:text-base font-normal leading-relaxed">
                A powerful CMS built for bloggers, teams, and creators who want to manage, publish, and grow their content — all from one place.
              </p>
              {!token && 
                <div className="self-start py-6">
                  <LoginButton title="Try it now" />
                </div>
              }
            </div>
          </div>

      </section>

      <section id="blogs" className="w-full  px-4 py-3 lg:py-2 lg:px-20 min-h-screen overflow-hidden">
        
        <MainHeading heading="Trending Blogs" />

        <div className="flex flex-col items-center gap-3 lg:flex-row px-0 md:px-24.5 md:justify-between pt-10">
          <Suspense fallback={<div className="text-center mt-10 text-slate-400 text-sm">Loading...</div>}>
              <FilterButton /> 
          </Suspense>       
          <Suspense fallback={<div className="text-center mt-10 text-slate-400 text-sm">Loading...</div>}>
            <SearchFilter />
          </Suspense>
          <CreateBlogButton />
        </div>
        
        <div className="w-full px-4 py-3 lg:py-20 lg:px-20 overflow-hidden">
          <Suspense fallback={<div className="text-center mt-10 text-slate-400 text-sm">Loading...</div>}>
            <BlogCard isRedirected={true} />
          </Suspense>
        </div>
      </section>
      
      <section id="features">
        <FeaturesCard />
      </section>
      

    </main>
  );
}
