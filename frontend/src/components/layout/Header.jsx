import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h1 className="font-semibold">
        Exalore ERP
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded bg-red-500 text-white"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;