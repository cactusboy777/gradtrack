import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  FileCheck2,
  Gavel,
  Headphones,
  Megaphone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import type { NotificationItem, ScreenId, SystemSettingsState } from '../../types';
import { computeNotificationStats } from '../../utils/academicLogic';

interface NotificationsCenterProps {
  notifications: NotificationItem[];
  settings: SystemSettingsState;
  onToggleSetting: (key: 'smsUrgentAlerts' | 'dailyDigestReport') => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (screen: ScreenId) => void;
  onNotify: (msg: string) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  settings,
  onToggleSetting,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
  onNotify,
}) => {
  const [catFilter, setCatFilter] = useState<'all' | NotificationItem['category']>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');

  const stats = computeNotificationStats(notifications);

  const filtered = notifications.filter((n) => {
    if (catFilter !== 'all' && n.category !== catFilter) return false;
    if (unreadOnly && !n.unread) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const todayList = filtered.filter((n) => n.group === 'today');
  const weekList = filtered.filter((n) => n.group === 'week');

  const iconForCategory = (cat: NotificationItem['category']) => {
    if (cat === 'defenses') return <Gavel className="w-4 h-4 text-amber-700" />;
    if (cat === 'submissions') return <FileCheck2 className="w-4 h-4 text-[#0B438C]" />;
    if (cat === 'reviews') return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    return <Megaphone className="w-4 h-4 text-slate-700" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
            <span>الرئيسية</span>
            <span>‹</span>
            <span>لوحة التحكم</span>
            <span>‹</span>
            <span className="font-bold text-[#0B438C]">مركز الإشعارات والتنبيهات الأكاديمية</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              مركز الإشعارات الأكاديمية
            </h1>
            {stats.unreadCount > 0 && (
              <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-extrabold text-rose-700 tabular-nums">
                {stats.unreadCount} تنبيهات جديدة غير مقروءة
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            معهد الجزيرة العالي للهندسة والتكنولوجيا · العام الجامعي 2024/2025 · الفصل الدراسي الثاني
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#0B438C]" />
            <span>تحديد الكل كمقروء</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-4 py-2.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>تفضيلات التنبيهات</span>
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الإشعارات، أسماء المشاريع، لجان المناقشة، أو كود التكليف..."
              aria-label="بحث في الإشعارات"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-xs focus:bg-white focus:outline-none"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-slate-300 text-[#0B438C]"
            />
            <span>غير المقروء فقط</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: `الكل (${stats.total})` },
            { id: 'submissions', label: `المهام والتسليمات (${stats.submissions})` },
            { id: 'reviews', label: `الملاحظات والتقييمات (${stats.reviews})` },
            { id: 'defenses', label: `المواعيد ولجان المناقشة (${stats.defenses})` },
            { id: 'security', label: `تنبيهات النظام والأمان (${stats.security})` },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCatFilter(c.id as typeof catFilter)}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-colors whitespace-nowrap cursor-pointer ${
                catFilter === c.id
                  ? 'bg-[#0B438C] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right 8 cols: Grouped Feed */}
        <div className="xl:col-span-8 space-y-6">
          {[
            { label: 'اليوم · الأربعاء، 14 مايو 2025', items: todayList },
            { label: 'سابقاً هذا الأسبوع', items: weekList },
          ].map((group) =>
            group.items.length > 0 ? (
              <section key={group.label} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 px-1">
                  <span>{group.label}</span>
                  <span>{group.items.length} إشعارات</span>
                </div>

                {group.items.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => onMarkRead(item.id)}
                    className={`rounded-2xl border p-5 transition-colors cursor-pointer ${
                      item.unread
                        ? 'bg-white border-blue-200 shadow-xs'
                        : 'bg-white/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                          {iconForCategory(item.category)}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-blue-50 text-[#0B438C] px-2 py-0.5 text-[11px] font-bold">
                              {item.categoryLabel}
                            </span>
                            {item.unread && (
                              <span className="rounded-full bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold">
                                جديد
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                      {item.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-3">
                      {item.meta.map((m, idx) => (
                        <React.Fragment key={m}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          <span>{m}</span>
                        </React.Fragment>
                      ))}
                    </div>

                    {(item.primaryActionLabel || item.secondaryActionLabel) && (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                        {item.primaryActionLabel && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkRead(item.id);
                              if (item.primaryTargetScreen) {
                                onNavigate(item.primaryTargetScreen);
                              }
                            }}
                            className="rounded-xl bg-[#0B438C] hover:bg-[#08346F] text-white font-bold text-xs px-3.5 py-2 cursor-pointer"
                          >
                            {item.primaryActionLabel}
                          </button>
                        )}
                        {item.secondaryActionLabel && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkRead(item.id);
                              onNotify(`تم تنفيذ: ${item.secondaryActionLabel}`);
                            }}
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 cursor-pointer"
                          >
                            {item.secondaryActionLabel}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </section>
            ) : null
          )}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-600">
              لا توجد إشعارات مطابقة لخيار التصفية المحدد.
            </div>
          )}
        </div>

        {/* Left 4 cols: Breakdown Stats + Quick Toggles + Support */}
        <aside className="xl:col-span-4 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">إحصائيات الإشعارات الأكاديمية</h2>
              <Bell className="w-4 h-4 text-[#0B438C]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-600">توزيع التنبيهات حسب التصنيف</span>
                <span className="font-extrabold text-[#0B438C] tabular-nums">{stats.total} إشعار نشط</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="bg-[#0B438C]" style={{ width: `${stats.percentages.submissions}%` }} />
                <div className="bg-amber-500" style={{ width: `${stats.percentages.defenses}%` }} />
                <div className="bg-emerald-600" style={{ width: `${stats.percentages.reviews}%` }} />
                <div className="bg-slate-500" style={{ width: `${stats.percentages.security}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>● {stats.percentages.submissions}% مسودات وتسليمات</div>
              <div>● {stats.percentages.defenses}% لجان مناقشة</div>
              <div>● {stats.percentages.reviews}% فحص الاقتباس</div>
              <div>● {stats.percentages.security}% أمان وتعاميم</div>
            </div>

            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 flex items-center justify-between">
              <div>
                <div className="text-slate-600">متوسط سرعة اعتماد المسودات</div>
                <div className="text-lg font-extrabold text-emerald-800 tabular-nums mt-0.5">
                  18.4 ساعة
                </div>
              </div>
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <h2 className="text-sm font-extrabold text-slate-900">قنوات التنبيه الفوري</h2>
            <p className="text-slate-500 leading-relaxed">
              قم بتفعيل القنوات المباشرة للحالات العاجلة وتغيير مواعيد جلسات التحكيم قبل 24 ساعة.
            </p>

            <label className="rounded-xl border border-slate-200 p-3 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-900">رسائل SMS الطارئة</div>
                <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                  +20 100 **** 489
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.smsUrgentAlerts}
                onChange={() => onToggleSetting('smsUrgentAlerts')}
                className="w-4 h-4 accent-[#0B438C]"
              />
            </label>

            <label className="rounded-xl border border-slate-200 p-3 flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-slate-900">التقرير الأكاديمي اليومي</div>
                <div className="text-[11px] text-slate-500">ملخص يرسل الساعة 08:00 صباحاً</div>
              </div>
              <input
                type="checkbox"
                checked={settings.dailyDigestReport}
                onChange={() => onToggleSetting('dailyDigestReport')}
                className="w-4 h-4 accent-[#0B438C]"
              />
            </label>
          </section>

          <section className="rounded-2xl bg-[#0B3E82] text-white p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-sm">
              <Headphones className="w-4 h-4 text-amber-300" />
              <span>الدعم الفني والتقني الأكاديمي</span>
            </div>
            <p className="text-blue-100/80 leading-relaxed">
              هل تواجه مشكلة في استلام ملفات لجان التحكيم أو تقارير الاقتباس؟ فريق الدعم الأكاديمي جاهز لمساعدتك طوال أيام العمل الرسمية.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="flex-1 rounded-xl bg-white text-[#0B438C] font-bold py-2 cursor-pointer"
              >
                محادثة الدعم الفني
              </button>
              <span className="rounded-xl bg-white/15 px-3 py-2 font-mono font-bold">
                داخلي: 2410
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
