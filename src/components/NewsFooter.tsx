// A decorative, news-outlet style footer. "The Petrol Ledger" is fictional, and every
// link points to #top, which browsers treat as the top of the page.

const footerSections: { heading: string, links: string[] }[] = [
    { heading: 'Sections', links: ['World', 'Energy', 'Markets', 'Economy', 'Climate', 'Data Desk'] },
    { heading: 'Analysis', links: ['Fuel Prices', 'Oil Consumption', 'Affordability', 'Country Profiles', 'Methodology'] },
    { heading: 'Company',  links: ['About Us', 'Our Journalists', 'Ethics Policy', 'Corrections', 'Careers'] },
    { heading: 'Follow',   links: ['Newsletters', 'Podcasts', 'RSS Feeds', 'Mobile App', 'Contact Us'] },
];

const legalLinks = ['Terms of Use', 'Privacy Policy', 'Cookie Settings', 'Accessibility', 'Sitemap'];

function FooterLink({ children }: { children: React.ReactNode })
{
    return (
        <a href="#top" className="text-gray-400 hover:text-white transition-colors">
            { children }
        </a>
    )
}

function NewsFooter()
{
    return (
        <div className="max-w-6xl mx-auto px-2 py-12">
            <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-gray-800">
                <div>
                    <a href="#top" className="font-thin text-4xl">The Petrol Ledger</a>
                    <p className="pt-1 text-sm text-gray-400">
                        Independent reporting on energy, markets, and the price of getting around.
                    </p>
                </div>

                <FooterLink>Back to top ↑</FooterLink>
            </div>

            <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
                { footerSections.map((section) => (
                    <div key={ section.heading }>
                        <h4 className="pb-3 text-sm font-semibold uppercase tracking-wider">{ section.heading }</h4>
                        <ul className="space-y-2 text-sm">
                            { section.links.map((link) => (
                                <li key={ link }><FooterLink>{ link }</FooterLink></li>
                            )) }
                        </ul>
                    </div>
                )) }
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-800 text-xs text-gray-500">
                <p>© 2026 The Petrol Ledger. All rights reserved.</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    { legalLinks.map((link) => (
                        <li key={ link }><FooterLink>{ link }</FooterLink></li>
                    )) }
                </ul>
            </div>

            <p className="mt-8 p-3 rounded-md border border-gray-800 text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Disclaimer:</span> This footer and the masthead at
                the top of the page are for aesthetic purposes only. The Petrol Ledger is not a real news outlet,
                and none of their links lead anywhere; each one simply returns you to the top of the page.
            </p>
        </div>
    )
}

export default NewsFooter;
