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
  verifyOtpFormSchema,
  type VerifyOtpFormSchemaType,
} from "@/lib/formSchema";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ApiResponse, VerifyOtpData } from "@/lib/types";

const VerifyOtp = () => {
  const navigate = useNavigate();

  // Get user mail from passed location state
  const userMail = useLocation().state?.email;

  // Form Config
  const form = useForm<VerifyOtpFormSchemaType>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      email: userMail ?? "",
      otp: "123456",
    },
  });

  // Handle submit
  const onSubmit = async (data: VerifyOtpFormSchemaType) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post<ApiResponse<VerifyOtpData>>(
        `${apiBaseUrl}/auth/verify-otp`,
        {
          email: data.email,
          otp: data.otp,
        },
      );

      if (response.data.success && response.data.data?.resetToken) {
        toast.success(response.data.message || "OTP verified successfully");
        navigate("/reset-password", {
          state: {
            email: data.email,
            resetToken: response.data.data.resetToken,
          },
        });
      } else {
        toast.error(response.data.message || "Failed to verify OTP");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="h-screen w-screen gird place-content-center-safe p-2">
      <Card className="max-w-lg mx-auto">
        <div className="space-y-2">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify OTP</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email (Readonly)</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                        autoComplete="off"
                        readOnly
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="otp">
                        OTP (Default Testing OTP: 123456)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="otp"
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="123456"
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
                  {form.formState.isSubmitting ? "Verifying..." : "Submit"}
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

export default VerifyOtp;
