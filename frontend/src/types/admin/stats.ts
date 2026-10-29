type courseStudentStats = {
  course_code: string;
  course_name: string;
  course_student_count: number;
};

export type GeneralStats = {
  student_count: number;
  course_count: number;
  min_course: courseStudentStats;
  max_course: courseStudentStats;
};

export type StudentsByYearStats = {
  yearType: "year1" | "year2" | "year3" | "year4" | "year5";
  students: number;
};

export type MostActiveGroupsStats = {
  courseCode: string;
  groupName: string;
  courseYear: "1" | "2" | "3" | "4" | "5";
  messageCount: number;
};

export type AverageCourseStats = {
  courseCode: string;
  averageGrade: number;
};

export type AssignmentCompletionStats = {
  code: string;
  name: string;
  assigned: number;
  late: number;
  missing: number;
  onTime: number;
  completionRate: number;
};

export type DailyUsageStats = {
  avg_7_days: number;
  avg_30_days: number;
  dailyUsage: {
    sessionDate: string;
    userCount: number;
  }[];
};

export type SessionDurationStats = {
  overallAverage: number;
  sessionStats: {
    sessionDate: string;
    averageDuration: number;
  }[];
};
