import React, {useContext, useState} from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, InputRightElement, InputGroup } from '@chakra-ui/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../Urls';
import toast, { Toaster } from 'react-hot-toast';
import {AuthContext} from "../Components/AuthContext";

const LoginForm = () => {
    const [state, setState] = useState({ email: "", pass: "" });
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.loading("Signing In...");

        try {
            const res = await axios.post(`${baseUrl}/user/login`, {
                email: state.email,
                pass: state.pass
            });

            toast.dismiss();
            if (res.data.message === "User does not exist. Please register") {
                toast(<b> ℹ️ User does not exist. Please register</b>);
            } else if (res.data.message === "Login successful") {
                login();
                toast.success("You're Signed In");
                localStorage.setItem('isLoggedIn', true); // Store login status in localStorage
                navigate("/add");
            } else {
                toast.error("An error occurred");
            }
        } catch (err) {
            toast.dismiss();
            toast.error(`Error: ${err.response ? err.response.data.message : err.message}`);
        }
    };

    return (
        <Box
            maxW="400px"
            mx="auto"
            mt={8}
            p={6}
            borderWidth={1}
            borderRadius="md"
            boxShadow="lg"
            bg="brand.BoxBase"
        >
            <Toaster />
            <Heading mb={4} textAlign="center">Login</Heading>

            <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        onChange={handleChange}
                        value={state.email}
                        name='email'
                        type="email"
                        placeholder="Enter your email"
                        focusBorderColor="teal.400"
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            onChange={handleChange}
                            value={state.pass}
                            name='pass'
                            type={show ? "text" : "password"}
                            placeholder="Enter your password"
                            focusBorderColor="teal.400"
                        />
                        <InputRightElement width="4rem">
                            <Button onClick={() => setShow(!show)}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    onClick={handleSubmit}
                    className='button-50'
                    type="submit"
                    size="lg"
                    mt={4}
                    w="100%"
                >
                    Sign In
                </Button>
            </form>

            <Text mt={4} textAlign="center">
                Don't have an account? <Link to="/signup" style={{ color: "crimson" }}>Sign Up</Link>
            </Text>
        </Box>
    );
};

export default LoginForm;
