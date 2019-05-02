import React from 'react';
import Header from './Header';
import TicketList from './TicketList';
import NewTicketControl from './NewTicketControl';
import Error404 from './Error404';
import { Switch, Route } from 'react-router-dom';
import Admin from './Admin';
import { v4 } from 'uuid';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      masterTicketList: {},
      selectedTicket: null
    };
    this.handleAddingNewTicketToList = this.handleAddingNewTicketToList.bind(this);
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this);
  }

  handleAddingNewTicketToList(newTicket){
    var newTicketId = v4();
    console.log(newTicket);
    var newMasterTicketList = Object.assign({}, this.state.masterTicketList, {[newTicketId]: newTicket});
    newMasterTicketList[newTicketId].formattedWaitTime = newMasterTicketList[newTicketId].timeOpen.fromNow(true);
    this.setState({masterTicketList: newMasterTicketList});
  }

  handleChangingSelectedTicket(ticketId){
    console.log(ticketId);
    console.log('selected ticket from state:');
    this.setState({selectedTicket: ticketId});
    console.log(this.state.selectedTicket);
  }

  componentDidMount(){
  //  console.log('componentDidMount');
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(), 5000
    );
  }

  // componentWillMount(){
  //   console.log('componentWillMount');
  // }
  //
  // componentWillReceiveProps(){
  //   console.log('componentWillReceiveProps');
  // }
  //
  // shouldComponentUpdate(){
  //   console.log('shouldComponentUpdate');
  //   return true;
  // }
  //
  // componentWillUpdate(){
  //   console.log('componentWillUpdate');
  // }
  //
  // componentDidUpdated(){
  //   console.log('componentDidUpdated');
  // }

  updateTicketElapsedWaitTime(){
  //  console.log('check');
  //  console.log(this.state.masterTicketList);
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    Object.keys(newMasterTicketList).forEach(ticketId => {
      newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    })
    this.setState({masterTicketList: newMasterTicketList});
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  render(){
    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' render={()=>
              <TicketList

                ticketList={this.state.masterTicketList} />} />
          <Route path='/newticket' render={()=><NewTicketControl onNewTicketCreation={this.handleAddingNewTicketToList} />} />
          <Route path='/admin' render={props=>
              <Admin
                ticketList={this.state.masterTicketList} currentRouterPath={props.location.pathname}
                onTicketSelection={this.handleChangingSelectedTicket}
                selectedTicket={this.state.selectedTicket}/>} />
          <Route component={Error404} />
        </Switch>
      </div>
    );
  }

}

export default App;
