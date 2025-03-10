import { FiSearch } from "react-icons/fi";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoBookmarkOutline } from "react-icons/io5";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

import { IoBookmark } from "react-icons/io5";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [viewBookmark, setViewBookmark] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { user, isLoggedIn, logout } = useUser();
  console.log(user);
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
        {isLoggedIn ? (
          <div className="flex gap-5 items-center justify-center">
            <Link
              to="/write"
              className="flex gap-2 items-center justify-center group cursor-pointer"
            >
              <FaRegPenToSquare className="text-gray-500 group-hover:text-gray-700  text-base" />
              <p className="font-bitter text-base text-gray-500 group-hover:text-gray-700">
                Write
              </p>
            </Link>
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
              <div
                className="w-8 h-8 rounded-full cursor-pointer "
                onClick={() => {
                  setOpenMenu((prev) => !prev);
                }}
              >
                {user?.userAvatarUrl ? (
                  <img
                    className="w-8 h-8 rounded-full cursor-pointer"
                    src={user?.userAvatarUrl}
                    alt="avatar"
                  />
                ) : (
                  <span className="border border-slate-400 rounded-full ">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {openMenu ? (
                <ul className="absolute right-0 m-2 w-40 bg-white shadow-lg rounded-md border border-slate-200 p-3">
                  <li className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer">
                    <FaRegUser />
                    Profile
                  </li>
                  <li className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer">
                    <MdOutlineLibraryBooks /> Blogs
                  </li>
                  <li
                    onClick={logout}
                    className="flex gap-2 items-center rounded-xl px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <MdOutlineLogout /> Logout
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            {" "}
            <div className=" flex gap-x-4">
              <button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="border border-transparent bg-slate-300 hover:border hover:border-slate-300 hover:bg-transparent text-gray-900 font-bitter text-base px-3 py-1 rounded-md "
              >
                Login
              </button>
              <button
                onClick={() => {
                  window.location.href = "/signup";
                }}
                className="border hover:bg-slate-300 border-slate-300 text-gray-900 font-bitter text-base px-3 py-1 rounded-md"
              >
                Create Account
              </button>
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
