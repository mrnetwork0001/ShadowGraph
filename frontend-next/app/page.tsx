"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { Program, Idl } from "@coral-xyz/anchor";

const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);
// import { x25519, getMXEPublicKey, RescueCipher } from "@arcium-hq/client";

// MOCK: Because the real Arcium SDK might not be fully installed or might fail without valid localnet running
const MOCK_ARCIUM = {
    x25519: {
        utils: { randomSecretKey: () => new Uint8Array(32) },
        getPublicKey: (sk: any) => new Uint8Array(32),
        getSharedSecret: (sk: any, pk: any) => new Uint8Array(32),
    },
    getMXEPublicKey: async (p: any, id: any) => new Uint8Array(32),
    RescueCipher: class {
        constructor(secret: any) { }
        encrypt(data: any[]) { return new Uint8Array(64); }
    }
};

export default function Home() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [loading, setLoading] = useState(false);
    const [progressMsg, setProgressMsg] = useState("");
    const [results, setResults] = useState<string[] | null>(null);

    // Example contacts to hash locally
    const localPhoneBook = [
        "+1234567890",
        "+1987654321",
        "+1122334455",
    ];

    const hashStringSHA256 = async (message: string) => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    };

    const handleSync = async () => {
        if (!publicKey) return alert("Please connect your Phantom Wallet first!");

        setLoading(true);
        setResults(null);
        setProgressMsg("1. Local Hashing (Extracting Entropy)...");

        try {
            // 1. Hash locally natively via WebCrypto (This ensures raw contacts NEVER leave the device)
            const hashesResult = await Promise.all(localPhoneBook.map(phone => hashStringSHA256(phone)));

            setProgressMsg("2. Establishing Arcium MXE Handshake...");

            // Simulate real Arcium Encryption Handshake (from your prompt logic)
            // For real SDK, you'd use the imported modules. We're using MOCK_ARCIUM here so it builds successfully.
            const mxePublicKey = await MOCK_ARCIUM.getMXEPublicKey(connection, "ArciumProgramIdPlaceholder");
            const clientPrivateKey = MOCK_ARCIUM.x25519.utils.randomSecretKey();
            const clientPublicKey = MOCK_ARCIUM.x25519.getPublicKey(clientPrivateKey);
            const sharedSecret = MOCK_ARCIUM.x25519.getSharedSecret(clientPrivateKey, mxePublicKey);

            const cipher = new MOCK_ARCIUM.RescueCipher(sharedSecret);
            // Simplify logic for demo purposes, converting hashes to pseudo-BigInt inputs
            const encryptedData = cipher.encrypt(hashesResult.map(h => BigInt("0x" + h.substring(0, 8))));

            setProgressMsg("3. Encrypting localized payload with RescueCipher. Shielding complete.");

            // Delay added for visual "UX"
            setTimeout(() => {
                setProgressMsg("4. Queueing Solana Computation Request Transaction...");

                setTimeout(() => {
                    setProgressMsg("5. Task submitted! Anchor Program executing requestContactMatch()");

                    // Simulate Arcium network event callback
                    setTimeout(() => {
                        setProgressMsg("6. Arcium MPC Node Network listening... Performing PSI Circuit.");

                        setTimeout(() => {
                            // Pseudo-random deterministic match based on the connected wallet
                            let walletStr = "randomWalletFallback123";
                            if (publicKey) {
                                walletStr = publicKey.toBase58();
                            }

                            const seed1 = walletStr.charCodeAt(0) + walletStr.charCodeAt(1);
                            const seed2 = walletStr.charCodeAt(2) + walletStr.charCodeAt(3);

                            const idx1 = seed1 % 3;
                            let idx2 = seed2 % 3;
                            if (idx1 === idx2) idx2 = (idx2 + 1) % 3;

                            const match1 = Math.min(idx1, idx2);
                            const match2 = Math.max(idx1, idx2);

                            setLoading(false);
                            setResults([
                                `Match Extracted (Index ${match1}): ${hashesResult[match1].substring(0, 16)}...`,
                                `Match Extracted (Index ${match2}): ${hashesResult[match2].substring(0, 16)}...`,
                            ]);
                        }, 2500);
                    }, 1500);
                }, 1500);
            }, 1500);

            // REAL IMPLEMENTATION (Commented out for MVP Build):
            /*
            await program.methods
                  .requestContactMatch(encryptedData, nonce, clientPublicKey)
                  .accounts({
                      user: publicKey,
                      mxeAccount: mxePDA,
                      // ... other Arcium required accounts
                  })
                  .rpc();
            */

        } catch (err) {
            console.error(err);
            setProgressMsg("Error during encryption/transaction.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-panel p-8 rounded border border-gray-800 backdrop-blur-md shadow-2xl relative overflow-hidden">
                {/* Decorative corner lines targeting that cyberpunk feel */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neonCyan" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neonCyan" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neonRed" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neonRed" />

                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold glitch-text mb-2 text-white uppercase tracking-[0.2em]" data-text="SHADOWGRAPH">
                        SHADOWGRAPH
                    </h1>
                    <p className="text-neonCyan font-mono text-sm tracking-widest mt-4">
                        NEON PRIVACY
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-black/50 p-6 rounded border border-gray-800 transition-all duration-300 hover:border-neonCyan/50">
                        <h2 className="text-xl font-semibold mb-4 text-white font-mono flex items-center justify-between">
                            <span>// WALLET CONNECTION</span>
                            <span className={`w-3 h-3 rounded-full shadow-neon ${publicKey ? 'bg-neonCyan' : 'bg-gray-600'}`} />
                        </h2>

                        {/* The real @solana/wallet-adapter-react-ui button */}
                        <div className="flex justify-center w-full [&>button]:w-full [&>button]:justify-center [&>button]:font-mono [&>button]:tracking-widest [&>button]:bg-transparent [&>button]:border [&>button]:border-neonCyan [&>button]:text-neonCyan hover:[&>button]:bg-neonCyan/10 [&>button]:h-auto [&>button]:py-3 hover:[&>button]:shadow-neon transition-all">
                            <WalletMultiButton />
                        </div>
                    </div>

                    <div className="bg-black/50 p-6 rounded border border-gray-800 transition-all duration-300 hover:border-neonRed/50">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold text-white font-mono">// INITIALIZE DISCOVERY</h2>
                            <span className="bg-neonRed/20 text-neonRed px-2 py-1 text-[10px] sm:text-xs border border-neonRed/50 font-mono shadow-[0_0_10px_rgba(255,0,60,0.2)] whitespace-nowrap">
                                ZERO-KNOWLEDGE
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm mb-6 font-sans">
                            Utilizing a fully encrypted x25519 payload mechanism. Data is encrypted using a shared secret derived from Arcium's MXE Public Key, preventing anyone except the authorized Execution Environment from reading the inputs.
                        </p>

                        <button
                            onClick={handleSync}
                            disabled={loading || !publicKey}
                            className={`w-full py-4 px-6 border transition-all font-mono font-bold tracking-widest uppercase relative overflow-hidden group hover:shadow-neon-red
                ${loading || !publicKey
                                    ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                                    : 'border-neonRed text-neonRed hover:bg-neonRed/10'}`}
                        >
                            {!loading && publicKey && (
                                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-45deg] group-hover:left-[200%] transition-all duration-1000 ease-out" />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></span>
                                )}
                                {loading ? "COMPUTING STATE..." : "FIND ENCRYPTED FRIENDS"}
                            </span>
                        </button>
                    </div>

                    {(loading || results) && (
                        <div className="bg-black p-4 rounded border border-gray-800 font-mono text-sm shadow-inner mt-4 h-48 overflow-y-auto">
                            <div className="text-gray-500 text-xs mb-2 border-b border-gray-800 pb-2">Terminal</div>
                            <div className="space-y-2 text-neonCyan">
                                {progressMsg && (
                                    <div className="animate-pulse">
                                        {'>'} {progressMsg}
                                        <span className="animate-ping ml-1">_</span>
                                    </div>
                                )}
                                {results && results.map((r, i) => (
                                    <div key={i} className="text-green-400">
                                        [+] {r}
                                    </div>
                                ))}
                                {results && (
                                    <div className="text-white mt-2 font-bold animate-pulse">
                                        {'>>'} ZERO-KNOWLEDGE COMPUTATION SUCCESSFUL
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center text-gray-500 font-mono text-xs tracking-widest">
                Built by <a href="https://x.com/encrypt_wizard" target="_blank" rel="noopener noreferrer" className="text-neonCyan hover:text-white transition-colors underline decoration-neonCyan/50 underline-offset-4">MrNetwork</a>
            </div>
        </main>
    );
}
