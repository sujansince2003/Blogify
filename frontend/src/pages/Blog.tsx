import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axiosInstance";
import { blogType } from "@sujansince2003/blogifycommon";
import { Loading, Navbar } from "../components";
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";
import DOMPurify from "dompurify";

const Blog = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState<blogType | null>(null);
  const [love, setLove] = useState(false);
  const [share, setShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    async function fetchBlog() {
      setIsLoading(true);
      try {
        const res = await API.get(`/blog/${id}`);
        const data = res.data;

        setBlogData(data.blogExist);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  const date = new Date(blogData?.createdAt || "");
  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const title = blogData?.title;
  const content = blogData?.content;
  const fullContent = (title + " " + content).length;
  const minutesToRead = Math.ceil(fullContent / 200);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-26  ">
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <div className="flex flex-col gap-5">
              <h1 className="font-bitter text-4xl font-extrabold leading-13 ">
                {blogData?.title}
              </h1>

              <div className=" flex justify-between items-center">
                <div className="flex gap-x-4 items-center">
                  <div className="rounded-full w-10 h-10">
                    {blogData?.user.userAvatarUrl ? (
                      <img
                        className="w-full h-full rounded-full "
                        src={blogData?.user.userAvatarUrl}
                        alt="avatar"
                      />
                    ) : (
                      <span className="border border-slate-400 rounded-full w-5 h-5 ">
                        {blogData?.user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h4 className=" font-bitter text-gray-900 text-base ">
                      {blogData?.user.username}
                    </h4>
                    <div className="flex gap-x-1 items-center ">
                      <p className="font-bitter text-sm text-slate-600 font-light">
                        {minutesToRead} min read
                      </p>
                      <p>·</p>
                      <p className="font-bitter text-sm text-slate-600 font-light">
                        {formattedDate}
                      </p>
                      <p>·</p>
                      <div className="rounded-4xl w-fit bg-slate-300 text-gray-900 font-bitter text-xs px-2 py-1 ">
                        Side Hustle
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {love ? (
                    <IoHeartSharp
                      onClick={() => setLove(!love)}
                      className="text-xl"
                    />
                  ) : (
                    <IoHeartOutline
                      onClick={() => setLove(!love)}
                      className="text-xl"
                    />
                  )}
                  <div className="flex gap-3">
                    {isBookmarked ? (
                      <IoBookmark
                        onClick={() => setIsBookmarked(false)}
                        className="text-xl text-slate-600"
                      />
                    ) : (
                      <IoBookmarkOutline
                        onClick={() => setIsBookmarked(true)}
                        className="text-xl text-slate-600"
                      />
                    )}

                    <div className="relative">
                      <IoShareOutline
                        onClick={() => {
                          setShare((prev) => !prev);
                        }}
                        className="text-xl text-slate-600"
                      />
                      {share && (
                        <div className="absolute z-10 -right-4 mt-3   bg-white shadow-lg rounded-md border border-slate-200 p-1">
                          <div className="flex  space-x-3 z-10">
                            <div className="p-2 rounded-3xl hover:bg-slate-100 ">
                              <FaFacebook className="text-blue-500 " />
                            </div>
                            <div className="p-2 rounded-3xl hover:bg-slate-100 ">
                              <RiTwitterXLine />
                            </div>
                            <div className="p-2 rounded-3xl z-20 hover:bg-slate-100 ">
                              <MdContentCopy />
                            </div>
                          </div>

                          {/* Triangle pointing to the IoShareOutline */}
                          <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-slate-200"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300 w-3xl my-2 " />

              <p className="font-bitter text-gray-900 text-xl ">
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blogData?.content ?? ""),
                  }}
                />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
