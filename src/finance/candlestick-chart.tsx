import * as React from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  Time,
} from "lightweight-charts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, TrendingUp, TrendingDown } from "lucide-react";

export interface CandleData {
  time: string; // YYYY-MM-DD or Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandlestickChartProps {
  data?: CandleData[];
  symbol?: string;
  subtitle?: string;
  interval?: string;
  intervals?: string[];
  onIntervalChange?: (interval: string) => void;
  showVolume?: boolean;
  height?: number;
  className?: string;
  bullishColor?: string;
  bearishColor?: string;
}

// Generate realistic 90-day crypto/stock candlestick sample data
export function generateSampleCandles(count = 90, basePrice = 62000): CandleData[] {
  const candles: CandleData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    // Volatility between -2.5% and +2.8%
    const changePercent = (Math.random() - 0.48) * 0.045;
    const open = Math.round(currentPrice * 100) / 100;
    const close = Math.round(open * (1 + changePercent) * 100) / 100;
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.015) * 100) / 100;
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.015) * 100) / 100;
    const volume = Math.round((Math.random() * 800 + 200) * 10) / 10;

    candles.push({
      time: dateStr,
      open,
      high,
      low,
      close,
      volume,
    });

    currentPrice = close;
  }

  return candles;
}

export const sampleCandleData = generateSampleCandles();

