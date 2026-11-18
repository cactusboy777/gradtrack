import type {
  AcademicDocument,
  KanbanTask,
  NotificationItem,
  Project,
  RubricScores,
  SubtaskItem,
} from '../types';

export interface PasswordPolicyResult {
  minLength: boolean;
  hasUpperAndLower: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  noUsernameMatch: boolean;
  passedCount: number;
  strengthPercent: number;
  strengthLabel: 'ضعيفة' | 'متوسطة' | 'قوية' | 'قوية جداً';
}

export function evaluatePasswordStrength(password: string, email: string): PasswordPolicyResult {
  const minLength = password.length >= 8;
  const hasUpperAndLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[@#$%!&*]/.test(password);

  const localPart = email.split('@')[0]?.trim().toLowerCase() ?? '';
  const noUsernameMatch =
    password.length > 0 &&
    (localPart.length < 3 || !password.toLowerCase().includes(localPart));

  const checks = [minLength, hasUpperAndLower, hasDigit, hasSpecialChar, noUsernameMatch];
  const passedCount = checks.filter(Boolean).length;

  let strengthPercent = Math.min(100, passedCount * 18);
  if (passedCount === 5) {
    strengthPercent = password.length >= 12 ? 96 : 90;
  } else if (password.length === 0) {
    strengthPercent = 0;
  }

  let strengthLabel: PasswordPolicyResult['strengthLabel'] = 'ضعيفة';
  if (strengthPercent >= 85) strengthLabel = 'قوية جداً';
  else if (strengthPercent >= 65) strengthLabel = 'قوية';
  else if (strengthPercent >= 40) strengthLabel = 'متوسطة';

  return {
    minLength,
    hasUpperAndLower,
    hasDigit,
    hasSpecialChar,
    noUsernameMatch,
    passedCount,
    strengthPercent,
    strengthLabel,
  };
}

export interface RubricEvaluationResult {
  clamped: RubricScores;
  total: number;
  gradeLabel: string;
  passed: boolean;
}

export function clampScore(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.round(value)));
}

export function calculateRubricEvaluation(scores: RubricScores): RubricEvaluationResult {
  const clamped: RubricScores = {
    idea: clampScore(scores.idea, 20),
    methodology: clampScore(scores.methodology, 25),
    execution: clampScore(scores.execution, 30),
    presentation: clampScore(scores.presentation, 15),
    timeline: clampScore(scores.timeline, 10),
  };

  const total =
    clamped.idea +
    clamped.methodology +
    clamped.execution +
    clamped.presentation +
    clamped.timeline;

  let gradeLabel = 'دون الحد الأدنى (إعادة مناقشة)';
  if (total >= 85) gradeLabel = 'ممتاز (امتياز مع مرتبة الشرف)';
  else if (total >= 75) gradeLabel = 'جيد جداً';
  else if (total >= 65) gradeLabel = 'جيد';
  else if (total >= 60) gradeLabel = 'مقبول (الحد الأدنى للاجتياز)';

  return {
    clamped,
    total,
    gradeLabel,
    passed: total >= 60,
  };
}

