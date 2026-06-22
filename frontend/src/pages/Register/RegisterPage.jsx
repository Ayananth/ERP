import { Navigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  const token = localStorage.getItem(
    "access_token"
  );

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
            Create your account
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
