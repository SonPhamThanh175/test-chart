"use client";
import React, { useState } from "react";
import { Button, Space } from "antd";
import { LineChartOutlined, BarChartOutlined } from "@ant-design/icons";
import VolumeChart from "./VolumeChart";
import { useTheme } from "@/context/ThemeContext";
import { GetCandles, ICandleStick } from "@/api/api";
import CandlestickChart from "./CandlestickChar";

interface BitcoinChartProps {
  currentCoin: string;
}

const BitcoinChart: React.FC<BitcoinChartProps> = ({ currentCoin }) => {
  const [selectedChart, setSelectedChart] = useState<"candlestick" | "volume">(
    "candlestick"
  );
  const { theme } = useTheme();
  const [timeFrame, setTimeFrame] = useState("1m");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  const fetchBitcoinPrices = async () => {
    const candles: ICandleStick[] = await GetCandles("1m", currentCoin);

    if (candles.length >= 2) {
      setPreviousPrice(candles[candles.length - 2].close);
      setCurrentPrice(candles[candles.length - 1].close);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1
        style={{
          color: theme === "dark" ? "#fff" : "#121212",
          fontWeight: "bold",
        }}
      >
        Bitcoin Chart
      </h1>

      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Nút đổi biểu đồ */}
        <Space size="small">
          <Button
            type="default"
            icon={<LineChartOutlined />}
            onClick={() => setSelectedChart("candlestick")}
            style={{
              background: selectedChart === "candlestick"
                ? theme === "dark" ? "#444" : "#ddd"
                : "transparent",
              color: theme === "dark" ? "#fff" : "#000",
              border: `1px solid ${theme === "dark" ? "#777" : "#ccc"}`,
              transition: "0.3s",
            }}
          />
          <Button
            type="default"
            icon={<BarChartOutlined />}
            onClick={() => setSelectedChart("volume")}
            style={{
              background: selectedChart === "volume"
                ? theme === "dark" ? "#444" : "#ddd"
                : "transparent",
              color: theme === "dark" ? "#fff" : "#000",
              border: `1px solid ${theme === "dark" ? "#777" : "#ccc"}`,
              transition: "0.3s",
            }}
          />
        </Space>

        {/* Chọn Time */}
        <div>
          <label
            style={{
              color: theme === "dark" ? "#fff" : "#121212",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          >
            Chọn Time:
          </label>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: `1px solid ${theme === "dark" ? "#444" : "#ccc"}`,
              backgroundColor: theme === "dark" ? "#222" : "#fff",
              color: theme === "dark" ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            <option value="1m">1 phút</option>
            <option value="5m">5 phút</option>
            <option value="15m">15 phút</option>
            <option value="1h">1 giờ</option>
            <option value="4h">4 giờ</option>
            <option value="1d">1 ngày</option>
          </select>
        </div>
      </div>

      {/* Biểu đồ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          border: theme === "dark" ? "1px solid white" : "1px solid black",
        }}
      >
        <div style={{ width: "1000px", height: "100%" }}>
          {selectedChart === "candlestick" ? (
            <CandlestickChart currentCoin={currentCoin} timeFrame={timeFrame} />
          ) : (
            <VolumeChart currentCoin={currentCoin} timeFrame={timeFrame} />
          )}
        </div>
      </div>

      {/* Nút lấy giá */}
      <Button
        type="primary"
        onClick={fetchBitcoinPrices}
        style={{
          marginTop: "20px",
          backgroundColor: theme === "dark" ? "#555" : "black",
          borderColor: theme === "dark" ? "#777" : "#007B9E",
          color: "#fff",
          padding: "8px 16px",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "6px black",
          transition: "0.3s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            theme === "dark" ? "black" : "#666")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            theme === "dark" ? "black" : "#555")
        }
      >
        Lấy giá Bitcoin hiện tại & 1 phút trước
      </Button>

      {/* Hiển thị giá */}
      {currentPrice !== null && previousPrice !== null && (
        <div
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: theme === "dark" ? "#fff" : "#121212",
          }}
        >
          <p>Giá hiện tại: ${currentPrice.toFixed(2)}</p>
          <p>Giá 1 phút trước: ${previousPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default BitcoinChart;
