import Link from "next/link";
import { PageToggle } from "./page-toggle";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link
                        href="/home"
                        className="mr-6 flex items-center space-x-2"
                    >
                        <span className="text-lg">🧑‍🦳</span>
                        <span className="inline-block text-sm">
                            <strong>银发无忧</strong>
                            ：实时预警·智慧反诈
                        </span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none"></div>

                    <nav className="flex items-center gap-2">
                        <ModeToggle />
                        <PageToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
