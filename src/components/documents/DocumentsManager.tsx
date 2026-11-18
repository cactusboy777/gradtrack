import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  CloudUpload,
  Download,
  FileArchive,
  FileCheck2,
  FileCode2,
  FileText,
  Folder,
  History,
  Lock,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { AcademicDocument, SubmissionFolderId } from '../../types';

interface DocumentsManagerProps {
  documents: AcademicDocument[];
  onUploadDocument: (doc: AcademicDocument) => void;
  onDeleteDocuments: (ids: string[]) => void;
  onNotify: (msg: string) => void;
}

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocuments,
  onNotify,
}) => {
  const [activeFolder, setActiveFolder] = useState<'all' | SubmissionFolderId>('final-report');
  const [typeFilter, setTypeFilter] = useState<'all' | 'docs' | 'code' | 'cad'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['doc-1']);
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders: {
    id: SubmissionFolderId;
    title: string;
    subtitle: string;
    badge: string;
    date: string;
  }[] = [
    { id: 'proposal', title: 'المقترح وخطة البحث', subtitle: 'Proposal & Concept', badge: 'معتمد 100%', date: '12 مارس' },
    { id: 'srs', title: 'متطلبات البرمجيات والعتاد', subtitle: 'SRS & Specs', badge: 'معتمد', date: '02 أبريل' },
    { id: 'design', title: 'المخططات والتصاميم الهندسية', subtitle: 'Design & Schematics', badge: 'معتمد', date: '25 أبريل' },
    { id: 'final-report', title: 'مسودة التقرير النهائي', subtitle: 'Final Report & Thesis', badge: 'قيد التدقيق (نشط)', date: 'الآن' },
    { id: 'defense-media', title: 'العروض ووسائط المناقشة', subtitle: 'Defense & Media', badge: 'اختياري', date: '08 مايو' },
  ];

  const totalStorageMB = Math.round(documents.reduce((acc, d) => acc + d.sizeMB, 200));

  const filteredDocs = documents.filter((d) => {
    if (activeFolder !== 'all' && d.folder !== activeFolder) return false;
    if (typeFilter === 'docs' && !['pdf', 'docx', 'pptx'].includes(d.fileType)) return false;
    if (typeFilter === 'code' && d.fileType !== 'zip') return false;
    if (typeFilter === 'cad' && d.fileType !== 'cad') return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const simulateFileUpload = (fileName: string, sizeMB: number) => {
    setUploadingName(fileName);
    setUploadPct(25);
    window.setTimeout(() => setUploadPct(70), 250);
    window.setTimeout(() => {
      setUploadPct(100);
      const ext = fileName.split('.').pop()?.toLowerCase();
      const fileType: AcademicDocument['fileType'] =
        ext === 'docx'
          ? 'docx'
          : ext === 'zip'
          ? 'zip'
          : ext === 'cad'
          ? 'cad'
          : ext === 'pptx'
          ? 'pptx'
          : 'pdf';

      onUploadDocument({
        id: `doc-${Date.now()}`,
        name: fileName,
        description: 'مسودة مرفوعة حديثاً عبر بوابة الرفع السريع وجاهزة للفحص الأكاديمي',
        folder: activeFolder === 'all' ? 'final-report' : activeFolder,
        fileType,
        sizeMB,
        version: 'v2.5 (الأحدث)',
        isLatest: true,
        uploadedBy: 'أحمد إبراهيم',
        uploaderRole: 'قائد الفريق (طالب)',
        uploaderInitials: 'أ إ',
        uploadedAt: 'الآن',
        turnitinScore: 7,
        approved: false,
      });
      setUploadingName(null);
      setUploadPct(0);
      onNotify(`تم رفع وفحص الملف ${fileName} بنجاح (Turnitin: 7%).`);
    }, 650);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <span>بوابة الطالب الأكاديمية</span>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">تسليم المسودات والمراحل (S-13)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            إدارة المستندات ومسودات التسليم الأكاديمي
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
            <span className="rounded bg-blue-50 text-[#0B438C] font-bold px-2 py-0.5">
              المرحلة النشطة: تسليم التقرير النهائي (S-13)
            </span>
            <span>مشروع: منظومة رصد وتصنيف الأعطال الميكانيكية بالذكاء الاصطناعي</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNotify('عرض سجل الإصدارات التاريخي الكامل.')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2.5 cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>سجل الإصدارات</span>
          </button>
          <button
            type="button"
            onClick={() => onNotify('تم تجهيز الحزمة الكاملة (ZIP) للتنزيل.')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0B438C]" />
            <span>تحميل الحزمة الكاملة (ZIP)</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" />
            <span>رفع ملف / مسودة جديدة +</span>
          </button>
        </div>
      </section>

      {/* 4 Storage & Integrity Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">المساحة السحابية للمشروع</div>
          <div className="text-xl font-extrabold text-slate-900 tabular-nums">
            {totalStorageMB} ميجابايت <span className="text-xs font-normal text-slate-500">/ 1.0 GB</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-[#0B438C]"
              style={{ width: `${Math.min(100, Math.round((totalStorageMB / 1024) * 100))}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">إجمالي الملفات والمرفقات</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {documents.length + 19} <span className="text-xs font-semibold text-slate-500">ملفاً أكاديمياً</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">موزعة على 5 مراحل تسليم متزامنة</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">حالة الاعتماد الأكاديمي</div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            4 / 5 <span className="text-xs font-semibold text-slate-500">مسودات معتمدة</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">1 مسودة قيد التدقيق · 0 مرفوضة</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">مؤشر النزاهة العلمية (Turnitin)</div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
            8% <span className="text-xs font-semibold text-slate-500">مقبول جداً (أقل من 20%)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">تطابق الذكاء الاصطناعي: 4% (مطابق لمعايير EGI)</div>
        </div>
      </section>

      {/* 5 Stage Folders */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">مجلدات وأقسام المراحل الأكاديمية</h2>
          <button
            type="button"
            onClick={() => setActiveFolder('all')}
            className={`text-xs font-bold cursor-pointer ${
              activeFolder === 'all' ? 'text-[#0B438C] underline' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            عرض كل المجلدات ({documents.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {folders.map((f) => {
            const count = documents.filter((d) => d.folder === f.id).length;
            const active = activeFolder === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`text-right rounded-2xl border p-4 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0B438C] text-white border-[#0B438C] shadow-sm'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-[#0B438C]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Folder className={`w-5 h-5 ${active ? 'text-amber-300' : 'text-[#0B438C]'}`} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {f.badge}
                  </span>
                </div>
                <div className="text-xs font-extrabold leading-snug">{f.title}</div>
                <div className={`text-[11px] mt-0.5 ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                  {f.subtitle}
                </div>
                <div className={`text-[11px] mt-3 pt-2 border-t ${active ? 'border-white/20 text-blue-100' : 'border-slate-100 text-slate-500'} flex justify-between`}>
                  <span>{count} ملفات</span>
                  <span>{f.date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split: Upload + Table & Left Policy/Turnitin Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-5">
          {/* Quick Upload Dropzone */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-extrabold text-slate-900">منطقة الرفع السريع للمسودة المعتمدة</span>
              <span className="text-[#0B438C] font-mono">
                المسار المستهدف: /المرحلة-13/{activeFolder}
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  simulateFileUpload(file.name, Math.max(1.2, Math.round((file.size / 1024 / 1024) * 10) / 10));
                }
              }}
            />

            <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 text-center">
              <CloudUpload className="w-8 h-8 text-[#0B438C] mx-auto mb-2" />
              <div className="text-sm font-extrabold text-slate-900 mb-1">
                اسحب وأفلت ملفات المسودة أو المستندات الأكاديمية هنا
              </div>
              <p className="text-xs text-slate-500 mb-4">
                الصيغ المدعومة: PDF, DOCX, PPTX, ZIP, CAD, IPYNB (الحد الأقصى للملف الواحد: 100 ميجابايت)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
                >
                  استعراض الملفات من جهازك
                </button>
                <button
                  type="button"
                  onClick={() => simulateFileUpload('EGI_PRJ-084_Final_Report_v2.5.pdf', 15.2)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 cursor-pointer"
                >
                  استيراد من GitHub / Google Drive
                </button>
              </div>
            </div>

            {uploadingName && (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-slate-900">{uploadingName}</span>
                  <span className="font-bold text-[#0B438C] tabular-nums">{uploadPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-[#0B438C] transition-all"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  جارٍ الفحص التلقائي ضد البرمجيات الخبيثة وفحص الاقتباس...
                </div>
              </div>
            )}
          </section>

          {/* Files List Table */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث باسم الملف أو الوصف..."
                  aria-label="بحث في المستندات"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 py-2 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: `الكل (${documents.length})` },
                  { id: 'docs', label: 'مستندات Word / PDF' },
                  { id: 'code', label: 'أكواد & أرشيف ZIP' },
                  { id: 'cad', label: 'مخططات هندسية' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeFilter(t.id as typeof typeFilter)}
                    className={`rounded-lg px-3 py-1.5 font-bold cursor-pointer ${
                      typeFilter === t.id
                        ? 'bg-[#0B438C] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B438C]">
                  تم تحديد {selectedIds.length} ملف من أصل {filteredDocs.length}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNotify(`جارٍ تحميل ${selectedIds.length} ملفات محددة...`)}
                    className="font-bold text-[#0B438C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    تحميل المحدد
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteDocuments(selectedIds);
                      setSelectedIds([]);
                    }}
                    className="font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف المحدد
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      aria-label={`تحديد ${doc.name}`}
                      className="mt-1 rounded border-slate-300 text-[#0B438C]"
                    />
                    <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center shrink-0">
                      {doc.fileType === 'zip' ? (
                        <FileArchive className="w-4 h-4 text-amber-600" />
                      ) : doc.fileType === 'cad' ? (
                        <FileCode2 className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 font-mono truncate" dir="ltr">
                        {doc.name}
                      </div>
                      <div className="text-slate-500 mt-0.5">{doc.description}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {doc.sizeMB} MB · {doc.uploadedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        doc.isLatest
                          ? 'bg-blue-50 text-[#0B438C] border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {doc.version}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                        {doc.uploaderInitials}
                      </span>
                      <div className="hidden sm:block text-right">
                        <div className="font-bold text-slate-800">{doc.uploadedBy}</div>
                        <div className="text-[10px] text-slate-500">{doc.uploaderRole}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNotify(`جارٍ تنزيل ${doc.name}...`)}
                      aria-label={`تنزيل ${doc.name}`}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0B438C] hover:bg-white cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Left 4 cols: Rules & Turnitin Report */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
              <FileCheck2 className="w-4 h-4 text-[#0B438C]" />
              <h2>شروط وقواعد التسليم المعتمدة بمعهد الجزيرة (EGI)</h2>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ضوابط النزاهة العلمية:
              </div>
              <p className="text-slate-600 leading-relaxed">
                نسبة الاقتباس المقبولة للمشروع عبر Turnitin يجب ألا تتجاوز <strong>20% كحد أقصى</strong>، وأي فصل يتجاوز 25% يُعاد تدقيقه فوراً.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="font-bold text-slate-900 mb-1">صيغة التسمية الإلزامية:</div>
              <div className="font-mono text-[11px] bg-white border border-slate-200 rounded px-2 py-1 text-[#0B438C]" dir="ltr">
                [ProjectCode]_[Milestone]_[Version]_[Date]
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                إغلاق المسودات المعتمدة:
              </div>
              <p className="text-slate-600 leading-relaxed">
                المسودات المعتمدة نهائياً من قبل المشرف الأكاديمي يتم قفلها برمجياً تلقائياً ولا يمكن حذفها إلا بإذن إلكتروني رسمي.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">تقرير الفحص الأكاديمي الأخير</h2>
              <span className="text-[11px] text-slate-500 font-mono">v2.4 · 10:32 ص</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
                <div className="text-lg font-extrabold text-emerald-700 tabular-nums">8%</div>
                <div className="text-[10px] text-slate-600">إجمالي الاقتباس</div>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-2.5">
                <div className="text-lg font-extrabold text-[#0B438C] tabular-nums">4%</div>
                <div className="text-[10px] text-slate-600">مؤشر AI</div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                <div className="text-lg font-extrabold text-slate-900 tabular-nums">0%</div>
                <div className="text-[10px] text-slate-600">نصوص مشبوهة</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              تم إنشاء التقرير آلياً بواسطة بوابة Turnitin المرتبطة بمعهد EGI. تقرير الاعتماد متاح للتنزيل المباشر كوثيقة رسمية داعمة للجنة التحكيم.
            </p>

            <button
              type="button"
              onClick={() => onNotify('تم تنزيل شهادة الأصالة الأكاديمية PDF.')}
              className="w-full rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0B438C] font-bold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تحميل شهادة الأصالة الأكاديمية (PDF)</span>
            </button>
          </section>

          <section className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 text-xs">
            <div className="font-extrabold text-amber-900 mb-1.5">توجيه عاجل من المشرف</div>
            <p className="text-amber-950/80 leading-relaxed italic mb-2">
              "يرجى من فريق العمل استكمال مراجعة المراجع وفق أسلوب IEEE وإعادة رفع المسودة النهائية قبل موعد إغلاق النظام الأكاديمي في 18 مايو."
            </p>
            <div className="text-[11px] font-bold text-amber-900">أ.د. أحمد السيد · قسم الحاسب</div>
          </section>
        </aside>
      </div>
    </div>
  );
};
