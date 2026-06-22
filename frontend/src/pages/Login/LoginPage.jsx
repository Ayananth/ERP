import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Alert from "../../components/common/Alert";
import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(
      location.state?.message || ""
    );

    const token = localStorage.getItem(
      "access_token"
    );

    useEffect(() => {
      if (!successMessage) return;

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }, [successMessage]);

    if (token) {
      return <Navigate to="/" replace />;
    }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Exalore ERP
          </h1>

        <p className="text-slate-500 mt-2">
          Inventory & Sales Management
        </p>
        </div>

        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />

        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
