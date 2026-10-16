import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormSchemaType,
} from "@/lib/formSchema";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import type { ApiResponse } from "@/lib/types";

const ResetPassword = () => {
  const navigate = useNavigate();

  // Get user mail and token from passed location state
  const locationState = useLocation().state;
  const resetToken = locationState?.resetToken || "";

  // Form Config
  const form = useForm<ResetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      resetToken: resetToken,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle submit
  const onSubmit = async (data: ResetPasswordFormSchemaType) => {
    if (!data.resetToken) {
      toast.error(
        "Reset token is missing. Please start the password reset process again.",
      );
      return;
    }

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      const response = await axios.post<ApiResponse>(
        `${apiBaseUrl}/auth/reset-password`,
        {
          resetToken: data.resetToken,
          newPassword: data.newPassword,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully!");
        navigate("/sign-in");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="h-screen w-screen gird place-content-center-safe p-2">
      <Card className="max-w-lg mx-auto">
        <div className="space-y-2">
          <img
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="mx-auto border"
          />
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {!resetToken && (
                <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                  No reset token found. Please request a new OTP from the{" "}
                  <Link to="/forgot-password" className="underline font-medium">
                    Forgot Password
                  </Link>{" "}
                  page.
                </div>
              )}

              <Field>
                {/* Password */}
                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="newPassword">
                        New Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="newPassword"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="******"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Confirm Password */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="******"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>

              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Resetting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  variant={"outline"}
                  asChild
                >
                  <Link to={"/sign-in"}>Cancel</Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
