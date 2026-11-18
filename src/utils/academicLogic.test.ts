import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluatePasswordStrength,
  calculateRubricEvaluation,
  calculateTaskCompletion,
  filterProjectsDirectory,
  filterAndSearchAll,
  computeNotificationStats,
  formatCountdown,
} from './academicLogic';
import type { Project, KanbanTask, AcademicDocument, NotificationItem } from '../types';

test('evaluatePasswordStrength checks all 5 EGI security rules', () => {
  const strong = evaluatePasswordStrength('EGI#Pass2025!', 's.ahmed@egi.edu.eg');
  assert.equal(strong.passedCount, 5);
  assert.equal(strong.strengthPercent, 96);
  assert.equal(strong.strengthLabel, 'قوية جداً');
  assert.equal(strong.minLength, true);
  assert.equal(strong.hasUpperAndLower, true);
  assert.equal(strong.hasDigit, true);
  assert.equal(strong.hasSpecialChar, true);
  assert.equal(strong.noUsernameMatch, true);

  const weak = evaluatePasswordStrength('s.ahmed1', 's.ahmed@egi.edu.eg');
  assert.equal(weak.noUsernameMatch, false);
  assert.equal(weak.hasUpperAndLower, false);
  assert.equal(weak.hasSpecialChar, false);
  assert.ok(weak.passedCount < 5);
});

test('calculateRubricEvaluation sums criteria, clamps bounds, and assigns grade', () => {
  const res = calculateRubricEvaluation({
    idea: 18,
    methodology: 22,
    execution: 27,
    presentation: 13,
    timeline: 8,
  });
  assert.equal(res.total, 88);
  assert.equal(res.passed, true);
  assert.equal(res.gradeLabel, 'ممتاز (امتياز مع مرتبة الشرف)');

  const clamped = calculateRubricEvaluation({
    idea: 50,
    methodology: -4,
    execution: 20,
    presentation: 10,
    timeline: 5,
  });
  assert.equal(clamped.clamped.idea, 20);
  assert.equal(clamped.clamped.methodology, 0);
  assert.equal(clamped.total, 55);
  assert.equal(clamped.passed, false);
});

test('calculateTaskCompletion computes subtasks percentage accurately', () => {
  const result = calculateTaskCompletion([
    { id: '1', title: 'A', assigneeName: 'أحمد', assigneeInitials: 'أ', completed: true, note: '' },
    { id: '2', title: 'B', assigneeName: 'أحمد', assigneeInitials: 'أ', completed: true, note: '' },
    { id: '3', title: 'C', assigneeName: 'أحمد', assigneeInitials: 'أ', completed: true, note: '' },
    { id: '4', title: 'D', assigneeName: 'أحمد', assigneeInitials: 'أ', completed: true, note: '' },
    { id: '5', title: 'E', assigneeName: 'أحمد', assigneeInitials: 'أ', completed: false, note: '' },
  ]);
  assert.equal(result.completed, 4);
  assert.equal(result.total, 5);
  assert.equal(result.percentage, 80);

  assert.deepEqual(calculateTaskCompletion([]), { completed: 0, total: 0, percentage: 0 });
});

