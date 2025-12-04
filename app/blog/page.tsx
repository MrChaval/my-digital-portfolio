import { db, blogPosts } from "@/lib/db"; // Import blogPosts table
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/lib/types"; // Import BlogPost type from lib/types
import { BlogSearchFilter } from "@/components/blog-search-filter";

export default async function BlogPage() {
  // Use the imported BlogPost type
  const posts: BlogPost[] = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);

  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Cybersecurity Blog</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Insights, tips, and best practices to help you stay secure in an ever-evolving threat landscape.
              </p>
            </div>
          </div>
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] opacity-5"></div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <BlogSearchFilter posts={posts} />
        </div>
      </section>
    </div>
  );
}
