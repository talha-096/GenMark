import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";

export const Signup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setIsLoading(true);
        
        try {
            await register({ name: username, email, password });
            setSuccessMsg("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to register. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
            <GlassCard variant="orange" className="w-full max-w-md p-8 relative overflow-hidden">
                <div className="text-center mb-10">
                   <h1 className="text-3xl font-display font-bold mb-2">Join <GradientText>GenMark</GradientText></h1>
                   <p className="text-muted-foreground">The ultimate AI marketing ecosystem.</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg text-center">
                            {successMsg}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Username / Company</label>
                        <input 
                            type="text" 
                            placeholder="Acme Corp" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 transition-colors" 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Work Email</label>
                        <input 
                            type="email" 
                            placeholder="you@acmecorp.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 transition-colors" 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-secondary/50 transition-colors" 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`mt-4 bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--secondary-dark)))] text-primary-foreground font-semibold px-6 py-4 rounded-xl shadow-glow-orange hover:shadow-glow-md transition-all active:scale-[0.98] ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Neural Account'}
                    </button>
                    <p className="text-xs text-center text-muted-foreground mt-2">By continuing, you agree to our precise Terms of Service.</p>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8 border-t border-white/10 pt-6">
                    Already have an account? <Link to="/login" className="text-secondary hover:text-white transition-colors">Sign In</Link>
                </p>
            </GlassCard>
        </div>
    )
};

