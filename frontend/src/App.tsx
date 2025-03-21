import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Blog,
  Login,
  SignUp,
  Blogs,
  Bookmarks,
  WriteBlog,
  Profile,
  NotFound,
} from "./pages";
import Upload from "./pages/Upload";
import { UserProvider } from "./context/UserContext";

import { ProtectedRoute, AuthRoute } from "./components";
import { BlogProvider } from "./context/BlogContext";

function App() {
  return (
    <>
      <UserProvider>
        <BlogProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Blogs />} />
              <Route element={<AuthRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/upload" element={<Upload />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/write" element={<WriteBlog />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BlogProvider>
      </UserProvider>
    </>
  );
}

export default App;
