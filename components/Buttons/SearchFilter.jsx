"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [tag, setTag] = useState(searchParams.get("tag") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setTag(searchParams.get("tag") || "");
  }, [searchParams]);

  const applyFilters = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    search.trim() ? params.set("search", search.trim()) : params.delete("search");
    tag.trim() ? params.set("tag", tag.trim()) : params.delete("tag");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={applyFilters} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search articles"
        className="h-11 w-full rounded-full border border-black/15 bg-white px-4 text-sm text-slate-700 outline-none focus:border-[#7C3AED] sm:w-64"
      />
      <input
        value={tag}
        onChange={(event) => setTag(event.target.value)}
        placeholder="Tag"
        className="h-11 w-full rounded-full border border-black/15 bg-white px-4 text-sm text-slate-700 outline-none focus:border-[#7C3AED] sm:w-36"
      />
      <button className="h-11 rounded-full bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800">
        Search
      </button>
    </form>
  );
}
