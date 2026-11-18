import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Headphones,
  Mail,
  Palette,
  RotateCcw,
  Save,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import type { ScreenId, SystemSettingsState } from '../../types';

interface SystemSettingsProps {
  settings: SystemSettingsState;
  onSaveSettings: (next: SystemSettingsState) => void;
  onResetDefaults: () => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onSaveSettings,
  onResetDefaults,
  onNavigate,
  onNotify,
}) => {
  const [draft, setDraft] = useState<SystemSettingsState>(settings);
  const [activeTab, setActiveTab] = useState<'notifications' | 'security' | 'appearance'>('notifications');
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');

  const enabledCount = [
    draft.emailNewDrafts,
    draft.emailDefenseAssigned,
    draft.emailTurnitinAlerts,
    draft.emailGradingReminders,
    draft.pushStudentInquiries,
    draft.pushCommitteeChanges,
    draft.pushDeanCirculars,
    draft.pushNewLoginAlert,
  ].filter(Boolean).length;

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-[#0B438C]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? '-translate-x-6' : '-translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Dismissible Sync Banner */}
      {showSuccessBanner && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-extrabold text-emerald-900">
                تمت مزامنة تفضيلات الحساب الأكاديمي بنجاح
              </div>
              <div className="text-emerald-800/80">
                تم حفظ التغييرات الأخيرة وفقاً لضوابط الاعتماد الأكاديمي لمعهد الجزيرة (EGI)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white border border-emerald-200 px-3 py-1 font-bold text-emerald-700">
              مُحدّث قبل دقيقتين
            </span>
            <button
              type="button"
              onClick={() => setShowSuccessBanner(false)}
              aria-label="إغلاق تنبيه المزامنة"
              className="p-1 text-emerald-700 hover:text-emerald-950 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <span>الإعدادات والنظام</span>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">إعدادات الحساب والتفضيلات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            إعدادات المنظومة والحساب الأكاديمي
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
            <span className="rounded bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 font-mono">
              حساب أكاديمي مفعل · EGI ID: STAFF-2018-042
            </span>
            <span>
              إدارة تفضيلات الإشعارات، أمان الدخول، وتخصيص تجربة الاستخدام الأكاديمية لمنصة مشاريع التخرج.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              setDraft(settings);
              onNotify('تمت استعادة الإعدادات الافتراضية المعتمدة.');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveSettings(draft);
              setShowSuccessBanner(true);
              onNotify('تم حفظ جميع التغييرات في إعدادات المنظومة بنجاح.');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع التغييرات</span>
          </button>
        </div>
      </section>

      {/* Sub-navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#0B438C] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>تفضيلات الإشعارات ({enabledCount} مفعلة)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#0B438C] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>الأمان والجلسات (محمي 2FA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-[#0B438C] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>المظهر واللغة (العربية)</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer mr-auto"
        >
          <UserCheck className="w-4 h-4 text-[#0B438C]" />
          <span>الحساب والملف الأكاديمي ←</span>
        </button>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols */}
        <div className="xl:col-span-8 space-y-6">
          {activeTab === 'notifications' && (
            <>
              {/* Email Notifications */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        إشعارات البريد الإلكتروني الأكاديمي
                      </h2>
                      <p className="text-xs text-slate-500 font-mono" dir="ltr">
                        البريد المعتمد: a.elsayed@egi.edu.eg
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-blue-50 text-[#0B438C] px-2.5 py-1 text-[11px] font-bold">
                    نطاق رسمي
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    {
                      key: 'emailNewDrafts' as const,
                      title: 'تسليمات المسودات الجديدة من الفرق الطلابية',
                      desc: 'تنبيه بريدي فوري عند رفع مسودة فصل أو تقرير جديد من الفرق الخاضعة لإشرافك',
                    },
                    {
                      key: 'emailDefenseAssigned' as const,
                      title: 'تعيين جلسات تحكيم ومناقشة جديدة من القسم',
                      desc: 'إشعار رسمي بجدول المناقشات وتعيينك رئيساً أو عضواً في لجان التقييم',
                    },
                    {
                      key: 'emailTurnitinAlerts' as const,
                      title: 'تقارير نسب الاقتباس الأكاديمي Turnitin',
                      desc: 'إرسال النتيجة فور اكتمال الفحص مع ملخص التجاوز في حال تخطي حاجز 20%',
                    },
                    {
                      key: 'emailGradingReminders' as const,
                      title: 'تذكيرات المواعيد النهائية لتسليم درجات الطلاب',
                      desc: 'تنبيهات استباقية (قبل 72 ساعة وقبل 24 ساعة) من إغلاق شيت الرصد النهائي',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{item.title}</div>
                        <div className="text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <ToggleSwitch
                        checked={draft[item.key]}
                        onChange={(v) => setDraft((d) => ({ ...d, [item.key]: v }))}
                        label={item.title}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* In-App Push Notifications */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        إشعارات المنظومة اللحظية المباشرة (In-App Push)
                      </h2>
                      <p className="text-xs text-slate-500">تنبيهات تظهر داخل شريط المنصة وأثناء جلسة العمل</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-amber-50 text-amber-800 px-2.5 py-1 text-[11px] font-bold">
                    سطح المكتب والمتصفح
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    {
                      key: 'pushStudentInquiries' as const,
                      title: 'رسائل واستفسارات الطلاب وممثلي الفرق',
                      desc: 'إشعار صوتي ومرئي فوري عند إرسال تعليق جديد على المهام',
                    },
                    {
                      key: 'pushCommitteeChanges' as const,
                      title: 'طلبات تعديل تشكيل لجان المناقشة',
                      desc: 'إشعارات التغييرات الطارئة على تواريخ وقاعات التحكيم',
                    },
                    {
                      key: 'pushDeanCirculars' as const,
                      title: 'التنبيهات الإدارية وتعاميم عمادة المعهد',
                      desc: 'القرارات الأكاديمية واللوائح التنظيمية الخاصة بمشاريع التخرج',
                    },
                    {
                      key: 'pushNewLoginAlert' as const,
                      title: 'تسجيل دخول جديد إلى حسابك الأكاديمي',
                      desc: 'تنبيه أمني فوري في حال فتح الجلسة من جهاز أو متصفح غير معتاد',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900">{item.title}</div>
                        <div className="text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <ToggleSwitch
                        checked={draft[item.key]}
                        onChange={(v) => setDraft((d) => ({ ...d, [item.key]: v }))}
                        label={item.title}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Frequency Selector */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    ملخص التردد الزمني للتقارير والإشعارات الأكاديمية
                  </h2>
                  <p className="text-xs text-slate-500">
                    حدد وتيرة استلام ملخصات تقدم الطلاب والإحصائيات الأسبوعية
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    {
                      id: 'instant' as const,
                      title: 'إشعار فوري',
                      desc: 'استقبال كل تنبيه في لحظة وقوع الحدث (موصى به أثناء فترة التحكيم النهائية).',
                    },
                    {
                      id: 'daily' as const,
                      title: 'ملخص يومي صباحي',
                      desc: 'تقرير موجز يومياً في تمام الساعة 8:00 صباحاً بكافة أنشطة الطلاب.',
                    },
                    {
                      id: 'weekly' as const,
                      title: 'ملخص أسبوعي',
                      desc: 'إرسال نشرة أسبوعية مجمعة صباح كل يوم أحد لجميع المشاريع المسندة.',
                    },
                  ].map((freq) => (
                    <label
                      key={freq.id}
                      className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                        draft.digestFrequency === freq.id
                          ? 'border-[#0B438C] bg-blue-50/70'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-slate-900">{freq.title}</span>
                        <input
                          type="radio"
                          name="digest-freq"
                          checked={draft.digestFrequency === freq.id}
                          onChange={() => setDraft((d) => ({ ...d, digestFrequency: freq.id }))}
                          className="text-[#0B438C]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{freq.desc}</p>
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'security' && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-slate-900">الأمان والمصادقة الثنائية (2FA)</h2>
              <p className="text-slate-600 leading-relaxed">
                حسابك الأكاديمي محمي ببروتوكول المصادقة الثنائية وتشفير الجلسات عبر شبكة معهد الجزيرة العالي.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('reset-password')}
                  className="rounded-xl bg-[#0B438C] text-white font-bold px-4 py-2.5 cursor-pointer"
                >
                  تحديث كلمة المرور الآن
                </button>
                <button
                  type="button"
                  onClick={() => onNotify('تم إنهاء كافة الجلسات الأخرى على الأجهزة غير النشطة.')}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-700 cursor-pointer"
                >
                  إنهاء الجلسات الأخرى
                </button>
              </div>
            </section>
          )}

          {activeTab === 'appearance' && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-slate-900">تخصيص المظهر واللغة الأكاديمية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#0B438C] bg-blue-50/50 p-4">
                  <div className="font-extrabold text-slate-900 mb-1">العربية (RTL) - اللغة الرسمية</div>
                  <div className="text-slate-600">مفعلة للتقارير الرسمية ومحاضر اللجان.</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-extrabold text-slate-900 mb-1">نمط التباين المؤسسي المعتمد</div>
                  <div className="text-slate-600">نظام ألوان معهد الجزيرة العالي (EGI Navy & Slate).</div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Left 4 cols */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#0B438C]" />
              <h2>سياسات حماية البيانات (EGI)</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              تخضع كافة الحسابات والتفضيلات للائحة أمن المعلومات المعتمدة من مجلس إدارة معهد الجزيرة العالي لمشاريع التخرج لعام 2024/2025.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>الامتثال للمعيار الأكاديمي ISO/IEC 27001 في تشفير درجات الطلاب ومداولات اللجان.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>يتم أرشفة سجل النشاطات وسجل الدخول لمدة 5 سنوات لأغراض الجودة والاعتماد.</span>
              </li>
            </ul>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">آخر تدقيق أمني للحساب</div>
                <div className="text-[11px] text-slate-500">14 يناير 2025 - معتمد</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
              <Headphones className="w-4 h-4 text-amber-600" />
              <h2>الدعم الفني الأكاديمي</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              هل تواجه مشكلة في ربط حسابك ببريدك الأكاديمي أو جداول التحكيم؟ تواصل مباشرة مع مسؤولي النظم بالمعهد.
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">مكتب الدعم:</span>
                <span className="font-bold text-slate-900">مبنى ب - الطابق الثالث - غرفة 304</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">البريد السريع:</span>
                <span className="font-mono font-bold text-[#0B438C]" dir="ltr">
                  support@egi.edu.eg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الخط الداخلي:</span>
                <span className="font-mono font-bold text-slate-900">#1080 / #1082</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTicketModal(true)}
              className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0B438C] font-bold py-2.5 cursor-pointer"
            >
              فتح تذكرة دعم فني جديدة
            </button>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-[#0B438C] to-[#08244B] text-white p-5">
            <div className="text-xs text-blue-200">منظومة GradTrack الذكية</div>
            <div className="text-lg font-extrabold mt-1">معهد الجزيرة العالي للهندسة والتكنولوجيا</div>
            <div className="text-xs text-blue-100/80 mt-1">المقطم - القاهرة - جمهورية مصر العربية</div>
          </section>
        </aside>
      </div>

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ticket-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="ticket-title" className="text-lg font-extrabold text-slate-900">
                فتح تذكرة دعم فني أكاديمي
              </h2>
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                aria-label="إغلاق"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!ticketSubject.trim()) return;
                setShowTicketModal(false);
                setTicketSubject('');
                setTicketDetails('');
                onNotify('تم تسجيل تذكرة الدعم الفني برقم #EGI-4410 وسيتم الرد خلال ساعتين.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label htmlFor="tick-subj" className="block font-bold text-slate-800 mb-1">
                  موضوع التذكرة
                </label>
                <input
                  id="tick-subj"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="مثال: صلاحيات رفع تقارير Turnitin..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="tick-desc" className="block font-bold text-slate-800 mb-1">
                  التفاصيل
                </label>
                <textarea
                  id="tick-desc"
                  rows={3}
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="اشرح المشكلة التقنية باختصار..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0B438C] text-white px-5 py-2 font-bold cursor-pointer"
                >
                  إرسال التذكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
