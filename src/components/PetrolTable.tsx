import data from '../assets/petrol_dataset.json' with { type: 'JSON' };
type TableType = typeof data;
type RowType = typeof data[0]

function PetrolTableRow({ data }: { data: RowType })
{
    return (
        <tr className="odd:bg-gray-900">
            <td className="px-2 py-1">{ data.rank }</td>
            <td className="px-2 py-1">{ data.country }</td>
            <td className="px-2 py-1">{ data.dailyOilConsumptionBarrels }</td>
            <td className="px-2 py-1">{ data.worldSharePercent }</td>
            <td className="px-2 py-1">{ data.yearlyGallonsPerCapita }</td>
            <td className="px-2 py-1">{ data.pricePerGallonUsd }</td>
            <td className="px-2 py-1">{ data.pricePerLiterPkr }</td>
            <td className="px-2 py-1">{ data.gdpPerCapitaUsd }</td>
            <td className="px-2 py-1">{ data.gallonsGdpPerCapitaCanBuy }</td>
            <td className="px-2 py-1">{ data.xTimesYearlyGallonsPerCapitaBuy }</td>
        </tr>
    )
}

function PetrolTable({ data }: { data: TableType })
{
    return (
        <div className="w-full min-h-40 max-h-dvh overflow-y-scroll scrollbar-thumb-gray-800
                      bg-gray-950 rounded-lg border border-gray-700/66 shadow-md">
            <table className="table-auto">
                <thead>
                    <td className="px-2 py-1">#</td>
                    <td className="px-2 py-1">Country</td>
                    <td className="px-2 py-1">Daily Oil Consumptions (Barrels)</td>
                    <td className="px-2 py-1">World Share Percentage</td>
                    <td className="px-2 py-1">Yearly Gallons per Capita</td>
                    <td className="px-2 py-1">Price/Gallon (USD)</td>
                    <td className="px-2 py-1">Price/Liter (PKR)</td>
                    <td className="px-2 py-1">GDP/Capita (USD)</td>
                    <td className="px-2 py-1">Gallons GDP per Capita Purchasable</td>
                    <td className="px-2 py-1">X Times Yearly Gallons per Capita Purchasable</td>
                </thead>
                <tbody>
                    { data.map((row) => (<PetrolTableRow data={row}></PetrolTableRow>)) }
                </tbody>
            </table>
        </div>
    )
}

export default PetrolTable;