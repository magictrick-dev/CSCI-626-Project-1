import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import data from '../assets/petrol_dataset.json' with { type: 'JSON' };
import '../index.css'
import '../index.scss'

type RowType = typeof data[0];

export type DataReference = {
    rows?: string;
    columns?: string;
    cell?: string;
}

export type DataRefHover = {
    reference: DataReference;
    x: number;
    y: number;
}

const numberFormat = new Intl.NumberFormat('en-US');

// Short labels and display formats for each table column. Index + 1 is the column
// number used by the table's cell ids (cell-{row}-{column}) and the data-reference attributes.
const snippetColumns: { label: string, format: (row: RowType) => string }[] = [
    { label: '#',            format: (row) => String(row.rank) },
    { label: 'Country',      format: (row) => row.country },
    { label: 'Barrels/day',  format: (row) => numberFormat.format(row.dailyOilConsumptionBarrels) },
    { label: 'World share',  format: (row) => `${ row.worldSharePercent }%` },
    { label: 'Gal/capita',   format: (row) => numberFormat.format(row.yearlyGallonsPerCapita) },
    { label: '$/gal',        format: (row) => `$${ row.pricePerGallonUsd.toFixed(2) }` },
    { label: '$/liter',      format: (row) => `$${ row.pricePerLiterUsd.toFixed(2) }` },
    { label: 'PKR/liter',    format: (row) => row.pricePerLiterPkr.toFixed(2) },
    { label: 'GDP/capita',   format: (row) => `$${ numberFormat.format(row.gdpPerCapitaUsd) }` },
    { label: 'Gal GDP buys', format: (row) => numberFormat.format(row.gallonsGdpPerCapitaCanBuy) },
    { label: 'x Yearly use', format: (row) => `${ row.xTimesYearlyGallonsPerCapitaBuy }×` },
];

// Rank and Country identify a row, so every snippet shows them ahead of the data columns.
const IDENTIFIER_COLUMNS = [1, 2];
const FIRST_DATA_COLUMN = 3;
const LAST_DATA_COLUMN = snippetColumns.length;

// Larger references are cut down to this many rows and data columns so the
// tooltip doesn't bury the paragraph underneath it.
const MAX_SNIPPET_ROWS = 5;
const MAX_SNIPPET_COLUMNS = 4;

// Lists an inclusive range for display. A range longer than the limit keeps its first
// (limit - 1) values and its last value, with null standing in for the skipped middle.
function truncateRange(start: number, end: number, limit: number)
{
    const count = end - start + 1;

    if (count <= limit)
    {
        const values = Array.from({ length: Math.max(count, 0) }, (_, i) => start + i);
        return { values, skipped: 0 };
    }

    const head = Array.from({ length: limit - 1 }, (_, i) => start + i);
    return { values: [ ...head, null, end ], skipped: count - limit };
}

type TableSnippetProps = {
    rows: [number, number];
    columns: [number, number];
    highlight: boolean;
}

