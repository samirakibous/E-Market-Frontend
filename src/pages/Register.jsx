import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // tu peux créer ce composant simple ou le retirer
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        setLoading(true);
        try {
            await register({
                fullname:formData.fullname,
                email: formData.email,
                password: formData.password,
            });
            setSuccess(true);
            setTimeout(() => {
                 navigate("/");
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la création du compte. Essayez à nouveau !");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <div className="mb-8">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                            alt="Fashion"
                            className="w-full h-96 object-cover rounded-lg shadow-2xl"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">skommerce</h2>
                    <p className="text-lg opacity-90">
                        skommerce is an online fashion store that provides a variety of
                        clothes, shoes, bags, and accessories for men and women.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 relative">
        <div className="w-full max-w-md relative">
          <button
            onClick={() => navigate("/login")}
            className="absolute top-8 right-8 w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="mb-8">
            <h1 className="text-sm font-medium text-gray-600 mb-2">skommerce</h1>
            <h2 className="text-3xl font-bold text-gray-900">
              Create Your Account!
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              Account created successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ✅ Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="magikpro@mail.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-12"
                  placeholder="········"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="text-center text-sm mt-2">
              <span className="text-gray-600">Already have an account? </span>
              <button
                type="button"
                className="text-black font-medium hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
