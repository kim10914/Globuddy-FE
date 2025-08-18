import { useNavigate } from "react-router-dom";

export type SetShowLogoutModal = {
  setShowLogoutModal: (show: boolean) => void;
};

export default function Logout({ setShowLogoutModal }: SetShowLogoutModal) {
  const nav = useNavigate();
  function onCancelHandler() {
    setShowLogoutModal(false);
  }
  function onLogoutHandler() {
    setShowLogoutModal(false);
    localStorage.removeItem("accessToken");
    nav("/login");
  }

  return (
    <div className="absolute bottom-0 flex flex-col w-full h-1/3 items-center space-y-6 bg-white">
      <h1 className="text-xl pt-4 font-bold">
        Do you want to log out of the app?
      </h1>
      <button
        className="w-11/12  mx-4 p-3 bg-[#0085FF] text-white rounded-lg"
        onClick={onCancelHandler}
      >
        Cancel
      </button>
      <button
        onClick={onLogoutHandler}
        className="w-11/12  mx-4 p-3 bg-white text-[#0085FF] border-1 rounded-lg border-[#0085FF]"
      >
        Logout
      </button>
    </div>
  );
}
