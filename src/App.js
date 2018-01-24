import React, { Component } from 'react';
import './App.css';


class Task extends Component {
  render() {
    return(
      <div className="row">
        <div className="task">
          <div className="taskInner">
            <p className="taskHeading">Personal</p>
            <p>{timeFormat(this.props.personalTime)}</p>
          </div>
            {
              this.props.personalTasks.map((task, idx) => (
                <div className="taskInner2" key={idx}>
                  <p className="time">{timeFormat(task.minutes)}</p>
                  <p className="taskParagraph">{task.description}</p>
                </div>
              ))
            }
        </div>
        <div className="task">
          <div className="taskInner">
            <p className="taskHeading">Work</p>
            <p>{timeFormat(this.props.workTime)}</p>
          </div>
            {
              this.props.workTasks.map((task, idx) => (
                <div className="taskInner2" key={idx}>
                  <p className="time">{timeFormat(task.minutes)}</p>
                  <p className="taskParagraph">{task.description}</p>
                </div>
              ))
            }
        </div>
      </div>
    );
  }
}


class WorkForm extends Component {
  render() {
    return (
        <form>
          <div>
            <div className="row">
              <label>Project</label>
                <select name='project' value={this.props.project} onChange={this.props.handleChange}>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
              </select>
            </div>
            <div className="row">
              <label>Description</label>
              <input type='text' name='description' value={this.props.description} onChange={this.props.handleChange}></input>
              <span className="error">{this.props.descriptionError}</span>
            </div>
            <div className="row">
              <label>Minutes</label>
              <input type='number' min="1" max="240" name='minutes' value={this.props.minutes} onChange={this.props.handleChange} id="minutesInput"></input>
              <span className="error">{this.props.minutesError}</span>
            </div>  
            <div className="row">
              <button disabled={!this.props.minutesValidated || !this.props.descripValidated} onClick={this.props.handleAdd}>Add</button> 
            </div>
          </div>                                      
        </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: 'Personal',
      description: '',
      minutes: 0,
      personalTasks: [],
      personalTotalTime: 0,
      workTasks: [],
      workTotalTime: 0,
      descriptionValidated: false,
      descriptionError: '',
      minutesValidated: false,
      minutesError: '',
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value}, function() {
      this.validate();
    });
  }

  handleAdd(e) {
    e.preventDefault();
    let newTask = new TaskItem(this.state.project, this.state.description, this.state.minutes);
    if (this.state.project === 'Personal'){
      let newArr = this.state.personalTasks;
      newArr.push(newTask);
      newArr = newArr.sort(function(a, b){
        return b.minutes - a.minutes;
      })
      this.setState({personalTasks: newArr});
      this.setState({personalTotalTime: parseInt(this.state.personalTotalTime) + parseInt(newTask.minutes)});
    } else {
      let newArr = this.state.workTasks;
      newArr.push(newTask);
      newArr = newArr.sort(function(a, b){
        return b.minutes - a.minutes;
      })
      this.setState({workTasks: newArr});
      this.setState({workTotalTime: parseInt(this.state.workTotalTime) + parseInt(newTask.minutes)});
    }
    console.log(newTask);
    this.setState({description:'', minutes: 0, validated: false});
  }

  validate() {
    if (this.state.description.length >= 5 && this.state.description.trim() !== '')
    {
      this.setState({descriptionValidated: true, descriptionError:''});
    } else {
      this.setState({descriptionValidated: false, descriptionError: 'Description must be at least 5 characters.'});
    }
    if (parseInt(this.state.minutes) <= 240 && parseInt(this.state.minutes) >= 1)
    {
      this.setState({minutesValidated: true, minutesError:''});
    } else {
      this.setState({minutesValidated: false, minutesError: 'Minutes must be between 1 and 240.'});
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Work Logger</h1>
        </header>
        <div className="formDiv">
          <WorkForm descripValidated={this.state.descriptionValidated} minutesValidated={this.state.minutesValidated} handleChange={this.handleChange} handleAdd={this.handleAdd}
          project={this.state.project} description={this.state.description} minutes={this.state.minutes} descriptionError={this.state.descriptionError} minutesError={this.state.minutesError}/>
        </div>
        <br />
        <hr />
        <br />
        <div className="tasksDiv">
          <Task personalTasks={this.state.personalTasks} workTasks={this.state.workTasks} personalTime={this.state.personalTotalTime} workTime={this.state.workTotalTime}/>
        </div>
      </div>
    );
  }
}

class TaskItem {
  constructor(project, description, minutes) {
    this.project = project;
    this.description = description;
    this.minutes = minutes;
  }
}

const timeFormat = (str) => {
  let minutes = parseInt(str);
  let minsLeft = minutes%60;
  let hours = parseInt(minutes/60);

  if (minsLeft.toString().length === 1){
    minsLeft = '0' +  minsLeft;
  }

  return(hours + ':' + minsLeft);
}

export default App;
