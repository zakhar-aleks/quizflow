import Link from "next/link";

export function Header() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h1 className="font-bold text-xl tracking-tight">
                    QuizFlow <span className="text-slate-400 font-normal">/</span> <span className="font-medium text-slate-600">Workspace</span>
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">JS</div>
            </div>
        </header>
    );
}
