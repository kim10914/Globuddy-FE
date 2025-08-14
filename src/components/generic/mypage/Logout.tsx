export default function Logout() {
  return (
    <div className="absolute bottom-0 flex flex-col w-full h-1/3 items-center space-y-6 bg-white">
      <h1 className="text-xl pt-4 font-bold">
        Do you want to log out of the app?
      </h1>
      <button className="w-11/12  mx-4 p-3 bg-[#0085FF] text-white rounded-lg ">
        Cancel
      </button>
      <button className="w-11/12  mx-4 p-3 bg-white text-[#0085FF] border-1 rounded-lg border-[#0085FF]">
        Logout
      </button>
    </div>
  );
}
