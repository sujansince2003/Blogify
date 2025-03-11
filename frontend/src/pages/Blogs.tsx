import API from "../axiosInstance";
import { BlogCard, Navbar, Loading } from "../components";
import { useEffect, useState } from "react";
import { blogType } from "@sujansince2003/blogifycommon";

const Blogs = () => {
  const [blogs, setBlogs] = useState<blogType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const blogsData = await API.get("blogs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBlogs(blogsData.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className=" mx-auto max-w-3xl my-20">
        {loading ? (
          <Loading />
        ) : (
          <>
            {blogs.length === 0 && <p>No blogs found</p>}
            <div className="flex flex-col gap-12">
              {blogs.map((blog: blogType, index) => (
                <>
                  <BlogCard
                    id={blog.id}
                    key={blog.id}
                    title={blog.title}
                    content={blog.content}
                    createdAt={blog.createdAt}
                    blogCover={blog.coverImgUrl}
                    user={blog.user}
                  />
                  {index !== blogs.length - 1 && (
                    <hr className="border-gray-300 w-2xl my-2" />
                  )}
                </>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Blogs;
