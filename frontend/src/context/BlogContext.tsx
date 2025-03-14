import { createContext, useContext, useEffect, useState } from "react";
import { blogType } from "@sujansince2003/blogifycommon";
import API from "../axiosInstance";

type BlogContextType = {
  blogs: blogType[];
  setBlogs: (blogs: blogType[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

const BlogContext = createContext<BlogContextType | null>(null);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async (query = "") => {
    setIsLoading(true);
    try {
      const endpoint = query ? `search?query=${query}` : "blogs";
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(response.data.blogs)) {
        setBlogs(response.data.blogs);
      } else {
        console.error("Invalid response data:", response.data);
        setBlogs([]); // Prevents undefined issues
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchBlogs(searchQuery);
    } else {
      fetchBlogs();
    }
  }, [searchQuery]);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        setBlogs,
        isLoading,
        setIsLoading,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlogs must be used within BlogProvider");
  return context;
};
