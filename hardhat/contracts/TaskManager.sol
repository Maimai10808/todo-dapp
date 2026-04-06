// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TaskManager {
    struct Task {
        string content;
        bool completed;
        uint256 createdAt;
    }

    mapping(address => Task[]) private userTasks;

    event TaskCreated(
        address indexed user,
        uint256 indexed taskIndex,
        string content,
        uint256 createdAt
    );

    event TaskToggled(
        address indexed user,
        uint256 indexed taskIndex,
        bool completed
    );

    event TaskDeleted(address indexed user, uint256 indexed taskIndex);

    modifier validTaskIndex(uint256 taskIndex) {
        require(taskIndex < userTasks[msg.sender].length, "Invalid task index");
        _;
    }

    function createTask(string calldata content) external {
        require(bytes(content).length > 0, "Task content cannot be empty");

        uint256 createdAt = block.timestamp;
        uint256 taskIndex = userTasks[msg.sender].length;

        userTasks[msg.sender].push(
            Task({content: content, completed: false, createdAt: createdAt})
        );

        emit TaskCreated(msg.sender, taskIndex, content, createdAt);
    }

    function getMyTasks() external view returns (Task[] memory) {
        return userTasks[msg.sender];
    }

    function toggleTask(uint256 taskIndex) external validTaskIndex(taskIndex) {
        Task storage task = userTasks[msg.sender][taskIndex];
        task.completed = !task.completed;

        emit TaskToggled(msg.sender, taskIndex, task.completed);
    }

    function deleteTask(uint256 taskIndex) external validTaskIndex(taskIndex) {
        uint256 lastIndex = userTasks[msg.sender].length - 1;

        if (taskIndex != lastIndex) {
            userTasks[msg.sender][taskIndex] = userTasks[msg.sender][lastIndex];
        }

        userTasks[msg.sender].pop();

        emit TaskDeleted(msg.sender, taskIndex);
    }
}
