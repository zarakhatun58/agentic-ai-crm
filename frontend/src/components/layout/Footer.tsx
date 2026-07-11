import { Mail, Heart } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/jahanara-khatun/';
const GITHUB_URL = 'http://github.com/zarakhatun58';
const EMAIL = 'jkhaun258@gmail.com';

export default function Footer() {
  return (
    <footer className="flex-shrink-0 bg-white border-t border-slate-200/80">
      <div className="h-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      <div className="px-4 md:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Credit line */}
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span className="text-xs text-slate-500">
              Project Agentic AI, built by
            </span>
            <span className="text-xs font-bold text-slate-800">Jahanara Khatun</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{EMAIL}</span>
              <span className="sm:hidden">Email</span>
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
                 <span className="text-slate-300 w-3.5 h-3.5">•</span>
              <span>LinkedIn</span>
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
                <span className="text-slate-300">•</span>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
