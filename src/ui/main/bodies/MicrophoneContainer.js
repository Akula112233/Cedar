import React from 'react'
import styled from 'styled-components'
import { lightTextColor, recordingColorSolid, recordingColorTranslucent, darkTextColor } from '../../colors/colorScheme'
import {  PauseOutlined, DeleteOutlined } from '@ant-design/icons'
import {store, entryCompleted, setFinalTranscript} from '../../../redux/redux'
import { Divider, Button, Alert } from 'antd'
import $ from 'jquery'
import '../convenience.css'
import { auth, storageRef } from '../../../firebase/firebase'
import RecordRTC, { MediaStreamRecorder, StereoAudioRecorder } from 'recordrtc'

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

export default class MicrophoneContainer extends React.Component {
    constructor(props) {
        super(props)
        this.d = new Date();
        this.dd = String(this.d.getDate()).padStart(2, '0');
        this.mm = String(this.d.getMonth() + 1).padStart(2, '0');
        this.yyyy =  this.d.getFullYear();
        this.state = {
            isSaving: false,
            isRecording: false,
            seconds: 0,
            minutes: 0,
            intervalID: undefined,
            microphone: null,
            recorder: null,
            url: ""
        }
    }
    
    onStartRecording = async () => {
        console.log('click')

        let mimeType = "audio/mpeg"
        let recorderType = MediaStreamRecorder
        let isMimeTypeSupported = (_mimeType) => {        
            if (typeof MediaRecorder.isTypeSupported !== 'function') {
                return true;
            }
            return MediaRecorder.isTypeSupported(_mimeType);
        };

        if(isMimeTypeSupported(mimeType) === false) {
            console.log(mimeType, 'is not supported.');
            mimeType = 'audio/ogg';
        
            if(isMimeTypeSupported(mimeType) === false) {
                console.log(mimeType, 'is not supported.');
                mimeType = 'audio/wav';
        
                if(isMimeTypeSupported(mimeType) === false) {
                    console.log(mimeType, 'is not supported.');
        
                    // fallback to WebAudio solution
                    mimeType = 'audio/wav';
                    recorderType = StereoAudioRecorder;
                }
            }
        }

        let options = {
            type: 'audio',
            numberOfAudioChannels: 1,
            mimeType: mimeType,
            recorderType: recorderType,
            checkForInactiveTracks: true,
            bufferSize: 16384,
            audio: true,
            video: false
        };


        if (this.state.microphone === null) {
            try {   
                const mic = await navigator.mediaDevices.getUserMedia(options);
                this.setState({microphone: mic}, () => {
                    console.log("Set microphone", mic)
                    this.onStartRecording()
                })
                
            } catch (e) {
                console.log("Unable to capture your microphone.")
                console.error(e)
            }
            return;
        }



        if (this.state.recorder !== null) { 
            this.state.recorder.resumeRecording() 
        } else {
            this.setState({recorder: RecordRTC(this.state.microphone, options)}, () => {
                console.log("Recorder made", this.state.recorder)
                this.state.recorder.startRecording()
            })
        }
        this.setState({isRecording: true, intervalID: setInterval(() => {
            if (this.state.seconds < 59) this.setState({seconds: this.state.seconds + 1})
            else {
                this.setState({minutes: this.state.minutes + 1, seconds: 0})
            }
        } ,1000)})
    }

    onPauseRecording = () => {
        this.state.recorder.pauseRecording();
        this.setState({isRecording: false})
        clearInterval(this.state.intervalID)
    }

    resetRecording = () => {
        if (this.state.recorder) {
            this.state.recorder.destroy();
            this.setState({recorder: null})
        }
        this.setState({
            isRecording: false,
            seconds: 0,
            mintues: 0
        })
        clearInterval(this.state.intervalID)
    }

    saveRecordingFinal = () => {
        this.setState({isSaving: true})
        this.state.recorder.stopRecording(async () =>  {
            let d = new Date();
            let dd = String(d.getDate()).padStart(2, '0');
            let mm = String(d.getMonth() + 1).padStart(2, '0');
            let yyyy =  d.getFullYear();


            let blob = this.state.recorder.getBlob();
            let file = new File([blob], `${mm}_${dd}_${yyyy}.wav`, {
                type: 'audio/wav'
            })

            try {
                const result = await saveAudioFile(`${mm}_${dd}_${yyyy}`, file)
                console.log("Successfully saved to Firebase", result)
                

                const storageURL = await storageRef.child(`${auth.currentUser.uid}/${mm}_${dd}_${yyyy}.wav`).getDownloadURL()


                let data = JSON.stringify({
                    link: storageURL
                })
                let url = "https://us-central1-cedar-315121.cloudfunctions.net/speechapi";
                const responseTranscriptStream = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                })
                const reponseTranscriptBody = await responseTranscriptStream.json();
                store.dispatch(setFinalTranscript(reponseTranscriptBody.result))
                console.log(reponseTranscriptBody.result, "Check if I'm a string")


                let emotionalURL = "https://us-central1-cedar-315121.cloudfunctions.net/analyze_emotion"
                const responseEmotion = await fetch(emotionalURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: reponseTranscriptBody.result
                })

                const responseEmotionBody = await responseEmotion.json();
                console.log(responseEmotionBody, 'Response from emotion api')



                let backendUpdateURL = "https://us-central1-cedar-315121.cloudfunctions.net/firebase"
                let backUpdateData = JSON.stringify({
                    uid: auth.currentUser.uid,
                    recordingLink: storageURL,
                    emotions: responseEmotionBody
                })
                await fetch(backendUpdateURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: backUpdateData
                }) 

