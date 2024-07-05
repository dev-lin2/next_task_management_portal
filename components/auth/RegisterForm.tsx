'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/src/stores/useAuthStore";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password, name);
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
      <div>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
