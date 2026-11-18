import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Award,
  BarChart3,
  Bell,
  Calendar,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type { ScreenId, UserRole } from '../../types';

interface AppShellProps {
  activeScreen: ScreenId;
  role: UserRole;
  unreadNotifications: number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: (q: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  toastMessage: string | null;
  onClearToast: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeScreen,
  role,
  unreadNotifications,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
  onSwitchRole,
  onLogout,
  toastMessage,
  onClearToast,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(onClearToast, 3500);
    return () => window.clearTimeout(t);
  }, [toastMessage, onClearToast]);

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; match?: ScreenId[] }[] = [
    {
      id: role === 'student' ? 'student-dashboard' : 'dashboard',
      label: role === 'student' ? 'لوحة تحكم الطالب' : 'لوحة التحكم العامة',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      match: ['dashboard', 'student-dashboard'],
    },
    {
      id: 'projects',
      label: 'مشاريع التخرج',
      icon: <FolderKanban className="w-4 h-4 shrink-0" />,
      match: ['projects', 'project-detail'],
    },
    {
      id: 'kanban',
      label: 'لوحة مهام المشروع (Kanban)',
      icon: <KanbanSquare className="w-4 h-4 shrink-0" />,
      match: ['kanban', 'task-detail'],
    },
    {
      id: 'documents',
      label: 'تسليم المسودات والمراحل',
      icon: <FileCheck2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'calendar',
      label: 'التقويم والمواعيد',
      icon: <Calendar className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'defenses',
      label: 'لجان التحكيم والتقييم',
      icon: <Award className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'teams',
      label: 'مجموعات الطلاب والفرق',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'supervisors',
      label: 'إدارة المشرفين والمحكمين',
      icon: <UserCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'الإعدادات والدعم الأكاديمي',
      icon: <Settings className="w-4 h-4 shrink-0" />,
      match: ['settings', 'profile'],
    },
  ];

  const isNavActive = (item: (typeof navItems)[number]) =>
    item.id === activeScreen || (item.match ? item.match.includes(activeScreen) : false);

  const cycleRole = () => {
    const next: UserRole =
      role === 'supervisor' ? 'student' : role === 'student' ? 'admin' : 'supervisor';
    onSwitchRole(next);
  };

  const userDisplay =
    role === 'student'
      ? { name: 'يوسف علي عبد الرحمن', title: 'طالب باحث · الفرقة الرابعة', initials: 'ي ع' }
      : role === 'admin'
      ? { name: 'أ.د. طارق الجزار', title: 'رئيس لجنة التحكيم والمناقشة', initials: 'ط ج' }
      : { name: 'أ.د. أحمد السيد', title: 'مشرف رئيسي - قسم هندسة الحاسب', initials: 'أ س' };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            onNavigate(role === 'student' ? 'student-dashboard' : 'dashboard');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-right cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#0B438C] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#0B438C] leading-tight">
              GradTrack | إدارة مشاريع التخرج
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">معهد الجزيرة العالي - EGI</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="إغلاق القائمة"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav aria-label="التنقل الرئيسي" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isNavActive(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-right cursor-pointer ${
                active
                  ? 'bg-[#0B438C] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User & Role Switcher */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onNavigate('profile');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-right min-w-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0B438C] font-bold text-xs flex items-center justify-center shrink-0">
              {userDisplay.initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{userDisplay.name}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {role === 'student' ? 'طالب باحث' : role === 'admin' ? 'رئيس لجنة' : 'مشرف أكاديمي'}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={cycleRole}
            title="تبديل الدور الأكاديمي (مشرف / طالب / لجنة تحكيم)"
            aria-label="تبديل الدور الأكاديمي"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-[#0B438C] border border-transparent hover:border-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            {/* Right: Mobile menu + User summary */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="فتح القائمة الجانبية"
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="hidden sm:flex items-center gap-2.5 text-right hover:bg-slate-50 rounded-xl px-2 py-1 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B438C] to-[#1D63B8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userDisplay.initials}
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900 whitespace-nowrap">
                    {userDisplay.name}
                  </div>
                  <div className="text-[11px] text-slate-500 whitespace-nowrap">
                    {userDisplay.title}
                  </div>
                </div>
              </button>
            </div>

            {/* Center: Global Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchQuery);
              }}
              className="flex-1 max-w-md"
            >
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="ابحث عن مشروع، طالب، مشرف، أو كود المادة..."
                  aria-label="البحث الشامل في المنظومة"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-14 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#0B438C] focus:outline-none focus:ring-2 focus:ring-[#0B438C]/15 transition-colors"
                />
                <kbd className="hidden md:inline-block absolute left-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                  Ctrl+K
                </kbd>
              </div>
            </form>

            {/* Left: Semester + Messages + Notifications */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0B438C]" />
                <span>الفصل الدراسي الثاني 2024/2025</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('task-detail')}
                aria-label="الرسائل والمناقشات الأكاديمية"
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('notifications')}
                aria-label={`مركز الإشعارات (${unreadNotifications} غير مقروء)`}
                className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Active Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-20 left-4 sm:left-6 z-50 max-w-md rounded-xl bg-slate-900 text-white px-4 py-3 shadow-lg border border-slate-700 flex items-center gap-3 text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="leading-relaxed">{toastMessage}</span>
            <button
              type="button"
              onClick={onClearToast}
              aria-label="إغلاق التنبيه"
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
