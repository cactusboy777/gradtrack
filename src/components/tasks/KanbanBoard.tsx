import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileSpreadsheet,
  KanbanSquare,
  List,
  Plus,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { KanbanTask, ScreenId, TaskColumnId, TaskPriority } from '../../types';
import { calculateTaskCompletion } from '../../utils/academicLogic';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onSelectTask: (taskId: string) => void;
  onMoveTask: (taskId: string, nextColumn: TaskColumnId) => void;
  onCreateTask: (task: {
    title: string;
    domainTag: string;
    priority: TaskPriority;
    column: TaskColumnId;
    assigneeName: string;
    dueDate: string;
  }) => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onSelectTask,
  onMoveTask,
  onCreateTask,
  onNavigate,
  onNotify,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('الذكاء الاصطناعي وتعلم الآلة');
  const [newPriority, setNewPriority] = useState<TaskPriority>('مرتفعة');
  const [newColumn, setNewColumn] = useState<TaskColumnId>('todo');
  const [newAssignee, setNewAssignee] = useState('أحمد إبراهيم محمد حسن');

  const filtered = tasks.filter((t) => {
    if (assigneeFilter !== 'all' && !t.assigneeName.includes(assigneeFilter)) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q) &&
        !t.domainTag.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const columns: {
    id: TaskColumnId;
    title: string;
    dotColor: string;
    headerBg: string;
  }[] = [
    { id: 'todo', title: 'قيد الانتظار / للبدء', dotColor: 'bg-amber-500', headerBg: 'bg-amber-50/70' },
    { id: 'in_progress', title: 'قيد التنفيذ', dotColor: 'bg-[#0B438C]', headerBg: 'bg-blue-50/70' },
    { id: 'review', title: 'قيد المراجعة والتدقيق', dotColor: 'bg-indigo-600', headerBg: 'bg-indigo-50/70' },
    { id: 'done', title: 'مكتملة ومعتمدة', dotColor: 'bg-emerald-600', headerBg: 'bg-emerald-50/70' },
  ];

  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.column === 'todo').length,
    in_progress: tasks.filter((t) => t.column === 'in_progress').length,
    review: tasks.filter((t) => t.column === 'review').length,
    done: tasks.filter((t) => t.column === 'done').length,
  };
  const donePct = counts.total > 0 ? Math.round((counts.done / counts.total) * 1000) / 10 : 0;

  const assignees = [
    { id: 'all', label: 'الكل' },
    { id: 'أحمد', label: 'أحمد' },
    { id: 'مريم', label: 'مريم' },
    { id: 'عمر', label: 'عمر' },
    { id: 'كريم', label: 'كريم' },
  ];

  const handleExportTasks = () => {
    const csvRows = [
      ['الكود', 'المهمة', 'المرحلة', 'المكلف', 'الأولوية', 'تاريخ الاستحقاق'].join(','),
      ...filtered.map((t) =>
        [
          t.code,
          `"${t.title.replace(/"/g, '""')}"`,
          `"${t.column}"`,
          `"${t.assigneeName}"`,
          `"${t.priority}"`,
          `"${t.dueDate}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EGI-Kanban-Tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('تم تصدير جدول مهام المشروع بصيغة CSV.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <span>بوابة الطالب الأكاديمية</span>
            <span>‹</span>
            <button type="button" onClick={() => onNavigate('project-detail')} className="hover:text-[#0B438C] cursor-pointer">
              مشروعي الأكاديمي
            </button>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">لوحة مهام وتكليفات المشروع (S-10)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            لوحة مهام وتكليفات المشروع (Kanban Board)
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
            <span className="font-mono font-bold text-[#0B438C]">PRJ-CS-2025-084</span>
            <span>·</span>
            <span>منظومة رصد وتصنيف الأعطال الميكانيكية بـ AI & IoT</span>
            <span>·</span>
            <span className="font-semibold text-slate-800">المشرف الأكاديمي: أ.د. أحمد السيد محمود</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#0B438C] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>لوحة كانبان</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0B438C] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>قائمة جدولية</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportTasks}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>تصدير المهام</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewColumn('todo');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة جديدة</span>
          </button>
        </div>
      </section>

      {/* 5 Summary Counters */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'إجمالي المهام', value: counts.total, color: 'text-slate-900', icon: <ClipboardList className="w-4 h-4 text-[#0B438C]" /> },
          { label: 'قيد الانتظار للبدء', value: counts.todo, color: 'text-amber-600', icon: <Clock className="w-4 h-4 text-amber-600" /> },
          { label: 'قيد التنفيذ النشط', value: counts.in_progress, color: 'text-[#0B438C]', icon: <ArrowLeftRight className="w-4 h-4 text-[#0B438C]" /> },
          { label: 'قيد المراجعة الأكاديمية', value: counts.review, color: 'text-indigo-700', icon: <ShieldCheck className="w-4 h-4 text-indigo-700" /> },
          { label: 'مكتملة ومعتمدة', value: `${counts.done} (${donePct}%)`, color: 'text-emerald-700', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold text-slate-500">{stat.label}</div>
              <div className={`text-xl font-extrabold tabular-nums mt-1 ${stat.color}`}>{stat.value}</div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              {stat.icon}
            </span>
          </div>
        ))}
      </section>

      {/* Filter Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">المكلف:</span>
          {assignees.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAssigneeFilter(a.id)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                assigneeFilter === a.id
                  ? 'bg-[#0B438C] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="تصفية حسب الأولوية"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">الأولوية: الكل</option>
            <option value="حرجة">حرجة</option>
            <option value="مرتفعة">مرتفعة</option>
            <option value="متوسطة">متوسطة</option>
            <option value="منخفضة">منخفضة</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في عنوان المهمة أو الوصف..."
              aria-label="بحث في مهام المشروع"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 py-2 text-xs focus:bg-white focus:border-[#0B438C] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Kanban Columns or Table */}
      {viewMode === 'kanban' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filtered.filter((t) => t.column === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedTaskId) {
                    onMoveTask(draggedTaskId, col.id);
                    setDraggedTaskId(null);
                  }
                }}
                className="bg-slate-100/80 rounded-2xl border border-slate-200/80 p-3 flex flex-col gap-3 min-h-[420px]"
              >
                {/* Column Header */}
                <div className={`rounded-xl px-3.5 py-2.5 flex items-center justify-between ${col.headerBg} border border-slate-200/60`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <h2 className="text-xs font-extrabold text-slate-900">{col.title}</h2>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-extrabold text-slate-700 tabular-nums border border-slate-200">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => {
                    const sub = calculateTaskCompletion(task.subtasks);
                    return (
                      <article
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-[#0B438C]/50 transition-colors space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-semibold text-[#0B438C] bg-blue-50 px-2 py-0.5 rounded truncate">
                            {task.domainTag}
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 font-bold shrink-0 ${
                              task.priority === 'حرجة'
                                ? 'bg-rose-50 text-rose-700'
                                : task.priority === 'مرتفعة'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectTask(task.id)}
                          className="text-sm font-extrabold text-slate-900 hover:text-[#0B438C] text-right leading-snug block w-full cursor-pointer"
                        >
                          {task.title}
                        </button>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {sub.total > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                              <span>معدل الإنجاز</span>
                              <span className="font-bold tabular-nums">
                                {sub.completed} / {sub.total} ({sub.percentage}%)
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#0B438C]"
                                style={{ width: `${sub.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{task.dueDate}</span>
                          </div>
                          <span className="w-7 h-7 rounded-full bg-[#0B438C] text-white font-bold text-[10px] flex items-center justify-center shrink-0" title={task.assigneeName}>
                            {task.assigneeInitials}
                          </span>
                        </div>

                        {/* Quick Status Move Strip */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          <select
                            aria-label={`نقل مهمة ${task.code} إلى مرحلة`}
                            value={task.column}
                            onChange={(e) => onMoveTask(task.id, e.target.value as TaskColumnId)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 cursor-pointer"
                          >
                            <option value="todo">نقل إلى: للبدء</option>
                            <option value="in_progress">نقل إلى: قيد التنفيذ</option>
                            <option value="review">نقل إلى: قيد المراجعة</option>
                            <option value="done">نقل إلى: مكتملة ومعتمدة</option>
                          </select>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewColumn(col.id);
                    setShowAddModal(true);
                  }}
                  className="w-full rounded-xl border border-dashed border-slate-300 bg-white/70 hover:bg-white hover:border-[#0B438C] py-2 text-xs font-bold text-slate-600 hover:text-[#0B438C] transition-colors cursor-pointer"
                >
                  + إضافة بطاقة هنا
                </button>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">الكود</th>
                <th className="py-3 px-4">عنوان المهمة</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">المكلف</th>
                <th className="py-3 px-4">الأولوية</th>
                <th className="py-3 px-4">الاستحقاق</th>
                <th className="py-3 px-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-[#0B438C]">{t.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{t.title}</td>
                  <td className="py-3 px-4">
                    <select
                      aria-label={`تغيير حالة ${t.code}`}
                      value={t.column}
                      onChange={(e) => onMoveTask(t.id, e.target.value as TaskColumnId)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="todo">للبدء</option>
                      <option value="in_progress">قيد التنفيذ</option>
                      <option value="review">قيد المراجعة</option>
                      <option value="done">مكتملة</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">{t.assigneeName}</td>
                  <td className="py-3 px-4 font-bold">{t.priority}</td>
                  <td className="py-3 px-4">{t.dueDate}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onSelectTask(t.id)}
                      className="rounded-lg bg-[#0B438C] text-white font-bold px-3 py-1.5 cursor-pointer"
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Modal: Add Task */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kanban-add-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="kanban-add-title" className="text-lg font-extrabold text-slate-900">
                إضافة مهمة هندسية جديدة
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
                if (!newTitle.trim()) return;
                onCreateTask({
                  title: newTitle.trim(),
                  domainTag: newDomain,
                  priority: newPriority,
                  column: newColumn,
                  assigneeName: newAssignee,
                  dueDate: '23 مايو 2025',
                });
                setNewTitle('');
                setShowAddModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label htmlFor="task-title-in" className="block font-bold text-slate-800 mb-1">
                  عنوان المهمة
                </label>
                <input
                  id="task-title-in"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: اختبار استقرار نموذج 1D-CNN تحت الأحمال المتغيرة..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-priority-in" className="block font-bold text-slate-800 mb-1">
                    الأولوية
                  </label>
                  <select
                    id="task-priority-in"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
                  >
                    <option value="حرجة">حرجة</option>
                    <option value="مرتفعة">مرتفعة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="task-assignee-in" className="block font-bold text-slate-800 mb-1">
                    المكلف بالتنفيذ
                  </label>
                  <select
                    id="task-assignee-in"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
                  >
                    <option value="أحمد إبراهيم محمد حسن">أحمد إبراهيم</option>
                    <option value="مريم خليل عبد العزيز">مريم خليل</option>
                    <option value="عمر سامي فهمي">عمر سامي</option>
                    <option value="كريم يوسف منصور">كريم يوسف</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="task-domain-in" className="block font-bold text-slate-800 mb-1">
                  التصنيف الهندسي
                </label>
                <input
                  id="task-domain-in"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
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
                  إضافة البطاقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
