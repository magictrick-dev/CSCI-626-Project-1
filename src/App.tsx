import PetrolTable from './components/PetrolTable';
import Article from './components/Article';
import data from './assets/petrol_dataset.json' with { type: 'JSON' };

function Navigation({ children }: { children?: React.ReactNode }): React.ReactNode
{
    return (
        <nav className="fixed w-full py-8 z-40">
            <div className="mx-auto max-w-4xl bg-gray-950/66 border border-gray-700/50
                            backdrop-blur-sm rounded-md p-2 shadow-md">

                { children }

            </div>
        </nav>
    )
}

function MainContent({ children }: { children?: React.ReactNode }): React.ReactNode
{
    return (
        <div className="max-w-6xl mx-auto pt-32 p-2 mb-16">
            { children }
        </div>
    )
}

function FooterContent({ children }: { children?: React.ReactNode }): React.ReactNode
{

    return (
        <footer className="py-4 bg-gray-950 min-h-120">
            { children }
        </footer>
    );

}

function App()
{

    return (
        <div data-theme="dark" className="min-h-dvh bg-white text-black dark:bg-gray-900 dark:text-white">
            <Navigation>
                <p>Navigation Bar</p>
            </Navigation>
            <MainContent>
                <Article/>
                <PetrolTable data={data} />
            </MainContent>
            <FooterContent>

            </FooterContent>
        </div>
    )

}

export default App
