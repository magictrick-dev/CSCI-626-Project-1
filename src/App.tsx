import PetrolTable from './components/PetrolTable';
import Article from './components/Article';
import NewsHeader from './components/NewsHeader';
import NavigationControls from './components/NavigationControls';
import NewsFooter from './components/NewsFooter';
import data from './assets/petrol_dataset.json' with { type: 'JSON' };

// Sits below the masthead, then sticks to the top of the viewport once scrolled past it.
// The transparent padding around the bar ignores the pointer so it never blocks the page beneath.
function Navigation({ children }: { children?: React.ReactNode }): React.ReactNode
{
    return (
        <nav className="sticky top-0 w-full px-2 py-4 z-40 pointer-events-none">
            <div className="mx-auto max-w-4xl bg-gray-950/66 border border-gray-700/50
                            backdrop-blur-sm rounded-md p-2 shadow-md pointer-events-auto">

                { children }

            </div>
        </nav>
    )
}


function MainContent({ children }: { children?: React.ReactNode }): React.ReactNode
{
    return (
        <div className="max-w-6xl mx-auto pt-8 p-2 mb-16">
            { children }
        </div>
    )
}

function FooterContent({ children }: { children?: React.ReactNode }): React.ReactNode
{

    return (
        <footer id="site-footer" className="py-4 bg-gray-950 min-h-120">
            { children }
        </footer>
    );

}

function App()
{

    return (
        <div data-theme="dark" className="min-h-dvh bg-white text-black dark:bg-gray-900 dark:text-white">
            <NewsHeader />
            <Navigation>
                <NavigationControls />
            </Navigation>
            <MainContent>
                <Article/>
                <PetrolTable data={data} />
            </MainContent>
            <FooterContent>
                <NewsFooter />
            </FooterContent>
        </div>
    )

}

export default App
