import React, { Component } from 'react'
import styled from 'styled-components'
import {store, selectId} from '../../../redux/redux'

const sizeProportion = 225;
const Bubble = styled.div`
    background-color: ${props => props.backgroundColor || "red"};
    height: ${props => (props.weight * sizeProportion) + "px" || "100px"};
    width: ${props => (props.weight * sizeProportion) + "px"|| "100px"};
    border-radius: ${props => (props.weight * sizeProportion) + "px" || "50px"};
    transition: height 0.2s, width 0.2s, border-radius 0.5s;
    cursor: pointer;

    :hover {
        height: ${props => (props.weight * (sizeProportion + 25)) + "px" || "100px"};
        width: ${props => (props.weight * (sizeProportion + 25)) + "px"|| "100px"};
        border-radius: ${props => (props.weight * (sizeProportion + 25)) + "px" || "50px"};
    }
`

export default class Visualizer extends React.PureComponent {
    constructor(props) {
        super(props)
    
        this.state = {
            size: 0
        }
    }

    onClick = () => {
        store.dispatch(selectId(this.props.keyProp))
    }

    render() {
        return (
            <Bubble onClick={this.onClick} weight={this.props.weight} backgroundColor={this.props.color} ></Bubble>
        )
    }
}
