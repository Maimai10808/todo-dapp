"use client";

import { CHAIN_ID, NETWORK_NAME, TASK_MANAGER_ADDRESS } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

export function OverviewCard({
  totalTasks,
  completedTasks,
  pendingTasks,
}: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/80">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>
          Quick stats for the currently connected wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="text-slate-400">Total</div>
            <div className="mt-1 text-xl font-semibold text-red-400">
              {totalTasks}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="text-slate-400">Done</div>
            <div className="mt-1 text-xl font-semibold text-emerald-400">
              {completedTasks}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="text-slate-400">Open</div>
            <div className="mt-1 text-xl font-semibold text-amber-400">
              {pendingTasks}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Network</span>
            <Badge variant="secondary">{NETWORK_NAME}</Badge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Chain ID</span>
            <span className="text-white">{CHAIN_ID}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-slate-400">Contract</span>
            <code className="max-w-[180px] break-all rounded bg-white px-2 py-1 text-xs">
              {TASK_MANAGER_ADDRESS}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
