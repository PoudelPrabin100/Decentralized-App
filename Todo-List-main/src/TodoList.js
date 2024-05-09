import React, { Component } from 'react';

class TodoList extends Component {
    state = {
        newTask: ''
    };

    handleInputChange = (event) => {
        this.setState({ newTask: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.createTask(this.state.newTask);
        this.setState({ newTask: '' }); // Reset input field after submit
    }

    render() {
        return (
            <div className="container">
                <h1>Todos</h1>
                <h2>Manage Your Tasks on Blockchain</h2>
                <p>Securely manage your tasks using Ethereum blockchain technology.</p>
                <form className="input-group" onSubmit={this.handleSubmit}>
                    <input type="text"
                        value={this.state.newTask}
                        onChange={this.handleInputChange}
                        placeholder="Add a new task..."
                        className="form-control" />
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button type="button" className="btn btn-danger" onClick={this.props.clearTasks} style={{ marginLeft: '10px' }}>Clear All</button>
                </form>
                <ul className="task-list">
                    {this.props.tasks.map((task, key) => (
                        <li key={key} className="task-item">
                            <label>
                                <input type="checkbox"
                                    checked={task.completed}
                                    onChange={() => this.props.toggleCompleted(task.id)} />
                                {task.content}
                            </label>
                            <button className="delete-button" onClick={() => this.props.deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default TodoList;
