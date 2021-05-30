import React, { Component } from 'react'
import styled from 'styled-components'
import { cardBackground } from '../colors/colorScheme'
import SideBar from './SideBar'
import TopBar from './TopBar'
import Recorder from './bodies/Recorder'
import EntryCompleted from './bodies/EntryCompleted'
import Calendar from './bodies/Calendar'
import {store} from '../../redux/redux'


const Background = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: ${cardBackground}
`

const MainContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const BodyContainers = styled.div`
    height: 100%;
    width: 100%;
    background-color: ${cardBackground};
`


export default class ViewManager extends Component {
    constructor(props) {
        super(props)
        this.unsubscribe = undefined
        this.setCurrentView = this.setCurrentView.bind(this)
        this.state = {
            currentView: 0,
            entryCompleted: false
        }
    }
    
    setCurrentView(view) {
        // 0 is home, 1 is calendar, 2 is graph
        this.setState({currentView: view})
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(this.subscribeToStore)
    }

    subscribeToStore = () => {
        if (store.getState().entryCompleted) {
            this.setState({
                entryCompleted: true
            })
        }
    }

    render() {
        return (
            <Background>
                <SideBar changeView={this.setCurrentView} ></SideBar>
                <MainContainer>
                    <TopBar></TopBar>
                    <BodyContainers>
                        {(this.state.currentView === 0 && !this.state.entryCompleted) ? <Recorder /> : undefined}
                        {(this.state.currentView === 0 && this.state.entryCompleted) ? <EntryCompleted /> : undefined}
                        {this.state.currentView === 1 ? <Calendar /> : undefined}
                    </BodyContainers>
                </MainContainer>
            </Background>
        )
    }
}
