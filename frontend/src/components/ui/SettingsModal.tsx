import { useState } from 'react'
import { Icon } from '../icons/Icons'

type SettingsPage = 'profile' | 'password' | 'delete-account' | 'default-view' | 'sidebar'

const MOCK_USER = {
  name: 'tinoz',
  email: 'tinoz@example.com',
}

const MOCK_SIDEBAR_OPTIONS = [
  { id: 'upcoming', label: 'Upcoming', checked: true },
  { id: 'today', label: 'Today', checked: true },
]

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isDark: boolean
  onToggleDark: () => void
}

interface SidebarOption {
  id: string
  label: string
  checked: boolean
}

export function SettingsModal({ isOpen, onClose, isDark, onToggleDark }: SettingsModalProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('profile')
  const [sidebarOptions, setSidebarOptions] = useState<SidebarOption[]>(MOCK_SIDEBAR_OPTIONS)
  const [defaultViewNotesPerPage, setDefaultViewNotesPerPage] = useState('10')
  const [defaultViewTasksPerPage, setDefaultViewTasksPerPage] = useState('10')

  if (!isOpen) return null

  const handleToggleSidebarOption = (id: string) => {
    setSidebarOptions(
      sidebarOptions.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    )
  }

  const menuItems = [
    {
      category: 'Account',
      items: [
        { id: 'profile' as const, label: 'Profile' },
        { id: 'password' as const, label: 'Change Password' },
        { id: 'delete-account' as const, label: 'Delete Account' },
      ],
    },
    {
      category: 'General',
      items: [
        { id: 'default-view' as const, label: 'Default View' },
        { id: 'sidebar' as const, label: 'Sidebar' },
      ],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-black dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Menu */}
          <div className="w-48 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
            {menuItems.map((section) => (
              <div key={section.category}>
                <div className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.category}
                </div>
                <div className="space-y-1 px-2 pb-4">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        currentPage === item.id
                          ? 'bg-white dark:bg-black text-black dark:text-white font-medium shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Settings Pages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentPage === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={MOCK_USER.name}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-black dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={MOCK_USER.email}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-black dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'password' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition mt-2">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'delete-account' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Delete Account
                </h3>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    This action is permanent and cannot be undone. All your data will be deleted
                    immediately.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type your email to confirm
                    </label>
                    <input
                      type="email"
                      placeholder={MOCK_USER.email}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'default-view' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Default View
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes per page
                    </label>
                    <select
                      value={defaultViewNotesPerPage}
                      onChange={(e) => setDefaultViewNotesPerPage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tasks per page
                    </label>
                    <select
                      value={defaultViewTasksPerPage}
                      onChange={(e) => setDefaultViewTasksPerPage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'sidebar' && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Sidebar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Choose which sections to display in the sidebar
                </p>
                <div className="space-y-3">
                  {sidebarOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={() => handleToggleSidebarOption(option.id)}
                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isDark ? 'Light mode' : 'Dark mode'}
                    </span>
                    <button
                      onClick={onToggleDark}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDark ? 'bg-violet-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDark ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
