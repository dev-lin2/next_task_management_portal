import { User } from "@/src/models/User";
import useAuthStore from "@/src/stores/useAuthStore";
import { useState } from "react";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const token = useAuthStore.getState().token;

  async function getUsers() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = await response.json();
    setUsers(users);
  }

  return { users, getUsers };
}
