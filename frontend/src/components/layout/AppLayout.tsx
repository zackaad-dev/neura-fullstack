// ─── APP LAYOUT (sidebar + topbar) ────────────────────────────────────────────
function AppLayout({
  children, activePage, onNavigate, dark, onToggleDark
}: {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (p: Page) => void;
  dark: boolean;
  onToggleDark: () => void;
}) {
  const navItems = [
    { id: "dashboard" as Page, label: "Dashboard", Icon: Icon.Layout },
    { id: "tasks" as Page, label: "Tasks", Icon: Icon.CheckSquare },
    { id: "notes" as Page, label: "Notes", Icon: Icon.FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col justify-between py-8 px-5 shrink-0"
        style={{ backgroundColor: VIOLET }}
      >
        <div>
          {/* Logo */}
          <div className="mb-10 px-1">
            <span className="text-white text-2xl font-bold tracking-tight">Neura</span>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map(({ id, label, Icon: NavIcon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <NavIcon />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          {/* Dark toggle */}
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
          >
            {dark ? <Icon.Sun /> : <Icon.Moon />}
            {dark ? "Light mode" : "Dark mode"}
          </button>

          {/* Logout */}
          <button
            onClick={() => onNavigate("landing")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
          >
            <Icon.LogOut />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
