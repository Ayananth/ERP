import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { register as registerUser } from "../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      await registerUser({
        username: data.username,
        password: data.password,
      });

      navigate("/login", {
        state: {
          message:
            "Registration successful. Please sign in.",
        },
      });
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.username?.[0] ||
        responseData?.password?.[0] ||
        "Failed to register user";

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">
        Create Account
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <div>
          <label className="block text-sm mb-1">
            Confirm Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required:
                "Please confirm your password",
              validate: (value) =>
                value === password ||
                "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 text-white py-2 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-slate-900 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
