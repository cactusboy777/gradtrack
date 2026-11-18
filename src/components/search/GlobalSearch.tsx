import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  FolderKanban,
  GraduationCap,
  Printer,
  RotateCcw,
  Search,
  UserCheck,
} from 'lucide-react';
import type { AcademicDocument, KanbanTask, Project, ScreenId } from '../../types';
import { filterAndSearchAll, type GlobalSearchFilters } from '../../utils/academicLogic';

interface GlobalSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  projects: Project[];
  tasks: KanbanTask[];
  documents: AcademicDocument[];
  people: { id: string; name: string; role: string; code: string; department: string; details: string; email?: string }[];
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onNotify: (msg: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  query,
  onQueryChange,
  projects,
  tasks,
  documents,
  people,
  onNavigate,
  onNotify,
}) => {
  const [filters, setFilters] = useState<GlobalSearchFilters>({
    category: 'all',
    department: 'all',
    turnitinBand: 'all',
    fileType: 'all',
  });

  const allMatches = filterAndSearchAll(
    query,
    { ...filters, category: 'all' },
    { projects, tasks, documents, people }
  );

  const visibleResults = allMatches.filter(
    (item) => filters.category === 'all' || item.kind === filters.category
  );

  const countKind = (kind: GlobalSearchFilters['category']) =>
    kind === 'all' ? allMatches.length : allMatches.filter((x) => x.kind === kind).length;

  const popularQueries = [
    'الذكاء الاصطناعي',
    'مصفوفة الارتباك',
    'أحمد السيد',
    'ESP32',
    'Turnitin',
  ];

  const handleExportResults = () => {
    const csvRows = [
      ['النوع', 'الكود', 'العنوان', 'التفاصيل'].join(','),
      ...visibleResults.map((r) =>
        [r.kind, r.code, `"${r.title.replace(/"/g, '""')}"`, `"${r.subtitle}"`].join(',')
      ),
    ];
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EGI-Search-Results.csv';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('تم تصدير نتائج البحث الشامل بصيغة Excel CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Hero */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-500">
            الرئيسية ‹ لوحة التحكم الأكاديمية ‹{' '}
            <strong className="text-[#0B438C]">نتائج البحث الشامل</strong>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 font-bold">
            الفهرس الأكاديمي المحدث: الفصل الثاني 2024/2025
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-[#0B438C] absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="ابحث في المشاريع، المهام، المستندات، أو أعضاء هيئة التدريس..."
              aria-label="بحث شامل في الفهرس الأكاديمي"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#0B438C] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => onNotify(`تم تحديث نتائج البحث لـ "${query || 'الكل'}"`)}
            className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-5 py-3.5 cursor-pointer"
          >
            بحث فوري
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-bold">عمليات بحث شائعة:</span>
            {popularQueries.map((pq) => (
              <button
                key={pq}
                type="button"
                onClick={() => onQueryChange(pq)}
                className="rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0B438C] px-2.5 py-1 font-semibold text-slate-700 cursor-pointer"
              >
                {pq}
              </button>
            ))}
          </div>

          <span className="text-slate-600 tabular-nums">
            تم العثور على <strong className="text-slate-900">{visibleResults.length}</strong> نتيجة بحث عبر قطاعات المنظومة (0.04 ثانية)
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {[
            { id: 'all', label: `الكل (${countKind('all')})` },
            { id: 'projects', label: `مشاريع التخرج (${countKind('projects')})` },
            { id: 'tasks', label: `المهام والتكليفات (${countKind('tasks')})` },
            { id: 'documents', label: `الملفات والوثائق (${countKind('documents')})` },
            { id: 'people', label: `الكوادر والطلاب (${countKind('people')})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, category: t.id as GlobalSearchFilters['category'] }))}
              className={`rounded-xl px-4 py-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filters.category === t.id
                  ? 'bg-[#0B438C] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Split: Faceted Filters Sidebar + Results */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Facets Sidebar (3 cols) */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">تصفية متقدمة</h2>
              <button
                type="button"
                onClick={() =>
                  setFilters({ category: 'all', department: 'all', turnitinBand: 'all', fileType: 'all' })
                }
                className="inline-flex items-center gap-1 text-[#0B438C] font-bold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط الفلاتر
              </button>
            </div>

            <div>
              <label htmlFor="facet-dept" className="block font-bold text-slate-800 mb-2">
                الأقسام الهندسية والعلمية
              </label>
              <select
                id="facet-dept"
                value={filters.department}
                onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold"
              >
                <option value="all">جميع الأقسام العلمية</option>
                <option value="قسم هندسة الحاسب ونظم المعلومات">قسم هندسة الحاسب ونظم المعلومات</option>
                <option value="قسم نظم المعلومات الإدارية">قسم نظم المعلومات الإدارية</option>
                <option value="قسم هندسة الإلكترونيات والاتصالات">قسم هندسة الإلكترونيات والاتصالات</option>
              </select>
            </div>

            <div>
              <div className="font-bold text-slate-800 mb-2">نوع الملف والتنسيق</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pdf', label: 'PDF' },
                  { id: 'docx', label: 'DOCX' },
                  { id: 'zip', label: 'ZIP / Git' },
                ].map((ft) => (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, fileType: ft.id }))}
                    className={`rounded-lg border py-2 font-bold cursor-pointer ${
                      filters.fileType === ft.id
                        ? 'bg-[#0B438C] text-white border-[#0B438C]'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-800 mb-2">نسبة الاقتباس (Turnitin)</div>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'جميع النسب' },
                  { id: 'under10', label: 'أقل من 10% (ممتاز ومثالي)' },
                  { id: '10to20', label: 'من 10% إلى 20% (مقبول أكاديمياً)' },
                  { id: 'over20', label: 'أعلى من 20% (يتطلب إعادة صياغة)' },
                ].map((tb) => (
                  <label key={tb.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="turnitin-band"
                      checked={filters.turnitinBand === tb.id}
                      onChange={() =>
                        setFilters((f) => ({
                          ...f,
                          turnitinBand: tb.id as GlobalSearchFilters['turnitinBand'],
                        }))
                      }
                      className="text-[#0B438C]"
                    />
                    <span className="text-slate-700 font-medium">{tb.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-[#0B3E82] text-white p-5 space-y-3 text-xs">
            <div className="font-extrabold text-sm">تصدير تقرير نتائج البحث</div>
            <p className="text-blue-100/80 leading-relaxed">
              يمكنك تحميل كافة النتائج مع بيانات الطلاب والمشرفين كملف Excel أو طباعة التقرير للإدارة الأكاديمية.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportResults}
                className="rounded-xl bg-white text-[#0B438C] font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>تصدير Excel</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التقرير</span>
              </button>
            </div>
          </section>
        </aside>

        {/* Results Feed (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          {visibleResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-600">
              <p className="font-bold text-slate-900 text-sm mb-2">
                لم نجد نتائج مطابقة لعبارة البحث "{query}"
              </p>
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  setFilters({ category: 'all', department: 'all', turnitinBand: 'all', fileType: 'all' });
                }}
                className="mt-2 rounded-xl bg-[#0B438C] text-white font-bold px-4 py-2 cursor-pointer"
              >
                عرض جميع السجلات
              </button>
            </div>
          ) : (
            visibleResults.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 hover:border-[#0B438C]/50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B438C] flex items-center justify-center">
                      {item.kind === 'projects' ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : item.kind === 'documents' ? (
                        <FileText className="w-4 h-4" />
                      ) : item.kind === 'tasks' ? (
                        <FolderKanban className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <span className="font-bold text-[#0B438C]">{item.subtitle}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    {item.badgeText}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.snippet}</p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  {item.meta.map((m, i) => (
                    <React.Fragment key={m}>
                      {i > 0 && <span aria-hidden="true">·</span>}
                      <span>{m}</span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.targetScreen, item.targetId)}
                    className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2 cursor-pointer"
                  >
                    {item.kind === 'projects'
                      ? 'عرض تفاصيل المشروع الكاملة'
                      : item.kind === 'tasks'
                      ? 'فتح التكليف والمناقشة'
                      : item.kind === 'documents'
                      ? 'فتح في مدير المستندات'
                      : 'عرض الملف الأكاديمي'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
