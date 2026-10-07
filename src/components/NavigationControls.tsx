// Controls for the floating navigation bar: a home link that reloads this page, and
// buttons that smoothly scroll to each part of it.

// Parts of the page the navigation can jump to, by element id.
const jumpTargets = [
    { label: 'Article', id: 'petrol-writeup' },
    { label: 'Table',   id: 'petrol-table' },
    { label: 'Footer',  id: 'site-footer' },
];

function jumpTo(id: string)
{
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function HomeIcon()
{
    return (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={ 1.5 }
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9v11h5v-6h4v6h5V9" />
        </svg>
    )
}

function NavigationControls()
{
    return (
        <div className="flex items-center justify-between gap-2 text-sm">
            <a href={ import.meta.env.BASE_URL }
               className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-gray-800 transition-colors">
                <HomeIcon />
                Home
            </a>

            <div className="flex items-center gap-1">
                <span className="hidden sm:inline pr-2 text-xs uppercase tracking-wider text-gray-500">Jump to</span>
                { jumpTargets.map((target) => (
                    <button key={ target.id } type="button" onClick={ () => jumpTo(target.id) }
                            className="px-2.5 py-1.5 rounded text-gray-300 hover:bg-gray-800 hover:text-white
                                       transition-colors cursor-pointer">
                        { target.label }
                    </button>
                )) }
            </div>
        </div>
    )
}

export default NavigationControls;
