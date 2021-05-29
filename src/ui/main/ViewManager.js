import React, { Component } from 'react'
import styled from 'styled-components'
import { cardBackground } from '../colors/colorScheme'
import SideBar from './SideBar'
import TopBar from './TopBar'
import Recorder from './bodies/Recorder'


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

        this.setCurrentView = this.setCurrentView.bind(this)
        this.state = {
            currentView: 0
        }
    }
    
    setCurrentView(view) {
        // 0 is home, 1 is calendar, 2 is graph
        this.setState({currentView: view})
    }

    render() {
        return (
            <Background>
                <SideBar changeView={this.setCurrentView} ></SideBar>
                <MainContainer>
                    <TopBar></TopBar>
                    <BodyContainers>
                        {this.state.currentView === 0 ? <Recorder /> : undefined}
                    </BodyContainers>
                </MainContainer>
            </Background>
        )
    }
}
