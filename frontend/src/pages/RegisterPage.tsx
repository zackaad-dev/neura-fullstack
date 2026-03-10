import { useNavigate } from 'react-router-dom'; 


function RegisterPage() {
	const VIOLET = "rgb(98, 78, 173)";
	const navigate = useNavigate(); 
	 const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-black dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition";

	return(
		 <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold" style={{ color: VIOLET }}>Neura</span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your workspace</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" className={inputClass} placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Confirm password</label>
              <input type="password" className={inputClass} placeholder="••••••••" />
            </div>

            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full text-sm font-semibold text-white py-3 rounded-xl mt-2 transition hover:opacity-90"
              style={{ backgroundColor: VIOLET }}
            >
              Create account
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold hover:underline"
            style={{ color: VIOLET }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
	);
}

export default RegisterPage;