                store.dispatch(entryCompleted(storageURL))
                this.setState({isSaving: false})
            } catch (e) {
                console.log("Error saving your audio to Firebase or with retrieving its url")
                console.error(e)
            }
        })
        this.setState({isRecording: false})
        clearInterval(this.state.intervalID)
    }

    render() {
        const { minutes, seconds, isRecording } = this.state
        const mm = this.mm; const dd = this.dd; const yyyy = this.yyyy;

        return (
            <MicrophoneContainerWrapper>
                <RecordingTimeShower>{minutes / 2}:{seconds < 10 ? `0${seconds}` : seconds}</RecordingTimeShower>
                <DateShower>{`${mm}/${dd}/${yyyy}`}</DateShower>
                <RecordingButtonOuter>{isRecording ? <PauseOutlined onClick={this.onPauseRecording} className="iconStyleSmall"></PauseOutlined>: <RecordingButtonInactive onClick={this.onStartRecording}></RecordingButtonInactive>}</RecordingButtonOuter>
                <Divider style={{margin: 0, marginTop: "15px", minWidth: 0, width: "300px"}}></Divider>
                <SavingWrapper> 
                    <Button loading={this.state.isSaving} onClick={this.saveRecordingFinal} type="default">Save Recording</Button>
                    <Button onClick={this.resetRecording} style={{marginLeft: "10px"}} danger icon={<DeleteOutlined />}></Button>
                </SavingWrapper>
            </MicrophoneContainerWrapper>
        )
    }
}

function saveAudioFile(entryDateString, file) {
    return new Promise(async (resolve, reject) => {
        try {
            const uid = auth.currentUser.uid
            const location = storageRef.child(`${uid}/${entryDateString}.wav`)
            const snapshot = await location.put(file);
            resolve({status: "success", snapshot})
        } catch (e) {
            reject({status: "fail", e})
        }
    })

}











/* Old Version */
// export default function MicrophoneContainer() {
//     let d = new Date();
//     let dd = String(d.getDate()).padStart(2, '0');
//     let mm = String(d.getMonth() + 1).padStart(2, '0');
//     let yyyy =  d.getFullYear();

//     const [isRecording, setRecordingStatus] = useState(false)
//     const [seconds, setNumSeconds] = useState(0);
//     const [minutes, setNumMinutes] = useState(0);
//     const [intervalID, setIntevalID] = useState(undefined)
//     const { transcript, resetTranscript } = useSpeechRecognition();
//     const [netTranscript, modifyTranscript] = useState("") 
    
//     const onStartRecording = () => {
//         setRecordingStatus(true)
//         //SpeechRecognition.browserSupportsSpeechRecognition() ? SpeechRecognition.startListening({continuous: true}) : SpeechRecognition.startListening()

//         // Timer
//         setIntevalID(setInterval(function() {
//             setNumSeconds(seconds => {
//                 if (seconds < 59) return seconds + 1;
//                 else { setNumMinutes(minutes => minutes + 1); return 0; }
//             })
//          }, 1000))
//     }

//     useEffect(() => {
//         if (netTranscript !== "") {
//             store.dispatch(setTranscriptContent(netTranscript))
//         }
//     }, [netTranscript])

//     const onPauseRecording = () => {
//         //SpeechRecognition.stopListening()
//         //modifyTranscript(transcript)
            
//         setRecordingStatus(false)
//         clearInterval(intervalID)
//     }

//     const resetRecording = () => {
//         setRecordingStatus(false)
//         store.dispatch(setTranscriptContent(""))
//         //modifyTranscript("")
//         setNumSeconds(0)
//         setNumMinutes(0)
//         //resetTranscript()
//         clearInterval(intervalID)
//     }

//     const saveRecordingFinal = () => {
//         //SpeechRecognition.stopListening()
//         //modifyTranscript(transcript)
        
//         setRecordingStatus(false)
//         clearInterval(intervalID)
//     }

//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//         return <Alert message="Your browser doesn't support realtime speech recognition. Please use the text interface instead." type="error" />
//     }
//     return (
//         <MicrophoneContainerWrapper>
//             <RecordingTimeShower>{minutes / 2}:{seconds < 10 ? `0${seconds}` : seconds}</RecordingTimeShower>
//             <DateShower>{`${mm}/${dd}/${yyyy}`}</DateShower>
//             <RecordingButtonOuter>{isRecording ? <PauseOutlined onClick={onPauseRecording} className="iconStyleSmall"></PauseOutlined>: <RecordingButtonInactive onClick={onStartRecording}></RecordingButtonInactive>}</RecordingButtonOuter>
//             <Divider style={{margin: 0, marginTop: "15px", minWidth: 0, width: "300px"}}></Divider>
//             <SavingWrapper> 
//                 <Button onClick={saveRecordingFinal} type="default">Save Recording</Button>
//                 <Button onClick={resetRecording} style={{marginLeft: "10px"}} danger icon={<DeleteOutlined />}></Button>
//             </SavingWrapper>
//         </MicrophoneContainerWrapper>
//     )
    
// }