test('filterProjectsDirectory filters by department, topic, and query', () => {
  const projects: Project[] = [
    {
      id: '1',
      code: 'PRJ-CS-2025-084',
      title: 'منظومة رصد الأعطال الميكانيكية بالذكاء الاصطناعي',
      description: 'desc',
      department: 'قسم هندسة الحاسب ونظم المعلومات',
      status: 'قيد التطوير الفعال',
      supervisor: 'أ.د. أحمد السيد',
      coSupervisor: 'د. إيمان',
      teamMembers: [],
      progress: 82,
      turnitinScore: 8,
      topicTags: ['الذكاء الاصطناعي (AI)', 'IoT'],
      labRoom: '204',
      daysRemaining: 28,
      defenseDate: '29 مايو 2025',
      decisionNumber: '144/ع',
      milestones: [],
      subProgress: { documentation: 90, hardware: 100, aiModels: 85, testing: 60 },
    },
    {
      id: '2',
      code: 'EGI-MIS-2025-045',
      title: 'منصة التكنولوجيا المالية FinTrack',
      description: 'desc',
      department: 'قسم نظم المعلومات الإدارية',
      status: 'قيد إعداد النموذج',
      supervisor: 'د. حازم القاضي',
      coSupervisor: 'م. خالد',
      teamMembers: [],
      progress: 70,
      turnitinScore: 10,
      topicTags: ['الأنظمة المالية (Fintech)'],
      labRoom: '102',
      daysRemaining: 30,
      defenseDate: '2 يونيو 2025',
      decisionNumber: '150/ع',
      milestones: [],
      subProgress: { documentation: 70, hardware: 0, aiModels: 60, testing: 50 },
    },
  ];

  const aiOnly = filterProjectsDirectory(projects, {
    search: '',
    department: 'all',
    status: 'all',
    topic: 'الذكاء الاصطناعي',
  });
  assert.equal(aiOnly.length, 1);
  assert.equal(aiOnly[0].code, 'PRJ-CS-2025-084');

  const searchByCode = filterProjectsDirectory(projects, {
    search: 'FinTrack',
    department: 'all',
    status: 'all',
    topic: 'all',
  });
  assert.equal(searchByCode.length, 1);
  assert.equal(searchByCode[0].id, '2');
});

test('filterAndSearchAll returns matching items across categories and Turnitin bands', () => {
  const sampleTasks: KanbanTask[] = [
    {
      id: 't1',
      code: 'TSK-AI-042',
      projectId: '1',
      title: 'دمج مصفوفة الارتباك Confusion Matrix بالذكاء الاصطناعي',
      description: 'تدقيق النموذج العصبي',
      stageTag: 'المرحلة الرابعة',
      domainTag: 'الذكاء الاصطناعي',
      column: 'in_progress',
      priority: 'مرتفعة',
      assigneeId: 'u1',
      assigneeName: 'أحمد إبراهيم',
      assigneeInitials: 'أ إ',
      dueDate: '16 مايو 2025',
      daysLeftLabel: 'غداً',
      hoursLogged: 14.5,
      hoursBudget: 18,
      turnitinCheck: 4,
      unitTestsPassed: 14,
      unitTestsTotal: 14,
      subtasks: [],
      acceptanceCriteria: [],
      attachments: [],
      comments: [],
    },
  ];
  const sampleDocs: AcademicDocument[] = [
    {
      id: 'd1',
      name: 'EGI_PRJ-084_Final_Report_v2.4.pdf',
      description: 'مسودة الفصل الرابع والخامس في الذكاء الاصطناعي',
      folder: 'final-report',
      fileType: 'pdf',
      sizeMB: 14.8,
      version: 'v2.4',
      isLatest: true,
      uploadedBy: 'أحمد إبراهيم',
      uploaderRole: 'قائد الفريق',
      uploaderInitials: 'أ إ',
      uploadedAt: 'اليوم 10:45 ص',
      turnitinScore: 8,
      approved: true,
    },
  ];

  const results = filterAndSearchAll(
    'الذكاء الاصطناعي',
    { category: 'all', department: 'all', turnitinBand: 'under10', fileType: 'all' },
    { projects: [], tasks: sampleTasks, documents: sampleDocs, people: [] }
  );
  assert.equal(results.length, 2);
});

test('computeNotificationStats and formatCountdown produce exact values', () => {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'A',
      body: 'B',
      category: 'submissions',
      categoryLabel: 'تسليم',
      timestamp: 'منذ ساعة',
      group: 'today',
      unread: true,
      meta: [],
    },
    {
      id: '2',
      title: 'C',
      body: 'D',
      category: 'defenses',
      categoryLabel: 'تحكيم',
      timestamp: 'أمس',
      group: 'week',
      unread: false,
      meta: [],
    },
  ];
  const stats = computeNotificationStats(notifications);
  assert.equal(stats.total, 2);
  assert.equal(stats.unreadCount, 1);
  assert.equal(stats.percentages.submissions, 50);

  assert.deepEqual(formatCountdown(26 * 3600 + 14 * 60 + 45), {
    hours: '26',
    minutes: '14',
    seconds: '45',
  });
});
