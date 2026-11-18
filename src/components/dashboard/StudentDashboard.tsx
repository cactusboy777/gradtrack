import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  MessageSquare,
  Plus,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import type {
  AcademicDocument,
  CalendarEvent,
  KanbanTask,
  Project,
  ScreenId,
} from '../../types';

interface StudentDashboardProps {
  project: Project;
  tasks: KanbanTask[];
  documents: AcademicDocument[];
  events: CalendarEvent[];
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onNotify: (msg: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  project,
  tasks,
  documents,
  events,
  onNavigate,
  onNotify,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [meetingRsvp, setMeetingRsvp] = useState<'pending' | 'confirmed' | 'reschedule'>('pending');

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasksCount = projectTasks.filter((t) => t.column === 'done').length + 15;
  const totalTasksCount = projectTasks.length + 11;

  const visibleTasks = projectTasks.filter((t) => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'todo') return t.column === 'todo';
    if (taskFilter === 'in_progress') return t.column === 'in_progress' || t.column === 'review';
    return t.column === 'done';
  });

  const upcomingDeadlines = events.filter((e) => !e.completed).slice(0, 3);

  const ringRadius = 46;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (project.progress / 100) * ringCirc;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb + Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>الرئيسية</span>
          <span>‹</span>
          <span>بوابة الطالب الأكاديمية</span>
          <span>‹</span>
          <span className="font-bold text-[#0B438C]">لوحة التحكم (S-08)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0B438C]" />
            <span>دليل التوثيق والمعايير</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMeetingRsvp('confirmed');
              onNotify('تم إرسال طلب اجتماع إرشادي مع المشرف الأكاديمي.');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>طلب اجتماع مع المشرف</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('documents')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white px-4 py-2 text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>رفع تسليم / مسودة جديدة</span>
          </button>
        </div>
      </div>

      {/* Student Greeting & Project Hero Card */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B438C] to-[#1D63B8] text-white flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-extrabold">ي ع</span>
              <span className="text-[10px] bg-white/20 px-1.5 rounded mt-0.5">قائد الفريق</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900">مرحباً بك، يوسف علي</h1>
                <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-mono font-bold text-[#0B438C]">
                  كود: 20210348
                </span>
                <span className="text-xs text-slate-500 font-semibold">السنة الرابعة - بكالوريوس</span>
              </div>
              <div className="text-xs font-bold text-[#0B438C] mb-1">مشروع التخرج:</div>
              <button
                type="button"
                onClick={() => onNavigate('project-detail', project.id)}
                className="text-sm font-extrabold text-slate-900 hover:text-[#0B438C] text-right cursor-pointer"
              >
                {project.title}
              </button>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                <span className="font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {project.code}
                </span>
                <span>{project.department}</span>
                <span aria-hidden="true">·</span>
                <span>المشرف: {project.supervisor}</span>
              </div>
              <div className="text-xs font-bold text-amber-700 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>متبقي {project.daysRemaining} يوماً حتى موعد مناقشات لجان التحكيم النهائية</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-center">
              <div className="text-xl font-extrabold text-[#0B438C] tabular-nums">
                {completedTasksCount}/{totalTasksCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 mt-0.5">المهام المنجزة</div>
            </div>
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-4 py-3 text-center">
              <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
                {project.turnitinScore}%
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">اقتباس Turnitin</div>
            </div>
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 px-4 py-3 text-center">
              <div className="text-xl font-extrabold text-amber-700 tabular-nums">19/20</div>
              <div className="text-[11px] font-semibold text-amber-900 mt-0.5">تقييم المسودة</div>
            </div>
          </div>
        </div>

        {/* Approval Notification Strip */}
        <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>اعتماد أكاديمي:</strong> تم اعتماد مسودة الفصل الرابع من المشرف الأكاديمي، وموعد المناقشة التجريبية القادمة تم تحديده يوم الأربعاء القادم بقاعة السيمينار.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('project-detail', project.id)}
            className="font-extrabold text-emerald-800 hover:underline whitespace-nowrap cursor-pointer"
          >
            عرض التفاصيل ‹
          </button>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols */}
        <div className="xl:col-span-8 space-y-6">
          {/* Overall Progress Gauge + Milestones */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <h2 className="text-base font-extrabold text-slate-900">
                مؤشر التقدم العام لمشروع التخرج
              </h2>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                التقدم متوافق مع الجدول الزمني
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                    <circle
                      cx="55"
                      cy="55"
                      r={ringRadius}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r={ringRadius}
                      fill="none"
                      stroke="#0B438C"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {project.progress}%
                    </span>
                    <span className="text-[11px] text-slate-500">مكتمل حتى الآن</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <div className="text-center">
                    <div className="font-extrabold text-emerald-700 tabular-nums">
                      {project.turnitinScore}%
                    </div>
                    <div className="text-[11px] text-slate-500">تشابه Turnitin</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center">
                    <div className="font-extrabold text-[#0B438C]">ممتاز</div>
                    <div className="text-[11px] text-slate-500">الفحص الدوري</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                {[
                  { label: 'المرحلة الأولى: خطة البحث وكراسة الشروط والمواصفات', pct: 100, color: 'bg-emerald-600' },
                  { label: 'المرحلة الثانية: التصميم المعماري وشبكة حساسات IoT', pct: 100, color: 'bg-emerald-600' },
                  { label: 'المرحلة الثالثة: النماذج الأولية وتدريب خوارزميات AI', pct: 85, color: 'bg-[#0B438C]' },
                  { label: 'المرحلة الرابعة: التجارب المعملية والتوثيق والتقرير النهائي', pct: 60, color: 'bg-amber-500' },
                  { label: 'المرحلة الخامسة: المناقشة الختامية مع لجنة التحكيم المعتمدة', pct: 0, color: 'bg-slate-300', locked: true },
                ].map((stage) => (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        {stage.locked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {stage.label}
                      </span>
                      <span className="font-bold text-slate-700 tabular-nums">
                        {stage.locked ? 'معلقة' : `${stage.pct}%`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stage.color}`}
                        style={{ width: `${stage.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Academic Tasks */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                سجل مهام الفريق الأكاديمي
              </h2>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {[
                  { id: 'all', label: `الكل (${projectTasks.length})` },
                  { id: 'todo', label: 'للبدء' },
                  { id: 'in_progress', label: 'جارية' },
                  { id: 'done', label: 'مكتملة' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTaskFilter(t.id as typeof taskFilter)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      taskFilter === t.id
                        ? 'bg-white text-[#0B438C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {visibleTasks.slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onNavigate('task-detail', t.id)}
                  className="w-full text-right rounded-xl border border-slate-200 hover:border-[#0B438C]/50 bg-slate-50/40 hover:bg-blue-50/20 p-4 transition-colors cursor-pointer"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{t.title}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                        <span
                          className={`rounded-md px-2 py-0.5 font-bold ${
                            t.column === 'done'
                              ? 'bg-emerald-50 text-emerald-700'
                              : t.priority === 'حرجة'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {t.column === 'done' ? 'تم الاعتماد' : `أولوية ${t.priority}`}
                        </span>
                        <span className="text-slate-500">{t.domainTag}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-1">{t.description}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="font-semibold text-slate-700">{t.assigneeName}</span>
                      <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 font-bold text-[#0B438C]">
                        {t.dueDate}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 text-left">
              <button
                type="button"
                onClick={() => onNavigate('kanban')}
                className="text-xs font-extrabold text-[#0B438C] hover:underline cursor-pointer"
              >
                فتح لوحة المهام الكاملة (Kanban) ←
              </button>
            </div>
          </section>

          {/* Latest Supervisor Directive */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                آخر توجيهات وملاحظات المشرف الأكاديمي
              </h2>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#0B438C]">
                التقييم الأكاديمي: 19 / 20
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0B438C] text-white font-bold text-xs flex items-center justify-center">
                    أ س
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      أ.د. أحمد السيد محمود إبراهيم
                    </div>
                    <div className="text-[11px] text-slate-500">
                      المشرف الرئيسي · قسم هندسة الحاسب ونظم المعلومات
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500">أمس، الساعة 05:40 م</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white rounded-xl border border-slate-200/80 p-3.5 mb-3">
                "عمل متميز للغاية في الفصل الرابع وخوارزمية 1D-CNN لتصنيف الاهتزازات الميكانيكية. يُرجى توضيح دقة النموذج مقارنة بـ SVM في جدول مقارن قبل طباعة النسخة النهائية للتسليم الرسمي، كما تم إرفاق ملف PDF مع تعديلات الصياغة في الفصل."
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('documents')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-3.5 py-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل المسودة الملاحظ عليها (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('task-detail', 'tsk-042')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0B438C]" />
                  <span>الرد في ساحة النقاش الأكاديمي</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Left 4 cols */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Next Advising Meeting */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <Users className="w-4 h-4 text-[#0B438C]" />
                <h2>الاجتماع الإرشادي القادم</h2>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold">
                {meetingRsvp === 'confirmed'
                  ? 'تم تأكيد حضورك'
                  : meetingRsvp === 'reschedule'
                  ? 'تم طلب التأجيل'
                  : 'مؤكد'}
              </span>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-4 mb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-extrabold text-[#0B438C]">
                    جلسة مراجعة نتائج خوارزميات AI
                  </div>
                  <div className="text-[11px] text-slate-700 mt-1">
                    الأربعاء، 21 مايو 2025 · 11:30 ص - 12:30 م
                  </div>
                </div>
                <Video className="w-4 h-4 text-[#0B438C] shrink-0" />
              </div>
              <div className="text-[11px] text-slate-600 mb-3">
                مكتب أ.د. أحمد السيد (مبنى B - الدور 3 - غرفة 314) + رابط Teams
              </div>
              <div className="rounded-lg bg-white border border-blue-100 p-2.5 text-[11px] text-slate-700 mb-3">
                <strong>جدول الأعمال:</strong> استعراض دقة مصفوفة الارتباك وتجهيز سيناريو العرض العملي للحساسات أمام المحكمين.
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMeetingRsvp('confirmed');
                    onNotify('تم تأكيد حضورك في الاجتماع الإرشادي.');
                  }}
                  className="rounded-lg bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs py-2 cursor-pointer"
                >
                  تأكيد الحضور
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMeetingRsvp('reschedule');
                    onNotify('تم إرسال طلب إعادة جدولة الموعد للمشرف.');
                  }}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 cursor-pointer"
                >
                  اعتذار / تأجيل
                </button>
              </div>
            </div>
          </section>

          {/* Upcoming Deadlines */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-extrabold text-slate-900">المواعيد النهائية القادمة</h2>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#0B438C] hover:underline cursor-pointer"
              >
                المفكرة
              </button>
            </div>
            <div className="space-y-2.5">
              {upcomingDeadlines.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="w-full text-right rounded-xl border border-slate-200 hover:border-[#0B438C]/40 p-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
                    <span className="rounded bg-rose-50 text-rose-700 font-bold px-2 py-0.5">
                      {ev.dateDay} مايو 2025
                    </span>
                    <span className="text-slate-500">{ev.timeLabel}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{ev.title}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Documents */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-extrabold text-slate-900">المستندات والملفات الأخيرة</h2>
              <button
                type="button"
                onClick={() => onNavigate('documents')}
                className="text-xs font-bold text-[#0B438C] hover:underline cursor-pointer"
              >
                كل الملفات
              </button>
            </div>
            <div className="space-y-2">
              {documents.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-slate-200 p-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B438C] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate font-mono text-[11px]" dir="ltr">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {d.sizeMB} MB · {d.uploadedBy}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNotify(`جارٍ تحميل ${d.name}...`)}
                    aria-label={`تحميل ${d.name}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0B438C] shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Team Quick Contact */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-extrabold text-slate-900">أعضاء الفريق والاتصال السريع</h2>
              <span className="text-xs font-bold text-slate-500">{project.teamMembers.length} أعضاء</span>
            </div>
            <div className="space-y-2.5">
              {project.teamMembers.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 ${m.avatarColor}`}>
                      {m.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{m.role}</div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                      m.online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.statusText}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-200 p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">دعم معامل هندسة الحاسب EGI</div>
                  <div className="text-[11px] text-slate-600">حجز أجهزة الفحص ورواسم الإشارة</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNotify('تم إرسال طلب حجز معمل الروبوتات بنجاح.')}
                className="rounded-lg bg-white border border-amber-300 px-3 py-1 font-bold text-amber-900 hover:bg-amber-100 cursor-pointer"
              >
                حجز
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
