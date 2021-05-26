import '../styles/globals.scss';
import '../styles/navbar.scss';
import Navbar from '../components/navigation/Navbar';
import "../styles/calender.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
        <Navbar />
        <Component {...pageProps} />
    </>
  );
}