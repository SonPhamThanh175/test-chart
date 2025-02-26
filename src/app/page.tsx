"use client";
import React, { useState } from "react";
import BitcoinChart from "@/components/BitcoinChart";

export default function Home() {


  return (
    <main>


      <BitcoinChart currentCoin="BTCUSDT"  />
    </main>
  );
}
