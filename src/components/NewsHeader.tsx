// A decorative, news-outlet style masthead to match NewsFooter. Like the footer, every
// link points to #top, which browsers treat as the top of the page.

const headerSections = ['World', 'Energy', 'Markets', 'Economy', 'Climate', 'Data Desk', 'Opinion', 'Science', 'Travel'];

// The section this article would be filed under, marked as the current page.
const currentSection = 'Energy';

function MenuIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={ 1.5 }
             strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}

function SearchIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={ 1.5 }
             strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
        </svg>
    )
}

function NewsHeader()
{
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-gray-950 border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-2 py-2 flex items-center justify-between gap-4 text-xs text-gray-400">
                <span>{ today }</span>
                <div className="hidden sm:flex gap-4">
                    <a href="#top" className="hover:text-white transition-colors">U.S. Edition</a>
                    <a href="#top" className="hover:text-white transition-colors">Today's Paper</a>
                    <a href="#top" className="hover:text-white transition-colors">Newsletters</a>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-2 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-300">
                        <a href="#top" aria-label="Menu" className="p-1.5 rounded hover:bg-gray-800 transition-colors">
                            <MenuIcon />
                        </a>
                        <a href="#top" aria-label="Search" className="hidden sm:block p-1.5 rounded hover:bg-gray-800 transition-colors">
                            <SearchIcon />
                        </a>
                    </div>

                    <a href="#top" className="font-thin text-2xl sm:text-5xl whitespace-nowrap">The Petrol Ledger</a>

                    <div className="flex items-center justify-end gap-3 text-sm">
                        <a href="#top" className="hidden sm:inline text-gray-300 hover:text-white transition-colors">Log in</a>
                        <a href="#top" className="px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-white text-gray-950 text-xs sm:text-sm
                                                  font-semibold hover:bg-gray-200 transition-colors">
                            Subscribe
                        </a>
                    </div>
                </div>
            </div>

            <nav className="border-t border-gray-800">
                <ul className="max-w-6xl mx-auto px-2 flex sm:justify-center gap-6 overflow-x-auto [scrollbar-width:none] whitespace-nowrap text-sm">
                    { headerSections.map((section) => (
                        <li key={ section }>
                            <a href="#top" aria-current={ section === currentSection ? 'page' : undefined }
                               className="block py-2.5 border-b-2 border-transparent text-gray-400 hover:text-white
                                          aria-[current=page]:border-white aria-[current=page]:text-white transition-colors">
                                { section }
                            </a>
                        </li>
                    )) }
                </ul>
            </nav>
        </header>
    )
}

export default NewsHeader;
