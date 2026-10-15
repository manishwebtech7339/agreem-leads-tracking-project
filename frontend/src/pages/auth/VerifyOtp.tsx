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
import logo from "@/assets/logo.png";

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
    console.log(data, "data");
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, 2000);
    }).then(() => {
      navigate("/reset-password", {
        state: { email: data.email, resetToken: "23434" },
      });
    });
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
            <CardTitle className="text-xl">Verify Otp</CardTitle>
            <CardDescription></CardDescription>
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
                        Otp (Default Testing Otp: 123456)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="otp"
                        type="otp"
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
                  {form.formState.isSubmitting ? "Loading..." : "Submit"}
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
