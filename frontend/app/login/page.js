"use client"

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {loginWithEmailAndPassword, resetPassword} from "/lib/firebase/auth.js"

import {useRouter} from "next/navigation"

// TODO remove, this demo shouldn't need to reset the theme.

//iTrbhqJChyVnc6n

const defaultTheme = createTheme();

export default function SignIn() {
  const router = useRouter()

  const [email, setEmail] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    loginWithEmailAndPassword(data.get('email'), data.get('password')).then((user) => {
      console.log(user); // This will log the user object or null
      if(user){
        console.log("User signed in");
        router.push("/employee/dashboard")
      } else {
        console.log("User not signed in");
        setErrorMessage("Invalid email or password")
        setSuccessMessage("")
      }
    });

  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    
    resetPassword(email).then((error) => {
      if(error == null){
        console.log("Password reset email sent");
        setSuccessMessage("Password reset email sent")
        setErrorMessage("")
      } else{
        console.log("Error sending password reset email");
        setErrorMessage(error)
        setSuccessMessage("")

      }
    });
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleEmailChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>

            <Grid container>
              <Grid item xs>
                <Link onClick={handleResetPassword} href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
         
              </Grid>
            </Grid>
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>
  );
}