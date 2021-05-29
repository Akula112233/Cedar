import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { lightTextColor, recordingColorSolid, recordingColorTranslucent, darkTextColor } from '../../colors/colorScheme'
import {  PauseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Divider, Button,  Alert } from 'antd'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import '../convenience.css'

const MicrophoneContainerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
`
const RecordingButtonOuter = styled.div`
    height: 30px;
    width: 30px;
    border-radius: 15px;
    display: flex;
    border: 2px solid ${recordingColorSolid};
    justify-content: center;
    align-items: center;
`

const RecordingButtonInactive = styled.div`
    height: 20px;
    width: 20px;
    border-radius: 10px;
    background-color: ${recordingColorTranslucent};
    cursor: pointer;
    transition: background-color 0.1s;

    :hover {
        background-color: ${recordingColorSolid};
    }
`

const DateShower = styled.h4`
    margin: none;
    padding: none;
    color: ${lightTextColor};
    user-select: none;
`

const RecordingTimeShower = styled.h1`
    margin: 0;
    padding: none;
    color: ${darkTextColor};
    user-select: none;
`

const SavingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`

export default function MicrophoneContainer() {
    let d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy =  d.getFullYear();

    const [isRecording, setRecordingStatus] = useState(false)
    const [seconds, setNumSeconds] = useState(0);
    const [minutes, setNumMinutes] = useState(0);
    const [intervalID, setIntevalID] = useState(undefined)
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [netTranscript, modifyTranscript] = useState("") 
    
    let onStartRecording = () => {
        setRecordingStatus(true)
        SpeechRecognition.browserSupportsSpeechRecognition() ? SpeechRecognition.startListening({continuous: true}) : SpeechRecognition.startListening()

        setIntevalID(setInterval(function() { 
            setNumSeconds(seconds => {
                if (seconds < 59) return seconds + 1;
                else { setNumMinutes(minutes => minutes + 1); return 0; }
            })
         }, 1000))
    }

    useEffect(() => {
        if (netTranscript !== "") {
            console.log(netTranscript)
        }
    }, [netTranscript])

    let onPauseRecording = () => {
        SpeechRecognition.stopListening()
        modifyTranscript(transcript)

        setRecordingStatus(false)
        clearInterval(intervalID)
    }

    let resetRecording = () => {
        setRecordingStatus(false)
        modifyTranscript("")
        setNumSeconds(0)
        setNumMinutes(0)
        resetTranscript()
        clearInterval(intervalID)
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <Alert message="Your browser doesn't support realtime speech recognition. Please use the text interface instead." type="error" />
    }
    return (
        <MicrophoneContainerWrapper>
            <RecordingTimeShower>{minutes / 2}:{seconds < 10 ? `0${seconds}` : seconds}</RecordingTimeShower>
            <DateShower>{`${mm}/${dd}/${yyyy}`}</DateShower>
            <RecordingButtonOuter>{isRecording ? <PauseOutlined onClick={onPauseRecording} className="iconStyleSmall"></PauseOutlined>: <RecordingButtonInactive onClick={onStartRecording}></RecordingButtonInactive>}</RecordingButtonOuter>
            <Divider style={{margin: 0, marginTop: "15px", minWidth: 0, width: "300px"}}></Divider>
            <SavingWrapper> 
                <Button type="default">Save Recording</Button>
                <Button onClick={resetRecording} style={{marginLeft: "10px"}} danger icon={<DeleteOutlined />}></Button>
            </SavingWrapper>
        </MicrophoneContainerWrapper>
    )
    
}
