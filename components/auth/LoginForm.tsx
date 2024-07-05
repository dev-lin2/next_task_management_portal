"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/src/stores/useAuthStore";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      </div>
      <div>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Link className="text-blue-400" href="/register">
          Register
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
