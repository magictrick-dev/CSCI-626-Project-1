export type DataReference = {
    rows?: string;
    columns?: string;
    cell?: string;
};

export type DataRefHover = {
    reference: DataReference;
    x: number;
    y: number;
};

export default function DataRefTooltip(): null {
    return null;
}
