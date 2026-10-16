export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PaginatedApiResponse<T = unknown> = ApiResponse<T> & {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ApiFilterParams = {
  page?: number;
  perPage?: number;
  query?: string;
};

export type AuthUserData = {
  id: number | string;
  _id?: string;
  name: string;
  email: string;
  gender: string;
};

export type SignInData = {
  user: AuthUserData;
  token: string;
};

export type ForgotPasswordData = {
  email: string;
  otp: string;
};

export type VerifyOtpData = {
  resetToken: string;
};

export type UserData = {
  id: number | string;
  _id?: string;
  name: string;
  email: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export type LeadData = {
  id: number | string;
  _id?: string;
  name: string;
  email: string;
  phone?: string | null;
  status: LeadStatus | string;
  userId: number | string;
  createdAt: string;
  updatedAt: string;
};

export type NoteData = {
  id: number | string;
  _id?: string;
  content: string;
  leadId: number | string;
  userId: number | string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  totalUsers: number;
};
