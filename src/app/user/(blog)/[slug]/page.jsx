import BlogDetail from "../../../../../components/Card/BlogDetail";

export default async function BlogPage({ params }) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
