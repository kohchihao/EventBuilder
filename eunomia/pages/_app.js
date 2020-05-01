import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import "./empty.css"
import {initGA, logPageView} from "../src/GoogleAnalytics";
import SnackbarProvider from "../components/snackbar/SnackbarProvider";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';


export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    if (!window.GA_INITIALIZED && process.env.NODE_ENV !== "development") {
      initGA();
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Build Events</title>
        </Head>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Component {...pageProps} />
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
