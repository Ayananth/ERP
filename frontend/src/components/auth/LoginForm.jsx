import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1 text-sm">
            Username
          </label>

          <input
            {...register("username")}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">
            Password
          </label>

          <input
            type="password"
            {...register("password")}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 text-white py-2"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;