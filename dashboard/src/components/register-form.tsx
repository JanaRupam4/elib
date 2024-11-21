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
import { register } from "@/http/api";
import useToken from "@/store";
import { toast } from "@/hooks/use-toast";

export function RegisterForm() {
  const setToken = useToken((state) => state.setToken);
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      setToken(data.data.data);
      toast({
        title: "Signup Successfully",
        description: "You are now successfully signup.",
      });
      navigate("/dashboard/home");
    },
  });
  const handleSubmit = () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      return;
    }
    mutation.mutate({ name, email, password });
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your name,email,password below to sign up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              ref={nameRef}
              id="name"
              type="text"
              placeholder="john doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              ref={emailRef}
              type="email"
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
            Sign Up
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
