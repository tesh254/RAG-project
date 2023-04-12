import '../styles/globals.css'
import "../components/input/input.css";
import "../components/auth-form/auth-form.css";
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
