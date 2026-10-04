import PetrolTable from "./components/PetrolTable"
import data from './assets/petrol_dataset.json' with { type: 'JSON' };
import writeup from "./assets/petrol_writeup.html?raw";

function Navigation({ children }: { children?: React.ReactNode }): React.ReactNode
{
    return (
        <nav className="fixed w-full py-8 z-50">
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
        <div className="max-w-6xl mx-auto pt-32 p-2">
            { children }
        </div>
    )
}

function App()
{

    return (
        <div data-theme="dark" className="min-h-dvh bg-white text-black dark:bg-gray-900 dark:text-white">
            <Navigation>
                <p>Navigation Bar</p>
            </Navigation>
            <MainContent>
                <article className="petrol-writeup" dangerouslySetInnerHTML={ { __html: writeup } }/>
                <PetrolTable data={data} />
            </MainContent>
            <div className="min-h-dvh"/>
        </div>
    )

}

export default App
