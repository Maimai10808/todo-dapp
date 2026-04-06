"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { TASK_MANAGER_ABI } from "@/lib/abi";
import { CHAIN_ID, TASK_MANAGER_ADDRESS } from "@/lib/config";
import type { Task, EthereumProvider } from "@/Types/task_types";

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useTaskManager() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  const connected = !!account;

  const totalTasks = tasks.length;
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );
  const pendingTasks = totalTasks - completedTasks;

  const getContract = useCallback(
    (
      signerOrProvider:
        | BrowserProvider
        | Awaited<ReturnType<BrowserProvider["getSigner"]>>,
    ) => {
      return new Contract(
        TASK_MANAGER_ADDRESS,
        TASK_MANAGER_ABI,
        signerOrProvider,
      );
    },
    [],
  );

  const ensureCorrectChain = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    const hexChainId = `0x${CHAIN_ID.toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: "Hardhat Local",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545"],
          },
        ],
      });
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    if (!provider || !account) return;

    try {
      setPageLoading(true);
      setError("");
      setStatus("Loading tasks...");

      const signer = await provider.getSigner();
      const readContract = getContract(signer);

      const rawTasks = (await readContract.getMyTasks()) as {
        content: string;
        completed: boolean;
        createdAt: bigint;
      }[];

      setTasks(
        rawTasks.map((item) => ({
          content: item.content,
          completed: item.completed,
          createdAt: BigInt(item.createdAt),
        })),
      );

      setStatus("Tasks loaded");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      setStatus("Load failed");
    } finally {
      setPageLoading(false);
    }
  }, [account, getContract, provider]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install MetaMask first.");
      return;
    }

    try {
      setError("");
      setStatus("Connecting wallet...");
      await ensureCorrectChain();

      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setContract(getContract(signer));
      setAccount(address);
      setStatus("Wallet connected");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
      setStatus("Connection failed");
    }
  }, [ensureCorrectChain, getContract]);

  const createTask = useCallback(async () => {
    if (!contract) return;
    if (!newTask.trim()) {
      setError("Task content cannot be empty.");
      return;
    }

    try {
      setError("");
      setActionLoading("create");
      setStatus("Waiting for wallet signature...");

      const tx = await contract.createTask(newTask.trim());

      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();

      setNewTask("");
      setStatus("Task created");
      await refreshTasks();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create task");
      setStatus("Create failed");
    } finally {
      setActionLoading(null);
    }
  }, [contract, newTask, refreshTasks]);

  const toggleTask = useCallback(
    async (taskIndex: number) => {
      if (!contract) return;

      try {
        setError("");
        setActionLoading(`toggle-${taskIndex}`);
        setStatus("Waiting for wallet signature...");

        const tx = await contract.toggleTask(taskIndex);

        setStatus("Transaction submitted. Waiting for confirmation...");
        await tx.wait();

        setStatus("Task updated");
        await refreshTasks();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to update task");
        setStatus("Update failed");
      } finally {
        setActionLoading(null);
      }
    },
    [contract, refreshTasks],
  );

  const deleteTask = useCallback(
    async (taskIndex: number) => {
      if (!contract) return;

      try {
        setError("");
        setActionLoading(`delete-${taskIndex}`);
        setStatus("Waiting for wallet signature...");

        const tx = await contract.deleteTask(taskIndex);

        setStatus("Transaction submitted. Waiting for confirmation...");
        await tx.wait();

        setStatus("Task deleted");
        await refreshTasks();
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to delete task");
        setStatus("Delete failed");
      } finally {
        setActionLoading(null);
      }
    },
    [contract, refreshTasks],
  );

  useEffect(() => {
    if (connected) {
      void refreshTasks();
    }
  }, [connected, refreshTasks]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => window.location.reload();
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.(
        "accountsChanged",
        handleAccountsChanged,
      );
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  return {
    account,
    tasks,
    newTask,
    setNewTask,
    pageLoading,
    actionLoading,
    status,
    error,
    connected,
    totalTasks,
    completedTasks,
    pendingTasks,
    connectWallet,
    refreshTasks,
    createTask,
    toggleTask,
    deleteTask,
  };
}
