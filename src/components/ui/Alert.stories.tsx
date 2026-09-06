import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "05. Overlays & Navigation/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "bullish", "bearish"],
    },
  },
};

export default meta;

export const AllVariants: StoryObj = {
  render: () => (
    <div className="p-8 max-w-lg space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Scheduled Maintenance</AlertTitle>
        <AlertDescription>
          Clearinghouse batch settlement starts at 04:00 UTC. Orders during this window are queued.
        </AlertDescription>
      </Alert>

      <Alert variant="bullish">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Limit Order Filled</AlertTitle>
        <AlertDescription>
          Bought 2.5 BTC @ $63,800.00. Settled in Vault A.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Liquidation Warning</AlertTitle>
        <AlertDescription>
          Account margin coverage is below 110%. Please deposit additional collateral.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
