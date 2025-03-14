import { BlogCard, Navbar, Loading } from "../components";

import { blogType } from "@sujansince2003/blogifycommon";
import { useBlogs } from "../context/BlogContext";

const Blogs = () => {
  const { blogs, isLoading } = useBlogs();

  return (
    <>
      <Navbar />
      <div className=" mx-auto max-w-3xl my-20">
        {isLoading ? (
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
