import React, { Component } from 'react'
import './App.css';
import 'antd/dist/antd.css';
import { auth } from './firebase/firebase' 
import AuthBarrier from './ui/authentication/AuthBarrier'
import { store, signUserIn } from './redux/redux'

export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.unsubscribe = undefined;
    this.state = {
      isSignedIn: false,
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.onStoreUpdate);
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({isSignedIn: true})
        store.dispatch(signUserIn(user));
      } else {
        this.setState({isSignedIn: false})
      }
    })
  }

  onStoreUpdate = () => {

  }

  render() {
    return (
      <div className="App">
        {!this.state.isSignedIn ? <AuthBarrier /> : undefined}
      </div>
    )
  }
}



