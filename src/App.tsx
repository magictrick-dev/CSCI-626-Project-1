import PetrolTable from './components/PetrolTable';
import Article from './components/Article';
import data from './assets/petrol_dataset.json' with { type: 'JSON' };

/*
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
*/

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

function HighlightTest()
{
    return (
        <div className="my-8 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">
                Highlight test
            </h2>

            <table className="w-full border-collapse">
                <tbody>
                    <tr>
                        <td data-col="1" data-highlighted>Column 1</td>
                        <td data-col="2" data-highlighted>Column 2</td>
                        <td data-col="3" data-highlighted>Column 3</td>
                        <td data-col="4" data-highlighted>Column 4</td>
                        <td data-col="5" data-highlighted>Column 5</td>
                        <td data-col="6" data-highlighted>Column 6</td>
                        <td data-col="7" data-highlighted>Column 7</td>
                        <td data-col="8" data-highlighted>Column 8</td>
                        <td data-col="9" data-highlighted>Column 9</td>
                        <td data-col="10" data-highlighted>Column 10</td>
                        <td data-col="11" data-highlighted>Column 11</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function App()
{

    return (
        <div data-theme="dark" className="min-h-dvh bg-white text-black dark:bg-gray-900 dark:text-white">
            {/* <Navigation>
                <p>Navigation Bar</p>
            </Navigation> */}
            <MainContent>
                <Article/>
                <PetrolTable data={data} />
				<HighlightTest />
            </MainContent>
            <FooterContent>

            </FooterContent>
        </div>
    )

}

export default App