// A miniature, truncated slice of the petrol table. When highlight is set, the
// referenced columns are tinted with their column color.
function TableSnippet({ rows, columns, highlight }: TableSnippetProps)
{
    const [rowStart, rowEnd] = rows;
    const [columnStart, columnEnd] = columns;

    const shownRows = truncateRange(rowStart, rowEnd, MAX_SNIPPET_ROWS);
    const shownColumns = truncateRange(
        Math.max(columnStart, FIRST_DATA_COLUMN),
        Math.min(columnEnd, LAST_DATA_COLUMN),
        MAX_SNIPPET_COLUMNS
    );
    const columnLayout = [ ...IDENTIFIER_COLUMNS, ...shownColumns.values ];

    const isReferenced = (column: number) => highlight && column >= columnStart && column <= columnEnd;
    const alignment = (column: number) => column === 2 ? 'text-left' : 'text-right';

    return (
        <table className="mt-1 text-xs tabular-nums whitespace-nowrap">
            <thead>
                <tr className="text-gray-400">
                    { columnLayout.map((column) => column === null
                        ? <th key="gap" className="px-1.5 py-0.5 font-normal">+{ shownColumns.skipped }</th>
                        : <th key={ column } className={ `px-1.5 py-0.5 font-normal ${ alignment(column) }` }>
                              { snippetColumns[column - 1].label }
                          </th>
                    ) }
                </tr>
            </thead>
            <tbody>
                { shownRows.values.map((rank) => rank === null
                    ? (
                        <tr key="gap">
                            <td colSpan={ columnLayout.length } className="px-1.5 py-0.5 text-center text-gray-400">
                                ⋯ { shownRows.skipped } more rows ⋯
                            </td>
                        </tr>
                    )
                    : (
                        <tr key={ rank } className="odd:bg-gray-900/60">
                            { columnLayout.map((column) => column === null
                                ? <td key="gap" className="px-1.5 py-0.5 text-center text-gray-400">⋯</td>
                                : <td key={ column } className={ `px-1.5 py-0.5 ${ alignment(column) }` }
                                      data-col={ column } data-highlighted={ isReferenced(column) || undefined }>
                                      { snippetColumns[column - 1].format(data[rank - 1]) }
                                  </td>
                            ) }
                        </tr>
                    )
                ) }
            </tbody>
        </table>
    )
}

// data-reference-rows="start:end"
function RowsTooltip({ rows }: { rows: string })
{
    const [start, end] = rows.split(':').map(Number);

    return (
        <>
            <p className="font-semibold">Rows { start } to { end }</p>
            <TableSnippet rows={ [start, end] } columns={ [FIRST_DATA_COLUMN, LAST_DATA_COLUMN] } highlight={ false } />
        </>
    )
}

// data-reference-columns="start:end"
function ColumnsTooltip({ columns }: { columns: string })
{
    const [start, end] = columns.split(':').map(Number);

    return (
        <>
            <p className="font-semibold">{ start === end ? `Column ${ start }` : `Columns ${ start } to ${ end }` }</p>
            <TableSnippet rows={ [1, data.length] } columns={ [start, end] } highlight />
        </>
    )
}

// data-reference-cell="row,column"
function CellTooltip({ cell }: { cell: string })
{
    const [row, column] = cell.split(',').map(Number);

    return (
        <>
            <p className="font-semibold">Row { row }, Column { column }</p>
            <TableSnippet rows={ [row, row] } columns={ [column, column] } highlight />
        </>
    )
}

// Positions the tooltip above the cursor and picks the body for the reference type.
function ArticleTooltip({ reference, x, y }: DataRefHover)
{
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Measure each new snippet so it can be kept on screen. Layout effects run
    // before paint, so the unmeasured first position is never visible.
    useLayoutEffect(() =>
    {
        if (tooltipRef.current)
        {
            setSize({ width: tooltipRef.current.offsetWidth, height: tooltipRef.current.offsetHeight });
        }
    }, [reference.rows, reference.columns, reference.cell]);

    let body: React.ReactNode;

    if (reference.rows)
    {
        body = <RowsTooltip rows={ reference.rows } />;
    }

    else if (reference.columns)
    {
        body = <ColumnsTooltip columns={ reference.columns } />;
    }

    else if (reference.cell)
    {
        body = <CellTooltip cell={ reference.cell } />;
    }

    else
    {
        return null;
    }

    // Center above the cursor, clamped to the viewport's edges, and flip below
    // the cursor when there isn't room above it.
    const margin = 8;
    const left = Math.max(margin, Math.min(x - size.width / 2, window.innerWidth - size.width - margin));
    const above = y - 12 - size.height;
    const top = above >= margin ? above : y + 20;

    return (
        <div ref={ tooltipRef }
             className="fixed z-50 w-max pointer-events-none backdrop-blur-md
                        bg-gray-950/30 border border-gray-700/66 rounded-md shadow-md p-2 text-sm"
             style={{ left, top }}>

            { body }
        </div>
    )
}

