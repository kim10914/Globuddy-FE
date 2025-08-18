import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const nav = useNavigate();
  return (
    <div>
      <nav className="relative h-12 m-3 flex items-center">
        <button
          className="absolute left-0 top-1/2 text-2xl -translate-y-1/2"
          onClick={() => {
            nav(-1);
          }}
        >
          ←
        </button>
        <h1 className="mx-auto text-center text-xl w-full">Notifications</h1>
      </nav>
      <main>
        <h4>추가 예정입니다</h4>
      </main>
    </div>
  );
}