export function calculateTaskCompletion(subtasks: SubtaskItem[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = subtasks.length;
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };
  const completed = subtasks.filter((s) => s.completed).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export interface ProjectDirectoryFilter {
  search: string;
  department: string;
  status: string;
  topic: string;
}

export function filterProjectsDirectory(
  projects: Project[],
  filters: ProjectDirectoryFilter
): Project[] {
  const q = filters.search.trim().toLowerCase();
  return projects.filter((p) => {
    if (filters.department !== 'all' && p.department !== filters.department) {
      return false;
    }
    if (filters.status !== 'all' && p.status !== filters.status) {
      return false;
    }
    if (
      filters.topic !== 'all' &&
      !p.topicTags.some((tag) => tag.toLowerCase().includes(filters.topic.toLowerCase())) &&
      !p.title.toLowerCase().includes(filters.topic.toLowerCase())
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      p.title,
      p.code,
      p.supervisor,
      p.coSupervisor,
      p.department,
      ...p.teamMembers.map((m) => m.name),
      ...p.topicTags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export interface GlobalSearchFilters {
  category: 'all' | 'projects' | 'tasks' | 'documents' | 'people';
  department: string;
  turnitinBand: 'all' | 'under10' | '10to20' | 'over20';
  fileType: string;
}

export interface GlobalSearchResultItem {
  id: string;
  kind: 'projects' | 'tasks' | 'documents' | 'people';
  title: string;
  subtitle: string;
  snippet: string;
  code: string;
  badgeText: string;
  meta: string[];
  turnitinScore?: number;
  department?: string;
  targetScreen: 'project-detail' | 'task-detail' | 'documents' | 'profile';
  targetId?: string;
}

export function filterAndSearchAll(
  query: string,
  filters: GlobalSearchFilters,
  data: {
    projects: Project[];
    tasks: KanbanTask[];
    documents: AcademicDocument[];
    people: { id: string; name: string; role: string; code: string; department: string; details: string; email?: string }[];
  }
): GlobalSearchResultItem[] {
  const q = query.trim().toLowerCase();
  const results: GlobalSearchResultItem[] = [];

  const matchesQuery = (text: string) => {
    if (!q) return true;
    return text.toLowerCase().includes(q);
  };

  for (const p of data.projects) {
    const searchable = `${p.title} ${p.description} ${p.code} ${p.supervisor} ${p.topicTags.join(' ')}`;
    if (!matchesQuery(searchable)) continue;
    results.push({
      id: `proj-${p.id}`,
      kind: 'projects',
      title: p.title,
      subtitle: `${p.department} · ${p.code}`,
      snippet: p.description,
      code: p.code,
      badgeText: p.status,
      meta: [`المشرف: ${p.supervisor}`, `الإنجاز ${p.progress}%`, `Turnitin ${p.turnitinScore}%`],
      turnitinScore: p.turnitinScore,
      department: p.department,
      targetScreen: 'project-detail',
      targetId: p.id,
    });
  }

  for (const t of data.tasks) {
    const searchable = `${t.title} ${t.description} ${t.code} ${t.assigneeName} ${t.domainTag}`;
    if (!matchesQuery(searchable)) continue;
    results.push({
      id: `task-${t.id}`,
      kind: 'tasks',
      title: t.title,
      subtitle: `${t.stageTag} · ${t.code}`,
      snippet: t.description,
      code: t.code,
      badgeText: `الأولوية: ${t.priority}`,
      meta: [`المكلف: ${t.assigneeName}`, `الاستحقاق: ${t.dueDate}`, `Turnitin ${t.turnitinCheck}%`],
      turnitinScore: t.turnitinCheck,
      department: 'قسم هندسة الحاسب ونظم المعلومات',
      targetScreen: 'task-detail',
      targetId: t.id,
    });
  }

  for (const d of data.documents) {
    const searchable = `${d.name} ${d.description} ${d.uploadedBy} ${d.fileType}`;
    if (!matchesQuery(searchable)) continue;
    results.push({
      id: `doc-${d.id}`,
      kind: 'documents',
      title: d.name,
      subtitle: `${d.fileType.toUpperCase()} · ${d.sizeMB} ميجابايت · ${d.version}`,
      snippet: d.description,
      code: d.version,
      badgeText: d.approved ? 'وثيقة معتمدة' : 'قيد التدقيق',
      meta: [`بواسطة: ${d.uploadedBy}`, d.uploadedAt],
      turnitinScore: d.turnitinScore,
      department: 'قسم هندسة الحاسب ونظم المعلومات',
      targetScreen: 'documents',
      targetId: d.id,
    });
  }

  for (const person of data.people) {
    const searchable = `${person.name} ${person.role} ${person.code} ${person.details} ${person.department}`;
    if (!matchesQuery(searchable)) continue;
    results.push({
      id: `person-${person.id}`,
      kind: 'people',
      title: person.name,
      subtitle: `${person.role} · ${person.code}`,
      snippet: person.details,
      code: person.code,
      badgeText: person.department,
      meta: person.email ? [person.email, person.department] : [person.department],
      department: person.department,
      targetScreen: 'profile',
      targetId: person.id,
    });
  }

  return results.filter((item) => {
    if (filters.category !== 'all' && item.kind !== filters.category) return false;
    if (filters.department !== 'all' && item.department !== filters.department) return false;
    if (filters.fileType !== 'all' && item.kind === 'documents') {
      if (!item.subtitle.toLowerCase().includes(filters.fileType.toLowerCase())) return false;
    }
    if (filters.turnitinBand !== 'all' && typeof item.turnitinScore === 'number') {
      if (filters.turnitinBand === 'under10' && item.turnitinScore >= 10) return false;
      if (filters.turnitinBand === '10to20' && (item.turnitinScore < 10 || item.turnitinScore > 20))
        return false;
      if (filters.turnitinBand === 'over20' && item.turnitinScore <= 20) return false;
    }
    return true;
  });
}

export function computeNotificationStats(notifications: NotificationItem[]) {
  const total = notifications.length;
  const unreadCount = notifications.filter((n) => n.unread).length;
  const countBy = (cat: NotificationItem['category']) =>
    notifications.filter((n) => n.category === cat).length;

  const pct = (c: number) => (total === 0 ? 0 : Math.round((c / total) * 100));

  return {
    total,
    unreadCount,
    submissions: countBy('submissions'),
    reviews: countBy('reviews'),
    defenses: countBy('defenses'),
    security: countBy('security'),
    percentages: {
      submissions: pct(countBy('submissions')),
      reviews: pct(countBy('reviews')),
      defenses: pct(countBy('defenses')),
      security: pct(countBy('security')),
    },
  };
}

export function formatCountdown(remainingSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const safe = Math.max(0, Math.floor(remainingSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}
