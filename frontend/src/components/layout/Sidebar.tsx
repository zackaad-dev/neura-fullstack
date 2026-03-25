import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '../icons/Icons'
import { SettingsModal } from '../ui/SettingsModal'
import { useLogout } from '../../hooks/useLogout'
import { getProjects, projectKeys } from '../../features/projects/api'

const VIOLET = 'rgb(98, 78, 173)'

interface SidebarProps {
  activePage: 'dashboard' | 'tasks' | 'notes'
  dark: boolean
  onToggleDark: () => void
}

const MOCK_USER = {
  name: 'tinoz',
  email: 'tinoz@example.com',
}

export function Sidebar({ activePage, dark, onToggleDark }: SidebarProps) {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [projectsExpanded, setProjectsExpanded] = useState(true)

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', Icon: Icon.Layout },
    { id: 'tasks' as const, label: 'Tasks', Icon: Icon.CheckSquare },
    { id: 'notes' as const, label: 'Notes', Icon: Icon.FileText },
  ]

  const { data: projects } = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
  })

  const handleNavigate = (page: 'dashboard' | 'tasks' | 'notes') => {
    const path = page === 'dashboard' ? '/dashboard' : `/${page}`
    navigate(path)
  }

  const logout = useLogout()

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
  }

  return (
    <aside
      className="w-60 flex flex-col justify-between py-8 px-5 shrink-0"
      style={{ backgroundColor: VIOLET }}
    >
      {/* Top section */}
      <div>
        {/* Logo */}
        <div className="mb-8 px-1">
          <span className="text-white text-2xl font-bold tracking-tight">Neura</span>
        </div>

        {/* User Dropdown */}
        <div className="relative mb-10">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2.5 text-white transition-all"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-semibold shrink-0">
                {MOCK_USER.name[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{MOCK_USER.name}</div>
                <div className="text-xs text-white/60 truncate">1/5 opgaver</div>
              </div>
            </div>
            <Icon.ChevronDown />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="text-sm font-semibold text-black dark:text-white">
                  {MOCK_USER.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{MOCK_USER.email}</div>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setSettingsOpen(true)
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition text-left"
              >
                <Icon.Settings />
                Indstillinger
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800"></div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  onToggleDark()
                  setDropdownOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition text-left"
              >
                {dark ? <Icon.Sun /> : <Icon.Moon />}
                {dark ? 'Light mode' : 'Dark mode'}
              </button>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition text-left"
              >
                <Icon.LogOut />
                Log ud
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map(({ id, label, Icon: NavIcon }) => {
            const active = activePage === id
            return (
              <button
                key={id}
                onClick={() => {
                  handleNavigate(id)
                  setDropdownOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <NavIcon />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Projects Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            <span>Projects</span>
            <div
              className={`ml-auto transition-transform duration-200 ${
                projectsExpanded ? 'rotate-180' : ''
              }`}
            >
              <Icon.ChevronDown />
            </div>
          </button>

          {projectsExpanded && (
            <div className="mt-2 space-y-1">
              {projects?.length ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all text-left truncate"
                    title={project.name}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></span>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-white/40 italic">No projects</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom section - Settings and Version */}
      <div className="space-y-1 text-xs text-white/60">
        <button
          onClick={() => {
            setSettingsOpen(true)
            setDropdownOpen(false)
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-white hover:bg-white/10 transition text-left"
        >
          <Icon.Settings />
          <span>Indstillinger</span>
        </button>

        <div className="text-xs text-white/40 px-3 py-2.5">
          <div>v0.0.1</div>
          <div>Change log</div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={dark}
        onToggleDark={onToggleDark}
      />
    </aside>
  )
}