export function CandlestickChart({
  data = sampleCandleData,
  symbol = "BTC / USDT",
  subtitle = "Bitcoin / TetherUS Spot",
  interval = "15m",
  intervals = ["1m", "5m", "15m", "1H", "4H", "1D"],
  onIntervalChange,
  showVolume = true,
  height = 360,
  className,
  bullishColor = "#10b981",
  bearishColor = "#ef4444",
}: CandlestickChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<IChartApi | null>(null);
  const candleSeriesRef = React.useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = React.useRef<ISeriesApi<"Histogram"> | null>(null);

  const [activeInterval, setActiveInterval] = React.useState(interval);
  const [hoveredCandle, setHoveredCandle] = React.useState<CandleData | null>(null);
  const [isDark, setIsDark] = React.useState(false);

  // Latest stats
  const latestCandle = data[data.length - 1];
  const previousCandle = data[data.length - 2] || latestCandle;
  const currentPrice = hoveredCandle ? hoveredCandle.close : latestCandle?.close || 0;
  const priceChange = latestCandle && previousCandle ? latestCandle.close - previousCandle.close : 0;
  const priceChangePercent =
    previousCandle?.close ? (priceChange / previousCandle.close) * 100 : 0;
  const isBullish = priceChange >= 0;

  // Observe theme (dark / light)
  React.useEffect(() => {
    const checkDark = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark");
      setIsDark(dark);
    };

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Initialize and update Lightweight Chart
  React.useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous chart instance
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const themeColors = isDark
      ? {
          bg: "transparent",
          text: "#94a3b8",
          grid: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
          crosshair: "rgba(148, 163, 184, 0.5)",
        }
      : {
          bg: "transparent",
          text: "#64748b",
          grid: "rgba(0, 0, 0, 0.05)",
          border: "rgba(0, 0, 0, 0.1)",
          crosshair: "rgba(100, 116, 139, 0.5)",
        };

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth || 600,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: themeColors.bg },
        textColor: themeColors.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: themeColors.grid },
        horzLines: { color: themeColors.grid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: themeColors.crosshair,
          width: 1,
          style: 3, // dashed
          labelBackgroundColor: isDark ? "#1e293b" : "#e2e8f0",
        },
        horzLine: {
          color: themeColors.crosshair,
          width: 1,
          style: 3,
          labelBackgroundColor: isDark ? "#1e293b" : "#e2e8f0",
        },
      },
      rightPriceScale: {
        borderColor: themeColors.border,
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.22 : 0.1,
        },
      },
      timeScale: {
        borderColor: themeColors.border,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: bullishColor,
      downColor: bearishColor,
      borderVisible: false,
      wickUpColor: bullishColor,
      wickDownColor: bearishColor,
    });
    candleSeries.setData(data as any);
    candleSeriesRef.current = candleSeries;

    // Add Volume Histogram Series if enabled
    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "#64748b",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // Overlay on chart
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0,
        },
      });

      const volumeData = data.map((d) => ({
        time: d.time as unknown as Time,
        value: d.volume || (d.high - d.low) * 100,
        color:
          d.close >= d.open
            ? "rgba(16, 185, 129, 0.4)" // Soft bullish green
            : "rgba(239, 68, 68, 0.4)", // Soft bearish red
      }));

      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // Crosshair hover listener for OHLC legend
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setHoveredCandle(null);
        return;
      }
      const dataPoint = param.seriesData.get(candleSeries) as any;
      if (dataPoint) {
        setHoveredCandle({
          time: String(param.time),
          open: dataPoint.open,
          high: dataPoint.high,
          low: dataPoint.low,
          close: dataPoint.close,
        });
      } else {
        setHoveredCandle(null);
      }
    });

    // Auto fit content
    chart.timeScale().fitContent();

    // ResizeObserver for responsive width
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !chartRef.current || !containerRef.current) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        chartRef.current.applyOptions({ width });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, isDark, height, showVolume, bullishColor, bearishColor]);

  const handleIntervalClick = (val: string) => {
    setActiveInterval(val);
    if (onIntervalChange) {
      onIntervalChange(val);
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  return (
    <Card className={cn("w-full min-w-0 overflow-hidden flex flex-col", className)}>
      {/* Chart Top Header Toolbar */}
      <CardHeader className="p-3 sm:p-4 pb-2 border-b border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Symbol & Live Price */}
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight font-mono">
                  {symbol}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-1.5 py-0 font-mono font-medium gap-1",
                    isBullish
                      ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                      : "border-rose-500/30 text-rose-500 bg-rose-500/10"
                  )}
                >
                  {isBullish ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {isBullish ? "+" : ""}
                  {priceChangePercent.toFixed(2)}%
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
            </div>

            <div className="hidden sm:block pl-3 border-l border-border/60">
              <div className="text-xl font-bold font-mono tracking-tight">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-muted-foreground">
                24h Vol: <span className="font-mono text-foreground font-medium">38,492.10 BTC</span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector & Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60 text-xs">
              {intervals.map((int) => (
                <button
                  key={int}
                  onClick={() => handleIntervalClick(int)}
                  className={cn(
                    "px-2 py-1 rounded-md font-medium text-[11px] transition-all",
                    activeInterval === int
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {int}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleResetZoom}
              title="Reset Zoom / Fit View"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Dynamic OHLC Bar Legend (Crosshair Info) */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground pt-1 overflow-x-auto whitespace-nowrap">
          <span>
            O:{" "}
            <strong className="text-foreground">
              {(hoveredCandle || latestCandle)?.open.toFixed(2)}
            </strong>
          </span>
          <span>
            H:{" "}
            <strong className="text-foreground">
              {(hoveredCandle || latestCandle)?.high.toFixed(2)}
            </strong>
          </span>
          <span>
            L:{" "}
            <strong className="text-foreground">
              {(hoveredCandle || latestCandle)?.low.toFixed(2)}
            </strong>
          </span>
          <span>
            C:{" "}
            <strong
              className={
                (hoveredCandle || latestCandle) &&
                (hoveredCandle || latestCandle)!.close >= (hoveredCandle || latestCandle)!.open
                  ? "text-emerald-500"
                  : "text-rose-500"
              }
            >
              {(hoveredCandle || latestCandle)?.close.toFixed(2)}
            </strong>
          </span>
          <span className="hidden sm:inline text-[10px] text-muted-foreground/80">
            Powered by TradingView Lightweight Charts
          </span>
        </div>
      </CardHeader>

      {/* Chart Canvas Mount Point */}
      <CardContent className="p-0 flex-1 relative w-full min-w-0">
        <div ref={containerRef} className="w-full min-w-0" style={{ height }} />
      </CardContent>
    </Card>
  );
}
