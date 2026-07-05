'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null)
  const router = useRouter()
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  useEffect(() => {
    if (state && !state.error) {
      router.push('/dashboard')
    }
  }, [state, router])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0B]">
      {/* Deep premium background mesh with extreme blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-purple-600/20 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Grid texture overlay for premium feel */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Glowing border effect wrapper */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] p-[1px] blur-sm"></div>
        
        <div className="relative bg-[#111113]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)] border border-white/[0.05]">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-5 transform transition-transform hover:scale-105 duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              Tele<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Post</span>
            </h1>
            <p className="text-[#88888F] text-sm font-medium">Channel Management OS</p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#88888F] uppercase tracking-wider pl-1">
                Username
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 ${focusedInput === 'username' ? 'text-blue-400' : 'text-[#66666F]'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  name="username"
                  type="text"
                  placeholder="admin"
                  required
                  autoComplete="username"
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full bg-black/20 border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-[#44444A] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#88888F] uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 ${focusedInput === 'password' ? 'text-blue-400' : 'text-[#66666F]'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full bg-black/20 border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder-[#44444A] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 animate-fade-in">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {state.error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={pending}
                className="relative w-full group overflow-hidden rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* Button background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] group-hover:bg-[position:100%_center] transition-all duration-500"></div>
                
                {/* Content */}
                <div className="relative py-4 px-4 flex justify-center items-center gap-2 text-white font-semibold shadow-inner">
                  {pending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Hint */}
          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#88888F]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Demo: admin / admin
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
