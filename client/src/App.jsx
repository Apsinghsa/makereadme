import './App.css'
import SideBar from './components/sidebar'
import { SideBarIcon } from './components/sidebar'
import HomePage from './components/homepage'
import Particles from './components/Particles';



function App() {

  return (
    <div className='bg-black flex items-center text-white'>
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
        <SideBar />
        <HomePage />
      </div>
      {/* <SideBarIcon icon={"sun-theme"} className='fixed top-0 right-0'/> */}
    </div>
  )
}

export default App
