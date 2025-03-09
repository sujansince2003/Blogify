import { FiSearch } from "react-icons/fi";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

import { IoBookmark } from "react-icons/io5";
import { useState } from "react";
const Navbar = () => {
  const [viewBookmark, setViewBookmark] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      {/* left */}
      <div className="flex items-center justify-around px-10 py-3 ">
        <div className="flex gap-6 items-center">
          <h1 className="font-bitter text-2xl font-bold">Blogify.</h1>
          <div className="w-56 flex items-center gap-2 py-1 px-3 rounded-3xl border-1 border-slate-200">
            <div>
              <FiSearch className="text-gray-500 text-xl" />
            </div>
            <input
              placeholder="Search"
              type="text"
              className="font-bitter text-base focus-within:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center">
          <div className="flex gap-2 items-center justify-center group cursor-pointer">
            <FaRegPenToSquare className="text-gray-500 group-hover:text-gray-700  text-base" />
            <p className="font-bitter text-base text-gray-500 group-hover:text-gray-700">
              Write
            </p>
          </div>
          {viewBookmark ? (
            <IoBookmark
              onClick={() => setViewBookmark(false)}
              className="text-xl"
            />
          ) : (
            <IoBookmarkOutline
              onClick={() => setViewBookmark(true)}
              className="text-xl"
            />
          )}
          <div className="relative">
            <img
              className="w-8 h-8 rounded-full cursor-pointer  "
              src="https://i.postimg.cc/CKH1gSmd/6289639005951739458-1.jpg"
              alt="avatar"
              onClick={() => {
                setOpenMenu((prev) => !prev);
              }}
            />
            {openMenu ? (
              <ul className="absolute right-0 m-2 w-40 bg-white shadow-lg rounded-md border border-slate-200 p-3">
                <li className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaRegUser />
                  Profile
                </li>
                <li className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer">
                  <MdOutlineLibraryBooks /> Blogs
                </li>
                <li className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer">
                  <MdOutlineLogout /> Logout
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
