import { useLang } from '../context/LanguageContext'
import { Languages, UserCircle2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const { lang, setLang, t } = useLang()
  return (
    <header className="w-full border-b border-gray-800/80 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
      <div className="container-padded h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="text-lg font-semibold text-white">
            {t.appName}
          </NavLink>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-300">
            <NavLink to="/" className={({isActive})=>`hover:text-white ${isActive? 'text-primary-400' : ''}`}>{t.chat}</NavLink>
            <NavLink to="/dashboard" className={({isActive})=>`hover:text-white ${isActive? 'text-primary-400' : ''}`}>{t.dashboard}</NavLink>
            <NavLink to="/symptoms" className={({isActive})=>`hover:text-white ${isActive? 'text-primary-400' : ''}`}>{t.symptomChecker}</NavLink>
            <NavLink to="/tips" className={({isActive})=>`hover:text-white ${isActive? 'text-primary-400' : ''}`}>{t.healthTips}</NavLink>
            <NavLink to="/emergency" className={({isActive})=>`hover:text-white ${isActive? 'text-primary-400' : ''}`}>{t.emergency}</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-primary-400" />
            <select aria-label={t.language} value={lang} onChange={e=>setLang(e.target.value)} className="input h-9 py-1">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <UserCircle2 className="w-6 h-6" />
            <span className="hidden sm:block text-sm">Guest</span>
          </div>
        </div>
      </div>
    </header>
  )
}
