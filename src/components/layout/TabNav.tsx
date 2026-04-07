interface Tab { id: string; label: string; icon?: React.ReactNode }
interface Props { tabs: Tab[]; active: string; onChange: (id: string) => void }

export default function TabNav({ tabs, active, onChange }: Props) {
  return (
    <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            active === tab.id
              ? 'border-gurps-600 text-gurps-600 dark:border-gurps-400 dark:text-gurps-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
