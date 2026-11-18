import React, { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './components/auth/LoginScreen';
import { RecoveryScreen } from './components/auth/RecoveryScreen';
import { ResetPasswordScreen } from './components/auth/ResetPasswordScreen';
import { SupervisorDashboard } from './components/dashboard/SupervisorDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ProjectsDirectory } from './components/projects/ProjectsDirectory';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { KanbanBoard } from './components/tasks/KanbanBoard';
import { TaskDetail } from './components/tasks/TaskDetail';
import { DocumentsManager } from './components/documents/DocumentsManager';
import { AcademicCalendar } from './components/calendar/AcademicCalendar';
import { DefenseCommittees } from './components/defenses/DefenseCommittees';
import { NotificationsCenter } from './components/notifications/NotificationsCenter';
import { GlobalSearch } from './components/search/GlobalSearch';
import { AcademicProfile } from './components/profile/AcademicProfile';
import { SystemSettings } from './components/settings/SystemSettings';
import { TeamsAndReports } from './components/directory/TeamsAndReports';
import {
  DEFAULT_TEAM_MEMBERS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_DEFENSE_SESSIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_SETTINGS,
  INITIAL_SUBMISSION_REVIEWS,
  INITIAL_TASKS,
  PEOPLE_DIRECTORY,
} from './data/seedData';
import type {
  AcademicDocument,
  AcademicProfileData,
  CalendarEvent,
  DefenseSession,
  DepartmentName,
  KanbanTask,
  NotificationItem,
  Project,
  RubricScores,
  ScreenId,
  SubmissionReviewItem,
  SystemSettingsState,
  TaskColumnId,
  TaskPriority,
  UserRole,
} from './types';
import { computeNotificationStats } from './utils/academicLogic';

function getInitialScreen(): ScreenId {
  if (typeof window === 'undefined') return 'dashboard';
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen') as ScreenId | null;
  if (screenParam) return screenParam;
  return 'dashboard';
}

export default function App() {
  const [role, setRole] = useState<UserRole>('supervisor');
  const [activeScreen, setActiveScreen] = useState<ScreenId>(getInitialScreen);
  const [recoveryEmail, setRecoveryEmail] = useState('s.ahmed@egi.edu.eg');

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(INITIAL_TASKS[0].id);

  const [documents, setDocuments] = useState<AcademicDocument[]>(INITIAL_DOCUMENTS);
  const [submissions, setSubmissions] = useState<SubmissionReviewItem[]>(INITIAL_SUBMISSION_REVIEWS);
  const [defenseSessions, setDefenseSessions] = useState<DefenseSession[]>(INITIAL_DEFENSE_SESSIONS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState<AcademicProfileData>(INITIAL_PROFILE);
  const [settings, setSettings] = useState<SystemSettingsState>(INITIAL_SETTINGS);

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist key user-modified state smoothly
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gradtrack_egi_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.settings) setSettings(parsed.settings);
      }
    } catch {
      // Ignore storage errors in restricted iframes
    }
  }, []);

  const savePersistentState = (nextProfile: AcademicProfileData, nextSettings: SystemSettingsState) => {
    try {
      localStorage.setItem(
        'gradtrack_egi_state_v1',
        JSON.stringify({ profile: nextProfile, settings: nextSettings })
      );
    } catch {
      // Ignore
    }
  };

  const handleNavigate = (screen: ScreenId, targetId?: string) => {
    if (screen === 'project-detail' && targetId) {
      setSelectedProjectId(targetId);
    }
    if (screen === 'task-detail' && targetId) {
      setSelectedTaskId(targetId);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchRole = (nextRole: UserRole) => {
    setRole(nextRole);
    if (nextRole === 'student') {
      setActiveScreen('student-dashboard');
      setToastMessage('تم التبديل إلى بوابة الطالب الأكاديمية (يوسف علي).');
    } else if (nextRole === 'admin') {
      setActiveScreen('defenses');
      setToastMessage('تم التبديل إلى بوابة رئيس لجنة التحكيم والمناقشة.');
    } else {
      setActiveScreen('dashboard');
      setToastMessage('تم التبديل إلى بوابة المشرف الأكاديمي (أ.د. أحمد السيد).');
    }
  };

  const handleLogin = (nextRole: UserRole, email: string) => {
    setRole(nextRole);
    setRecoveryEmail(email);
    if (nextRole === 'student') setActiveScreen('student-dashboard');
    else if (nextRole === 'admin') setActiveScreen('defenses');
    else setActiveScreen('dashboard');
    setToastMessage('تم تسجيل الدخول بنجاح إلى منظومة GradTrack - EGI.');
  };

  const handleCreateProject = (data: {
    title: string;
    department: DepartmentName;
    supervisor: string;
    leaderName: string;
  }) => {
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      code: `EGI-CS-2025-0${90 + projects.length}`,
      title: data.title,
      description: 'مشروع تخرج مسجل حديثاً ضمن خطة الفصل الدراسي الثاني 2024/2025 بمعهد الجزيرة العالي.',
      department: data.department,
      status: 'قيد التطوير الفعال',
      supervisor: data.supervisor,
      coSupervisor: 'م.د. إيمان عبد الرحمن شلبي',
      teamMembers: [
        {
          ...DEFAULT_TEAM_MEMBERS[0],
          id: `m-${Date.now()}`,
          name: data.leaderName,
          initials: data.leaderName.slice(0, 2),
        },
        DEFAULT_TEAM_MEMBERS[1],
        DEFAULT_TEAM_MEMBERS[2],
      ],
      progress: 45,
      turnitinScore: 6,
      topicTags: ['الذكاء الاصطناعي (AI)'],
      labRoom: 'معمل الروبوتات والذكاء - قاعة 204',
      daysRemaining: 35,
      defenseDate: '5 يونيو 2025',
      decisionNumber: 'قرار رقم 189/ع',
      milestones: [],
      subProgress: { documentation: 55, hardware: 40, aiModels: 50, testing: 35 },
    };
    setProjects((prev) => [newProj, ...prev]);
    setToastMessage(`تم تسجيل المشروع الجديد (${newProj.code}) وإضافته إلى الدليل.`);
  };

  const handleUpdateTaskColumn = (taskId: string, nextCol: TaskColumnId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, column: nextCol } : t)));
    setToastMessage('تم تحديث حالة المهمة في لوحة المشروع.');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                {
                  id: `st-${Date.now()}`,
                  title,
                  assigneeName: 'أحمد إبراهيم',
                  assigneeInitials: 'أ إ',
                  completed: false,
                  note: 'تمت الإضافة الآن',
                },
              ],
            }
          : t
      )
    );
    setToastMessage('تمت إضافة المهمة الفرعية الجديدة.');
  };

  const handleAddComment = (taskId: string, content: string, isCritical: boolean) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `cm-${Date.now()}`,
                  authorName:
                    role === 'student' ? 'يوسف علي عبد الرحمن' : 'أ.د. أحمد السيد محمود',
                  authorRole: role === 'student' ? 'طالب باحث' : 'مشرف أكاديمي رئيسي',
                  authorInitials: role === 'student' ? 'ي ع' : 'أ س',
                  timestamp: 'الآن',
                  content,
                  isSupervisorDirective: role === 'supervisor',
                  isCritical,
                },
              ],
            }
          : t
      )
    );
    setToastMessage('تم نشر التعليق الأكاديمي في ساحة النقاش.');
  };

  const handleCreateTask = (data: {
    title: string;
    domainTag: string;
    priority: TaskPriority;
    column: TaskColumnId;
    assigneeName: string;
    dueDate: string;
  }) => {
    const newTask: KanbanTask = {
      id: `tsk-${Date.now()}`,
      code: `TSK-EGI-${111 + tasks.length}`,
      projectId: 'prj-084',
      title: data.title,
      description: 'مهمة هندسية مضافة حديثاً إلى خطة العمل المرحلية لمشروع التخرج.',
      stageTag: 'المرحلة الرابعة',
      domainTag: data.domainTag,
      column: data.column,
      priority: data.priority,
      assigneeId: 'm1',
      assigneeName: data.assigneeName,
      assigneeInitials: data.assigneeName.slice(0, 2),
      dueDate: data.dueDate,
      daysLeftLabel: 'متبقي 5 أيام',
      hoursLogged: 0,
      hoursBudget: 10,
      turnitinCheck: 0,
      unitTestsPassed: 0,
      unitTestsTotal: 4,
      subtasks: [],
      acceptanceCriteria: [],
      attachments: [],
      comments: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    setToastMessage(`تمت إضافة البطاقة ${newTask.code} إلى اللوحة.`);
  };

  const handleSaveDefenseEval = (
    sessionId: string,
    scores: RubricScores,
    notes: string,
    decision: DefenseSession['decision']
  ) => {
    setDefenseSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              rubricScores: scores,
              notes,
              decision,
              status: 'معتمد وموقّع إلكترونياً',
            }
          : s
      )
    );
  };

  // Auth screens render outside AppShell
  if (activeScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onGoToRecovery={() => setActiveScreen('recovery')}
      />
    );
  }

  if (activeScreen === 'recovery') {
    return (
      <RecoveryScreen
        onBackToLogin={() => setActiveScreen('login')}
        onProceedToReset={(email) => {
          setRecoveryEmail(email);
          setActiveScreen('reset-password');
        }}
      />
    );
  }

  if (activeScreen === 'reset-password') {
    return (
      <ResetPasswordScreen
        email={recoveryEmail}
        onCompleteReset={() => {
          setActiveScreen('login');
          setToastMessage('تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.');
        }}
        onBackToLogin={() => setActiveScreen('login')}
      />
    );
  }

  const activeProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];
  const activeTask = tasks.find((t) => t.id === selectedTaskId) ?? tasks[0];
  const unreadCount = computeNotificationStats(notifications).unreadCount;

  return (
    <AppShell
      activeScreen={activeScreen}
      role={role}
      unreadNotifications={unreadCount}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={(q) => {
        setSearchQuery(q);
        handleNavigate('search');
      }}
      onNavigate={handleNavigate}
      onSwitchRole={handleSwitchRole}
      onLogout={() => setActiveScreen('login')}
      toastMessage={toastMessage}
      onClearToast={() => setToastMessage(null)}
    >
      {activeScreen === 'dashboard' && (
        <SupervisorDashboard
          projects={projects}
          submissions={submissions}
          onUpdateSubmissionStatus={(id, nextStatus) =>
            setSubmissions((prev) =>
              prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
            )
          }
          onCreateProject={handleCreateProject}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'student-dashboard' && (
        <StudentDashboard
          project={projects[0]}
          tasks={tasks}
          documents={documents}
          events={calendarEvents}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'projects' && (
        <ProjectsDirectory
          projects={projects}
          onSelectProject={(id) => handleNavigate('project-detail', id)}
          onNavigate={handleNavigate}
          onCreateProject={handleCreateProject}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'project-detail' && (
        <ProjectDetail
          project={activeProject}
          documents={documents}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'kanban' && (
        <KanbanBoard
          tasks={tasks}
          onSelectTask={(id) => handleNavigate('task-detail', id)}
          onMoveTask={handleUpdateTaskColumn}
          onCreateTask={handleCreateTask}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'task-detail' && (
        <TaskDetail
          task={activeTask}
          onUpdateColumn={handleUpdateTaskColumn}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onAddComment={handleAddComment}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'documents' && (
        <DocumentsManager
          documents={documents}
          onUploadDocument={(doc) => setDocuments((prev) => [doc, ...prev])}
          onDeleteDocuments={(ids) => {
            setDocuments((prev) => prev.filter((d) => !ids.includes(d.id)));
            setToastMessage(`تم حذف ${ids.length} ملفات محددة من المسودة.`);
          }}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'calendar' && (
        <AcademicCalendar
          events={calendarEvents}
          onAddEvent={(ev) => setCalendarEvents((prev) => [...prev, ev])}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'defenses' && (
        <DefenseCommittees
          sessions={defenseSessions}
          onSaveEvaluation={handleSaveDefenseEval}
          onAddSession={(s) => setDefenseSessions((prev) => [s, ...prev])}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'notifications' && (
        <NotificationsCenter
          notifications={notifications}
          settings={settings}
          onToggleSetting={(key) =>
            setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
          }
          onMarkRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
            )
          }
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
            setToastMessage('تم تحديد جميع الإشعارات كمقروءة.');
          }}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'search' && (
        <GlobalSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
          projects={projects}
          tasks={tasks}
          documents={documents}
          people={PEOPLE_DIRECTORY}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'profile' && (
        <AcademicProfile
          profile={profile}
          onSaveProfile={(next) => {
            setProfile(next);
            savePersistentState(next, settings);
          }}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {activeScreen === 'settings' && (
        <SystemSettings
          settings={settings}
          onSaveSettings={(next) => {
            setSettings(next);
            savePersistentState(profile, next);
          }}
          onResetDefaults={() => {
            setSettings(INITIAL_SETTINGS);
            savePersistentState(profile, INITIAL_SETTINGS);
          }}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}

      {(activeScreen === 'teams' ||
        activeScreen === 'supervisors' ||
        activeScreen === 'reports') && (
        <TeamsAndReports
          mode={activeScreen}
          projects={projects}
          people={PEOPLE_DIRECTORY}
          onNavigate={handleNavigate}
          onNotify={setToastMessage}
        />
      )}
    </AppShell>
  );
}
