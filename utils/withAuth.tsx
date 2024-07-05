// utils/withAuth.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/src/stores/useAuthStore";

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);

    if (!token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set the display name for better debugging
  WithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
}

// Helper function to get the display name of a component
function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
