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
  forgotPasswordFormSchema,
  type ForgotPasswordFormSchemaType,
} from "@/lib/formSchema";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import type { ApiResponse, ForgotPasswordData } from "@/lib/types";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Form Config
  const form = useForm<ForgotPasswordFormSchemaType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle submit
  const onSubmit = async (data: ForgotPasswordFormSchemaType) => {
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      const response = await axios.post<ApiResponse<ForgotPasswordData>>(
        `${apiBaseUrl}/auth/forgot-password`,
        { email: data.email },
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP generated successfully");
        navigate("/verify-otp", {
          state: { email: data.email },
        });
      } else {
        toast.error(response.data.message || "Failed to generate OTP");
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
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you an OTP to reset your
              password.
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
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
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
                  {form.formState.isSubmitting ? "Sending OTP..." : "Submit"}
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

export default ForgotPassword;
