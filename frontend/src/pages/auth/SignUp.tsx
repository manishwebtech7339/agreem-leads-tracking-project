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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signUpFormSchema, type SignUpFormSchemaType } from "@/lib/formSchema";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiResponse } from "@/lib/types";

const SignUp = () => {
  const navigate = useNavigate();

  // Form Config
  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      gender: "male",
      email: "",
      password: "",
    },
  });

  // Handle submit
  const onSubmit = async (data: SignUpFormSchemaType) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post<ApiResponse>(
        `${apiBaseUrl}/auth/signup`,
        data,
      );

      if (response.data.success) {
        toast.success(response.data.message || "Account created successfully!");
        navigate("/sign-in");
      } else {
        toast.error(response.data.message || "Failed to sign up");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // Handle Test account fill up
  const handleTestValues = () => {
    form.reset({
      name: "Manish Panchal",
      gender: "male",
      email: "manish@yopmail.com",
      password: "Password@1234",
    });
    form.handleSubmit(onSubmit)();
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
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to get started
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="eg. Manish Panchal"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Gender */}
                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="gender"
                          aria-invalid={fieldState.invalid}
                          className="capitalize"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectSeparator />
                          {["male", "female"].map((g) => (
                            <SelectItem
                              key={g}
                              value={g}
                              className="capitalize"
                            >
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Email */}
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
                {/* Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="password"
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
                  {form.formState.isSubmitting
                    ? "Creating account..."
                    : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={handleTestValues}
                  disabled={form.formState.isSubmitting}
                >
                  Test Account (Auto Register)
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/sign-in">Sign In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
