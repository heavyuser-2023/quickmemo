import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { LogOut, User as UserIcon } from "lucide-react";
import MemoApp from "./components/MemoApp";

export default function App() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.current);

  if (user === undefined) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex w-full min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl space-y-10 transform transition-all duration-500 hover:scale-[1.01] border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-2">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium px-4">
              Sign in to securely access your dashboard and manage your data.
            </p>
          </div>
          
          <button
            onClick={() => void signIn("google")}
            className="group relative w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700/80 rounded-2xl px-4 py-4 text-gray-700 dark:text-gray-200 font-semibold shadow-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-800 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <svg className="w-6 h-6 z-10" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="z-10">Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 상단 네비게이션바 (환영 인사 & 로그아웃) */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 px-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              안녕하세요, <span className="text-indigo-600 dark:text-indigo-400">{user.name || "사용자"}</span>님!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">환영합니다. 메모를 관리해보세요.</p>
          </div>
        </div>
        
        <button
          onClick={() => void signOut()}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </header>

      {/* 메인 콘텐츠 (메모 앱) */}
      <main className="w-full max-w-6xl">
        <MemoApp />
      </main>
    </div>
  );
}
