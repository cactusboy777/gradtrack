import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import type { CalendarEvent, ScreenId } from '../../types';
import { formatCountdown } from '../../utils/academicLogic';

interface AcademicCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (ev: CalendarEvent) => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
  events,
  onAddEvent,
  onNavigate,
  onNotify,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | CalendarEvent['category']>('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [remainingSeconds, setRemainingSeconds] = useState(26 * 3600 + 14 * 60 + 45);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState(21);
  const [newTime, setNewTime] = useState('12:00 م');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('advising');

  useEffect(() => {
    const t = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  const countdown = formatCountdown(remainingSeconds);

  const filteredEvents = events.filter(
    (e) => categoryFilter === 'all' || e.category === categoryFilter
  );

  const upcomingEvents = filteredEvents
    .filter((e) => e.dateDay >= 16)
    .sort((a, b) => a.dateDay - b.dateDay);

  // May 2025 starts on Thursday (Sat=0..Fri=6 -> Thursday is index 5)
  const leadingEmptyDays = [26, 27, 28, 29, 30];
  const daysInMay = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekdays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  const categoryColor = (cat: CalendarEvent['category']) => {
    if (cat === 'drafts') return 'bg-amber-100 text-amber-900 border-amber-200';
    if (cat === 'engineering') return 'bg-blue-100 text-[#0B438C] border-blue-200';
    if (cat === 'advising') return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    return 'bg-rose-600 text-white border-rose-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <span>مشروعي الأكاديمي</span>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">التقويم والمواعيد النهائية (S-12)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            التقويم والمواعيد الأكاديمية ومواعيد التسليم
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            إدارة المخطط الزمني للفصل الدراسي الثاني 2024/2025 - مشروع التخرج لقسم هندسة الحاسب
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNotify('تمت مزامنة المواعيد مع تقويم Google / Outlook الجامعي.')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0B438C]" />
            <span>مزامنة مع Google / Outlook</span>
          </button>
          <button
            type="button"
            onClick={() => onNotify('تم تصدير ملف التقويم بصيغة iCal.')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>تصدير (.iCal / PDF)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موعد / تذكير جديد</span>
          </button>
        </div>
      </section>

      {/* Filter + View Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: `الكل (${events.length})` },
            { id: 'drafts', label: `المسودات والتقارير (${events.filter((e) => e.category === 'drafts').length})` },
            { id: 'engineering', label: `التكليفات الهندسية (${events.filter((e) => e.category === 'engineering').length})` },
            { id: 'advising', label: `جلسات التوجيه (${events.filter((e) => e.category === 'advising').length})` },
            { id: 'defense', label: `المناقشات والتحكيم (${events.filter((e) => e.category === 'defense').length})` },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id as typeof categoryFilter)}
              className={`rounded-full px-3 py-1.5 font-bold transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-[#0B438C] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            {[
              { id: 'month', label: 'عرض شهري' },
              { id: 'week', label: 'عرض أسبوعي' },
              { id: 'agenda', label: 'عرض قائمة' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setViewMode(v.id as typeof viewMode)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                  viewMode === v.id ? 'bg-white text-[#0B438C] shadow-xs' : 'text-slate-600'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
            <button type="button" aria-label="الشهر السابق" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span>مايو 2025</span>
            <button type="button" aria-label="الشهر التالي" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols: Calendar Grid + Velocity */}
        <div className="xl:col-span-8 space-y-5">
          {viewMode === 'agenda' ? (
            <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 mb-3">
                قائمة المواعيد والمهام الزمنية - مايو 2025
              </h2>
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B438C] font-extrabold flex items-center justify-center tabular-nums">
                      {ev.dateDay}
                    </span>
                    <div>
                      <div className="font-extrabold text-slate-900">{ev.title}</div>
                      <div className="text-slate-500 mt-0.5">
                        {ev.dateDay} مايو 2025 · {ev.timeLabel} {ev.location ? `· ${ev.location}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className={`rounded-lg border px-2.5 py-1 font-bold ${categoryColor(ev.category)}`}>
                    {ev.completed ? 'مكتمل' : ev.priority ?? 'مجدول'}
                  </span>
                </div>
              ))}
            </section>
          ) : (
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                  <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-extrabold text-slate-700">
                    {weekdays.map((w) => (
                      <div key={w} className="py-3 border-l border-slate-200/70 last:border-l-0">
                        {w}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {leadingEmptyDays.map((d) => (
                      <div
                        key={`prev-${d}`}
                        className="min-h-[96px] p-2 border-b border-l border-slate-100 bg-slate-50/50 text-xs text-slate-400 tabular-nums"
                      >
                        {d}
                      </div>
                    ))}

                    {daysInMay
                      .filter((day) => (viewMode === 'week' ? day >= 14 && day <= 20 : true))
                      .map((day) => {
                        const dayEvents = filteredEvents.filter((e) => e.dateDay === day);
                        const isToday = day === 15;
                        const isSelected = day === selectedDay;
                        return (
                          <div
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`min-h-[104px] p-2 border-b border-l border-slate-100 cursor-pointer transition-colors ${
                              isToday
                                ? 'bg-blue-50/60 ring-2 ring-inset ring-[#0B438C]'
                                : isSelected
                                ? 'bg-slate-50'
                                : 'bg-white hover:bg-slate-50/70'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className={`text-xs font-extrabold tabular-nums ${
                                  isToday
                                    ? 'rounded bg-[#0B438C] text-white px-1.5 py-0.5'
                                    : 'text-slate-700'
                                }`}
                              >
                                {day} {isToday ? 'اليوم' : ''}
                              </span>
                              {dayEvents.some((e) => e.completed) && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>

                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`rounded-md border px-1.5 py-1 text-[10px] font-bold leading-tight truncate ${categoryColor(
                                    ev.category
                                  )}`}
                                  title={ev.title}
                                >
                                  {ev.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-[10px] font-bold text-[#0B438C]">
                                  +{dayEvents.length - 2} إضافي
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-600">
                <span>دليل الرموز الأكاديمية:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> تسليم مسودة وتقارير
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B438C]" /> مهام برمجية وهندسية
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> جلسات توجيه وإرشاد
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> لجان تحكيم ومناقشات
                </span>
              </div>
            </section>
          )}

          {/* Sprint Velocity */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  حالة الالتزام بالجدول الزمني (Sprint Velocity)
                </div>
                <div className="text-xs text-slate-500">
                  تم إنجاز 78% من التكليفات المقررة حتى الأسبوع الثاني عشر بنجاح
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-xl font-extrabold text-emerald-700 tabular-nums">78%</div>
                <div className="text-[11px] text-slate-500">ممتاز - متوافق</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-xl font-extrabold text-slate-900 tabular-nums">14 يوماً</div>
                <div className="text-[11px] text-slate-500">المتبقي للمناقشة</div>
              </div>
            </div>
          </section>
        </div>

        {/* Left 4 cols: Live Countdown + Upcoming + Policies */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Countdown Hero */}
          <section className="rounded-2xl bg-gradient-to-br from-[#0B3E82] to-[#08244B] text-white p-5">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                الاستحقاق الأقرب
              </span>
              <span className="font-mono text-blue-200">DEADLINE - S12</span>
            </div>

            <h2 className="text-lg font-extrabold leading-snug mb-1.5">
              تسليم مصفوفة الارتباك (الفصل الخامس)
            </h2>
            <p className="text-xs text-blue-100/80 mb-4 leading-relaxed">
              يتضمن تقرير الدقة ونسب تصنيف عينات المستشعرات لنموذج الذكاء الاصطناعي
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="rounded-xl bg-white/10 border border-white/15 py-3">
                <div className="text-2xl font-extrabold tabular-nums font-mono">{countdown.hours}</div>
                <div className="text-[11px] text-blue-200">ساعة</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 py-3">
                <div className="text-2xl font-extrabold tabular-nums font-mono">{countdown.minutes}</div>
                <div className="text-[11px] text-blue-200">دقيقة</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 py-3">
                <div className="text-2xl font-extrabold tabular-nums font-mono">{countdown.seconds}</div>
                <div className="text-[11px] text-blue-200">ثانية</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('documents')}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>رفع التسليم الآن</span>
            </button>
          </section>

          {/* Chronological Upcoming */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">المواعيد القادمة مرتبة زمنياً</h2>
              <span className="text-xs text-slate-500">{upcomingEvents.length} مواعيد</span>
            </div>

            <div className="space-y-2.5">
              {upcomingEvents.slice(0, 5).map((ev) => (
                <div key={ev.id} className="rounded-xl border border-slate-200 p-3 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[#0B438C]">
                      {ev.dateDay} مايو · {ev.timeLabel}
                    </span>
                    {ev.priority && (
                      <span className="rounded bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
                        {ev.priority}
                      </span>
                    )}
                  </div>
                  <div className="font-extrabold text-slate-900">{ev.title}</div>
                  {ev.assignee && (
                    <div className="text-[11px] text-slate-500 mt-1">المكلف: {ev.assignee}</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Policy Reminders */}
          <section className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 text-xs space-y-2">
            <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-amber-700" />
              <span>تنبيهات السياسة الأكاديمية للتسليمات</span>
            </div>
            <ul className="space-y-1.5 text-amber-950/80 leading-relaxed list-disc pr-4">
              <li>فترة السماح القصوى للتأخير 24 ساعة فقط بخصم إلزامي قدره 5% من درجة التقييم المرحلي.</li>
              <li>تتطلب مسودات الفصول النهائية شهادة Turnitin بنسبة استلال لا تتجاوز 20%.</li>
              <li>الحضور الشخصي بالزي الرسمي إلزامي في مناقشة السيمينار يوم الخميس 29 مايو بمدرج 4B.</li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Add Deadline Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cal-add-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="cal-add-title" className="text-lg font-extrabold text-slate-900">
                إضافة موعد أو تذكير أكاديمي
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
                onAddEvent({
                  id: `ev-${Date.now()}`,
                  title: newTitle.trim(),
                  dateDay: Math.max(1, Math.min(31, newDay)),
                  timeLabel: newTime,
                  category: newCategory,
                  priority: 'أولوية مرتفعة',
                });
                setNewTitle('');
                setShowAddModal(false);
                onNotify('تمت إضافة الموعد الجديد إلى التقويم الجامعي.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label htmlFor="ev-title-in" className="block font-bold text-slate-800 mb-1">
                  عنوان الموعد / التسليم
                </label>
                <input
                  id="ev-title-in"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: جلسة تجربة تشغيل الحساسات..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ev-day-in" className="block font-bold text-slate-800 mb-1">
                    اليوم (مايو 2025)
                  </label>
                  <input
                    id="ev-day-in"
                    type="number"
                    min={1}
                    max={31}
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ev-time-in" className="block font-bold text-slate-800 mb-1">
                    التوقيت
                  </label>
                  <input
                    id="ev-time-in"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ev-cat-in" className="block font-bold text-slate-800 mb-1">
                  التصنيف
                </label>
                <select
                  id="ev-cat-in"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CalendarEvent['category'])}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
                >
                  <option value="drafts">المسودات والتقارير</option>
                  <option value="engineering">التكليفات الهندسية</option>
                  <option value="advising">جلسات التوجيه والإرشاد</option>
                  <option value="defense">المناقشات والتحكيم</option>
                </select>
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
                  حفظ في التقويم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
