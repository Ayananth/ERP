import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
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

        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;