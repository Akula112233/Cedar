import React from 'react'
import { Result, Button } from 'antd'

export default function EntryCompleted() {
    let styles = {height: "100%", display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}
    return (
        <Result style={styles} status="success" title="Successfully Recorded Today's Entry!" extra={
            <Button></Button>
        }></Result>
    )
}
