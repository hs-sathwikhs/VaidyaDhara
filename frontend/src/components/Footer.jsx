import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-auto border-t border-gray-800/80 bg-gray-900/80">
      <div className="container-padded py-4 text-xs text-gray-400 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl">{t.disclaimer}</p>
        <p className="text-gray-500">© {new Date().getFullYear()} Vaidya Dhara</p>
      </div>
    </footer>
  )
}
