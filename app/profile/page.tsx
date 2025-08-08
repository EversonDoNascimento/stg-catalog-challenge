"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoutes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/libs/supabase/supabase";

type ProfileData = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    name: null,
    email: null,
    phone: null,
  });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, phone")
        .eq("id", user.id)
        .single();

      if (!cancelled) {
        if (error) {
          console.error(error);
          setProfile({
            name: user.user_metadata?.name ?? null,
            email: user.email as string,
            phone: user.user_metadata?.phone ?? null,
          });
        } else {
          setProfile({
            name: data.name,
            email: data.email,
            phone: data.phone,
          });
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <ProtectedRoute>
      {loading && <LoadingSpinner />}
      <Header />

      <main className="max-w-md mx-auto px-6 mt-16 mb-12">
        <div className="flex flex-col items-center bg-white dark:bg-background border rounded-lg shadow p-6">
          <div className="h-24 w-24 relative rounded-full overflow-hidden bg-gray-100">
            <Image
              src="/avatar-placeholder.png"
              alt="Avatar"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <h1 className="mt-4 text-xl font-bold text-foreground">
            {profile.name ?? "Nome não informado"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {profile.email ?? "E-mail não informado"}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {profile.phone ?? "Telefone não informado"}
          </p>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}
