"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/zod";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [backendError, setBackendError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [providerLoading, setProviderLoading] = useState<
    "google" | "github" | null
  >(null);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          console.log("Error:", ctx);
          const errorMessage = ctx?.error?.message || "Something went wrong";
          setBackendError(errorMessage);
        },
      }
    );
  };

  const handleSignInWithProvider = async (provider: "google" | "github") => {
    setProviderLoading(provider);
    await authClient.signIn.social(
      {
        provider,
      },
      {
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          console.log("Error:", ctx);
          const errorMessage = ctx?.error?.message || "Something went wrong";
          setBackendError(errorMessage);
        },
      }
    );

    setProviderLoading(null);
  };

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold">Log in</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Welcom back
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="absolute z-50 inset-y-0 right-3 flex items-center "
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <EyeOffIcon strokeWidth={0.5} />
                          ) : (
                            <EyeIcon strokeWidth={0.5} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm hover:underline">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password ?
                </Link>
              </div>
              {backendError && (
                <div className="text-red-500 text-sm">{backendError}</div>
              )}
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full cursor-pointer"
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="animate-spin w-6 h-6" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          <div className="flex items-center w-full gap-x-2 mt-6">
            <Button
              size="lg"
              className="flex-1 cursor-pointer"
              variant="outline"
              onClick={() => handleSignInWithProvider("google")}
              disabled={providerLoading === "google"}
            >
              {providerLoading === "google" ? (
                <Loader2Icon className="animate-spin w-5 h-5" />
              ) : (
                <FcGoogle size={20} />
              )}
            </Button>
            <Button
              size="lg"
              className="flex-1 cursor-pointer"
              variant="outline"
              onClick={() => handleSignInWithProvider("github")}
              disabled={providerLoading === "github"}
            >
              {providerLoading === "github" ? (
                <Loader2Icon className="animate-spin w-5 h-5" />
              ) : (
                <FaGithub size={20} />
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex justify-center text-sm w-full">
          <Link href="/sign-up" className="text-primary hover:underline">
            Don&apos;t have an account yet ? Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
