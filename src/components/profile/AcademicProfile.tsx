import React, { useState } from 'react';
import {
  BadgeCheck,
  Calendar,
  CheckCircle2,
  KeyRound,
  Lock,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Star,
  Users,
  X,
} from 'lucide-react';
import type { AcademicProfileData, ScreenId } from '../../types';

interface AcademicProfileProps {
  profile: AcademicProfileData;
  onSaveProfile: (next: AcademicProfileData) => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const AcademicProfile: React.FC<AcademicProfileProps> = ({
  profile,
  onSaveProfile,
  onNavigate,
  onNotify,
}) => {
  const [draft, setDraft] = useState<AcademicProfileData>(profile);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!draft.researchInterests.includes(newTag.trim())) {
      setDraft((d) => ({
        ...d,
        researchInterests: [...d.researchInterests, newTag.trim()],
      }));
    }
    setNewTag('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      researchInterests: d.researchInterests.filter((t) => t !== tag),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(draft);
    onNotify('تم حفظ التعديلات الأكاديمية واعتمادها في سجل المعهد بنجاح.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <button type="button" onClick={() => onNavigate('settings')} className="hover:text-[#0B438C] cursor-pointer">
              الإعدادات والحساب
            </button>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">الملف الشخصي الأكاديمي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            الملف الشخصي الأكاديمي
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            إدارة الهوية الرقمية والبيانات المعتمدة للمشرف الأكاديمي لدى لجان مشاريع التخرج بالهندسة والتكنولوجيا
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            وضع التحرير المباشر مفعل
          </span>
        </div>
      </section>

      {/* Main Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols: Credentials Form */}
        <form
          onSubmit={handleSave}
          className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                بيانات الاعتماد الأكاديمي وهيئة التدريس
              </h2>
              <p className="text-xs text-slate-500">
                تُستخدم هذه البيانات رسمياً في محاضر لجان المناقشة وتوثيق مشروعات التخرج والشهادات
              </p>
            </div>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-800">
              جاهز للتحرير والاعتماد
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="prof-name" className="block font-bold text-slate-800 mb-1.5">
                الاسم الرباعي الرسمي للأستاذ <span className="text-rose-600">*</span>
              </label>
              <input
                id="prof-name"
                value={draft.fullName}
                onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-semibold focus:bg-white focus:border-[#0B438C] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="prof-id" className="font-bold text-slate-800">
                  الرقم الأكاديمي / القيد الجامعي (EGI-ID)
                </label>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> معتمد من شؤون هيئة التدريس
                </span>
              </div>
              <input
                id="prof-id"
                disabled
                dir="ltr"
                value={draft.egiId}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-mono font-bold text-slate-600 text-left"
              />
            </div>

            <div>
              <label htmlFor="prof-dept" className="block font-bold text-slate-800 mb-1.5">
                القسم العلمي والكلية <span className="text-rose-600">*</span>
              </label>
              <input
                id="prof-dept"
                value={draft.department}
                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#0B438C] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="prof-email" className="font-bold text-slate-800">
                  البريد الإلكتروني الجامعي المعتمد
                </label>
                <span className="text-[11px] text-emerald-700 font-bold">مفعل ومؤمن</span>
              </div>
              <input
                id="prof-email"
                disabled
                dir="ltr"
                value={draft.email}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-mono text-slate-600 text-left"
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="block font-bold text-slate-800 mb-1.5">
                رقم الهاتف المعتمد (لإشعارات الطوارئ والواتساب)
              </label>
              <input
                id="prof-phone"
                dir="ltr"
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-mono text-left focus:bg-white focus:border-[#0B438C] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-rank" className="block font-bold text-slate-800 mb-1.5">
                الرتبة الأكاديمية والمؤهل العلمي <span className="text-rose-600">*</span>
              </label>
              <input
                id="prof-rank"
                value={draft.rank}
                onChange={(e) => setDraft((d) => ({ ...d, rank: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-[#0B438C] focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="prof-bio" className="font-bold text-slate-800">
                النبذة التعريفية والسيرة الأكاديمية (تظهر لطلاب مشاريع التخرج)
              </label>
              <span className="text-[11px] text-slate-500 tabular-nums">
                {draft.bio.length} / 500 حرف
              </span>
            </div>
            <textarea
              id="prof-bio"
              rows={4}
              maxLength={500}
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs sm:text-sm leading-relaxed focus:bg-white focus:border-[#0B438C] focus:outline-none"
            />
          </div>

          {/* Research Interests */}
          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                الاهتمامات البحثية ومجالات تحكيم مشاريع التخرج
              </span>
              <span className="text-[11px] text-slate-500">انقر لإضافة أو إزالة تصنيف</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex flex-wrap items-center gap-2">
              {draft.researchInterests.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B438C] text-white font-bold px-3 py-1.5"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`إزالة ${tag}`}
                    className="hover:text-amber-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {showTagInput ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="اسم المجال..."
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 font-bold cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:border-[#0B438C] hover:text-[#0B438C] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مجال جديد</span>
                </button>
              )}
            </div>
          </div>

          {/* Office Hours */}
          <div className="rounded-xl bg-blue-50/50 border border-blue-200/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <Calendar className="w-5 h-5 text-[#0B438C] shrink-0" />
              <div className="flex-1">
                <label htmlFor="prof-hours" className="block font-bold text-slate-900 mb-1">
                  الساعات المكتبية المعتمدة لاستشارات التخرج
                </label>
                <input
                  id="prof-hours"
                  value={draft.officeHours}
                  onChange={(e) => setDraft((d) => ({ ...d, officeHours: e.target.value }))}
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              آخر تحديث للملف تم في 15 مايو 2025 عبر شبكة المعهد الداخلية (EGI-Intranet)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  onNotify('تم التراجع عن التغييرات غير المحفوظة.');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 font-bold text-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء التراجع</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white px-5 py-2.5 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات الأكاديمية</span>
              </button>
            </div>
          </div>
        </form>

        {/* Left 4 cols: Avatar Card + Activity Stats + Security */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-[#0B438C] p-6 text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0B438C] to-[#1D63B8] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
              أ س
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="text-lg font-extrabold text-slate-900">{draft.fullName}</h2>
                <BadgeCheck className="w-5 h-5 text-[#0B438C]" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">أستاذ دكتور بقسم هندسة الحاسب والمعلوماتية</p>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">الاعتماد الوظيفي:</span>
                <span className="font-bold text-[#0B438C]">{draft.gradeLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">الرمز الأكاديمي للتحقق:</span>
                <span className="font-mono font-bold text-[#0B438C]">{draft.verificationId}</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 pt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                صلاحيات التحكيم والاعتماد مفعلة للفصل الحالي
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">النشاط الأكاديمي الميداني</h2>
              <span className="rounded bg-amber-50 text-amber-800 px-2 py-0.5 font-bold tabular-nums">
                2024 / 2025
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                  {draft.stats.projectsCount}
                </div>
                <div className="text-[11px] text-slate-500">مشاريع تحت الإشراف</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                  0{draft.stats.committeesCount}
                </div>
                <div className="text-[11px] text-slate-500">لجان تحكيم ومناقشة</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-xl font-extrabold text-slate-900 tabular-nums flex items-center gap-1">
                  {draft.stats.studentsCount}
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500">طالباً تم توجيههم</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="text-xl font-extrabold text-slate-900 tabular-nums flex items-center gap-1">
                  {draft.stats.rating}/5
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
                <div className="text-[11px] text-slate-500">تقييم الإشراف العام</div>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">معدل التزام الفرق بالمواعيد</div>
                <div className="text-[11px] text-slate-500">تسليم مسودات المشاريع في موعدها</div>
              </div>
              <span className="text-lg font-extrabold text-[#0B438C] tabular-nums">
                {draft.stats.commitmentRate}%
              </span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">أمان الحساب والجلسات</h2>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold">
                مؤمن 2FA
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">MacBook Pro · شبكة معهد الجزيرة</div>
                <div className="text-[11px] text-slate-500 font-mono">192.168.10.42</div>
              </div>
              <span className="text-emerald-700 font-bold">الآن</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('reset-password')}
              className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 font-bold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#0B438C]" />
              <span>تغيير كلمة المرور</span>
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};
