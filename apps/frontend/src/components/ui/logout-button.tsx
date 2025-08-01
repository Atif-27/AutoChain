"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import useStore from "@/store";
import axiosInstance from "@/utils/axiosInstance";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogoutButton({ className, variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const deleteUserDetails = useStore((state) => state.deleteUserDetails);

  const handleLogout = async () => {
    try {
      // Call the backend signout endpoint
      await axiosInstance.post("/api/v1/user/signout");
      
      // Clear the user details from the store
      deleteUserDetails();
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if the API call fails, we should still clear local state and redirect
      deleteUserDetails();
      router.push("/login");
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
} 