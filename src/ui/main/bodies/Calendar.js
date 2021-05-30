import React, { Component } from 'react'
import styled from 'styled-components'
import { DatePicker } from 'antd'
import { darkTextColor, lightTextColor } from '../../colors/colorScheme'
import { store } from '../../../redux/redux'
import Visualizer from './Visualizer'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid' 

const Body = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ControlWrapper = styled.div`
    height: 85%;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items; center;
    flex-direction: column;
`

const TopBar = styled.div`
    height: 75px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const CedarContainer = styled.div`
    height: 100%;
    width: 100%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const VisualizerContainer = styled.div`
    height: 40%;
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
`

const VisualizerDescription = styled.div`
    height: 60%;
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: flex-start;
`

const Header = styled.h3`
    color: ${darkTextColor};
    margin: 0;
    padding: 0;
    user-select: none;
`    


export default class Calendar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.d = new Date();
        this.dd = String(this.d.getDate()).padStart(2, '0');
        this.mm = String(this.d.getMonth() + 1).padStart(2, '0');
        this.yyyy =  this.d.getFullYear();
        this.unsubscribe = undefined

        this.state = {
            date: undefined,
            dateString: "",
            holdingArray: [],
            dataArray: [],
            keyArray: [],
            currentDescriptionHolder: null
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(this.onStoreChange);
        const dummyData = {
            "Confident": {
                "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom.",
                "confidence": 0.898327,
                "topics": []
            },
            "Analytical": {
                "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                "confidence": 0.6359925,
                "topics": [
                    "bathroom"
                ]
            },
            "Sadness": {
                "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules.",
                "confidence": 0.555144,
                "topics": []
            },
            "Tentative": {
                "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules. Perhaps some people like this but It negatively affected our enjoyment of the accommodation. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                "confidence": 0.8410679999999999,
                "topics": [
                    "enjoyment",
                    "accommodation"
                ]
            }
        }

        const types = {
            anger: "#ED6A5A",
            joy: "#B4CEB3",
            fear: "#FAD4D8",
            sadness: "#88A0A8",
            tentative: "#DBD3C9",
            analytical: "#D17B88",
            confident: "#546A76"
        }
        // fetch for today's date
        const arr = filterData(dummyData)
        let holdingArray = [];
        let keyArray = [];
        let dataArray = [];
        arr.forEach(c => {
            const keyP = uuidv4();
            holdingArray.push(<Visualizer key={keyP} keyProp={keyP} data={c} color={types[c.type]} weight={c.score} />)
            keyArray.push(keyP)
            dataArray.push(c)
        })
        this.setState({holdingArray, keyArray, dataArray})
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStoreChange = () => {
        if (store.getState().selectedId !== "") {
            const id = store.getState().selectedId;
            const index = this.state.keyArray.indexOf(id);

            if (index !== -1) {
                this.setState({
                    currentDescriptionHolder: this.state.dataArray[index]
                })
            } else {
                this.setState({
                    currentDescriptionHolder: null
                })
            }
        }
    }

    onDateChange = (date, dateString) => {
        this.setState({
            date,
            dateString
        }, () => {
            console.log(date, dateString)
            // Dummy data comes from API, fetch here
            const dummyData = {
                "Confident": {
                    "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom.",
                    "confidence": 0.898327,
                    "topics": []
                },
                "Analytical": {
                    "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                    "confidence": 0.6359925,
                    "topics": [
                        "bathroom"
                    ]
                },
                "Sadness": {
                    "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules.",
                    "confidence": 0.555144,
                    "topics": []
                },
                "Tentative": {
                    "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules. Perhaps some people like this but It negatively affected our enjoyment of the accommodation. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                    "confidence": 0.8410679999999999,
                    "topics": [
                        "enjoyment",
                        "accommodation"
                    ]
                }
            }

            const types = {
                anger: "#ED6A5A",
                joy: "#B4CEB3",
                fear: "#FAD4D8",
                sadness: "#88A0A8",
                tentative: "#DBD3C9",
                analytical: "#D17B88",
                confident: "#546A76"
            }
    
            const arr = filterData(dummyData)
            let holdingArray = [];
            let keyArray = [];
            let dataArray = [];
            arr.forEach(c => {
                const keyP = uuidv4();
                holdingArray.push(<Visualizer key={keyP} keyProp={keyP} data={c} color={types[c.type]} weight={c.score} />)
                keyArray.push(keyP)
                dataArray.push(c)
            })
            this.setState({holdingArray, keyArray, dataArray})
        })
    }   
    

    render() {
        const mm = this.mm; const dd = this.dd; const yyyy = this.yyyy;
        const types = {
            anger: "#ED6A5A",
            joy: "#B4CEB3",
            fear: "#FAD4D8",
            sadness: "#88A0A8",
            tentative: "#DBD3C9",
            analytical: "#D17B88",
            confident: "#546A76"
        }

        return (
            <Body>
                <ControlWrapper>
                    <TopBar>
                        <Header>Cedar Analysis</Header>
                        <DatePicker defaultValue={moment(`${mm}/${dd}/${yyyy}`, 'MM/DD/YYYY')} format='MM/DD/YYYY' onChange={this.onDateChange} /> 
                    </TopBar>
                    <CedarContainer>
                        <VisualizerContainer>
                            {this.state.holdingArray}
                        </VisualizerContainer>
                        <VisualizerDescription>
                            {this.state.currentDescriptionHolder === null ? <DescriptionEmpty>Select an emotion sphere to start</DescriptionEmpty> : 
                            <CalendarDescriptionHeader color={types[this.state.currentDescriptionHolder.type]} title={this.state.currentDescriptionHolder.type} />
                            }
                        </VisualizerDescription>
                    </CedarContainer>
                </ControlWrapper>
            </Body>
        )
    }
}

function filterData(data) {
    let arr = [];
    for (const property in data) {
        arr.push({
            type: property.toLowerCase(),
            score: data[property].confidence,
            topics: data[property].topics,
            sentence: data[property].sentence
        })
    }

    return arr;
}

const DescriptionHeaderCont = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`
const DescriptionHeader = styled.h1`
    color: ${props => props.color || "black"}
`

const DescriptionEmpty = styled.h2`
    color: ${lightTextColor};
`

function CalendarDescriptionHeader(props) {
    return (
        <DescriptionHeaderCont>
            <DescriptionHeader color={props.color}>{props.title}</DescriptionHeader>
        </DescriptionHeaderCont>    
    )
}
