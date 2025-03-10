import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <section className="bg-white min-h-screen ">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 font-bitter ">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl font-bitter ">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 font-bitter ">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <div className="flex gap-x-4 items-center justify-center">
            <Link
              to="/"
              className="inline-flex text-gray-900 bg-slate-300 hover:bg-primary-800 font-bitter  font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4"
            >
              Back to Homepage
            </Link>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className=" cursor-pointer inline-flex text-gray-900 bg-slate-300 hover:bg-primary-800 font-bitter  font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4"
            >
              {" "}
              Reload
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
