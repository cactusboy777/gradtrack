import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Mail,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import type { Project, ScreenId } from '../../types';

interface TeamsAndReportsProps {
  mode: 'teams' | 'supervisors' | 'reports';
  projects: Project[];
  people: {
    id: string;
    name: string;
    role: string;
    code: string;
    department: string;
    details: string;
    email?: string;
    office?: string;
    officeHours?: string;
    projectsSupervised?: number;
    committeesCount?: number;
  }[];
  onNavigate: (screen: ScreenId, targetId?: string) => void;
  onNotify: (msg: string) => void;
}

export const TeamsAndReports: React.FC<TeamsAndReportsProps> = ({
  mode,
  projects,
  people,
  onNavigate,
  onNotify,
}) => {
  if (mode === 'teams') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">مجموعات الطلاب والفرق البحثية</h1>
            <p className="text-xs text-slate-600 mt-1">
              قائمة الفرق المعتمدة ومؤشرات إنجاز المهام ونسب النزاهة العلمية لكل فريق
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="rounded-xl bg-[#0B438C] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            استعراض دليل المشاريع الكامل
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#0B438C]">{p.code}</span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 font-bold tabular-nums">
                  الإنجاز {p.progress}%
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('project-detail', p.id)}
                className="text-sm font-extrabold text-slate-900 hover:text-[#0B438C] text-right block cursor-pointer"
              >
                {p.title}
              </button>
              <div className="text-xs text-slate-500">المشرف: {p.supervisor}</div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {p.teamMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center ${m.avatarColor}`}>
                        {m.initials}
                      </span>
                      <span className="font-bold text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-slate-500 tabular-nums">{m.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'supervisors') {
    const faculty = people.filter((p) => p.code.startsWith('EGI-FAC'));
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">إدارة المشرفين والمحكمين المعتمدين</h1>
            <p className="text-xs text-slate-600 mt-1">
              السجل الأكاديمي لأعضاء هيئة التدريس والخبراء الخارجيين المشاركين في الإشراف والتحكيم
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('defenses')}
            className="rounded-xl bg-[#0B438C] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            جدول لجان التحكيم
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faculty.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B438C] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{f.name}</div>
                    <div className="text-[#0B438C] font-semibold mt-0.5">{f.role}</div>
                  </div>
                </div>
                <span className="font-mono text-slate-500">{f.code}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{f.details}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-slate-500">
                  {f.projectsSupervised} مشاريع · {f.committeesCount} لجان تحكيم
                </span>
                <button
                  type="button"
                  onClick={() => onNotify(`تم إرسال بريد أكاديمي إلى ${f.email}`)}
                  className="inline-flex items-center gap-1 text-[#0B438C] font-bold hover:underline cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>مراسلة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Reports Mode
  const avgProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / Math.max(1, projects.length)
  );
  const avgTurnitin = (
    projects.reduce((acc, p) => acc + p.turnitinScore, 0) / Math.max(1, projects.length)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">التقارير والإحصائيات الأكاديمية</h1>
          <p className="text-xs text-slate-600 mt-1">
            مؤشرات الأداء الإجمالية للدفعة 22 ومعدلات النزاهة العلمية وجاهزية المناقشات
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNotify('تم تصدير التقرير الإحصائي السنوي لعمادة المعهد.')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>تصدير التقرير السنوي</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>متوسط الإنجاز الكلي للفرق</span>
            <BarChart3 className="w-4 h-4 text-[#0B438C]" />
          </div>
          <div className="text-3xl font-extrabold text-[#0B438C] tabular-nums">{avgProgress}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>متوسط نسبة الاستلال Turnitin</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">{avgTurnitin}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>المشاريع الجاهزة للتحكيم</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
            {projects.filter((p) => p.progress >= 80).length} / {projects.length}
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">توزيع نسب الإنجاز ومؤشر Turnitin</h2>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 truncate">{p.title}</span>
                <span className="font-mono text-slate-600 shrink-0 tabular-nums">
                  إنجاز {p.progress}% · Turnitin {p.turnitinScore}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0B438C] rounded-full" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
