import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authService";

function LoginForm() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      await login(data);

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Invalid username or password";

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Username */}

        <div>
          <label className="block text-sm mb-1">
            Username
          </label>

          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message:
                  "Username must be at least 3 characters",
              },
            })}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <label className="block text-sm mb-1">
            Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password must be at least 6 characters",
              },
            })}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* API Error */}

        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {apiError}
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 text-white py-2 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;