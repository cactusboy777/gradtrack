export type UserRole = 'supervisor' | 'student' | 'admin';

export type ScreenId =
  | 'login'
  | 'recovery'
  | 'reset-password'
  | 'dashboard'
  | 'student-dashboard'
  | 'projects'
  | 'project-detail'
  | 'kanban'
  | 'task-detail'
  | 'documents'
  | 'calendar'
  | 'defenses'
  | 'notifications'
  | 'search'
  | 'profile'
  | 'settings'
  | 'teams'
  | 'supervisors'
  | 'reports';

export type DepartmentName =
  | 'قسم هندسة الحاسب ونظم المعلومات'
  | 'قسم نظم المعلومات الإدارية'
  | 'قسم هندسة الإلكترونيات والاتصالات'
  | 'قسم هندسة الميكاترونيكس'
  | 'قسم الهندسة المدنية وتكنولوجيا البناء'
  | 'قسم الهندسة المعمارية والتخطيط';

export type ProjectStatus =
  | 'قيد التطوير الفعال'
  | 'تسليم المسودة النهائية'
  | 'جاهز للمناقشة والتحكيم'
  | 'قيد المراجعة الفنية'
  | 'مرحلة التجارب الميدانية'
  | 'قيد إعداد النموذج';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  studentCode: string;
  role: string;
  progress: number;
  statusText: string;
  online: boolean;
  avatarColor: string;
}

export interface ProjectMilestone {
  id: number;
  title: string;
  description: string;
  dateLabel: string;
  status: 'completed' | 'active' | 'scheduled';
  progress: number;
  scoreLabel?: string;
  artifactLabel?: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  description: string;
  department: DepartmentName;
  status: ProjectStatus;
  supervisor: string;
  coSupervisor: string;
  teamMembers: TeamMember[];
  progress: number;
  turnitinScore: number;
  topicTags: string[];
  labRoom: string;
  daysRemaining: number;
  defenseDate: string;
  decisionNumber: string;
  milestones: ProjectMilestone[];
  subProgress: {
    documentation: number;
    hardware: number;
    aiModels: number;
    testing: number;
  };
}

export type TaskColumnId = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'حرجة' | 'مرتفعة' | 'متوسطة' | 'منخفضة';

export interface SubtaskItem {
  id: string;
  title: string;
  assigneeName: string;
  assigneeInitials: string;
  completed: boolean;
  note: string;
  dueLabel?: string;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  timestamp: string;
  content: string;
  isSupervisorDirective: boolean;
  isCritical?: boolean;
  isSystemLog?: boolean;
}

export interface KanbanTask {
  id: string;
  code: string;
  projectId: string;
  title: string;
  description: string;
  stageTag: string;
  domainTag: string;
  column: TaskColumnId;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeInitials: string;
  dueDate: string;
  daysLeftLabel: string;
  hoursLogged: number;
  hoursBudget: number;
  turnitinCheck: number;
  unitTestsPassed: number;
  unitTestsTotal: number;
  subtasks: SubtaskItem[];
  acceptanceCriteria: { title: string; detail: string }[];
  attachments: { id: string; name: string; size: string; meta: string; type: 'image' | 'doc' | 'sheet' | 'code' }[];
  comments: TaskComment[];
}

export type SubmissionFolderId =
  | 'proposal'
  | 'srs'
  | 'design'
  | 'final-report'
  | 'defense-media';

export interface AcademicDocument {
  id: string;
  name: string;
  description: string;
  folder: SubmissionFolderId;
  fileType: 'pdf' | 'docx' | 'zip' | 'cad' | 'pptx' | 'xlsx';
  sizeMB: number;
  version: string;
  isLatest: boolean;
  uploadedBy: string;
  uploaderRole: string;
  uploaderInitials: string;
  uploadedAt: string;
  turnitinScore?: number;
  approved?: boolean;
}

export interface SubmissionReviewItem {
  id: string;
  projectCode: string;
  projectTitle: string;
  department: DepartmentName;
  teamLeader: string;
  leaderInitials: string;
  teamSizeLabel: string;
  attachmentSummary: string;
  submittedAt: string;
  status: 'بانتظار التقييم' | 'معتمد' | 'مطلوب تعديل' | 'قيد فحص الكود';
  turnitinScore?: number;
}

export interface DefenseSession {
  id: string;
  sessionCode: string;
  timeRange: string;
  hall: string;
  dateLabel: string;
  projectCode: string;
  projectTitle: string;
  department: string;
  teamSize: number;
  leadSupervisor: string;
  internalExaminer: string;
  externalExaminer: string;
  status: 'جارية الآن' | 'مؤكدة' | 'بانتظار اعتماد التقرير' | 'معتمد وموقّع إلكترونياً';
  startedAgoLabel?: string;
  rubricScores: RubricScores;
  notes: string;
  decision: 'إجازة المشروع بدون تعديل' | 'إجازة مع تعديلات طفيفة' | 'إعادة مناقشة وتعديل جوهري';
  signedBy?: string;
  verificationCode?: string;
}

export interface RubricScores {
  idea: number; // /20
  methodology: number; // /25
  execution: number; // /30
  presentation: number; // /15
  timeline: number; // /10
}

export interface CalendarEvent {
  id: string;
  title: string;
  dateDay: number; // Day of May 2025 (1..31)
  timeLabel: string;
  category: 'drafts' | 'engineering' | 'advising' | 'defense';
  priority?: 'أولوية حرجة' | 'أولوية مرتفعة' | 'عاجل' | 'اجتماع إرشادي' | 'لجنة رسمية';
  assignee?: string;
  location?: string;
  completed?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'submissions' | 'reviews' | 'defenses' | 'security';
  categoryLabel: string;
  timestamp: string;
  group: 'today' | 'week';
  unread: boolean;
  meta: string[];
  primaryActionLabel?: string;
  primaryTargetScreen?: ScreenId;
  secondaryActionLabel?: string;
}

export interface AcademicProfileData {
  fullName: string;
  egiId: string;
  department: string;
  email: string;
  phone: string;
  rank: string;
  bio: string;
  researchInterests: string[];
  officeHours: string;
  gradeLevel: string;
  verificationId: string;
  stats: {
    projectsCount: number;
    committeesCount: number;
    studentsCount: number;
    rating: number;
    commitmentRate: number;
  };
}

export interface SystemSettingsState {
  emailNewDrafts: boolean;
  emailDefenseAssigned: boolean;
  emailTurnitinAlerts: boolean;
  emailGradingReminders: boolean;
  pushStudentInquiries: boolean;
  pushCommitteeChanges: boolean;
  pushDeanCirculars: boolean;
  pushNewLoginAlert: boolean;
  digestFrequency: 'instant' | 'daily' | 'weekly';
  smsUrgentAlerts: boolean;
  dailyDigestReport: boolean;
  theme: 'light' | 'high-contrast';
  language: 'ar' | 'en';
}
