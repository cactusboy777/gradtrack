import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FolderKanban,
  Gavel,
  Headphones,
  Info,
  Lock,
  Plus,
  Users,
  X,
} from 'lucide-react';
import type {
  DepartmentName,
  Project,
  ScreenId,
  SubmissionReviewItem,
} from '../../types';

interface SupervisorDashboardProps {
  projects: Project[];
  submissions: SubmissionReviewItem[];
  onUpdateSubmissionStatus: (id: string, nextStatus: SubmissionReviewItem['status']) => void;
  onCreateProject: (data: {
    title: string;
    department: DepartmentName;
    supervisor: string;
    leaderName: string;
  }) => void;
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onNotify: (msg: string) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  projects,
  submissions,
  onUpdateSubmissionStatus,
  onCreateProject,
  onNavigate,
  onNotify,
}) => {
  const [deptFilter, setDeptFilter] = useState<'all' | DepartmentName>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState<DepartmentName>('قسم هندسة الحاسب ونظم المعلومات');
  const [newLeader, setNewLeader] = useState('');
  const [page, setPage] = useState(1);

  const filteredSubmissions = submissions.filter(
    (s) => deptFilter === 'all' || s.department === deptFilter
  );

  const handleExportDefenses = () => {
    const csvRows = [
      ['الكود', 'المشروع', 'القسم', 'قائد الفريق', 'الحالة', 'نسبة Turnitin'].join(','),
      ...projects.map((p) =>
        [
          p.code,
          `"${p.title.replace(/"/g, '""')}"`,
          `"${p.department}"`,
          `"${p.teamMembers[0]?.name ?? ''}"`,
          `"${p.status}"`,
          `${p.turnitinScore}%`,
        ].join(',')
      ),
    ];
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EGI-GradTrack-Defenses-2025.csv';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('تم تصدير كشف المناقشات والمشاريع بصيغة CSV بنجاح.');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLeader.trim()) return;
    onCreateProject({
      title: newTitle.trim(),
      department: newDept,
      supervisor: 'أ.د. أحمد السيد محمود',
      leaderName: newLeader.trim(),
    });
    setNewTitle('');
    setNewLeader('');
    setShowNewModal(false);
  };

  const roadmapStages = [
    { num: '01', title: 'مقترح وفكرة المشروع', sub: 'تم اعتماد 148 فكرة', status: 'done' as const, pct: 100 },
    { num: '02', title: 'التحليل وتحديد المتطلبات', sub: 'مراجعة وثائق SRS كاملة', status: 'done' as const, pct: 100 },
    { num: '03', title: 'التصميم وبناء النموذج الأولي', sub: 'فحص الواجهات والعتاد', status: 'done' as const, pct: 100 },
    { num: '04', title: 'تسليم المسودة والكود المصدري', sub: 'الموعد النهائي: 21 مايو', status: 'active' as const, pct: 80 },
    { num: '05', title: 'مناقشات التحكيم العلنية', sub: 'من 22 إلى 29 مايو 2025', status: 'locked' as const, pct: 0 },
  ];

  const pendingCount = submissions.filter((s) => s.status === 'بانتظار التقييم').length + 23;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            مرحباً بك، د. أحمد السيد
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1.5">
            <span className="font-bold text-[#0B438C]">
              الفصل الدراسي الثاني 2024/2025 - مرحلة تسليم المسودات النهائية
            </span>
            <span aria-hidden="true">·</span>
            <span>الأحد، 18 مايو 2025</span>
            <span aria-hidden="true">·</span>
            <span>قسم هندسة الحاسب ونظم المعلومات - معهد الجزيرة العالي</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل مشروع جديد</span>
          </button>

          <button
            type="button"
            onClick={handleExportDefenses}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير كشف المناقشات</span>
          </button>
        </div>
      </section>

      {/* 4 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('projects')}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-right hover:border-[#0B438C]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي المشاريع المسجلة</span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {141 + projects.length}
            </span>
            <span className="text-xs font-semibold text-slate-600">مشروعاً أكاديمياً</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-2">
            +12% مقارنة بالعام الأكاديمي الماضي
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('teams')}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-right hover:border-emerald-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500">الفرق الطلابية النشطة</span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">432</span>
            <span className="text-xs font-semibold text-slate-600">طالباً وطالبة</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>موزعون على 148 فريق</span>
            <span className="font-bold text-emerald-700">مكتمل الفرق</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('documents')}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-right hover:border-amber-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500">المسودات بانتظار الاعتماد</span>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tabular-nums">
              {pendingCount}
            </span>
            <span className="text-xs font-semibold text-slate-600">تسليماً جديداً</span>
          </div>
          <div className="text-[11px] font-bold text-amber-700 mt-2">
            يتطلب قرار المشرف خلال 48 ساعة
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('defenses')}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-right hover:border-[#0B438C]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500">جلسات التحكيم المجدولة</span>
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">18</span>
            <span className="text-xs font-semibold text-slate-600">جلسة تحكيم نهائية</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span className="font-bold text-[#0B438C]">تبدأ الخميس 22 مايو</span>
            <span>مبنى ب</span>
          </div>
        </button>
      </section>

      {/* Graduation Roadmap */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-base font-extrabold text-slate-900">
            المسار الزمني الموحد لمشاريع التخرج (Graduation Roadmap)
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 tabular-nums">
            أسبوع الإنجاز 14 من 16
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {roadmapStages.map((st) => (
            <div
              key={st.num}
              className={`rounded-xl border p-4 transition-colors ${
                st.status === 'active'
                  ? 'border-[#0B438C] bg-blue-50/50'
                  : st.status === 'done'
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-bold text-slate-500">
                  المرحلة {st.num} {st.status === 'active' ? '(النشطة الآن)' : ''}
                </span>
                {st.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {st.status === 'active' && (
                  <span className="text-xs font-extrabold text-[#0B438C] tabular-nums">
                    {st.pct}%
                  </span>
                )}
                {st.status === 'locked' && <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="text-xs font-extrabold text-slate-900 mb-1">{st.title}</div>
              <div className="text-[11px] text-slate-500 mb-3">{st.sub}</div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    st.status === 'done'
                      ? 'bg-emerald-600'
                      : st.status === 'active'
                      ? 'bg-[#0B438C]'
                      : 'bg-slate-300'
                  }`}
                  style={{ width: `${st.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Split Grid: Submissions Table + Side Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols: Submissions Table + Dept Breakdown */}
        <div className="xl:col-span-8 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  تسليمات الفرق قيد المراجعة والاعتماد
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  المسودات البرمجية والأكاديمية المرفوعة حديثاً من قبل الطلاب
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'all', label: `الكل (${submissions.length})` },
                  { id: 'قسم هندسة الحاسب ونظم المعلومات', label: 'هندسة الحاسب' },
                  { id: 'قسم نظم المعلومات الإدارية', label: 'نظم المعلومات' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDeptFilter(tab.id as typeof deptFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      deptFilter === tab.id
                        ? 'bg-white text-[#0B438C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500">
                    <th className="py-3 px-4">عنوان المشروع والتخصص</th>
                    <th className="py-3 px-4">قائد الفريق</th>
                    <th className="py-3 px-4">المرفقات وتاريخ الرفع</th>
                    <th className="py-3 px-4">حالة الاعتماد</th>
                    <th className="py-3 px-4">الإجراء الأكاديمي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <button
                          type="button"
                          onClick={() => onNavigate('project-detail', 'prj-084')}
                          className="font-extrabold text-slate-900 hover:text-[#0B438C] text-right block cursor-pointer"
                        >
                          {item.projectTitle}
                        </button>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.department} ·{' '}
                          <span className="font-mono text-[#0B438C]">{item.projectCode}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0B438C] font-bold text-xs flex items-center justify-center shrink-0">
                            {item.leaderInitials}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{item.teamLeader}</div>
                            <div className="text-[11px] text-slate-500">{item.teamSizeLabel}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{item.submittedAt}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.attachmentSummary}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.status === 'معتمد'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'مطلوب تعديل'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : item.status === 'بانتظار التقييم'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {item.status === 'بانتظار التقييم' || item.status === 'قيد فحص الكود' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateSubmissionStatus(item.id, 'معتمد');
                                onNotify(`تم اعتماد تسليم مشروع ${item.projectCode} بنجاح.`);
                              }}
                              className="rounded-lg bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-[11px] px-3 py-1.5 transition-colors cursor-pointer"
                            >
                              اعتماد ومراجعة
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onNavigate('documents')}
                              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] px-3 py-1.5 transition-colors cursor-pointer"
                            >
                              عرض التقرير
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onNavigate('documents')}
                            aria-label={`تنزيل مرفقات ${item.projectCode}`}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0B438C] hover:bg-slate-50 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span>عرض {filteredSubmissions.length} من إجمالي 24 تسليماً بانتظار الاعتماد</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  السابق
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded-lg font-bold tabular-nums cursor-pointer ${
                      page === n
                        ? 'bg-[#0B438C] text-white'
                        : 'border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(3, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  التالي
                </button>
              </div>
            </div>
          </section>

          {/* Department Breakdown */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">
              حالة تسليم المسودات بحسب الأقسام
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'قسم هندسة الحاسب', ratio: '58 / 62', pct: 93.5, color: 'bg-[#0B438C]' },
                { name: 'نظم المعلومات الإدارية', ratio: '48 / 54', pct: 88.8, color: 'bg-amber-500' },
                { name: 'قسم هندسة الاتصالات', ratio: '30 / 32', pct: 93.7, color: 'bg-emerald-600' },
              ].map((dept) => (
                <div key={dept.name} className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                  <div className="text-xs font-bold text-slate-700 mb-2">{dept.name}</div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                      {dept.ratio}
                    </span>
                    <span className="text-xs font-bold text-slate-600 tabular-nums">
                      {dept.pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dept.color}`}
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Left 4 cols: Upcoming Defenses + Directives + Tech Support */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <Calendar className="w-4 h-4 text-[#0B438C]" />
                <h2>جلسات التحكيم القادمة</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('defenses')}
                className="text-xs font-bold text-[#0B438C] hover:underline cursor-pointer"
              >
                عرض الجدول الكامل
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <div className="flex items-center justify-between gap-2 text-[11px] mb-2">
                  <span className="rounded-md bg-[#0B438C] text-white font-bold px-2 py-0.5">
                    الخميس 22 مايو · 10:00 ص
                  </span>
                  <span className="text-slate-500 font-semibold">قاعة أ.د/ إبراهيم حلمي</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900 mb-1.5">
                  تطبيق الذكاء الاصطناعي في الفحص الإشعاعي الطبي
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  اللجنة: أ.د. أحمد السيد (رئيساً)، د. منى الشرقاوي، خبير خارجي (وزارة الاتصالات)
                </p>
                <div className="flex items-center justify-between text-[11px] border-t border-slate-200/80 pt-2.5">
                  <span className="text-slate-500">المبنى الأكاديمي (ب) - الدور الثاني</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('defenses')}
                    className="font-bold text-[#0B438C] hover:underline cursor-pointer"
                  >
                    تفاصيل الجلسة ←
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <div className="flex items-center justify-between gap-2 text-[11px] mb-2">
                  <span className="rounded-md bg-slate-800 text-white font-bold px-2 py-0.5">
                    السبت 24 مايو · 01:00 م
                  </span>
                  <span className="text-slate-500 font-semibold">قاعة السيمينار الرئيسية</span>
                </div>
                <div className="text-xs font-extrabold text-slate-900 mb-1.5">
                  نظام الملاحة الذكي للطائرات المسيرة داخل المنشآت
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  اللجنة: أ.د. حسام عثمان، أ.د. أحمد السيد، د. وليد فاروق
                </p>
                <div className="flex items-center justify-between text-[11px] border-t border-slate-200/80 pt-2.5">
                  <span className="text-slate-500">مبنى الإدارة المركزية - الدور الأرضي</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('defenses')}
                    className="font-bold text-[#0B438C] hover:underline cursor-pointer"
                  >
                    تفاصيل الجلسة ←
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('defenses')}
              className="mt-4 w-full rounded-xl border border-dashed border-slate-300 hover:border-[#0B438C] py-2.5 text-xs font-bold text-[#0B438C] hover:bg-blue-50/50 transition-colors cursor-pointer"
            >
              + جدولة جلسة مناقشة جديدة
            </button>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
              <Info className="w-4 h-4 text-amber-600" />
              <h2>تعليمات وتوجيهات إدارة المعهد (EGI)</h2>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs leading-relaxed">
              <div className="font-bold text-slate-900 mb-0.5">
                الموعد النهائي لتسليم النسخ المجلدة:
              </div>
              <p className="text-slate-600">
                آخر موعد لاستلام مجلد المشروع المعتمد بمكتب شؤون الخريجين هو{' '}
                <strong className="text-rose-600">30 مايو 2025</strong>.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs leading-relaxed">
              <div className="font-bold text-slate-900 mb-0.5">
                معايير فحص الاستلال العلمي (Turnitin):
              </div>
              <p className="text-slate-600">
                الحد الأقصى المسموح به لنسبة الاقتباس هو <strong>20%</strong>، مع استبعاد المراجع والملحقات البرمجية.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNotify('تم تنزيل حزمة النماذج الرسمية المعتمدة بصيغة Word.')}
              className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0B438C] font-bold text-xs py-2.5 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل حزمة النماذج الرسمية</span>
            </button>
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-[#0B438C] to-[#082C5E] text-white p-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold">الدعم الأكاديمي والتقني</div>
              <p className="text-xs text-blue-100/80 mt-1">
                وحدة تكنولوجيا المعلومات بمعهد الجزيرة
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="rounded-xl bg-white text-[#0B438C] font-bold text-xs px-3.5 py-2 flex items-center gap-1.5 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>تواصل فوري</span>
            </button>
          </section>
        </aside>
      </div>

      {/* Modal: New Project */}
      {showNewModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-proj-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="new-proj-title" className="text-lg font-extrabold text-slate-900">
                تسجيل مشروع تخرج جديد
              </h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                aria-label="إغلاق نافذة تسجيل مشروع"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label htmlFor="proj-title-input" className="block font-bold text-slate-800 mb-1.5">
                  عنوان مشروع التخرج
                </label>
                <input
                  id="proj-title-input"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: منصة ذكية لإدارة الشبكات الكهربائية بالذكاء الاصطناعي"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0B438C] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="proj-dept-input" className="block font-bold text-slate-800 mb-1.5">
                  القسم العلمي
                </label>
                <select
                  id="proj-dept-input"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value as DepartmentName)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:border-[#0B438C] focus:outline-none"
                >
                  <option value="قسم هندسة الحاسب ونظم المعلومات">قسم هندسة الحاسب ونظم المعلومات</option>
                  <option value="قسم نظم المعلومات الإدارية">قسم نظم المعلومات الإدارية</option>
                  <option value="قسم هندسة الإلكترونيات والاتصالات">قسم هندسة الإلكترونيات والاتصالات</option>
                  <option value="قسم هندسة الميكاترونيكس">قسم هندسة الميكاترونيكس</option>
                </select>
              </div>

              <div>
                <label htmlFor="proj-leader-input" className="block font-bold text-slate-800 mb-1.5">
                  اسم الطالب قائد الفريق
                </label>
                <input
                  id="proj-leader-input"
                  required
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  placeholder="مثال: حسام الدين طارق"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0B438C] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white px-5 py-2.5 font-bold cursor-pointer"
                >
                  اعتماد وتسجيل المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
