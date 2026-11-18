import React from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  FlaskConical,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { AcademicDocument, Project, ScreenId } from '../../types';

interface ProjectDetailProps {
  project: Project;
  documents: AcademicDocument[];
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onNotify: (msg: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  documents,
  onNavigate,
  onNotify,
}) => {
  const milestones =
    project.milestones.length > 0
      ? project.milestones
      : [
          {
            id: 1,
            title: 'المرحلة الأولى: كراسة الشروط وخطة البحث المعتمدة',
            description: 'صياغة الإشكالية الهندسية وتحديد دراسة الجدوى.',
            dateLabel: '15 أكتوبر 2024',
            status: 'completed' as const,
            progress: 100,
            scoreLabel: '98 / 100',
          },
          {
            id: 2,
            title: 'المرحلة الثانية: التصميم المعماري وبناء النموذج',
            description: 'تصميم البرمجيات والعتاد المدمج وربط الواجهات.',
            dateLabel: '20 يناير 2025',
            status: 'completed' as const,
            progress: 100,
            scoreLabel: '94 / 100',
          },
          {
            id: 3,
            title: 'المرحلة الثالثة: التجارب المعملية والتقرير النهائي',
            description: 'اختبار الأداء الكلي وتجهيز التقرير الأكاديمي.',
            dateLabel: '20 مايو 2025',
            status: 'active' as const,
            progress: project.progress,
          },
        ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb + Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-[#0B438C] cursor-pointer">
            الرئيسية
          </button>
          <span>‹</span>
          <button type="button" onClick={() => onNavigate('projects')} className="hover:text-[#0B438C] cursor-pointer">
            مشاريع التخرج
          </button>
          <span>‹</span>
          <span className="font-bold text-[#0B438C]">{project.code}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('kanban')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة جديدة</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#0B438C]" />
            <span>رفع مسودة جديدة</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>طلب اجتماع</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Right 7 cols: Title & Description */}
          <div className="xl:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-[#0B438C] text-white font-bold px-2.5 py-1">
                مشروع التخرج المعتمد (الفرقة الرابعة)
              </span>
              <span className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-bold px-2.5 py-1">
                اعتماد المجلس الأكاديمي
              </span>
              <span className="font-mono text-slate-500">{project.code}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug text-balance">
              {project.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {project.topicTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Left 5 cols: 4 Academic Stat Boxes */}
          <div className="xl:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>فحص الاقتباس (Turnitin)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
                {project.turnitinScore}% ضمن الحد الآمن
              </div>
              <div className="text-[11px] text-slate-500 mt-1">المسموح بحد أقصى: 20%</div>
            </div>

            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>التحكيم النهائي</span>
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-xl font-extrabold text-amber-700 tabular-nums">
                {project.daysRemaining} يوماً متبقياً
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{project.defenseDate}</div>
            </div>

            <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>المعمل المخصص</span>
                <FlaskConical className="w-4 h-4 text-[#0B438C]" />
              </div>
              <div className="text-xs font-extrabold text-[#0B438C] leading-snug">
                {project.labRoom}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">متاح: طوال أيام الأسبوع</div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>الاعتماد الأكاديمي</span>
                <Award className="w-4 h-4 text-slate-700" />
              </div>
              <div className="text-sm font-extrabold text-slate-900">معتمد رسمياً</div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                {project.decisionNumber} · مستوفٍ لكافة البنود
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Progress Bar + 4 Track Meters */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                مؤشر التقدم الإجمالي للمشروع
              </h2>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold">
                متقدم وفق الخطة الزمنية المعتمدة
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تم استيفاء مخرجات المراحل الثلاث الأولى بنجاح، والعمل جارٍ على اختبار العينات الميدانية والتقرير النهائي.
            </p>
          </div>
          <div className="text-3xl font-extrabold text-[#0B438C] tabular-nums">
            {project.progress}% <span className="text-xs font-semibold text-slate-500">من متطلبات التخرج</span>
          </div>
        </div>

        <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#0B438C] to-emerald-600"
            style={{ width: `${project.progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'التوثيق والأطر النظرية', pct: project.subProgress.documentation, sub: 'تم تسليم 4 فصول ومراجعتها' },
            { label: 'العتاد الصلب والمتحكمات', pct: project.subProgress.hardware, sub: 'تم تجميع وتوصيل الحساسات بالكامل' },
            { label: 'النماذج وخوارزميات AI', pct: project.subProgress.aiModels, sub: 'تم تدريب الشبكة بدقتها 97.4%' },
            { label: 'المعايرة والاختبار الميداني', pct: project.subProgress.testing, sub: 'جارٍ اختبار 12 محركاً بمعمل 204' },
          ].map((track) => (
            <div key={track.label} className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-800">{track.label}</span>
                <span className="text-[#0B438C] tabular-nums">{track.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-1.5">
                <div className="h-full rounded-full bg-[#0B438C]" style={{ width: `${track.pct}%` }} />
              </div>
              <div className="text-[11px] text-slate-500">{track.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Split: Milestones + Supervisors & Team */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          {/* Milestones Timeline */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  المسار الزمني للمراحل والتسليمات
                </h2>
                <p className="text-xs text-slate-500">تسلسل الخطوات الرسمية لاعتماد مشروع التخرج الأكاديمي</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{milestones.length} محطات رئيسية</span>
            </div>

            <div className="space-y-4">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className={`rounded-2xl border p-4 ${
                    ms.status === 'active'
                      ? 'border-[#0B438C] bg-blue-50/40'
                      : ms.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {ms.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : ms.status === 'active' ? (
                        <RefreshCw className="w-5 h-5 text-[#0B438C] shrink-0" />
                      ) : (
                        <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <h3 className="text-sm font-extrabold text-slate-900">{ms.title}</h3>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        ms.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ms.status === 'active'
                          ? 'bg-[#0B438C] text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ms.status === 'completed'
                        ? 'تم الاعتماد بنجاح (100%)'
                        : ms.status === 'active'
                        ? `قيد التنفيذ (${ms.progress}%)`
                        : 'مجدولة'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{ms.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span>التاريخ: {ms.dateLabel}</span>
                      {ms.scoreLabel && (
                        <span className="font-bold text-emerald-700">التقييم: {ms.scoreLabel}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('documents')}
                      className="font-bold text-[#0B438C] hover:underline cursor-pointer"
                    >
                      {ms.artifactLabel ?? 'عرض المخرجات'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Artifacts Repository */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  مستودع المخرجات والملفات الأكاديمية
                </h2>
                <p className="text-xs text-slate-500">
                  التقارير المرفوعة، شفرات المصدر، ومخططات الدوائر المودعة رسمياً
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('documents')}
                className="rounded-xl bg-[#0B438C] text-white font-bold text-xs px-3.5 py-2 cursor-pointer"
              >
                فتح مدير المستندات الكامل
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <FileText className="w-5 h-5 text-[#0B438C]" />
                      <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        {doc.version}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 font-mono truncate" dir="ltr">
                      {doc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {doc.sizeMB} MB · {doc.uploadedBy}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => onNavigate('documents')}
                      className="font-bold text-[#0B438C] hover:underline cursor-pointer"
                    >
                      معاينة
                    </button>
                    <button
                      type="button"
                      onClick={() => onNotify(`جارٍ تحميل ${doc.name}...`)}
                      aria-label={`تحميل ${doc.name}`}
                      className="text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Left 4 cols: Supervision + Team */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-slate-900">هيئة الإشراف والتحكيم</h2>
              <span className="text-xs text-slate-500">القسم الهندسي</span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#0B438C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  أ س
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{project.supervisor}</div>
                  <div className="text-[11px] text-[#0B438C] font-bold">المشرف الرئيسي</div>
                </div>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600 mb-3">
                <div>البريد الرسمي: s.ahmed@egi.edu.eg</div>
                <div>الساعات المكتبية: الإثنين والأربعاء (11:00 ص - 2:00 م)</div>
                <div>مكتب المشرف: مبنى B - مكتب رقم 314</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('task-detail', 'tsk-042')}
                  className="flex-1 rounded-lg bg-[#0B438C] text-white font-bold text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>مراسلة المشرف</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  الملف
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{project.coSupervisor}</div>
                <div className="text-[11px] text-slate-500">مشرف مساعد · هندسة الاتصالات</div>
              </div>
              <button
                type="button"
                onClick={() => onNotify(`تم فتح نافذة مراسلة ${project.coSupervisor}`)}
                aria-label="مراسلة المشرف المساعد"
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-[#0B438C] cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-slate-900">فريق العمل الأكاديمي</h2>
              <span className="text-xs font-bold text-amber-700">
                {project.teamMembers.length} أعضاء مكلفين
              </span>
            </div>

            <div className="space-y-3">
              {project.teamMembers.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-200/80 p-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${m.avatarColor}`}
                      >
                        {m.initials}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{m.role}</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#0B438C] tabular-nums shrink-0">
                      {m.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
