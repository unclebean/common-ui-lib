import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface AssetHolding {
  id: string;
  symbol: string;
  name: string;
  category: "Equity" | "Crypto" | "ETF" | "Bond" | "Cash";
  price: number;
  change24h: number;
  quantity: number;
  valuation: number;
  allocationPercent: number;
}

export const sampleHoldings: AssetHolding[] = [
  {
    id: "1",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    category: "Equity",
    price: 128.45,
    change24h: 3.42,
    quantity: 220,
    valuation: 28259.0,
    allocationPercent: 20.8,
  },
  {
    id: "2",
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "Equity",
    price: 224.23,
    change24h: 1.15,
    quantity: 120,
    valuation: 26907.6,
    allocationPercent: 19.8,
  },
  {
    id: "3",
    symbol: "BTC",
    name: "Bitcoin",
    category: "Crypto",
    price: 64120.0,
    change24h: -1.84,
    quantity: 0.24,
    valuation: 15388.8,
    allocationPercent: 11.3,
  },
  {
    id: "4",
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    category: "ETF",
    price: 512.6,
    change24h: 0.74,
    quantity: 48,
    valuation: 24604.8,
    allocationPercent: 18.1,
  },
  {
    id: "5",
    symbol: "BND",
    name: "Vanguard Total Bond Market",
    category: "Bond",
    price: 73.12,
    change24h: -0.22,
    quantity: 410,
    valuation: 29979.2,
    allocationPercent: 22.1,
  },
  {
    id: "6",
    symbol: "USD",
    name: "US Dollar Cash Reserves",
    category: "Cash",
    price: 1.0,
    change24h: 0.0,
    quantity: 10460.6,
    valuation: 10460.6,
    allocationPercent: 7.9,
  },
];

export const assetColumns: ColumnDef<AssetHolding>[] = [
  {
    accessorKey: "symbol",
    header: "Asset",
    cell: ({ row }) => {
      const holding = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {holding.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="font-semibold leading-tight">{holding.symbol}</div>
            <div className="text-xs text-muted-foreground">{holding.name}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-[11px] font-normal">
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div className="font-mono text-sm font-medium">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "change24h",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        24h Change
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const change = parseFloat(row.getValue("change24h"));
      const isPositive = change > 0;
      const isNeutral = change === 0;

      return (
        <Badge
          variant={isPositive ? "bullish" : isNeutral ? "secondary" : "bearish"}
          className="gap-1 font-mono text-xs"
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : isNeutral ? null : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "valuation",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Valuation
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const val = parseFloat(row.getValue("valuation"));
      return (
        <div className="font-mono font-semibold">
          ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "allocationPercent",
    header: "Weight",
    cell: ({ row }) => {
      const weight = parseFloat(row.getValue("allocationPercent"));
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.min(weight * 3, 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{weight}%</span>
        </div>
      );
    },
  },
];

export function AssetHoldingsTable({
  data = sampleHoldings,
  className,
}: {
  data?: AssetHolding[];
  className?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "valuation", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns: assetColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Asset Holdings</CardTitle>
            <CardDescription>Live breakdown of all portfolio assets and positions</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {data.length} Assets
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={assetColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No asset holdings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
