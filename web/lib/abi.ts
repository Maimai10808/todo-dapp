export const TASK_MANAGER_ABI = [
  {
    type: "function",
    name: "createTask",
    stateMutability: "nonpayable",
    inputs: [{ name: "content", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getMyTasks",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "content", type: "string" },
          { name: "completed", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "toggleTask",
    stateMutability: "nonpayable",
    inputs: [{ name: "taskIndex", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "deleteTask",
    stateMutability: "nonpayable",
    inputs: [{ name: "taskIndex", type: "uint256" }],
    outputs: [],
  },
] as const;
