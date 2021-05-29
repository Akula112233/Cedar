import React from 'react'
import styled from 'styled-components'
import { cardBackground } from '../colors/colorScheme'

const Body = styled.div`
    height: 50px;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    background-color: ${cardBackground};
`

export default function TopBar() {
    return (
        <Body></Body>
    )
}
