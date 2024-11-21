import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/http/api";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useToken from "@/store";

export function LoginForm() {
  const setToken = useToken((state) => state.setToken);
  const { toast } = useToast();
  const navigation = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.data.data);
      toast({
        title: "Login Successfully",
        description: "You are now Logged in.",
      });
      navigation("/dashboard/home");
    },
  });
  const handleSubmit = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      return;
    }

    mutation.mutate({ email, password });
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" ref={passwordRef} type="password" required />
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            onClick={handleSubmit}
            className="w-full"
          >
            {mutation.isPending && <LoaderCircle className="animate-spin" />}
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
