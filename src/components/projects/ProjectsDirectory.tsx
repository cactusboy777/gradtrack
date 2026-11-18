import React, { useState } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import type { DepartmentName, Project, ScreenId } from '../../types';
import { filterProjectsDirectory } from '../../utils/academicLogic';

interface ProjectsDirectoryProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onCreateProject: (data: {
    title: string;
    department: DepartmentName;
    supervisor: string;
    leaderName: string;
  }) => void;
  onNotify: (msg: string) => void;
}

export const ProjectsDirectory: React.FC<ProjectsDirectoryProps> = ({
  projects,
  onSelectProject,
  onNavigate,
  onCreateProject,
  onNotify,
}) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [topic, setTopic] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState<DepartmentName>('قسم هندسة الحاسب ونظم المعلومات');
  const [newLeader, setNewLeader] = useState('');

  const filtered = filterProjectsDirectory(projects, { search, department, status, topic });

  const topics = [
    { id: 'all', label: 'الكل' },
    { id: 'الذكاء الاصطناعي', label: 'الذكاء الاصطناعي (AI)' },
    { id: 'إنترنت الأشياء', label: 'إنترنت الأشياء (IoT)' },
    { id: 'الأنظمة المالية', label: 'الأنظمة المالية (Fintech)' },
    { id: 'الرعاية الصحية', label: 'الرعاية الصحية الذكية' },
    { id: 'الطاقة المستدامة', label: 'الطاقة المستدامة' },
  ];

  const handleExportExcel = () => {
    const csvRows = [
      ['الكود', 'عنوان المشروع', 'القسم', 'المشرف', 'نسبة الإنجاز', 'Turnitin'].join(','),
      ...filtered.map((p) =>
        [
          p.code,
          `"${p.title.replace(/"/g, '""')}"`,
          `"${p.department}"`,
          `"${p.supervisor}"`,
          `${p.progress}%`,
          `${p.turnitinScore}%`,
        ].join(',')
      ),
    ];
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EGI-Projects-Directory.csv';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('تم تصدير تقرير المشاريع المصفى بصيغة Excel CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0B438C] font-bold mb-1">
            <span>العام الجامعي 2024 / 2025</span>
            <span>·</span>
            <span>دفعة التخرج 22</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              دليل مشاريع التخرج الأكاديمية
            </h1>
            <span className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-extrabold text-[#0B438C] tabular-nums">
              {141 + projects.length} مشروعاً
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            استعراض ومتابعة وتصنيف مشاريع التخرج لكافة الأقسام العلمية، تتبع نسب الإنجاز، وفحص التقرير النهائي للجان التحكيم بمعهد الجزيرة العالي (EGI).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>تصدير تقرير Excel</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مشروع جديد</span>
          </button>
        </div>
      </section>

      {/* 4 Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {141 + projects.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">إجمالي المشاريع</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">38</div>
            <div className="text-xs text-slate-500 mt-0.5">جاهز للمناقشة</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-amber-600 tabular-nums">86</div>
            <div className="text-xs text-slate-500 mt-0.5">قيد المراجعة والتنفيذ</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-sm">
            86
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">584</div>
            <div className="text-xs text-slate-500 mt-0.5">طالب باحث مسجل</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </span>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المشروع، الكود، اسم الطالب، أو المشرف..."
              aria-label="بحث في دليل المشاريع"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-xs focus:bg-white focus:border-[#0B438C] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-label="تصفية حسب القسم العلمي"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-[#0B438C] focus:outline-none"
            >
              <option value="all">كافة الأقسام العلمية (الكل)</option>
              <option value="قسم هندسة الحاسب ونظم المعلومات">قسم هندسة الحاسب ونظم المعلومات</option>
              <option value="قسم نظم المعلومات الإدارية">قسم نظم المعلومات الإدارية</option>
              <option value="قسم هندسة الإلكترونيات والاتصالات">قسم هندسة الإلكترونيات والاتصالات</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="تصفية حسب حالة المشروع"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-[#0B438C] focus:outline-none"
            >
              <option value="all">كافة الحالات</option>
              <option value="قيد التطوير الفعال">قيد التطوير الفعال</option>
              <option value="تسليم المسودة النهائية">تسليم المسودة النهائية</option>
              <option value="جاهز للمناقشة والتحكيم">جاهز للمناقشة والتحكيم</option>
              <option value="قيد المراجعة الفنية">قيد المراجعة الفنية</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="عرض شبكي"
              className={`p-2 rounded-lg border cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0B438C] text-white border-[#0B438C]'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="عرض جدولي"
              className={`p-2 rounded-lg border cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0B438C] text-white border-[#0B438C]'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-500">المواضيع الشائعة:</span>
          {topics.map((tp) => (
            <button
              key={tp.id}
              type="button"
              onClick={() => setTopic(tp.id)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                topic === tp.id
                  ? 'bg-[#0B438C] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid or Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-sm font-bold text-slate-800 mb-2">
            لم يتم العثور على مشاريع مطابقة لمعايير البحث الحالية.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDepartment('all');
              setStatus('all');
              setTopic('all');
            }}
            className="mt-2 rounded-xl bg-[#0B438C] text-white px-4 py-2 text-xs font-bold cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const isReady = p.status === 'جاهز للمناقشة والتحكيم';
            return (
              <article
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-[#0B438C] p-5 flex flex-col justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] mb-3">
                    <span className="font-bold text-[#0B438C]">{p.department}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold whitespace-nowrap ${
                        isReady
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-[#0B438C]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 mb-1">{p.code}</div>

                  <button
                    type="button"
                    onClick={() => onSelectProject(p.id)}
                    className="text-base font-extrabold text-slate-900 hover:text-[#0B438C] text-right leading-snug mb-3 block cursor-pointer"
                  >
                    {p.title}
                  </button>

                  <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 text-xs space-y-1 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500">المشرف الأكاديمي:</span>
                      <span className="font-bold text-slate-900">{p.supervisor}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500">المشرف المساعد:</span>
                      <span className="font-semibold text-slate-700">{p.coSupervisor}</span>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="text-xs text-slate-600 truncate">
                      <span className="text-slate-400">فريق العمل ({p.teamMembers.length}): </span>
                      <span className="font-semibold text-slate-800">
                        {p.teamMembers.map((m) => m.name.split(' ')[0]).join('، ')}
                      </span>
                    </div>
                    <div className="flex -space-x-1.5 space-x-reverse shrink-0">
                      {p.teamMembers.slice(0, 4).map((m) => (
                        <span
                          key={m.id}
                          className={`w-7 h-7 rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center ${m.avatarColor}`}
                        >
                          {m.initials}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Turnitin */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">نسبة اكتمال المشروع:</span>
                      <span className="font-extrabold text-[#0B438C] tabular-nums">
                        {p.progress}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.progress >= 90
                            ? 'bg-emerald-600'
                            : p.progress >= 80
                            ? 'bg-[#0B438C]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500">فحص الاقتباس العلمي (Turnitin):</span>
                      <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold tabular-nums">
                        {p.turnitinScore}% (معتمد)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectProject(p.id)}
                    className={`flex-1 rounded-xl font-bold text-xs py-2.5 px-3 transition-colors cursor-pointer ${
                      isReady
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-[#0B438C] hover:bg-[#08346F] text-white'
                    }`}
                  >
                    {isReady ? 'اعتماد المناقشة والتفاصيل' : 'عرض الملفات والمراحل'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('kanban')}
                    aria-label={`مهام مشروع ${p.code}`}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    المهام
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">الكود</th>
                <th className="py-3 px-4">عنوان المشروع</th>
                <th className="py-3 px-4">القسم</th>
                <th className="py-3 px-4">المشرف</th>
                <th className="py-3 px-4">الإنجاز</th>
                <th className="py-3 px-4">Turnitin</th>
                <th className="py-3 px-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-[#0B438C]">{p.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.title}</td>
                  <td className="py-3 px-4 text-slate-600">{p.department}</td>
                  <td className="py-3 px-4 text-slate-700">{p.supervisor}</td>
                  <td className="py-3 px-4 font-extrabold tabular-nums">{p.progress}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 tabular-nums">{p.turnitinScore}%</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onSelectProject(p.id)}
                      className="rounded-lg bg-[#0B438C] text-white font-bold px-3 py-1.5 cursor-pointer"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Modal: Add Project */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dir-add-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="dir-add-title" className="text-lg font-extrabold text-slate-900">
                إضافة مشروع تخرج جديد للدليل
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="إغلاق"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
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
                setShowAddModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label htmlFor="dir-proj-title" className="block font-bold text-slate-800 mb-1">
                  اسم المشروع
                </label>
                <input
                  id="dir-proj-title"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="أدخل عنوان مشروع التخرج..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="dir-proj-dept" className="block font-bold text-slate-800 mb-1">
                  القسم العلمي
                </label>
                <select
                  id="dir-proj-dept"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value as DepartmentName)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white"
                >
                  <option value="قسم هندسة الحاسب ونظم المعلومات">قسم هندسة الحاسب ونظم المعلومات</option>
                  <option value="قسم نظم المعلومات الإدارية">قسم نظم المعلومات الإدارية</option>
                  <option value="قسم هندسة الإلكترونيات والاتصالات">قسم هندسة الإلكترونيات والاتصالات</option>
                </select>
              </div>
              <div>
                <label htmlFor="dir-proj-leader" className="block font-bold text-slate-800 mb-1">
                  قائد الفريق
                </label>
                <input
                  id="dir-proj-leader"
                  required
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  placeholder="اسم الطالب..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0B438C] text-white px-5 py-2 font-bold cursor-pointer"
                >
                  حفظ وإضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
