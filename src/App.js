import React, { Component } from 'react';
import './App.css';
import './ui-toolkit/css/nm-cx/main.css'

const Task = (props) => (
  props.tasks.map((task, idx) => (
    <div className="taskInner2" key={idx}>
      <p className="time">{timeFormat(task.minutes)}</p>
      <p className="taskParagraph">{task.description}</p>
    </div>
  ))
)

const TaskDisplay = (props) => {
  return(
    <div>
      <div className="row">
        <div className="medium-6 columns">
          <div className="medium-12 medium-centered columns border">
            <div className="task">
              <div className="taskInner">
                <h4 className="taskHeading">Personal</h4>
                <p>{timeFormat(props.personalTime)}</p>
              </div>
              <Task tasks={props.personalTasks}/>
            </div>
          </div>
        </div>
        <div className="medium-6 columns">
          <div className="medium-12 medium-centered columns border">
            <div className="task">
              <div className="taskInner">
                <h4 className="taskHeading">Work</h4>
                <p>{timeFormat(props.workTime)}</p>
              </div>
              <Task tasks={props.workTasks}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const WorkForm = (props) => {
  return (
      <form>
          <div className="row">
            <div className="large-12 columns uitk-select md-text-field with-floating-label">
              <select className="os-default" name='project' onChange={props.handleChange}>
                <option disabled selected disabled>Select an Option</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
              <span className="select-arrow"></span>
              <label>Project</label>
            </div>
          </div>
          <div className="row">
            <div className="large-12 columns md-text-field with-floating-label">
              <input type='text' name='description' value={props.description} onChange={props.handleChange} required id="descrip"></input>
              <label htmlFor="descrip">Description</label>
              <span className="error">{props.descriptionError}</span>
            </div>
          </div>
          <div className="row">
            <div className="large-12 columns md-text-field with-floating-label">
              <input type='number' min="1" max="240" name='minutes' value={props.minutes} onChange={props.handleChange} id="minutesInput"></input>
              <label htmlFor="minutesInput">Minutes</label>
              <span className="error">{props.minutesError}</span>
            </div>
          </div>  
          <br />
          <div className="rowLeft">
            <button disabled={!props.minutesValidated || !props.descripValidated || !props.projectValidated} onClick={props.handleAdd} className="button btn-cta small">Add</button> 
          </div>                                    
      </form>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: '',
      description: '',
      minutes: 1,
      personalTasks: [],
      personalTotalTime: 0,
      workTasks: [],
      workTotalTime: 0,
      descriptionValidated: false,
      descriptionError: '',
      minutesValidated: false,
      minutesError: '',
      projectValidated: false,
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
    let newTask = new TaskItem(this.state.description, this.state.minutes);
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
    this.setState({description:'', minutes: 1, validated: false});
  }

  validate() {
    if (this.state.project !== '') {
      this.setState({projectValidated: true});
    } else {
      this.setState({projectValidated: false});
    }
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
      <div className="App nm-cx-theme">
        <header className="App-header">
          <h1 className="App-title">Work Logger</h1>
        </header>
        <div className="formDiv">
          <WorkForm descripValidated={this.state.descriptionValidated} minutesValidated={this.state.minutesValidated} projectValidated={this.state.projectValidated} handleChange={this.handleChange} handleAdd={this.handleAdd}
          project={this.state.project} description={this.state.description} minutes={this.state.minutes} descriptionError={this.state.descriptionError} minutesError={this.state.minutesError}/>
        </div>
        <hr className="myHr"/>
        <br />
        <div>
          <TaskDisplay personalTasks={this.state.personalTasks} workTasks={this.state.workTasks} personalTime={this.state.personalTotalTime} workTime={this.state.workTotalTime}/>
        </div>
      </div>
    );
  }
}

class TaskItem {
  constructor(description, minutes) {
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
