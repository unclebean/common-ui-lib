import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./select";
import { Label } from "./label";

const meta: Meta = {
  title: "04. Forms & Controls/Select",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-xs space-y-2">
      <Label>Settlement Currency</Label>
      <Select defaultValue="usd">
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
          <SelectItem value="eur">EUR - Euro (€)</SelectItem>
          <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
          <SelectItem value="jpy">JPY - Japanese Yen (¥)</SelectItem>
          <SelectItem value="chf">CHF - Swiss Franc (Fr)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Grouped: StoryObj = {
  render: () => (
    <div className="p-8 max-w-sm space-y-2">
      <Label>Trading Pair</Label>
      <Select defaultValue="nvda">
        <SelectTrigger>
          <SelectValue placeholder="Select market" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>US Equities</SelectLabel>
            <SelectItem value="nvda">NVDA - NVIDIA Corp</SelectItem>
            <SelectItem value="aapl">AAPL - Apple Inc</SelectItem>
            <SelectItem value="msft">MSFT - Microsoft</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Crypto Pairs</SelectLabel>
            <SelectItem value="btc">BTC/USD - Bitcoin</SelectItem>
            <SelectItem value="eth">ETH/USD - Ethereum</SelectItem>
            <SelectItem value="sol">SOL/USD - Solana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
