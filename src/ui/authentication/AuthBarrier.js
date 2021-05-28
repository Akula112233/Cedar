import React, { Component } from 'react'
import styled from 'styled-components'
import { primaryBackground, cardBackground } from '../colors/colorScheme'
import { Input, Divider, Button, Alert } from 'antd' 
import { createNewUser, signUserIn } from '../../firebase/authManager'

const MainBackground = styled.div`
    background-color: ${primaryBackground};
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const UICardBackground = styled.div`
    background-color: ${cardBackground};
    height: 500px;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 50px;
`


export default class AuthBarrier extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: "",
            password: "",
            showSignIn: true,
            error: {
                isError: false,
                description: ""
            },
            isLoading: false
        }
    }
    
    onChangeEmail = (e) => {
        this.setState({email: e.target.value})
    }


    onChangePassword = (e) => {
        this.setState({password: e.target.value})
    }

    onSignInClick = async () => {
        try {
            this.setState({isLoading: true})
            await signUserIn(this.state.email, this.state.password);
            this.setState({isLoading: false})
        } catch (e) {
            this.setState({error: {isError: true, description: e.errorMessage}, isLoading: false})
        }
    }

    onSignUpClick = async () => {
        try {
            this.setState({isLoading: true})
            await createNewUser(this.state.email, this.state.password);
            this.setState({isLoading: false})
        } catch (e) {
            this.setState({error: {isError: true, description: e.errorMessage}, isLoading: false})
        }
    }

    onClickToSwitch = () => {
        this.setState({email: "", password: "", showSignIn: !this.state.showSignIn})
    }

    render() {
        if (this.state.showSignIn) {
            return (
                <MainBackground>
                    <UICardBackground>
                        <Input value={this.state.email} style={{marginBottom: "10px"}} onChange={this.onChangeEmail} placeholder="Email..." ></Input>
                        <Input.Password value={this.state.password} style={{marginBottom: "10px"}} onChange={this.onChangePassword} placeholder="Password..." ></Input.Password>
                        <Button style={{marginBottom: "10px"}} block onClick={this.onSignInClick} type="primary">Sign In</Button>
                        {this.state.error.isError ? <Alert closable description={this.state.error.description} type="error"/> : undefined}
                        <Divider style={{marginTop: "20px", marginBottom: "20px"}}/>
                        <Button block onClick={this.onClickToSwitch} type="link">Need an account? Sign up</Button>
                    </UICardBackground>
                </MainBackground>
            )
        }
        return (
            <MainBackground>
                <UICardBackground>
                    <Input value={this.state.email} style={{marginBottom: "10px"}} onChange={this.onChangeEmail} placeholder="Email..." ></Input>
                    <Input.Password value={this.state.password} style={{marginBottom: "10px"}} onChange={this.onChangePassword} placeholder="Password..." ></Input.Password>
                    <Button style={{marginBottom: "10px"}} block onClick={this.onSignUpClick} type="primary">Sign Up</Button>
                    {this.state.error.isError ? <Alert closable description={this.state.error.description} type="error"/> : undefined}
                    <Divider style={{marginTop: "20px", marginBottom: "20px"}}/>
                    <Button block onClick={this.onClickToSwitch} type="link">Have an account? Sign in</Button>
                </UICardBackground>
            </MainBackground>
        )
    }
}


