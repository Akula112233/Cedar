import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { store  } from '../../../redux/redux'
import { DeleteOutlined } from '@ant-design/icons'
import { Divider, Button, Input } from 'antd'
import { lightTextColor } from '../../colors/colorScheme'

const { TextArea } = Input

const HeaderDiv = styled.div`
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-bottom: 5px;
`

const Header = styled.h4`
    color: ${lightTextColor};
    margin: 0;
    padding: 0;
    user-select: none;
`

const TextContainerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction: column;
    height: 100%;
`

const SavingWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`

export default function TextContainer() {
    let d = new Date();
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy =  d.getFullYear();

    const[content, setContent] = useState("")

    useEffect(() => {
        if (content !== "") {
        }
    }, [content])

    const onTextAreaChange = (e) => {
        setContent(e.target.value)
    }

    const finalEntrySubmit = () => {
        console.log(store.getState())
    }

    const resetText = () => {
        setContent("")
    }

    return (
        <TextContainerWrapper>
            <HeaderDiv>
                <Header>Text Entry:</Header>
                <Header>{`${mm}/${dd}/${yyyy}`}</Header>
            </HeaderDiv>
            <TextArea style={{width: "70%"}} value={content} onChange={onTextAreaChange} placeholder="Start writing!" autoSize={{minRows: 6, maxRows: 8}}></TextArea>
            <Divider style={{margin: 0, marginTop: "15px", minWidth: 0, width: "400px"}}></Divider>
            <SavingWrapper>
                <Button onClick={finalEntrySubmit} type="default">Save Entry</Button>
                <Button onClick={resetText} style={{marginLeft: "10px"}} danger icon={<DeleteOutlined />}></Button>
            </SavingWrapper>
        </TextContainerWrapper>
    )
}
