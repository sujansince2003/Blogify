import { useState, ChangeEvent, useCallback } from "react";
import TinyEditor from "../components/Editor";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Navbar } from "../components";
import API from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const WriteBlog = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublished, setIspublished] = useState<boolean>(true);
  const [coverImgUrl, setCoverImgurl] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const PostBlog = useCallback(async () => {
    if (!token) {
      toast.error("Unauthorized: No token found.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/blog",
        { title, content, isPublished, coverImgUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success("Blog posted successfully!");
        setTitle("");
        setContent("");
        setCoverImgurl("");
        setLoading(false);
      } else {
        toast.error(`Failed to post blog. Status: ${res.status}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [title, content, isPublished, coverImgUrl, token]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0] || null;
    const uploadPreset = import.meta.env.VITE_CloudinaryUploadPreset;
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "react-hono");
    data.append("cloud_name", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${uploadPreset}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const imgData = await res.json();
    setCoverImgurl(imgData?.secure_url);
  }
  return (
    <>
      <div>
        <Toaster />
      </div>
      <Navbar />
      <div className="max-w-3xl  my-14 mx-auto flex flex-col gap-4">
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="title"
        >
          Title
        </label>
        <input
          value={title}
          className="p-2 border-2 border-slate-200 rounded-md"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder="Blog Title"
        />
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="content"
        >
          Content
        </label>
        <TinyEditor
          defaultValue={content}
          onChange={setContent}
          placeholder="Enter Blog Content (markdown supported)"
        />
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="content"
        >
          Cover Image
        </label>
        {coverImgUrl.length === 0 ? (
          <label
            htmlFor="uploadFile1"
            className="flex bg-slate-500 hover:bg-slate-600 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 mr-2 fill-white inline"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            Upload Cover Image
            <input
              onChange={handleFile}
              type="file"
              id="uploadFile1"
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-3 items-end">
            <img className="rounded-xl" src={coverImgUrl} alt="coverimg" />
            <div
              onClick={() => {
                setCoverImgurl("");
              }}
              className=" p-2 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <RiDeleteBin6Line className="text-slate-500 text-2xl  " />
            </div>
          </div>
        )}

        <label
          className="block mb-2 text-sm font-medium text-gray-900"
          htmlFor="content"
        >
          Publish Type
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            onChange={() => {
              setIspublished(!isPublished);
            }}
            value=""
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-slate-600 "></div>
          <span className="ms-3 text-sm font-medium text-gray-900">
            Toggle to publish later
            <span className="italic">
              {isPublished
                ? ""
                : "(You have choose to publish later.You can publish from your dashboard )"}{" "}
            </span>
          </span>
        </label>
        <hr className="w-full bg-slate-500 " />
        <div>
          <button
            disabled={loading}
            onClick={PostBlog}
            className="px-3 py-1 cursor-pointer hover:bg-slate-600 text-white bg-slate-500 rounded-md "
          >
            {loading ? "Posting blog...." : "Post Blog"}
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteBlog;