function ArticleParagraph({ children }: { children: React.ReactNode })
{
    return (
        <p className="text-justify">
            { children }
        </p>
    )
}

// Strips the tint from every table cell highlighted by a previous reference click.
function clearReferenceHighlights()
{
    document.querySelectorAll('.reference-highlight').forEach((cell) =>
    {
        cell.classList.remove('reference-highlight', 'reference-row');
    });
}

function Article()
{
    const [hover, setHover] = useState<DataRefHover | null>(null);
    const [articleReference, setArticleReference] = useState<HTMLElement | null>(null);
    const [backToArticle, setBackToArticle] = useState<{x: number, y: number} | null>(null);

    useEffect(() =>
    {
        let hideTimeout: ReturnType<typeof setTimeout> | undefined;

        function handleTableHover(event: MouseEvent)
        {
            const target = event.target as HTMLElement;

            const highlightedCell = target.closest<HTMLElement>('.reference-highlight');
            if (!highlightedCell)
            {
                return;
            }
            clearTimeout(hideTimeout);

            const rect = highlightedCell.getBoundingClientRect();
            setBackToArticle({
                x: rect.right,
                y: rect.top + rect.height / 2
            });
        }

        document.addEventListener('mouseover', handleTableHover);

        return () =>
        {
            clearTimeout(hideTimeout);
            document.removeEventListener('mouseover', handleTableHover);
        };
    }, []);
    
    // One delegated handler for every .data-ref span inside the article.
    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>)
    {
        const span = (event.target as HTMLElement).closest<HTMLElement>('.data-ref');
        if (!span)
        {
            setHover(null);
            return;
        }

        // dataset maps data-reference-rows -> referenceRows, etc.
        const { referenceRows, referenceColumns, referenceCell } = span.dataset;
        setHover({
            reference: { rows: referenceRows, columns: referenceColumns, cell: referenceCell },
            x: event.clientX,
            y: event.clientY,
        });
    }

    function handleClick(event: React.MouseEvent<HTMLDivElement>)
    {
        const span = (event.target as HTMLElement).closest<HTMLElement>('.data-ref');

        if (!span)
        {
            return;
        }

        setArticleReference(span);

        // Remove previous highlights
        clearReferenceHighlights();

        let cellIds: string[] = [];

        // Single cell: "row,column"
        const cell = span.dataset.referenceCell;

        if (cell)
        {
            const [row, column] = cell.split(',').map(Number);

            cellIds.push(`cell-${row}-${column}`);
        }

        // Group of rows: "start:end"
        const rows = span.dataset.referenceRows;

        if (rows)
        {
            const [startRow, endRow] = rows.split(':').map(Number);

            for (let row = startRow; row <= endRow; row++)
            {
                for (let column = 1; column <= 11; column++)
                {
                    cellIds.push(`cell-${row}-${column}`);
                }
            }
        }

        // Group of columns: "start:end"
        const columns = span.dataset.referenceColumns;

        if (columns)
        {
            const [startColumn, endColumn] = columns.split(':').map(Number);

            for (let row = 1; row <= 181; row++)
            {
                for (let column = startColumn; column <= endColumn; column++)
                {
                    cellIds.push(`cell-${row}-${column}`);
                }
            }
        }

        // Highlight all referenced cells. Cells and columns are tinted with their column
        // color like the hover snippets; whole rows get a neutral tint (.reference-row).
        const highlightClasses = rows ? ['reference-highlight', 'reference-row'] : ['reference-highlight'];

        cellIds.forEach((id) =>
        {
            const tableCell = document.getElementById(id);

            if (tableCell)
            {
                tableCell.classList.add(...highlightClasses);
            }
        });

        // Scroll to the first referenced cell
        if (cellIds.length > 0)
        {
            const firstCell = document.getElementById(cellIds[0]);

            if (firstCell)
            {
                firstCell.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        }
    }

    return (
        <>
            <div id="petrol-writeup" className="px-1"
                onMouseMove={ handleMouseMove }
                onMouseLeave={ () => setHover(null) }
                onClick={ handleClick }
                >
                { hover && <ArticleTooltip { ...hover } /> }

                <h1 className="font-thin text-6xl pb-2">Gas Price Analysis by Country</h1>
                <h3 className="font-semibold text-xl pb-8">Written by Claude, Anthropic, October 2026</h3>

                <ArticleParagraph>
                    This dataset is a snapshot of petrol markets across <span className="data-ref" data-reference-rows="1:181">181 countries and territories</span>, dated June 23, 2022, a moment when fuel prices were already under heavy global pressure. Each row describes one economy through <span className="data-ref" data-reference-columns="3:11">nine measurements</span>: how much oil it burns each day, its share of world consumption, its yearly gallons per person, several expressions of the pump price, its income per person, and two derived affordability figures. The table is ordered by total consumption, so the story begins at the top with the two heavyweights. The <span className="data-ref" data-reference-cell="1,2">United States</span> consumes <span className="data-ref" data-reference-cell="1,3">19,687,287 barrels</span> of oil per day, which is <span className="data-ref" data-reference-cell="1,4">20%</span> of the world total. <span className="data-ref" data-reference-cell="2,2">China</span> follows with <span className="data-ref" data-reference-cell="2,3">12,791,553 barrels</span> and a <span className="data-ref" data-reference-cell="2,4">13%</span> share. Taken together, <span className="data-ref" data-reference-rows="1:2">the first two rows</span> account for roughly a third of all the oil consumed by the countries in the table, a concentration that sets the tone for everything else.
                </ArticleParagraph>

                <ArticleParagraph>
                    Consumption falls away quickly after those two. <span className="data-ref" data-reference-cell="3,2">India</span> is a distant third at <span className="data-ref" data-reference-cell="3,3">4,443,000 barrels</span> per day, and <span className="data-ref" data-reference-cell="4,2">Japan</span> is close behind with <span className="data-ref" data-reference-cell="4,3">4,012,877</span>. <span className="data-ref" data-reference-cell="5,2">Russia</span> records <span className="data-ref" data-reference-cell="5,3">3,631,287</span>, while <span className="data-ref" data-reference-cell="6,2">Saudi Arabia</span>, one of the world's great producers, still burns <span className="data-ref" data-reference-cell="6,3">3,302,000 barrels</span> at home. By my calculation the <span className="data-ref" data-reference-rows="1:10">top ten rows</span> make up about 60% of the total daily consumption in the entire dataset. The bottom of the table is a different universe. <span className="data-ref" data-reference-cell="178,2">Niue</span> consumes just <span className="data-ref" data-reference-cell="178,3">51 barrels</span> a day, and <span className="data-ref" data-reference-cell="171,2">Saint Helena</span> uses <span className="data-ref" data-reference-cell="171,3">70</span>. Because the shares are rounded to whole percentages, the <span className="data-ref" data-reference-columns="4:4">world share column</span> loses nearly all its resolution in the tail: 147 of the 181 rows show <span className="data-ref" data-reference-cell="181,4">0%</span>, including the last row, so small consumers are effectively indistinguishable in that column and are better compared using the raw barrel counts.
                </ArticleParagraph>

                <ArticleParagraph>
                    Total consumption mostly reflects population, so the per-person figures in <span className="data-ref" data-reference-columns="5:5">the yearly gallons column</span> tell a more interesting story. The <span className="data-ref" data-reference-cell="1,2">United States</span> uses <span className="data-ref" data-reference-cell="1,5">934.3 gallons</span> per person each year, but <span className="data-ref" data-reference-cell="2,2">China</span> uses only <span className="data-ref" data-reference-cell="2,5">138.7</span> and <span className="data-ref" data-reference-cell="3,2">India</span> just <span className="data-ref" data-reference-cell="3,5">51.4</span>, which shows that the two largest consumers by volume are not the heaviest users per head. The top of that ranking belongs to <span className="data-ref" data-reference-cell="16,2">Singapore</span>, at an extraordinary <span className="data-ref" data-reference-cell="16,5">3,679.5 gallons</span>, more than double the next-highest entries: the tiny territory <span className="data-ref" data-reference-cell="179,2">Saint Pierre &amp; Miquelon</span> at <span className="data-ref" data-reference-cell="179,5">1,705.1</span>, <span className="data-ref" data-reference-cell="107,2">Malta</span> at <span className="data-ref" data-reference-cell="107,5">1,652.2</span>, and <span className="data-ref" data-reference-cell="6,2">Saudi Arabia</span> at <span className="data-ref" data-reference-cell="6,5">1,560.2</span>. Such figures are likely inflated by shipping, refining, aviation bunkering, and other activity that is not personal driving, so they should be read as national intensity rather than what an individual buys at the pump. At the opposite extreme, <span className="data-ref" data-reference-cell="165,2">Burundi</span> registers only <span className="data-ref" data-reference-cell="165,5">2.2 gallons</span> per person, a gap of more than a thousandfold from Singapore.
                </ArticleParagraph>

                <ArticleParagraph>
                    Pump prices are recorded three ways: <span className="data-ref" data-reference-columns="6:8">in dollars per gallon, dollars per liter, and Pakistani rupees per liter</span>. The middle of the distribution sits near <span className="data-ref" data-reference-columns="6:6">$5 per gallon</span>; by my calculation the median is $5.28 and the mean about $5.70, with a long tail of expensive outliers pulling the average upward. The <span className="data-ref" data-reference-cell="1,2">United States</span> is close to the middle at <span className="data-ref" data-reference-cell="1,6">$5.19</span>, and <span className="data-ref" data-reference-cell="3,2">India</span> is slightly lower at <span className="data-ref" data-reference-cell="3,6">$5.05</span>. Europe is markedly more expensive. <span className="data-ref" data-reference-cell="10,2">Germany</span> charges <span className="data-ref" data-reference-cell="10,6">$7.65</span> per gallon, <span className="data-ref" data-reference-cell="13,2">France</span> <span className="data-ref" data-reference-cell="13,6">$8.27</span>, and the <span className="data-ref" data-reference-cell="15,2">United Kingdom</span> <span className="data-ref" data-reference-cell="15,6">$8.38</span>, while the <span className="data-ref" data-reference-cell="23,2">Netherlands</span> reaches <span className="data-ref" data-reference-cell="23,6">$9.33</span>. Nordic countries push higher still, with <span className="data-ref" data-reference-cell="59,2">Norway</span> at <span className="data-ref" data-reference-cell="59,6">$10.22</span> and <span className="data-ref" data-reference-cell="54,2">Denmark</span> at <span className="data-ref" data-reference-cell="54,6">$10.04</span>. The most expensive large economy in this group is <span className="data-ref" data-reference-cell="41,2">Hong Kong</span>, at <span className="data-ref" data-reference-cell="41,6">$11.35</span>. The same prices can be restated per liter: Germany's gallon price converts to <span className="data-ref" data-reference-cell="10,7">$2.02 per liter</span>, and in rupee terms to <span className="data-ref" data-reference-cell="10,8">427.44 PKR</span>, which suggests the dataset was built with a Pakistani audience in mind.
                </ArticleParagraph>

                <ArticleParagraph>
                    That perspective makes the <span className="data-ref" data-reference-cell="33,2">Pakistan</span> row a useful benchmark. Pakistan pays <span className="data-ref" data-reference-cell="33,6">$3.90 per gallon</span>, or <span className="data-ref" data-reference-cell="33,7">$1.03 per liter</span> and <span className="data-ref" data-reference-cell="33,8">217.85 PKR</span>, well below Western Europe but far above the cheapest countries. Those cheapest countries are the most striking feature of the price columns. <span className="data-ref" data-reference-cell="31,2">Venezuela</span> sells petrol for just <span className="data-ref" data-reference-cell="31,6">$0.08 per gallon</span>, or <span className="data-ref" data-reference-cell="31,8">4.65 PKR</span> per liter. <span className="data-ref" data-reference-cell="50,2">Libya</span> is nearly as cheap at <span className="data-ref" data-reference-cell="50,6">$0.12</span>, followed by <span className="data-ref" data-reference-cell="12,2">Iran</span> at <span className="data-ref" data-reference-cell="12,6">$0.20</span>, which is only <span className="data-ref" data-reference-cell="12,8">11.21 PKR</span> per liter, and <span className="data-ref" data-reference-cell="126,2">Brunei</span> at <span className="data-ref" data-reference-cell="126,6">$0.83</span>. Only these four rows fall under one dollar per gallon. All are oil producers with heavily subsidized domestic fuel, a pattern that continues just above the threshold with <span className="data-ref" data-reference-cell="38,2">Kuwait</span> at <span className="data-ref" data-reference-cell="38,6">$1.29</span> and <span className="data-ref" data-reference-cell="35,2">Nigeria</span> at <span className="data-ref" data-reference-cell="35,6">$1.57</span>. Cheap fuel does not always mean heavy use, however: Nigeria's <span className="data-ref" data-reference-cell="35,5">35.3 gallons</span> per person is low, while Iran's <span className="data-ref" data-reference-cell="12,5">347.6</span> is close to Russia's <span className="data-ref" data-reference-cell="5,5">383.2</span> despite a fraction of the price.
                </ArticleParagraph>

                <ArticleParagraph>
                    At the other end, one row stands so far outside the pattern that it deserves scrutiny. <span className="data-ref" data-reference-cell="148,2">North Korea</span> is listed at <span className="data-ref" data-reference-cell="148,6">$54.89 per gallon</span>, <span className="data-ref" data-reference-cell="148,7">$14.50 per liter</span>, and <span className="data-ref" data-reference-cell="148,8">3,066.75 PKR</span>, more than three times the next-highest price. The country has very low consumption (<span className="data-ref" data-reference-cell="148,3">18,000 barrels</span> per day and <span className="data-ref" data-reference-cell="148,5">10.9 gallons</span> per person) and a tiny income of <span className="data-ref" data-reference-cell="148,9">$1,300</span>, so this figure probably reflects a scarce, tightly controlled market rather than a price ordinary residents pay. Even ignoring it, the expensive tail includes small islands: <span className="data-ref" data-reference-cell="181,2">Tonga</span> at <span className="data-ref" data-reference-cell="181,6">$16.20</span> and <span className="data-ref" data-reference-cell="178,2">Niue</span> at <span className="data-ref" data-reference-cell="178,6">$11.43</span>, both probably driven by the cost of shipping fuel to remote locations. Equally notable is the <span className="data-ref" data-reference-cell="175,2">Central African Republic</span>, where petrol costs <span className="data-ref" data-reference-cell="175,6">$9.06</span> per gallon in a country with an income of only <span className="data-ref" data-reference-cell="175,9">$477</span> per person, an outcome of landlocked logistics and limited supply.
                </ArticleParagraph>

                <ArticleParagraph>
                    Income is where prices turn into hardship. The <span className="data-ref" data-reference-columns="9:9">GDP per capita column</span> ranges from <span className="data-ref" data-reference-cell="93,9">$115,874</span> in <span className="data-ref" data-reference-cell="93,2">Luxembourg</span> and <span className="data-ref" data-reference-cell="51,9">$87,097</span> in <span className="data-ref" data-reference-cell="51,2">Switzerland</span> down to just <span className="data-ref" data-reference-cell="165,9">$274</span> in Burundi. The dataset converts this into two affordability measures, <span className="data-ref" data-reference-columns="10:11">the last two columns</span>, which show how many gallons a year's average income would buy and how many multiples of the country's yearly per-person consumption that represents. For the <span className="data-ref" data-reference-cell="1,2">United States</span>, income buys <span className="data-ref" data-reference-cell="1,10">12,218 gallons</span>, or <span className="data-ref" data-reference-cell="1,11">13 times</span> the average annual consumption. The champion is <span className="data-ref" data-reference-cell="31,2">Venezuela</span>: its income buys <span className="data-ref" data-reference-cell="31,10">200,700 gallons</span>, or <span className="data-ref" data-reference-cell="31,11">654 times</span> its yearly usage, because of that near-zero price. <span className="data-ref" data-reference-cell="126,2">Brunei</span> (<span className="data-ref" data-reference-cell="126,10">33,064</span>), <span className="data-ref" data-reference-cell="50,2">Libya</span> (<span className="data-ref" data-reference-cell="50,10">30,825</span>), and <span className="data-ref" data-reference-cell="52,2">Qatar</span> (<span className="data-ref" data-reference-cell="52,10">22,993</span>) also stand out. The weakest positions belong to <span className="data-ref" data-reference-cell="148,2">North Korea</span> at <span className="data-ref" data-reference-cell="148,10">24 gallons</span>, the <span className="data-ref" data-reference-cell="175,2">Central African Republic</span> at <span className="data-ref" data-reference-cell="175,10">53</span>, and <span className="data-ref" data-reference-cell="165,2">Burundi</span> at <span className="data-ref" data-reference-cell="165,10">54</span>, where a full year of average income buys only a few dozen gallons.
                </ArticleParagraph>

                <ArticleParagraph>
                    The final affordability column is subtler and needs careful reading, since it depends on both income and habits. <span className="data-ref" data-reference-cell="51,2">Switzerland</span> scores <span className="data-ref" data-reference-cell="51,11">25</span> despite a high price of <span className="data-ref" data-reference-cell="51,6">$8.27</span>, because its wealth is enormous relative to its consumption, whereas <span className="data-ref" data-reference-cell="93,2">Luxembourg</span>, with the highest income, scores only <span className="data-ref" data-reference-cell="93,11">10</span> because its <span className="data-ref" data-reference-cell="93,5">1,487.2 gallons</span> per person are so high. The lowest scores occur where consumption is high relative to income: <span className="data-ref" data-reference-cell="16,2">Singapore</span> and <span className="data-ref" data-reference-cell="67,2">Lebanon</span> both show <span className="data-ref" data-reference-cell="16,11">2</span> and <span className="data-ref" data-reference-cell="67,11">2</span>, and <span className="data-ref" data-reference-cell="164,2">Seychelles</span> hits the floor at <span className="data-ref" data-reference-cell="164,11">1</span>. Two caveats apply. First, GDP per capita is an average and hides inequality, so real hardship is greater than the figures suggest for poorer households. Second, income and consumption are only loosely tied to price; by my calculation, GDP per capita correlates fairly strongly with gallons per person (about 0.62) but only weakly with price per gallon (about 0.18). In other words, the wealthy burn more fuel but do not necessarily pay more for it. Taken as a whole, the table shows that petrol is a story of extremes: consumption concentrated in a handful of giants, prices set as much by subsidy and geography as by markets, and affordability that varies by a factor of several thousand between the richest and poorest rows.
                </ArticleParagraph>
            </div>

            { backToArticle && articleReference && (
                <button
                    className="back-to-article"
                    style={{ left: backToArticle.x, top: backToArticle.y }}
                    onMouseEnter={ () => setBackToArticle(backToArticle) }
                    onClick={ () =>
                    {
                        articleReference.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        });

                        // Clear the highlights first: as the page scrolls back up, the table
                        // slides under the cursor and would re-trigger the hover handler on
                        // any still-highlighted cell, bringing the button right back.
                        clearReferenceHighlights();
                        setBackToArticle(null);
                        setArticleReference(null);
                    }}
                >
                    Back to Article
                </button>
            )}
        </>
    )
}

export default Article;