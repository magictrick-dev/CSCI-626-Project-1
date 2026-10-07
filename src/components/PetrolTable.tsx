import data from '../assets/petrol_dataset.json' with { type: 'JSON' };
type TableType = typeof data;
type RowType = typeof data[0]

function PetrolTableRow({ data }: { data: RowType })
{
    return (
        <tr className="odd:bg-gray-900">
            <td id={`cell-${data.rank}-1`} data-col={ 1 } className="px-2 py-1">{ data.rank }</td>
            <td id={`cell-${data.rank}-2`} data-col={ 2 } className="px-2 py-1">{ data.country }</td>
            <td id={`cell-${data.rank}-3`} data-col={ 3 } className="px-2 py-1">{ data.dailyOilConsumptionBarrels }</td>
            <td id={`cell-${data.rank}-4`} data-col={ 4 } className="px-2 py-1">{ data.worldSharePercent }</td>
            <td id={`cell-${data.rank}-5`} data-col={ 5 } className="px-2 py-1">{ data.yearlyGallonsPerCapita }</td>
            <td id={`cell-${data.rank}-6`} data-col={ 6 } className="px-2 py-1">{ data.pricePerGallonUsd }</td>
            <td id={`cell-${data.rank}-7`} data-col={ 7 } className="px-2 py-1">{ data.pricePerLiterUsd }</td>
            <td id={`cell-${data.rank}-8`} data-col={ 8 } className="px-2 py-1">{ data.pricePerLiterPkr }</td>
            <td id={`cell-${data.rank}-9`} data-col={ 9 } className="px-2 py-1">{ data.gdpPerCapitaUsd }</td>
            <td id={`cell-${data.rank}-10`} data-col={ 10 } className="px-2 py-1">{ data.gallonsGdpPerCapitaCanBuy }</td>
            <td id={`cell-${data.rank}-11`} data-col={ 11 } className="px-2 py-1">{ data.xTimesYearlyGallonsPerCapitaBuy }</td>
        </tr>
    )
}

function PetrolTable({ data }: { data: TableType })
{
    return (
        <div id="petrol-table" className="w-full min-h-40 max-h-dvh overflow-y-scroll scrollbar-thumb-gray-800
                      bg-gray-950 rounded-lg border border-gray-700/66 shadow-md">
            <table className="table-auto">
                <thead className="sticky top-0 z10 bg-gray-950">
                    <td className="px-2 py-1">#</td>
                    <td className="px-2 py-1">Country</td>
                    <td className="px-2 py-1">Daily Oil Consumptions (Barrels)</td>
                    <td className="px-2 py-1">World Share Percentage</td>
                    <td className="px-2 py-1">Yearly Gallons per Capita</td>
                    <td className="px-2 py-1">Price/Gallon (USD)</td>
                    <td className="px-2 py-1">Price/Liter (USD)</td>
                    <td className="px-2 py-1">Price/Liter (PKR)</td>
                    <td className="px-2 py-1">GDP/Capita (USD)</td>
                    <td className="px-2 py-1">Gallons GDP per Capita Purchasable</td>
                    <td className="px-2 py-1">X Times Yearly Gallons per Capita Purchasable</td>
                </thead>
                <tbody>
                    { data.map((row) => (<PetrolTableRow key={row.rank} data={row}></PetrolTableRow>)) }
                </tbody>
            </table>
        </div>
    )
}

export default PetrolTable;