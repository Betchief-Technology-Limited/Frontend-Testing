import { useContext, useState } from "react";
import { UserContext } from "../useContextAPI/userContextApi";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../config/api.js";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    const data = await loginAdmin(form);
      setUser(data.admin);
      navigate("/api-keys");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input mb-4"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
