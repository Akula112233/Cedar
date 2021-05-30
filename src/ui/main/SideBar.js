import React, { useState } from 'react'
import styled from 'styled-components'
import {  primaryBackground } from '../colors/colorScheme'
import { HomeOutlined, CalendarOutlined, LineChartOutlined } from '@ant-design/icons'
import './convenience.css'

const Body = styled.div`
    height: 100%;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: ${primaryBackground};
`
const IconHolder = styled.div`
    margin-top: 50px;
    margin-bottom: 50px;
    border-radius: 5px;
    display: flex;
`

export default function SideBar(props) {
    // 0 main, 1 calendar select
    const [option, setOption] = useState(0);

    let onClick = (num) => {
        setOption(num)
        props.changeView(num)
    }

    return (
        <Body>
            <IconHolder>
                <HomeOutlined onClick={() => onClick(0)} className={`iconStyle ${option === 0 ? "selectedIcon" : "deselectedIcon"}`}></HomeOutlined>
            </IconHolder>
            <IconHolder >
                <CalendarOutlined onClick={() => onClick(1)} className={`iconStyle ${option === 1 ? "selectedIcon" : "deselectedIcon"}`}></CalendarOutlined>
            </IconHolder>
        </Body>
    )
}
