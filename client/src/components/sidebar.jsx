import Icon from "./Icon";

function SideBar(){
    return(
    <div className="fixed top-0 left-0 h-screen flex flex-col border-r-1 border-r-neutral-400 p-1 justify-between">
        <div>
            <SideBarIcon icon='save-icon' text={"save"}/>
        </div>
        <div>
            <SideBarIcon icon='heart' text='donate'/>
            <SideBarIcon icon='question-mark' text='how to use'/>
            <SideBarIcon icon='info' text='about'/>
        </div>
    </div>
    ) 
}

export const SideBarIcon = ({ icon, text=null ,className=''}) => (
    <div className={`flex flex-col items-center justify-center bg-[#48484861] m-2 p-3 pl-5 pr-5 rounded-xl ${className}`} >
        <Icon name={icon} className='h-6 '/>
        {text ? <div className="leading-4 text-center mt-2 mb-2 ">
                {text.split(' ').map((word, index) => (
                    <div key={index}>{word}</div>))}
            </div> : null
        }

    </div>
)

export default SideBar;