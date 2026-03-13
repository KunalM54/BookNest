export type NoticePriority = 'NORMAL' | 'HIGH';

export interface Notice {
  id: number;
  title: string;
  message: string;
  priority: NoticePriority;
  isImportant?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NoticePayload {
  title: string;
  message: string;
  priority: NoticePriority;
}

export interface NoticeMutationResponse {
  success?: boolean;
  message?: string;
  notice: Notice;
}
