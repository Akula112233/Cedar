import React, { Component } from 'react'
import './App.css';
import 'antd/dist/antd.css';
import { auth, storageRef } from './firebase/firebase' 
import AuthBarrier from './ui/authentication/AuthBarrier'
import ViewManager from './ui/main/ViewManager'
import { store, signUserIn, entryCompleted } from './redux/redux'

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
        
        let d = new Date();
        let dd = String(d.getDate()).padStart(2, '0');
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let yyyy =  d.getFullYear();
        const todaysEntryRef = storageRef.child(`${user.uid}/${mm}_${dd}_${yyyy}.mp3`)
        todaysEntryRef.getDownloadURL().then(url => {
          store.dispatch(entryCompleted(url))
          console.log(url)
        }).catch(error => {
          if (error.code !== "storage/object-not-found") {
            console.log(error)
          }
        })

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
        {!this.state.isSignedIn ? <AuthBarrier /> : <ViewManager />}
      </div>
    )
  }
}



