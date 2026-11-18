import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Headphones,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import type { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
  onGoToRecovery: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToRecovery }) => {
  const [role, setRole] = useState<UserRole>('supervisor');
  const [email, setEmail] = useState('s.ahmed@egi.edu.eg');
  const [password, setPassword] = useState('EGI#Pass2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole);
    setErrorMsg('');
    if (nextRole === 'supervisor') setEmail('s.ahmed@egi.edu.eg');
    else if (nextRole === 'student') setEmail('y.ali2021@student.egi.edu.eg');
    else setEmail('committee.chair@egi.edu.eg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني الجامعي المعتمد بشكل صحيح.');
      return;
    }
    if (password.trim().length < 6) {
      setErrorMsg('كلمة المرور يجب أن تحتوي على 6 خانات على الأقل.');
      return;
    }
    setErrorMsg('');
    onLogin(role, email.trim());
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col lg:flex-row">
      {/* Right Panel: Form (in RTL this sits on the right) */}
      <div className="flex-1 bg-white flex flex-col justify-between px-6 py-6 sm:px-12 lg:px-16">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[#0B438C] font-semibold whitespace-nowrap">
              العام الجامعي 2024 / 2025
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 whitespace-nowrap">
              الفصل الدراسي الثاني
            </span>
          </div>
          <button
            type="button"
            onClick={onGoToRecovery}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0B438C] transition-colors whitespace-nowrap"
          >
            <Headphones className="w-4 h-4" />
            <span>الدعم الفني والأكاديمي</span>
          </button>
        </header>

        {/* Form body */}
        <main className="my-auto py-8 max-w-lg w-full mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>بوابة المنظومة الأكاديمية</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            تسجيل الدخول إلى المنصة
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            أدخل بيانات حسابك الأكاديمي المعتمد من معهد الجزيرة العالي للمتابعة وإدارة الأطروحات.
          </p>

          {/* Role Selector */}
          <div className="mb-5">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              اختر صفتك الأكاديمية للمتابعة:
            </span>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  role === 'student'
                    ? 'bg-white text-[#0B438C] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>طالب باحث</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('supervisor')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  role === 'supervisor'
                    ? 'bg-white text-[#0B438C] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>مشرف أكاديمي</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  role === 'admin'
                    ? 'bg-white text-[#0B438C] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>إدارة / محكم</span>
              </button>
            </div>
          </div>

          {/* Info notice */}
          <div className="rounded-xl bg-[#EEF4FC] border border-blue-200/80 p-3.5 mb-6 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#0B438C] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-700">
              <span className="font-bold text-[#0B438C] block mb-0.5">تنبيه النفاذ الأكاديمي</span>
              يرجى تسجيل الدخول باستخدام البريد الجامعي المعتمد (
              <span className="font-mono font-semibold text-[#0B438C]" dir="ltr">
                @egi.edu.eg
              </span>
              ). في حال مواجهة صعوبة في استرداد الحساب يرجى التوجه لمركز نظم المعلومات.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-800 mb-1.5">
                البريد الإلكتروني الجامعي
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="s.ahmed@egi.edu.eg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-4 py-3 text-sm font-mono text-slate-900 text-left focus:bg-white focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-800">
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={onGoToRecovery}
                  className="text-xs font-semibold text-[#0B438C] hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-11 py-3 text-sm font-mono text-slate-900 text-left focus:bg-white focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0B438C] focus:ring-[#0B438C]"
                />
                <span>تذكر تسجيل دخولي على هذا الجهاز</span>
              </label>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>جلسة عمل مؤمنة TLS 1.3</span>
              </span>
            </div>

            {errorMsg && (
              <div role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-sm py-3.5 px-5 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>تسجيل الدخول للمنظومة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="relative py-2 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                أو من خلال النفاذ الإلكتروني الموحد
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            <button
              type="button"
              onClick={() => onLogin(role, email.trim())}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#0B438C]" />
              <span>تسجيل الدخول الموحد للجامعة (EGI Single Sign-On)</span>
            </button>
          </form>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          هل تواجه مشكلة تقنية أو لم تستلم بيانات الاعتماد؟ تواصل مع الدعم الفني:{' '}
          <span className="font-mono font-semibold text-[#0B438C]" dir="ltr">
            support@egi.edu.eg
          </span>
        </footer>
      </div>

      {/* Left Panel: Navy EGI Institutional Showcase */}
      <aside className="lg:w-[46%] bg-gradient-to-br from-[#0B3E82] via-[#082C5E] to-[#051B3B] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Top institute branding */}
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-tight">GradTrack</span>
                <span className="text-[11px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                  EGI
                </span>
              </div>
              <p className="text-xs text-blue-100/80">معهد الجزيرة العالي للهندسة والتكنولوجيا</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-[11px] font-medium text-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>معتمد من وزارة التعليم العالي</span>
          </span>
        </div>

        {/* Center showcase card */}
        <div className="my-10 relative z-10">
          <div className="rounded-2xl bg-white/8 border border-white/15 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 bg-slate-950/50 border border-white/15 rounded-xl px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <div className="text-right">
                  <div className="text-xs font-bold">فحص الاقتباس المباشر</div>
                  <div className="text-[11px] text-blue-200/80">تكامل كامل مع Turnitin</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/25 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-xs font-bold tabular-nums">100%</div>
                  <div className="text-[11px] text-emerald-200/80">أرشفة رقمية معتمدة</div>
                </div>
              </div>
            </div>

            {/* Clean architectural academic illustration SVG */}
            <div className="rounded-xl bg-gradient-to-b from-[#0E4A99] to-[#08244B] border border-white/15 p-6 text-center">
              <svg
                viewBox="0 0 360 150"
                className="w-full h-36 mx-auto"
                role="img"
                aria-label="بوابة معهد الجزيرة العالي للأطروحات"
              >
                <defs>
                  <linearGradient id="archGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                <rect x="20" y="18" width="90" height="58" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />
                <line x1="32" y1="34" x2="92" y2="34" stroke="#93C5FD" strokeWidth="2" />
                <line x1="32" y1="46" x2="78" y2="46" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <line x1="32" y1="58" x2="86" y2="58" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

                <rect x="250" y="18" width="90" height="58" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />
                <rect x="264" y="42" width="12" height="24" rx="2" fill="#60A5FA" />
                <rect x="282" y="34" width="12" height="32" rx="2" fill="#34D399" />
                <rect x="300" y="28" width="12" height="38" rx="2" fill="#FBBF24" />
                <rect x="318" y="38" width="12" height="28" rx="2" fill="#93C5FD" />

                {/* Central Arch */}
                <path
                  d="M 135 135 L 135 65 Q 135 22 180 22 Q 225 22 225 65 L 225 135 Z"
                  fill="rgba(255,255,255,0.12)"
                  stroke="url(#archGold)"
                  strokeWidth="3"
                />
                <path
                  d="M 150 135 L 150 70 Q 150 38 180 38 Q 210 38 210 70 L 210 135 Z"
                  fill="rgba(11,67,140,0.65)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.5"
                />
                {/* Podium */}
                <rect x="155" y="106" width="50" height="29" rx="4" fill="#0B438C" stroke="rgba(255,255,255,0.35)" />
                <rect x="165" y="92" width="30" height="8" rx="4" fill="url(#archGold)" />
              </svg>
              <div className="mt-2 text-xs font-semibold text-blue-100">
                منظومة التوثيق والمناقشة الرقمية المعتمدة
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-extrabold leading-snug mb-3 text-balance">
              بوابتكم الموحدة لإدارة ومناقشة مشاريع التخرج الأكاديمية
            </h2>
            <p className="text-sm text-blue-100/80 leading-relaxed max-w-md mx-auto">
              منظومة رقمية رائدة تربط بين الباحثين والمشرفين ولجان التحكيم وفق أعلى معايير الجودة والاعتماد المؤسسي.
            </p>
          </div>
        </div>

        {/* Bottom 3 highlights + copyright */}
        <div className="relative z-10 space-y-5">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-white/8 border border-white/10 p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold leading-tight">اعتماد فوري للدرجات والمحاضر</span>
            </div>
            <div className="rounded-xl bg-white/8 border border-white/10 p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="font-semibold leading-tight">فحص نسب الاقتباس الأكاديمي</span>
            </div>
            <div className="rounded-xl bg-white/8 border border-white/10 p-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-semibold leading-tight">متابعة مسودات وتقارير الإنجاز</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-200/70 border-t border-white/10 pt-4">
            <span>© 2025 معهد الجزيرة العالي - المقطم، القاهرة.</span>
            <div className="flex items-center gap-4">
              <span>سياسة الخصوصية</span>
              <span>شروط الاستخدام والأمان</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
