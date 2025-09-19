import { useLocalizationStore } from '../store';
import { translations } from '../translations';

function Footer() {
  const { currentLanguage } = useLocalizationStore();
  const t = (key, fallback = key) => translations[currentLanguage]?.[key] || fallback;
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-teal-700 text-white text-[10px] md:text-xs text-center py-2 mt-auto shadow-inner">
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 px-2">
        <img src="/logo.png" alt="Logo" className="h-4 w-4 md:h-5 md:w-5 rounded-full border border-white/80 bg-white object-contain" style={{ background: '#fff' }} />
        <span className="whitespace-nowrap">{t('footer.copyright', '© 2025 Vaidya Dhara Team')}</span>
        <span className="hidden md:inline">|</span>
        <span className="whitespace-nowrap">{t('footer.hackathon', 'Smart India Hackathon 2025')}</span>
        <span className="hidden md:inline">|</span>
        <span className="whitespace-nowrap">{t('footer.problem', 'SIH Problem Statement: SIH25049')}</span>
      </div>
    </footer>
  );
}

export default Footer;