import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gavel,
  Info,
  Plus,
  Printer,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import type { DefenseSession, RubricScores } from '../../types';
import { calculateRubricEvaluation } from '../../utils/academicLogic';

interface DefenseCommitteesProps {
  sessions: DefenseSession[];
  onSaveEvaluation: (
    sessionId: string,
    scores: RubricScores,
    notes: string,
    decision: DefenseSession['decision']
  ) => void;
  onAddSession: (session: DefenseSession) => void;
  onNotify: (msg: string) => void;
}

export const DefenseCommittees: React.FC<DefenseCommitteesProps> = ({
  sessions,
  onSaveEvaluation,
  onAddSession,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'committees' | 'rubrics' | 'archive'>('scheduled');
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id ?? '');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];

  const [scores, setScores] = useState<RubricScores>(
    selectedSession?.rubricScores ?? {
      idea: 18,
      methodology: 22,
      execution: 27,
      presentation: 13,
      timeline: 8,
    }
  );
  const [notes, setNotes] = useState(selectedSession?.notes ?? '');
  const [decision, setDecision] = useState<DefenseSession['decision']>(
    selectedSession?.decision ?? 'إجازة المشروع بدون تعديل'
  );

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newHall, setNewHall] = useState('قاعة السيمينار الكبرى');
  const [newTime, setNewTime] = useState('04:00 م - 05:30 م');

  const handleSelectSession = (s: DefenseSession) => {
    setSelectedSessionId(s.id);
    setScores(s.rubricScores);
    setNotes(s.notes);
    setDecision(s.decision);
  };

  const evalResult = calculateRubricEvaluation(scores);
  const ringRadius = 38;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc - (evalResult.total / 100) * ringCirc;

  const pendingReportsCount = sessions.filter(
    (s) => s.status === 'بانتظار اعتماد التقرير'
  ).length + 3;

  const criteriaRows: {
    key: keyof RubricScores;
    title: string;
    subtitle: string;
    max: number;
    bands: string[];
  }[] = [
    {
      key: 'idea',
      title: '1. جودة فكرة المشروع والابتكار والجدوى الفنية',
      subtitle: 'حداثة الحل المقدم ومدى قابليته للتطبيق الفعلي',
      max: 20,
      bands: ['ضعيف (0-10)', 'جيد (11-15)', 'متميز (16-20)'],
    },
    {
      key: 'methodology',
      title: '2. المنهجية العلمية والتحليل وتوثيق التقرير',
      subtitle: 'هيكلة الأطروحة، المراجع، سلامة التحليل الرياضي والمنطقي',
      max: 25,
      bands: ['دون المستوى (<15)', 'مقبول إلى جيد (16-20)', 'استثنائي (21-25)'],
    },
    {
      key: 'execution',
      title: '3. كفاءة التنفيذ البرمجي والتطبيق العملي',
      subtitle: 'جودة الكود، بنية النظام، تجربة المستخدم واستقرار النظام',
      max: 30,
      bands: ['غير مكتمل (<18)', 'مستوفي للمتطلبات (19-24)', 'مكتمل باحترافية (25-30)'],
    },
    {
      key: 'presentation',
      title: '4. مهارات العرض التقديمي ومناقشة أعضاء الفريق',
      subtitle: 'الإلقاء، إدارة الوقت، الإجابة الدقيقة على أسئلة اللجنة',
      max: 15,
      bands: ['متوسط (<9)', 'جيد جداً (10-12)', 'مبهر ومتناسق (13-15)'],
    },
    {
      key: 'timeline',
      title: '5. الالتزام بالجدول الزمني ونسبة الاقتباس',
      subtitle: 'تقارير Turnitin للأصالة وتواريخ تسليم المسودات',
      max: 10,
      bands: ['مخالفة بالتوثيق (0-5)', 'مقبول (6-7)', 'التزام كامل وأصالة (8-10)'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Regulatory Banner */}
      <section className="rounded-2xl bg-[#EEF4FC] border border-blue-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-slate-800">
          <Info className="w-4 h-4 text-[#0B438C] shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-[#0B438C] block">
              تنبيه إجرائي ولائحي معتمد (عمادة معهد الجزيرة العالي - EGI)
            </span>
            <span>
              الحد الأدنى لاجتياز مشروع التخرج هو <strong>60%</strong>، ولا تُعتمد النتيجة النهائية إلا بعد استيفاء استمارة التقييم الموحدة وتوقيع رئيس القسم ومصادقة عميد المعهد وختم إدارة شؤون الطلاب والامتحانات.
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-white border border-blue-200 px-3 py-1.5 font-bold text-[#0B438C] whitespace-nowrap">
          لائحة 2024/2025
        </span>
      </section>

      {/* Page Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#0B438C] font-bold mb-1">GradTrack EGI · لجان التحكيم والأطروحات</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            لجان التحكيم وجلسات المناقشة والتقييم النهائي
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            إدارة وتوزيع لجان مناقشة مشاريع التخرج الأكاديمية، رصد درجات وملاحظات المحكمين الداخليين والخارجيين، وتوثيق المحاضر الرسمية المعتمدة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>طباعة استمارات التقييم المجمعة</span>
          </button>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>جدولة جلسة تحكيم جديدة</span>
          </button>
        </div>
      </section>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs">
        {[
          { id: 'scheduled', label: `الجلسات المجدولة (${15 + sessions.length} جلسة قادمة)` },
          { id: 'committees', label: 'لجان التحكيم المعتمدة وتشكيل المجالس (12 لجنة)' },
          { id: 'rubrics', label: 'استمارات التقييم ومعايير الدرجات (Rubrics)' },
          { id: 'archive', label: 'المشاريع المنتهية والمجازة (سجل التخرج)' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`rounded-xl px-4 py-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#0B438C] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4 KPI Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">إجمالي جلسات اليوم</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
              0{3 + sessions.length}
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">2 جارية حالياً بالقاعات</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">المحكمون الخارجيون المشاركون</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">14</div>
            <div className="text-[11px] text-slate-500 mt-0.5">جامعات القاهرة، عين شمس، حلوان</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">التقارير بانتظار الاعتماد</div>
            <div className="text-2xl font-extrabold text-rose-600 tabular-nums mt-1">
              0{pendingReportsCount}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-0.5">تتطلب توقيع رئيس القسم</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">متوسط نسب الإنجاز للمشاريع</div>
            <div className="text-2xl font-extrabold text-emerald-700 tabular-nums mt-1">92.4%</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">أعلى من المستهدف الفصلي</div>
          </div>
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </span>
        </div>
      </section>

      {activeTab === 'committees' ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#0B438C]">{s.sessionCode}</span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 font-bold">معتمدة</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">{s.projectTitle}</h3>
              <div className="space-y-1 text-slate-600">
                <div><strong>المشرف الرئيسي:</strong> {s.leadSupervisor}</div>
                <div><strong>الممتحن الداخلي:</strong> {s.internalExaminer}</div>
                <div><strong>الممتحن الخارجي:</strong> {s.externalExaminer}</div>
              </div>
            </div>
          ))}
        </section>
      ) : activeTab === 'archive' ? (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 text-xs">
          <h2 className="text-base font-extrabold text-slate-900 mb-3">
            سجل المشاريع المنتهية والمجازة بالدرجات النهائية
          </h2>
          <p className="text-slate-600">
            يضم السجل 38 مشروعاً مجازاً بدرجة امتياز خلال الدورات السابقة، وسيتم ترحيل جلسات الفصل الثاني 2024/2025 فور اعتماد رئيس القسم.
          </p>
        </section>
      ) : (
        /* Main Split: Sessions Table + Live Grading Rubric Form */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Right 7 cols: Sessions Table + Decree */}
          <div className="xl:col-span-7 space-y-5">
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
                  <Gavel className="w-4 h-4 text-[#0B438C]" />
                  <h2>جدول جلسات المناقشة المقررة</h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">اليوم: الأحد 25 مايو 2025</span>
              </div>

              <div className="divide-y divide-slate-100">
                {sessions.map((s) => {
                  const isSelected = selectedSession?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`p-4 sm:p-5 transition-colors space-y-3.5 ${
                        isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Row Top: Session Code, Time/Hall & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-md bg-blue-50 text-[#0B438C] font-bold px-2.5 py-1 text-[11px] whitespace-nowrap">
                            جلسة رقم #{s.sessionCode}
                          </span>
                          <span className="font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                            {s.timeRange}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 font-semibold">{s.hall}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
                              s.status === 'جارية الآن' || s.status === 'معتمد وموقّع إلكترونياً'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.status === 'مؤكدة'
                                ? 'bg-blue-50 text-[#0B438C] border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {s.status}
                          </span>
                          {s.startedAgoLabel && (
                            <span className="text-[11px] text-slate-500 whitespace-nowrap">
                              ({s.startedAgoLabel})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row Middle: Project Info + Action Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {s.projectTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span>{s.department}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                              <Users className="w-3.5 h-3.5" />
                              فريق ({s.teamSize} طلاب)
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectSession(s)}
                          className={`rounded-xl font-bold text-xs px-4 py-2.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#0B438C] text-white'
                              : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected ? 'استمارة الرصد النشطة' : 'فتح استمارة الرصد'}
                        </button>
                      </div>

                      {/* Row Bottom: Committee Members */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="rounded-lg bg-slate-100 text-slate-800 px-2.5 py-1">
                          <span className="text-slate-500">المشرف: </span>
                          <strong className="font-bold">{s.leadSupervisor}</strong>
                        </span>
                        <span className="rounded-lg bg-slate-100 text-slate-800 px-2.5 py-1">
                          <span className="text-slate-500">ممتحن داخلي: </span>
                          <strong className="font-semibold">{s.internalExaminer}</strong>
                        </span>
                        <span className="rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 px-2.5 py-1 font-semibold">
                          خارجي: {s.externalExaminer}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Decree Box */}
            <section className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-5 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-extrabold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>إقرار التشكيل الأكاديمي للجان (العمادة)</span>
                </div>
                <span className="rounded-full bg-white border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  معتمد رسمياً
                </span>
              </div>
              <p className="text-emerald-950/80 leading-relaxed">
                تتشكل لجان التحكيم وفقاً للمادة (38) من اللائحة التنفيذية: أستاذ مشرف + ممتحن داخلي من كادر المعهد + ممتحن خارجي بدرجة أستاذ مساعد/أستاذ من إحدى الجامعات الحكومية المصرية المعتمدة لضمان حيادية التقييم الأكاديمي.
              </p>
            </section>
          </div>

          {/* Left 5 cols: Live Interactive Rubric Form */}
          <aside className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
                <ClipboardCheck className="w-5 h-5 text-[#0B438C]" />
                <h2>استمارة التقييم ورصد الدرجات المباشر</h2>
              </div>
              <span className="rounded-full bg-[#0B438C] text-white px-3 py-1 text-[11px] font-bold whitespace-nowrap">
                {selectedSession?.status === 'معتمد وموقّع إلكترونياً' ? 'معتمدة' : 'جلسة نشطة'}
              </span>
            </div>

            {selectedSession && (
              <>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[#0B438C]">المشروع قيد المناقشة الآن:</span>
                    <span className="font-mono text-slate-600 font-semibold">
                      كود: {selectedSession.projectCode}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedSession.projectTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    القاعة: {selectedSession.hall} · الممتحن الخارجي: {selectedSession.externalExaminer}
                  </div>
                </div>

                {/* Live Total Score Card (cleanly aligned, no text overlap!) */}
                <div className="rounded-2xl bg-gradient-to-br from-[#0B3E82] to-[#08244B] text-white p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-blue-200 font-semibold">المجموع التراكمي للرصد</div>
                    <div className="text-3xl font-extrabold tabular-nums">
                      {evalResult.total}{' '}
                      <span className="text-base font-semibold text-blue-200">/ 100</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-300">
                      التقدير المقترح: {evalResult.gradeLabel}
                    </div>
                  </div>

                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 92 92">
                      <circle
                        cx="46"
                        cy="46"
                        r={ringRadius}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="46"
                        cy="46"
                        r={ringRadius}
                        fill="none"
                        stroke={evalResult.passed ? '#34D399' : '#FB7185'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={ringCirc}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-base font-extrabold tabular-nums">
                      {evalResult.total}%
                    </div>
                  </div>
                </div>

                {/* 5 Interactive Criteria Sliders + Numeric Inputs */}
                <div className="space-y-3">
                  {criteriaRows.map((c) => {
                    const val = evalResult.clamped[c.key];
                    return (
                      <div key={c.key} className="rounded-xl border border-slate-200 p-3.5 text-xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-slate-900">{c.title}</div>
                            <div className="text-[11px] text-slate-500">{c.subtitle}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 font-mono">
                            <input
                              type="number"
                              min={0}
                              max={c.max}
                              aria-label={c.title}
                              value={val}
                              onChange={(e) =>
                                setScores((prev) => ({
                                  ...prev,
                                  [c.key]: Number(e.target.value),
                                }))
                              }
                              className="w-14 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-center font-extrabold text-[#0B438C] tabular-nums"
                            />
                            <span className="text-slate-500 font-bold">/ {c.max}</span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={c.max}
                          aria-label={`تعديل درجة ${c.title}`}
                          value={val}
                          onChange={(e) =>
                            setScores((prev) => ({
                              ...prev,
                              [c.key]: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-[#0B438C] cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          {c.bands.map((b) => (
                            <span key={b}>{b}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mandatory Notes */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label htmlFor="rubric-notes" className="font-extrabold text-slate-900">
                      الملاحظات والتعديلات الإلزامية قبل استلام النسخة النهائية المجلدة:
                    </label>
                    <span className="text-[11px] text-amber-700 font-bold">مطلوبة للاعتماد</span>
                  </div>
                  <textarea
                    id="rubric-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب هنا التوصيات التقنية، تصحيح الرسوم البيانية، أو فصول التقرير المطلوب تعديلها خلال مهلة أسبوعين..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:bg-white focus:border-[#0B438C] focus:outline-none"
                  />
                </div>

                {/* Preliminary Committee Decision */}
                <div className="space-y-2 text-xs">
                  <div className="font-extrabold text-slate-900">قرار لجنة التحكيم المبدئي:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        'إجازة المشروع بدون تعديل',
                        'إجازة مع تعديلات طفيفة',
                        'إعادة مناقشة وتعديل جوهري',
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt}
                        className={`rounded-xl border p-2.5 flex items-center gap-2 cursor-pointer font-bold text-[11px] ${
                          decision === opt
                            ? 'border-[#0B438C] bg-blue-50 text-[#0B438C]'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="committee-decision"
                          checked={decision === opt}
                          onChange={() => setDecision(opt)}
                          className="text-[#0B438C]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Digital Signature Box */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">التوقيع الرقمي للمحكم المشفر</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {selectedSession.signedBy ?? 'أ.د. طارق الجزار'} · رمز المصادقة{' '}
                      {selectedSession.verificationCode ?? 'VER-EGI-9921#'}
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSaveEvaluation(selectedSession.id, evalResult.clamped, notes, decision);
                    onNotify(
                      `تم اعتماد درجة (${evalResult.total}/100 - ${evalResult.gradeLabel}) وتوقيع المحكم إلكترونياً للجلسة ${selectedSession.sessionCode}.`
                    );
                  }}
                  className="w-full rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-extrabold text-sm py-3.5 px-5 transition-colors cursor-pointer"
                >
                  اعتماد الدرجة وتوقيع المحكم إلكترونياً
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sched-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 id="sched-modal-title" className="text-lg font-extrabold text-slate-900">
                جدولة جلسة تحكيم جديدة
              </h2>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                aria-label="إغلاق"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProjTitle.trim()) return;
                const nextSession: DefenseSession = {
                  id: `def-${Date.now()}`,
                  sessionCode: `DEF-${405 + sessions.length}`,
                  timeRange: newTime,
                  hall: newHall,
                  dateLabel: 'الإثنين 26 مايو 2025',
                  projectCode: `CS-GP-2025-0${30 + sessions.length}`,
                  projectTitle: newProjTitle.trim(),
                  department: 'قسم هندسة الحاسب ونظم المعلومات',
                  teamSize: 4,
                  leadSupervisor: 'أ.د. أحمد السيد',
                  internalExaminer: 'د. ريم مصطفى',
                  externalExaminer: 'أ.د. طارق الجزار (جامعة القاهرة)',
                  status: 'مؤكدة',
                  rubricScores: { idea: 16, methodology: 20, execution: 25, presentation: 12, timeline: 8 },
                  notes: '',
                  decision: 'إجازة المشروع بدون تعديل',
                  signedBy: 'أ.د. طارق الجزار',
                  verificationCode: 'VER-EGI-9988#',
                };
                onAddSession(nextSession);
                handleSelectSession(nextSession);
                setNewProjTitle('');
                setShowScheduleModal(false);
                onNotify('تمت جدولة جلسة التحكيم الجديدة بنجاح.');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label htmlFor="def-proj-in" className="block font-bold text-slate-800 mb-1">
                  عنوان المشروع
                </label>
                <input
                  id="def-proj-in"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="أدخل عنوان مشروع التخرج..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="def-hall-in" className="block font-bold text-slate-800 mb-1">
                  القاعة / المدرج
                </label>
                <input
                  id="def-hall-in"
                  value={newHall}
                  onChange={(e) => setNewHall(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="def-time-in" className="block font-bold text-slate-800 mb-1">
                  الفترة الزمنية
                </label>
                <input
                  id="def-time-in"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0B438C] text-white px-5 py-2 font-bold cursor-pointer"
                >
                  تأكيد الجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
