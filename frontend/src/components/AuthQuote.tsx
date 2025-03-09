const AuthQuote = () => {
  return (
    <div className="bg-gray-200 h-screen hidden lg:flex justify-center items-center ">
      <div className="max-w-lg flex flex-col gap-1">
        <h1 className="text-2xl font-bold">
          "The customer service i received was beyond my expectations. I would
          definitely recommend this company to anyone looking for top-notch
          customer service."{" "}
        </h1>
        <div>
          <h2 className="max-w-md text-base font-semibold text-left">
            John Doe
          </h2>
          <p className="text-sm text-slate-500 font-light">
            Customer Review | META
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthQuote;
