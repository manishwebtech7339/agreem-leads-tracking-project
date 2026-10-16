export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};
export type ErrorInstance =
  | { error: { response: { data: { message: string } } } }
  | { error: { message: string } };

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
