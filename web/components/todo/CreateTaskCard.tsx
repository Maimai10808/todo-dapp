"use client";

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  newTask: string;
  setNewTask: (value: string) => void;
  connected: boolean;
  actionLoading: string | null;
  onCreate: () => void;
};

export function CreateTaskCard({
  newTask,
  setNewTask,
  connected,
  actionLoading,
  onCreate,
}: Props) {
  return (
    <Card className="border-slate-800 bg-slate-900/80">
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>
          Add a new task to your personal on-chain task list.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="e.g. Finish Web3 homework"
          disabled={!connected || actionLoading === "create"}
          className="border-slate-700 bg-slate-950 text-white"
        />

        <Button
          onClick={onCreate}
          disabled={!connected || !newTask.trim() || !!actionLoading}
          className="w-full gap-2 bg-violet-600 hover:bg-violet-500"
        >
          {actionLoading === "create" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Task
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
