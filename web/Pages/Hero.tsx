"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateTaskCard } from "@/components/todo/CreateTaskCard";
import { OverviewCard } from "@/components/todo/OverviewCard";
import { TaskListCard } from "@/components/todo/TaskListCard";
import { TodoHeader } from "@/components/todo/TodoHeader";
import { useTaskManager } from "@/hooks/useTaskManager";

export default function Hero() {
  const todo = useTaskManager();

  return (
    <main className="min-h-screen bg-gray-300 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <TodoHeader
          connected={todo.connected}
          account={todo.account}
          pageLoading={todo.pageLoading}
          onConnect={() => void todo.connectWallet()}
          onRefresh={() => void todo.refreshTasks()}
        />

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <CreateTaskCard
              newTask={todo.newTask}
              setNewTask={todo.setNewTask}
              connected={todo.connected}
              actionLoading={todo.actionLoading}
              onCreate={() => void todo.createTask()}
            />

            <OverviewCard
              totalTasks={todo.totalTasks}
              completedTasks={todo.completedTasks}
              pendingTasks={todo.pendingTasks}
            />

            {todo.error ? (
              <Alert className="border-red-900/60 bg-red-950/40 text-red-100">
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription className="break-all">
                  {todo.error}
                </AlertDescription>
              </Alert>
            ) : null}

            <Alert className="border-slate-800 bg-slate-900/80 text-slate-200">
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>{todo.status}</AlertDescription>
            </Alert>
          </div>

          <TaskListCard
            connected={todo.connected}
            pageLoading={todo.pageLoading}
            actionLoading={todo.actionLoading}
            tasks={todo.tasks}
            onToggle={(index) => void todo.toggleTask(index)}
            onDelete={(index) => void todo.deleteTask(index)}
          />
        </div>
      </div>
    </main>
  );
}
