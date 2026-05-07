import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import { Header, Sidebar } from "@/widgets/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Quiz Builder",
    description: "Create and Take Quizzes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} h-full m-0 flex flex-col overflow-hidden bg-slate-50 text-slate-900`}>
                <ReduxProvider>
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar />
                        <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
                            <div className="max-w-3xl mx-auto">{children}</div>
                        </main>
                    </div>
                </ReduxProvider>
            </body>
        </html>
    );
}
