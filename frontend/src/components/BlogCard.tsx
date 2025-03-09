import { useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";
interface BlogCardProps {
  title: string;
  content: string;
  authorName?: string;
  authorImage?: string;
  createdAt?: Date;
}

const BlogCard = ({ title, content, createdAt }: BlogCardProps) => {
  const [share, setShare] = useState(false);
  const totalWordsToRead = (title + " " + content).length;
  const minutesToRead = Math.ceil(totalWordsToRead / 200);

  const [isBookmarked, setIsBookmarked] = useState(false);

  // The new keyword is required because Date is a constructor function.It ensures createdAt is converted into a Date object
  const date = createdAt ? new Date(createdAt) : null;

  const formattedDate = date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className=" grid  grid-cols-2 gap-20 items-center">
      <div className="flex flex-col gap-3 ">
        {/* image and authorname */}
        <div className="flex gap-2 items-center ">
          <img
            className="rounded-full w-5 h-5"
            src="https://i.postimg.cc/CKH1gSmd/6289639005951739458-1.jpg"
            alt="avatar"
          />
          <p className="text-sm font-medium">Sujan Khatri</p>
          <p>·</p>
          <p className="text-xs text-slate-600 font-light">{formattedDate}</p>
        </div>
        <div className="flex flex-col gap-2">
          {/* title */}
          <h1 className="font-bitter font-bold text-2xl ">{title}</h1>
          <p className="font-bitter text-base line-clamp-2 text-ellipsis ">
            {content}
          </p>
        </div>
        {/* footer div ,ta time to read,bookmark,share,option  */}
        <div className="flex justify-between items-center mt-3 pr-12 ">
          <div className="flex gap-2 items-center">
            <div className="rounded-4xl w-fit bg-slate-300 text-gray-900 font-bitter text-xs px-2 py-1 ">
              Side Hustle
            </div>
            <p>·</p>
            <p className="text-slate-600 font-bitter text-xs">
              {" "}
              {minutesToRead} min read
            </p>
          </div>
          <div className="flex gap-2">
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
      <div>
        <img
          className="rounded-md object-contain"
          width={160}
          height={107}
          src="https://i.postimg.cc/CKH1gSmd/6289639005951739458-1.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default BlogCard;
