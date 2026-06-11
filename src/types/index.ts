export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  experience: string;
  education: string;
  type: string;
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  publishedAt: string;
  isBookmarked: boolean;
  isApplied: boolean;
  status?: 'online' | 'offline';
  welfare?: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Resume {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  workExperiences: WorkExperience[];
  skills: string[];
  expectedSalary: string;
  expectedPosition: string;
  expectedLocation: string;
  attachments: AttachmentItem[];
  completion: number;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  isCompany: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'job_card';
  jobCard?: Job;
  jobApplied?: boolean;
  timestamp: string;
  isRead: boolean;
}

export interface Interview {
  id: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  applicantName?: string;
  applicantAvatar?: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  result?: 'passed' | 'failed' | 'pending';
  notes: string;
  interviewer: string;
  reminded?: boolean;
}

export type UserRole = 'seeker' | 'company';

export interface UserProfile {
  role: UserRole;
  name: string;
  avatar: string;
  phone: string;
  resumeCompletion: number;
  applicationCount: number;
  bookmarkCount: number;
  companyName: string;
  companyLogo: string;
  publishedJobs: number;
  receivedApplications: number;
}

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  applicantAvatar: string;
  appliedAt: string;
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'hired';
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}
