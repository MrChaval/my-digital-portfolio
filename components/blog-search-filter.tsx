"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

type SortOption = "alphabetical" | "newest" | "oldest";

interface BlogSearchFilterProps {
  posts: BlogPost[];
}

export function BlogSearchFilter({ posts }: BlogSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSortedPosts = useMemo(() => {
    // Filter posts by search query
    let filtered = posts.filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        (post.author && post.author.toLowerCase().includes(searchLower))
      );
    });

    // Sort posts
    const sorted = [...filtered];
    switch (sortBy) {
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case "oldest":
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB;
        });
        break;
    }

    return sorted;
  }, [posts, searchQuery, sortBy]);

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blogs by title, content, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Date Posted (Newest)</SelectItem>
              <SelectItem value="oldest">Date Posted (Oldest)</SelectItem>
              <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredAndSortedPosts.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
      </div>

      {/* Blog Posts Grid */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {post.coverImage && (
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-2">
                <p className="text-sm text-muted-foreground">
                  {post.createdAt ? formatDate(post.createdAt) : "Date unavailable"}
                </p>
                {post.readTime && (
                  <p className="text-xs text-muted-foreground">📖 {post.readTime}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">No posts found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
