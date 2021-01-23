import React, { Component } from 'react';
import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import {findIndex, without} from 'lodash';
import '../css/App.css';

class App extends Component {
// state
  constructor() {
    super();
    this.state = {
      myName: 'Sunlight',
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      // ascending
      orderDir: 'asc',
      // when you type pet Name, only that pet shows and the rest of the list disappears
      queryText: '',
      lastIndex: 0
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

// show or hide add appointment container 
  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

// update Info - name, value, id,   
updateInfo(name, value, id) {
  let tempApts = this.state.myAppointments;
  // lodash method, when the data gets loaded, we push individual id
  // we find the current and actual original list id
  let aptIndex = findIndex(this.state.myAppointments, {
    aptId: id
  });
  // we modify record
  tempApts[aptIndex][name] = value;
  this.setState({
    myAppointments: tempApts
  })
}
// search appointments
searchApts(query) {
  // we pass along what we send from the input field when it gets changed
  // it makes our form dynamic, when we put letters into the form
  // the pets disappears and appears according to the used letter 
  this.setState({queryText: query});
}  

// change order
changeOrder(order, dir) {
  this.setState({
    orderBy: order,
    orderDir: dir
  });
}  

// add appointments
addAppointment(apt)  {
  let tempApts = this.state.myAppointments;
  apt.aptId = this.state.lastIndex;
  tempApts.unshift(apt);
  this.setState({
    myAppointments: tempApts,
    lastIndex: this.state.lastIndex + 1
  });
} 

// delete Appointment
deleteAppointment(apt) {
  let tempApts = this.state.myAppointments;
  tempApts = without(tempApts, apt);

  this.setState({
    myAppointments: tempApts
  });
}

// lifecycle method
componentDidMount() {
  fetch('./data.json')
  // promise - reponse comes as json formatted object
    .then(response => response.json())
    .then(result => {
      // go through each element (item) and display them
      const apts = result.map(item => {
        item.aptId = this.state.lastIndex;
        // we can't modify state directly 
        this.setState({
          lastIndex: this.state.lastIndex + 1
        })
        return item;
      });
    // You never modify the state directly
    // you need to create a temporary variable
    this.setState({
      myAppointments: apts
    });
  });
} 


  render() {

    // temporary variable how we are going to order data
    // by the name of the owner, pet name, date, etc. 
    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if (a[this.state.orderBy].toLowerCase() < 
          b[this.state.orderBy].toLowerCase()
      ) {
        return - 1 * order;
      } else {
        return 1 * order;
      };
    // when you type pet, owner name or notes, only that pet shows and the rest of the list disappears  
    }).filter(eachItem => {
      return (
        eachItem['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      );
    });

    return (
      <div className="App">
        <main className="page bg-white" id="petratings">
          <div className="container">
            <div className="row">
              <div className="col-md-12 bg-white">
                <div className="container">
                  <AddAppointments 
                    formDisplay={this.state.formDisplay}
                    toggleForm={this.toggleForm}
                    addAppointment = {this.addAppointment}
                  />
                   <SearchAppointments 
                    orderBy = {this.state.orderBy}
                    orderDir = {this.state.orderDir}
                    changeOrder={this.changeOrder}
                    searchApts={this.searchApts}
                  />
                  {/* we pass data down via props */}
                  <ListAppointments  
                    // we displayed the order of the data  
                    appointments={filteredApts} 
                    deleteAppointment={this.deleteAppointment}
                    updateInfo={this.updateInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
