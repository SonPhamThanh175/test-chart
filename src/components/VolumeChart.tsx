"use client";
import React, { useEffect, useRef } from "react";
import { createChart, IChartApi, UTCTimestamp, HistogramSeries } from "lightweight-charts";
import { GetCandles } from "../api/api";
import { useTheme } from "@/context/ThemeContext";

interface VolumeChartProps {
  currentCoin: string;
  timeFrame: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ currentCoin, timeFrame }) => {
  const { theme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const volumeSeriesRef = useRef<HistogramSeries | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      layout: {
        background: { color: theme === "dark" ? "#121212" : "#fff" },
        textColor: theme === "dark" ? "#fff" : "#000",
      },
      grid: {
        vertLines: { color: theme === "dark" ? "#444" : "#e0e0e0" },
        horzLines: { color: theme === "dark" ? "#444" : "#e0e0e0" },
      },
      rightPriceScale: {
        borderColor: theme === "dark" ? "#444" : "#e0e0e0",
        scaleMargins: { top: 0.2, bottom: 0.2 },
        title: "Volume", 
      },
    });

    const volumeSeries = chart.addHistogramSeries({
      color: theme === "dark" ? "#26a69a" : "#00796b",
      priceFormat: { type: "volume" },
      priceScaleId: "right",
    });

    volumeSeriesRef.current = volumeSeries;
    chartRef.current = chart;

    const fetchData = async () => {
      const candles = await GetCandles(timeFrame, currentCoin);
      const formattedVolumes = candles.map((candle) => ({
        time: (candle.openTime / 1000) as UTCTimestamp,
        value: candle.volume,
        color: candle.close > candle.open
          ? theme === "dark" ? "#26a69a" : "#00796b"
          : theme === "dark" ? "#ef5350" : "#d32f2f",
      }));

      volumeSeries.setData(formattedVolumes);
    };

    fetchData();

    const interval = setInterval(async () => {
      const candles = await GetCandles(timeFrame, currentCoin);
      const latestCandle = candles[candles.length - 1];

      if (latestCandle) {
        volumeSeries.update({
          time: (latestCandle.openTime / 1000) as UTCTimestamp,
          value: latestCandle.volume,
          color: latestCandle.close > latestCandle.open
            ? theme === "dark" ? "#26a69a" : "#00796b"
            : theme === "dark" ? "#ef5350" : "#d32f2f",
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, [currentCoin, timeFrame, theme]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px", marginTop: "50px" }} />;
};

export default VolumeChart;
