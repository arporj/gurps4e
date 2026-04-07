import type { Profile } from '@/types/app'

interface Props { profile: Profile; size?: 'sm' | 'md' }

export default function UserBadge({ profile, size = 'md' }: Props) {
  const initials = (profile.display_name || profile.username).slice(0, 2).toUpperCase()
  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'text-sm' : ''}`}>
      <div className={`rounded-full bg-gurps-600 text-white flex items-center justify-center font-medium flex-shrink-0 ${size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'}`}>
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          : initials}
      </div>
      <div className="min-w-0">
        <p className="font-medium truncate">{profile.display_name || profile.username}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs truncate">@{profile.username}</p>
      </div>
    </div>
  )
}
