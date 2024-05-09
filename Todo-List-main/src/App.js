import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config';
import TodoList from './TodoList';

class App extends Component {
componentDidMount() {
    this.loadBlockchainData();
}

async loadBlockchainData() {
    if (window.ethereum) {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });

        const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
        this.setState({ todoList });
        await this.refreshTasks();
    } catch (error) {
        console.error("Failed to load blockchain data:", error);
        this.setState({ loading: false });
    }
    } else {
    console.error("Ethereum object doesn't exist!");
    }
}

constructor(props) {
    super(props);
    this.state = {
    account: '',
    taskCount: 0,
    tasks: [],
    loading: true
    };
}

refreshTasks = async () => {
    const taskCount = await this.state.todoList.methods.taskCount().call();
    const tasks = [];
    for (let i = 1; i <= taskCount; i++) {
    const task = await this.state.todoList.methods.tasks(i).call();
      if(task.exists) { // Assuming your smart contract returns an 'exists' property
        tasks.push({...task, id: task.id.toString()});
    }
    }
    this.setState({ tasks, loading: false });
}

createTask = async (content) => {
    this.setState({ loading: true });
    await this.state.todoList.methods.createTask(content).send({ from: this.state.account });
    await this.refreshTasks();
}

deleteTask = async (id) => {
    this.setState({ loading: true });
    await this.state.todoList.methods.deleteTask(id).send({ from: this.state.account });
    await this.refreshTasks();
}

toggleCompleted = async (taskId) => {
    this.setState({ loading: true });
    await this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account });
    await this.refreshTasks();
}

clearTasks = async () => {
    this.setState({ loading: true });
    await this.state.todoList.methods.clearTasks().send({ from: this.state.account });
    await this.refreshTasks();
}

render() {
    return (
    <div>
        <nav className="navbar">
        <span className="navbar-brand">Ethereum Blockchain | ToDo List</span>
        </nav>
        <div className="container-fluid">
        <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
            {this.state.loading
                ? <div id="loader" className="text-center"><p>Loading...</p></div>
                : <TodoList
                    tasks={this.state.tasks}
                    createTask={this.createTask}
                    toggleCompleted={this.toggleCompleted}
                    deleteTask={this.deleteTask}
                    clearTasks={this.clearTasks}/>
            }
            </main>
        </div>
        </div>
    </div>
    );
}
}

export default App;
