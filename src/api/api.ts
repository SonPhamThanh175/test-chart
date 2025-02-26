import axios from "axios";

export type ICandleStick = {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  baseAssetVolume: number;
  numberOfTrades: number;
  takerBuyVolume: number;
  takerBuyBaseAssetVolume: number;
  ignore: number;
};

/**
 * Lấy dữ liệu nến từ Binance API
 */
export const GetCandles = async (
  currentTimeFrame: string,
  currentCoin: string
): Promise<ICandleStick[]> => {
  try {
    const response = await axios.get<
      [number, string, string, string, string, string, number, string, number, string, string, string][]
    >(
      `https://api.binance.com/api/v3/klines?symbol=${currentCoin}&interval=${currentTimeFrame}&limit=100`
    );

    return response.data.map((item) => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
      closeTime: item[6],
      baseAssetVolume: parseFloat(item[7]),
      numberOfTrades: item[8],
      takerBuyVolume: parseFloat(item[9]),
      takerBuyBaseAssetVolume: parseFloat(item[10]),
      ignore: parseFloat(item[11]),
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu nến:", error);
    return [];
  }
};
