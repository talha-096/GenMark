import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        try {
            await login({ email, password });
            navigate("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
            <GlassCard className="w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--secondary)))]" />
                
                <div className="text-center mb-10">
                   <h1 className="text-3xl font-display font-bold mb-2"><GradientText>Welcome Back</GradientText></h1>
                   <p className="text-muted-foreground">Access your neural ecosystem.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Work Email</label>
                        <input 
                            type="email" 
                            placeholder="sarah@enterprise.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors" 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                           <label className="text-sm font-medium">Password</label>
                           <a href="#" className="text-xs text-primary hover:text-white transition-colors">Forgot Password?</a>
                        </div>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`mt-4 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-dark)))] text-primary-foreground font-semibold px-6 py-4 rounded-xl shadow-glow-sm hover:shadow-glow-md transition-all active:scale-[0.98] ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In via SSO'}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't have an account? <Link to="/signup" className="text-primary hover:text-white transition-colors">Request Access</Link>
                </p>
            </GlassCard>
        </div>
    )
};

