import './App.css'
import SideBar from './components/sidebar'
import { SideBarIcon } from './components/sidebar'
import HomePage from './components/homepage'

function App() {

  return (
    <div className='bg-black flex items-center text-white'>
      <SideBar />
      <HomePage />
      {/* <SideBarIcon icon={"sun-theme"} className='fixed top-0 right-0'/> */}
    </div>
  )
}

export default App
