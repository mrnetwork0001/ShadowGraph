import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWalletProvider } from "../components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ShadowGraph - Neon Privacy",
    description: "Private contact discovery using Arcium MPC",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="cyber-grid" />
                <AppWalletProvider>
                    {children}
                </AppWalletProvider>
            </body>
        </html>
    );
}
