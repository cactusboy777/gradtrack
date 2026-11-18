import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  FlaskConical,
  Link2,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { KanbanTask, ScreenId, TaskColumnId } from '../../types';
import { calculateTaskCompletion } from '../../utils/academicLogic';

interface TaskDetailProps {
  task: KanbanTask;
  onUpdateColumn: (taskId: string, col: TaskColumnId) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onAddComment: (taskId: string, content: string, isCritical: boolean) => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  onUpdateColumn,
  onToggleSubtask,
  onAddSubtask,
  onAddComment,
  onNavigate,
  onNotify,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isCriticalNote, setIsCriticalNote] = useState(false);
  const [commentTab, setCommentTab] = useState<'all' | 'supervisor' | 'activity'>('all');

  const completion = calculateTaskCompletion(task.subtasks);

  const filteredComments = task.comments.filter((c) => {
    if (commentTab === 'supervisor') return c.isSupervisorDirective;
    if (commentTab === 'activity') return c.isSystemLog;
    return true;
  });

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim(), isCriticalNote);
    setCommentText('');
    setIsCriticalNote(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-[#0B438C] cursor-pointer">
            الرئيسية
          </button>
          <span>‹</span>
          <button type="button" onClick={() => onNavigate('kanban')} className="hover:text-[#0B438C] cursor-pointer">
            لوحة المهام (S-10)
          </button>
          <span>‹</span>
          <span className="font-bold text-[#0B438C] font-mono">{task.code}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('kanban')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى لوحة المهام</span>
          </button>
          <button
            type="button"
            onClick={() => onNotify('تم حفظ تعديلات المهمة الأكاديمية بنجاح.')}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2 cursor-pointer"
          >
            حفظ التعديلات
          </button>
          <button
            type="button"
            onClick={() => {
              onUpdateColumn(task.id, 'review');
              onNotify('تم إرسال المهمة للمراجعة والتدقيق الأكاديمي من المشرف.');
            }}
            className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2 cursor-pointer"
          >
            إرسال للمراجعة والتدقيق الأكاديمي
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols: Description, Acceptance Criteria, Subtasks, Attachments, Comments */}
        <div className="xl:col-span-8 space-y-6">
          {/* Task Title Card */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
              <span className="rounded-md bg-blue-50 text-[#0B438C] font-bold px-2.5 py-1">
                {task.stageTag}
              </span>
              <span className="rounded-md bg-amber-50 text-amber-800 font-bold px-2.5 py-1">
                {task.domainTag}
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم التحقق من معايير الاعتماد الأكاديمي EGI-ABEE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mb-3 text-balance">
              {task.title}
            </h1>

            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>المنشئ: أ.د. أحمد السيد محمود (المشرف الرئيسي)</span>
              <span>·</span>
              <span>آخر تعديل: منذ ساعتين بواسطة أحمد إبراهيم</span>
            </div>
          </section>

          {/* Engineering Description & Acceptance Criteria */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                التوصيف الهندسي والتكليف الأكاديمي
              </h2>
              <span className="text-xs text-slate-500">معايير الدقة الهندسية والتحليل المعملي</span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>

            {task.acceptanceCriteria.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 mb-3">
                  معايير القبول والاعتماد الأكاديمي (Acceptance Criteria):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {task.acceptanceCriteria.map((ac) => (
                    <div
                      key={ac.title}
                      className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs"
                    >
                      <div className="font-extrabold text-[#0B438C] mb-1">{ac.title}</div>
                      <p className="text-slate-600 leading-relaxed">{ac.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Interactive Subtasks */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  قائمة المهام الفرعية والتحقق الهندسي
                </h2>
                <p className="text-xs text-slate-500">متابعة دقيقة لمراحل التنفيذ الفردية للفريق</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-[#0B438C] tabular-nums">
                  {completion.completed} من {completion.total} مكتملة ({completion.percentage}%)
                </span>
                <div className="w-28 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0B438C] transition-all"
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                    st.completed
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-amber-50/30 border-amber-200 hover:bg-amber-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => onToggleSubtask(task.id, st.id)}
                      className="mt-1 rounded border-slate-300 text-[#0B438C] focus:ring-[#0B438C] w-4 h-4"
                    />
                    <div>
                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          st.completed ? 'text-slate-700 line-through' : 'text-slate-900'
                        }`}
                      >
                        {st.title}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                        <span>{st.note || (st.completed ? 'مكتمل' : 'قيد التنفيذ')}</span>
                        {st.dueLabel && (
                          <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 font-bold">
                            {st.dueLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-xs text-slate-600">
                    <span className="hidden sm:inline">{st.assigneeName}</span>
                    <span className="w-7 h-7 rounded-full bg-blue-50 text-[#0B438C] font-bold text-[10px] flex items-center justify-center">
                      {st.assigneeInitials}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="كتابة مهمة فرعية جديدة والضغط على إضافة..."
                aria-label="إضافة مهمة فرعية جديدة"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:bg-white focus:border-[#0B438C] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة للمهمة</span>
              </button>
            </form>
          </section>

          {/* Attachments */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  المرفقات والوثائق الهندسية ({task.attachments.length} ملفات)
                </h2>
                <p className="text-xs text-slate-500">الملفات المعتمدة للمراجعة المباشرة من المشرف</p>
              </div>
              <button
                type="button"
                onClick={() => onNotify('تم تنزيل حزمة مرفقات المهمة بصيغة ZIP.')}
                className="text-xs font-bold text-[#0B438C] hover:underline cursor-pointer"
              >
                تحميل الكل كملف ZIP
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {task.attachments.map((att) => (
                <div
                  key={att.id}
                  className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-blue-50 text-[#0B438C] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 font-mono truncate" dir="ltr">
                        {att.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {att.size} · {att.meta}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNotify(`جارٍ تحميل ${att.name}...`)}
                    aria-label={`تحميل ${att.name}`}
                    className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-[#0B438C] shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('documents')}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0B438C] bg-slate-50/70 p-4 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-[#0B438C] mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-800">
                سحب وإفلات ملفات التسليم أو استعراض من جهازك
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                يدعم PDF, DOCX, PNG, ZIP, IPYNB · الحجم الأقصى المسموح 50MB
              </div>
            </button>
          </section>

          {/* Threaded Academic Discussion */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  ساحة النقاش والملاحظات الأكاديمية
                </h2>
                <p className="text-xs text-slate-500">سجل المداولات الرسمية بين المشرفين وأعضاء الفريق</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {[
                  { id: 'all', label: `جميع الملاحظات (${task.comments.length})` },
                  {
                    id: 'supervisor',
                    label: `توجيهات المشرف (${task.comments.filter((c) => c.isSupervisorDirective).length})`,
                  },
                  { id: 'activity', label: 'سجل النشاط' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCommentTab(tab.id as typeof commentTab)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      commentTab === tab.id ? 'bg-white text-[#0B438C] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-5">
              {filteredComments.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-6 bg-slate-50 rounded-xl">
                  لا توجد سجلات في هذا التصنيف حالياً.
                </div>
              ) : (
                filteredComments.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-4 ${
                      c.isCritical
                        ? 'border-rose-200 bg-rose-50/40'
                        : c.isSupervisorDirective
                        ? 'border-blue-200 bg-blue-50/30'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#0B438C] text-white font-bold text-xs flex items-center justify-center">
                          {c.authorInitials}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{c.authorName}</span>
                            <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-[#0B438C]">
                              {c.authorRole}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{c.timestamp}</div>
                        </div>
                      </div>

                      {c.isSupervisorDirective && (
                        <span className="rounded-full bg-amber-100 text-amber-900 px-2.5 py-0.5 text-[11px] font-bold">
                          توجيه أكاديمي معتمد
                        </span>
                      )}
                      {c.isCritical && (
                        <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[11px] font-bold">
                          ملاحظة حرجة
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Composer */}
            <form onSubmit={handleCommentSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="أضف رداً أو استفساراً أكاديمياً... استخدم @ للإشارة إلى المشرف أو أحد الزملاء"
                aria-label="نص التعليق الأكاديمي"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm focus:border-[#0B438C] focus:outline-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCriticalNote}
                    onChange={(e) => setIsCriticalNote(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600"
                  />
                  <span className="font-semibold">تحديد كـ "ملاحظة حرجة"</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التعليق</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Left 4 cols: Metadata Sidebar */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">حالة المهمة ومرحلة التحقق</h2>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold">
                سارية الآن
              </span>
            </div>

            <div>
              <label htmlFor="task-status-select" className="block text-[11px] text-slate-500 mb-1">
                الحالة التشغيلية الحالية:
              </label>
              <select
                id="task-status-select"
                value={task.column}
                onChange={(e) => onUpdateColumn(task.id, e.target.value as TaskColumnId)}
                className="w-full rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2.5 text-xs font-extrabold text-[#0B438C]"
              >
                <option value="todo">قيد الانتظار للبدء (To Do)</option>
                <option value="in_progress">قيد التنفيذ النشط (In Progress)</option>
                <option value="review">قيد المراجعة الأكاديمية (In Review)</option>
                <option value="done">مكتملة ومعتمدة (Done)</option>
              </select>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1">
              <div className="font-bold text-slate-800">{task.stageTag}</div>
              <div className="text-[11px] text-slate-500 font-mono">PRJ-CS-2025-084</div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
            <h2 className="text-sm font-extrabold text-slate-900">بيانات التكليف والتوقيتات</h2>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#0B438C] text-white font-bold flex items-center justify-center">
                  {task.assigneeInitials}
                </span>
                <div>
                  <div className="font-bold text-slate-900">{task.assigneeName}</div>
                  <div className="text-[11px] text-slate-500">المكلف الرئيسي بالإنجاز</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3">
                <div className="text-[11px] text-slate-600">درجة الأولوية</div>
                <div className="font-extrabold text-amber-800 mt-0.5">{task.priority}</div>
              </div>
              <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3">
                <div className="text-[11px] text-slate-600">موعد الاستحقاق</div>
                <div className="font-extrabold text-rose-700 mt-0.5">{task.dueDate}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600">الوقت الهندسي المستغرق:</span>
                <span className="font-extrabold text-[#0B438C] tabular-nums">
                  {task.hoursLogged} من أصل {task.hoursBudget} ساعة
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0B438C]"
                  style={{ width: `${Math.min(100, (task.hoursLogged / task.hoursBudget) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600 pt-1">
              <FlaskConical className="w-4 h-4 text-[#0B438C] shrink-0" />
              <span>معمل الروبوتات والذكاء الاصطناعي - قاعة 204</span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <h2 className="text-sm font-extrabold text-slate-900">فحص الجودة والنزاهة الأكاديمية</h2>

            <div className="rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">فحص الاستلال العلمي (Turnitin)</div>
                <div className="text-[11px] text-slate-600">ضمن النطاق الآمن المعتمد</div>
              </div>
              <span className="font-extrabold text-emerald-700 tabular-nums">
                {task.turnitinCheck}% فقط
              </span>
            </div>

            <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">اختبارات الكود (Unit Tests)</div>
                <div className="text-[11px] text-slate-600">
                  اجتياز {task.unitTestsPassed} اختبار من أصل {task.unitTestsTotal}
                </div>
              </div>
              <span className="font-extrabold text-[#0B438C]">+A ممتاز</span>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2.5 flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0B438C]" />
                طلب مناقشة المهمة في الاجتماع القادم
              </span>
              <span>‹</span>
            </button>
            <button
              type="button"
              onClick={() => onNotify(`تم نسخ رابط التكليف ${task.code} إلى الحافظة.`)}
              className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2.5 flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#0B438C]" />
                نسخ رابط التكليف الأكاديمي المباشر
              </span>
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => setCommentTab('all')}
              className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 px-3 py-2.5 flex items-center justify-between font-bold text-slate-800 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0B438C]" />
                سجل التدقيق والتعديلات الزمني
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};
