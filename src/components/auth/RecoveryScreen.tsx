import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Info,
  Lock,
  Mail,
  MailCheck,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface RecoveryScreenProps {
  onBackToLogin: () => void;
  onProceedToReset: (email: string) => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onBackToLogin,
  onProceedToReset,
}) => {
  const [email, setEmail] = useState('s.ahmed@egi.edu.eg');
  const [sentEmail, setSentEmail] = useState('s.ahmed@egi.edu.eg');
  const [countdown, setCountdown] = useState(58);
  const [errorMsg, setErrorMsg] = useState('');
  const [sentBanner, setSentBanner] = useState(true);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.toLowerCase().endsWith('@egi.edu.eg')) {
      setErrorMsg('يجب استخدام البريد الأكاديمي المنتهي بـ @egi.edu.eg حصراً.');
      return;
    }
    setErrorMsg('');
    setSentEmail(email.trim());
    setSentBanner(true);
    setCountdown(58);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xs border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B438C] text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-slate-900">GradTrack</span>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  EGI Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">معهد الجزيرة العالي للهندسة والتكنولوجيا بالمقطم</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-[#0B438C]">
            بوابة المنظومة الأكاديمية | استعادة الوصول للحساب
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: Recovery Form */}
        <section className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B438C] shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">استعادة كلمة المرور</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  الخطوة الأولى للوصول إلى مشاريع التخرج واللجان الأكاديمية
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-5">
              أدخل بريدك الإلكتروني الأكاديمي المعتمد (
              <span className="font-mono font-bold text-[#0B438C]" dir="ltr">
                @egi.edu.eg
              </span>
              ) المسجل بالمنظومة، وسنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور فوراً.
            </p>

            <div className="rounded-xl bg-[#EEF4FC] border border-blue-200/70 p-4 mb-6 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0B438C] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-[#0B438C] block mb-0.5">تنبيه أمني معتمد:</span>
                يجب استخدام البريد الأكاديمي الصادر حصراً عن وحدة تكنولوجيا المعلومات بالمعهد للطلبة وأعضاء هيئة التدريس لضمان التحقق الثنائي.
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label htmlFor="recovery-email" className="block text-xs font-bold text-slate-800 mb-1.5">
                  البريد الإلكتروني الجامعي <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="recovery-email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s.ahmed@egi.edu.eg"
                    className="w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 py-3 text-sm font-mono text-slate-900 text-left focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  مثال:{' '}
                  <span className="font-mono" dir="ltr">
                    student_id@egi.edu.eg
                  </span>{' '}
                  أو البريد الوظيفي لأعضاء هيئة التدريس
                </p>
              </div>

              {errorMsg && (
                <div role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-sm py-3.5 px-5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>إرسال رابط إعادة التعيين</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-[#0B438C] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى تسجيل الدخول</span>
              </button>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Lock className="w-3.5 h-3.5" />
                <span>تشفير طرفي TLS 1.3 معتمد</span>
              </span>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-xs text-slate-600">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              تواجه مشكلة في تذكر بريدك الجامعي؟ تواصل مع الدعم الفني:{' '}
              <span className="font-mono font-bold text-[#0B438C]" dir="ltr">
                support@egi.edu.eg
              </span>{' '}
              أو مراجعة إدارة نظم المعلومات والحاسب الآلي بمبنى (أ) الدور الأرضي.
            </p>
          </div>
        </section>

        {/* Left Column: Link Sent Confirmation + Guidelines */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-emerald-600 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sentBanner ? 'جاهز للاستخدام' : 'بانتظار الإرسال'}</span>
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MailCheck className="w-5 h-5" />
              </div>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              تم إرسال رابط إعادة التعيين بنجاح!
            </h2>
            <p className="text-xs text-slate-600 mb-3">تم إرسال تعليمات إعادة تعيين كلمة المرور إلى:</p>

            <div className="rounded-xl bg-[#EEF4FC] border border-blue-100 py-2.5 px-3 text-center font-mono text-sm font-bold text-slate-900 mb-2" dir="ltr">
              {sentEmail}
            </div>
            <p className="text-[11px] text-slate-500 text-center mb-4">
              يرجى فحص صندوق الوارد أو مجلد الرسائل الترويجية/غير المرغوب فيها (Spam).
            </p>

            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 flex items-center justify-center gap-2 text-xs text-slate-700 mb-4">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                صلاحية الرابط الأمني تنتهي تلقائياً خلال <strong className="text-slate-900">30 دقيقة</strong> لأسباب أمنية.
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onProceedToReset(sentEmail)}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح البريد الجامعي (Webmail) والانتقال للتعيين</span>
              </button>

              <button
                type="button"
                disabled={countdown > 0}
                onClick={() => setCountdown(58)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 font-semibold text-xs py-2.5 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer tabular-nums"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {countdown > 0
                    ? `إعادة إرسال الرابط (متاح بعد ${countdown} ثانية)`
                    : 'إعادة إرسال رابط التحقق الآن'}
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-[#0B438C]" />
              <h3>إرشادات أمان الحساب الأكاديمي</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>لا تشارك رابط استعادة الحساب المرسل إليك مع أي شخص حتى منسقي المشروعات.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>يجب أن تتكون كلمة المرور الجديدة من 8 خانات تتضمن رموزاً وأرقاماً وأحرفاً إنجليزية.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>في حال فقدان حق الوصول لبريدك الإلكتروني، راجع مشرفك الأكاديمي لإصدار تصريح هوية.</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};
