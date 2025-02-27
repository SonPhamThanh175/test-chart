"use client";
import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, UTCTimestamp, ISeriesApi } from "lightweight-charts";
import { GetCandles } from "../api/api";
import { useTheme } from "@/context/ThemeContext";

interface CandlestickChartProps {
  currentCoin: string;
  timeFrame: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ currentCoin, timeFrame }) => {
  const { theme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: theme === "dark" ? "#121212" : "#fff" },
        textColor: theme === "dark" ? "#fff" : "#000",
      },
      grid: {
        vertLines: { color: theme === "dark" ? "#444" : "#e0e0e0" },
        horzLines: { color: theme === "dark" ? "#444" : "#e0e0e0" },
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeriesRef.current = candleSeries;
    chartRef.current = chart;

    const fetchData = async () => {
      const candles = await GetCandles(timeFrame, currentCoin);
      const formattedCandles = candles.map((candle) => ({
        time: (candle.openTime / 1000) as UTCTimestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candleSeries.setData(formattedCandles);
    };

    fetchData();

    const interval = setInterval(async () => {
      const candles = await GetCandles(timeFrame, currentCoin);
      const latestCandle = candles[candles.length - 1];

      if (latestCandle) {
        candleSeries.update({
          time: (latestCandle.openTime / 1000) as UTCTimestamp,
          open: latestCandle.open,
          high: latestCandle.high,
          low: latestCandle.low,
          close: latestCandle.close,
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, [currentCoin, timeFrame, theme]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
};

export default CandlestickChart;
