import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Body from "./Components/Body"
import Navbar from "./Components/Navbar"

function App() { 
  return (
    <>
      <div class="bg-slate-400 min-h-screen px-6 py-3">
        <Navbar/>
        <Header/>
        <Footer/>
        <Body/>
      </div>
    </>
  )
}

export default App