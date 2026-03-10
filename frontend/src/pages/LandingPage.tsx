import { ArrowRight, Layout, CheckSquare, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import neuraLogo from '../assets/neura_favicon.png';

const VIOLET = "rgb(98, 78, 173)";

function LandingPage() {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col transition-colors duration-300">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
    <img 
      src={neuraLogo} 
      alt="Neura Logo" 
      className="w-8 h-8 object-contain" 
    />
    <span 
      className="text-xl font-bold tracking-tight text-black dark:text-white"
    >
      Neura
    </span>
  </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("login")}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("register")}
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: VIOLET }}
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div
          className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6"
          style={{ color: VIOLET, backgroundColor: "rgb(98 78 173 / 0.08)" }}
        >
          Project · Task · Note Management
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white leading-tight max-w-2xl mb-6">
          Organised thinking,<br />
          <span style={{ color: VIOLET }}>clear execution.</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mb-10 leading-relaxed">
          Neura keeps your projects, tasks, and notes in one place — clean, fast, and out of your way.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("register")}
            className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: VIOLET, boxShadow: `0 8px 32px rgb(98 78 173 / 0.35)` }}
          >
            Start for free <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition underline underline-offset-4"
          >
            View demo
          </button>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-t border-gray-100 dark:border-gray-900 py-12 px-8">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: Layout, title: "Projects", desc: "Group work into focused spaces" },
            { icon: CheckSquare, title: "Tasks", desc: "Track status from to-do to done" },
            { icon: FileText, title: "Notes", desc: "Capture decisions and context" },
          ].map(({ icon: NavIcon, title, desc }) => (
            <div key={title}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "rgb(98 78 173 / 0.1)", color: VIOLET }}
              >
                <NavIcon size={20} />
              </div>
              <div className="text-sm font-semibold text-black dark:text-white mb-1">{title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
