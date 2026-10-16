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
  id: number;
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
  id: number;
  name: string;
  email: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type User = UserData;

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export type LeadData = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  status: LeadStatus | string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type Lead = LeadData;

export type GetLeadsParams = ApiFilterParams;

export type LeadsApiResponse = PaginatedApiResponse<LeadData[]>;

export type CreateLeadPayload = {
  name: string;
  email: string;
  phone?: string;
  status?: LeadStatus | string;
};

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

