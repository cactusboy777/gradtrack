import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FolderKanban,
  GraduationCap,
  Headphones,
  KeyRound,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { evaluatePasswordStrength } from '../../utils/academicLogic';

interface ResetPasswordScreenProps {
  email: string;
  onCompleteReset: () => void;
  onBackToLogin: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  email,
  onCompleteReset,
  onBackToLogin,
}) => {
  const [password, setPassword] = useState('EGI#Pass2025!');
  const [confirmPassword, setConfirmPassword] = useState('EGI#Pass2025!');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(14 * 60 + 58);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSessionSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const policy = evaluatePasswordStrength(password, email);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
  const secs = String(sessionSeconds % 60).padStart(2, '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policy.passedCount < 5) {
      setErrorMsg('يرجى استيفاء جميع ضوابط كلمة المرور الخمسة المعتمدة.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }
    setErrorMsg('');
    onCompleteReset();
  };

  const rules = [
    { label: 'على الأقل 8 خانات', sub: '(يُفضل 12 خانة فأكثر لرفع درجة الحماية)', passed: policy.minLength },
    { label: 'أحرف لاتينية كبيرة وصغيرة', sub: '(A-Z, a-z)', passed: policy.hasUpperAndLower },
    { label: 'رقم واحد على الأقل', sub: '(0-9)', passed: policy.hasDigit },
    { label: 'رمز خاص واحد على الأقل', sub: '(@, #, $, %, !, &, *)', passed: policy.hasSpecialChar },
    { label: 'عدم التطابق مع اسم المستخدم', sub: 'تجنب استخدام البريد الأكاديمي أو أرقام القيد', passed: policy.noUsernameMatch },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B438C] text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-slate-900">GradTrack</span>
                <span className="text-[11px] font-bold bg-blue-50 text-[#0B438C] px-2 py-0.5 rounded-md">
                  بوابة EGI
                </span>
              </div>
              <p className="text-xs text-slate-500">معهد الجزيرة العالي للهندسة والتكنولوجيا بالمقطم</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>اتصال أكاديمي آمن TLS 1.3</span>
          </span>
        </div>
      </header>

      {/* Stepper Bar */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            التحقق من الهوية
          </span>
          <span className="text-slate-400">‹</span>
          <span className="text-[#0B438C] font-bold">تعيين كلمة المرور (الحالية)</span>
          <span className="text-slate-400">‹</span>
          <span className="text-slate-400">اكتمال الدخول</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-slate-700 font-semibold tabular-nums">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>تنتهي الجلسة خلال: {mins}:{secs}</span>
        </span>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Form Card */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#0B438C] text-white flex items-center justify-center shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">تعيين كلمة المرور الجديدة</h1>
              <p className="text-xs text-[#0B438C] font-semibold mt-0.5">
                الرمز التعريفي: S-03 · نظام التحقق الأكاديمي
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed mb-6">
            أدخل كلمة مرور قوية وجديدة لحسابك الأكاديمي المعتمد{' '}
            <span className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-mono text-xs font-bold text-[#0B438C]" dir="ltr">
              {email}
            </span>{' '}
            لتأمين مشاريع التخرج والبيانات الحساسة الخاصة بفريقك.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="new-pass" className="text-xs font-bold text-slate-800">
                  كلمة المرور الجديدة <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] text-slate-500">الحد الأدنى 8 خانات</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="new-pass"
                  type={showPass ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-10 py-3 text-sm font-mono text-slate-900 text-left focus:bg-white focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">
                    مستوى الأمان:{' '}
                    <span
                      className={
                        policy.strengthPercent >= 85
                          ? 'text-emerald-700'
                          : policy.strengthPercent >= 60
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }
                    >
                      {policy.strengthLabel} ({policy.strengthPercent}%)
                    </span>
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {policy.passedCount === 5 ? 'ممتاز' : `${policy.passedCount}/5 مستوفى`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[25, 50, 75, 90].map((threshold, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-colors ${
                        policy.strengthPercent >= threshold
                          ? policy.strengthPercent >= 85
                            ? 'bg-emerald-600'
                            : 'bg-amber-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  تحتوي على درجة إنتروبيا مرتفعة يصعب تخمينها أو اختراقها بالهجمات الآلية.
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="confirm-pass" className="text-xs font-bold text-slate-800">
                  تأكيد كلمة المرور الجديدة <span className="text-rose-600">*</span>
                </label>
                {confirmPassword.length > 0 && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      passwordsMatch
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> كلمتا المرور متطابقتان
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> غير متطابقتين
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="confirm-pass"
                  type={showConfirm ? 'text' : 'password'}
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-10 pl-10 py-3 text-sm font-mono text-slate-900 text-left focus:bg-white focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={logoutAllDevices}
                onChange={(e) => setLogoutAllDevices(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#0B438C] focus:ring-[#0B438C]"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">
                  تسجيل الخروج من كافة الأجهزة والجلسات الأكاديمية الأخرى النشطة فوراً
                </span>
                <span className="text-slate-500">
                  (موصى به أمنياً) ينهي صلاحية أي اتصال سابق في معامل المعهد أو أجهزة الجوال.
                </span>
              </div>
            </label>

            {errorMsg && (
              <div role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-sm py-3.5 px-5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>حفظ كلمة المرور وتأكيد التحديث</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs font-bold text-slate-700 hover:text-[#0B438C] transition-colors cursor-pointer"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </form>
        </section>

        {/* Left Checklist & Context Column */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-extrabold text-slate-900">ضوابط كلمة المرور</h2>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
                {policy.passedCount} من 5 مكتملة
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              وفقاً لسياسة أمن المعلومات المعتمدة من إدارة الدعم الفني بمعهد الجزيرة العالي (EGI):
            </p>
            <ul className="space-y-3">
              {rules.map((r) => (
                <li key={r.label} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-800">{r.label}</div>
                      <div className="text-[11px] text-slate-500">{r.sub}</div>
                    </div>
                  </div>
                  <span
                    className={`font-bold shrink-0 ${
                      r.passed ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {r.passed ? 'مستوفى' : 'مطلوب'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#0B438C] shrink-0" />
              <div>
                <div className="font-bold text-slate-900">معايير أمان معتمدة</div>
                <div className="text-[11px] text-slate-500">متوافق مع المعيار الأكاديمي ISO/IEC 27001</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>تنبيه أمان عمادة المعهد</span>
            </div>
            <p className="text-amber-900/80 leading-relaxed">
              لا تشارك كلمة المرور مع أي من أعضاء الفرق الطلابية أو المشرفين. سيتم إرسال إشعار أمني فوري عبر الرسائل القصيرة والبريد الجامعي فور إتمام التغيير.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B438C] font-bold text-xs flex items-center justify-center">
                GP
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">مشروع التخرج: رادار ذكي IoT</div>
                <div className="text-[11px] text-slate-500">قسم هندسة الحاسبات · الفصل الثاني 2024/2025</div>
              </div>
            </div>
            <FolderKanban className="w-4 h-4 text-[#0B438C]" />
          </div>
        </aside>
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-4 text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#0B438C]" />
            <span>تواجه مشكلة فنية؟ تواصل مع إدارة نظم المعلومات والحاسب الآلي بالمعهد:</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono font-bold text-[#0B438C]" dir="ltr">
              support@egi.edu.eg
            </span>
            <span>المبنى (أ) الدور الأرضي</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
