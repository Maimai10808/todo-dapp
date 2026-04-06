"use client";

import { RefreshCw, Wallet } from "lucide-react";
import { NETWORK_NAME } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function shortAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type Props = {
  connected: boolean;
  account: string;
  pageLoading: boolean;
  onConnect: () => void;
  onRefresh: () => void;
};

export function TodoHeader({
  connected,
  account,
  pageLoading,
  onConnect,
  onRefresh,
}: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-2xl">
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-violet-500/40 bg-violet-500/10 text-violet-200"
          >
            Todo DApp · {NETWORK_NAME}
          </Badge>
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Chain-based Task Manager
          </CardTitle>
          <CardDescription className="max-w-2xl text-slate-400">
            A minimal Web3 Todo app built with Hardhat, ethers, Next.js and
            shadcn/ui. It trains wallet connection, contract reads, contract
            writes, loading states and transaction feedback.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={onConnect}
            className="gap-2 bg-violet-600 hover:bg-violet-500"
          >
            <Wallet className="h-4 w-4" />
            {connected ? shortAddress(account) : "Connect Wallet"}
          </Button>

          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={!connected || pageLoading}
            className="gap-2 border-slate-700  hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${pageLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
