"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // Added for better navigation

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Local loading state

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const onSubmit = async () => {
    if (!email || !password || !name) {
      alert("Please fill in all fields");
      return;
    }

    await authClient.signUp.email({
      email,
      name,
      password,
    }, {
      onRequest: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        router.refresh(); // Refresh the server components/session state
      },
      onError: (ctx) => {
        setLoading(false);
        alert(ctx.error.message);
      },
    });
  }

  const onLogin = async () => {
    if (!email || !password || !name) {
      alert("Please fill in all fields");
      return;
    }

    await authClient.signIn.email({
      email,
      password,
    }, {
      onRequest: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        router.refresh(); // Refresh the server components/session state
      },
      onError: (ctx) => {
        setLoading(false);
        alert(ctx.error.message);
      },
    });
  }
  // Handle global loading state (initial session check)
  if (sessionLoading) return <div className="p-4">Loading session...</div>;

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }

  return (
    <div>
    <div className="p-4 flex flex-col gap-y-4 max-w-sm">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Creating Account..." : "Create User"}
      </Button>
    </div>

    <div className="p-4 flex flex-col gap-y-4 max-w-sm">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button onClick={onLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </div>
    </div>
  );
}