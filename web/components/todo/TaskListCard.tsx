"use client";

import { CheckCircle2, Circle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "@/Types/task_types";

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp) * 1000;
  if (!Number.isFinite(ms)) return "-";
  return new Date(ms).toLocaleString();
}

type Props = {
  connected: boolean;
  pageLoading: boolean;
  actionLoading: string | null;
  tasks: Task[];
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
};

export function TaskListCard({
  connected,
  pageLoading,
  actionLoading,
  tasks,
  onToggle,
  onDelete,
}: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/80">
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>
          Tasks are loaded from the connected wallet address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/80 p-10 text-center">
            <p className="text-lg font-medium">Connect your wallet first</p>
            <p className="mt-2 text-sm text-slate-400">
              Once connected, you can read your tasks and send contract
              transactions.
            </p>
          </div>
        ) : pageLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-2/3 bg-slate-800" />
                    <Skeleton className="h-4 w-1/3 bg-slate-800" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-xl bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 text-white bg-slate-950/80 p-10 text-center">
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Create your first on-chain task from the panel on the left.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[640px] pr-4">
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const toggling = actionLoading === `toggle-${index}`;
                const deleting = actionLoading === `delete-${index}`;

                return (
                  <div
                    key={`${task.content}-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-500" />
                          )}

                          <h3
                            className={`text-base font-medium ${
                              task.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-50"
                            }`}
                          >
                            {task.content}
                          </h3>

                          <Badge
                            className={
                              task.completed
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-amber-500/10 text-amber-300"
                            }
                          >
                            {task.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>

                        <div className="pl-8 text-xs text-slate-400">
                          Task #{index} · Created at{" "}
                          {formatDate(task.createdAt)}
                        </div>
                      </div>

                      <div className="flex gap-2 pl-8 md:pl-0">
                        <Button
                          variant="outline"
                          onClick={() => onToggle(index)}
                          disabled={!!actionLoading}
                          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          {toggling ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : task.completed ? (
                            "Reopen"
                          ) : (
                            "Complete"
                          )}
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => onDelete(index)}
                          disabled={!!actionLoading}
                          className="gap-2"
                        >
                          {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
