import { useState, useEffect, useRef } from 'react'
import './tabs.css'


function Tabs({tabs, currentTab, selectTab, deleteTab}) {

  const Tab = ({name, id, index}) => {
    const [selected, setSelected] = useState(false);
    const [animate, setAnimate] = useState(false);
    const textRef = useRef(null)
    const containerRef = useRef(null)


    useEffect(() => {
      if(index == currentTab){
        setSelected(true);
      }else{
        setSelected(false)
      }
    }, []);

    useEffect(() => {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;

      if(textWidth > containerWidth){
        setAnimate(true)
      }else{
        false
      }
    }, [name])

    return(
      <div title={name} ref={containerRef} className={selected ? 'tab-selected' : 'tab'} onClick={() => selectTab(index)}>
        <span ref={textRef} className={animate ? 'animated-name' : 'name'}>{name}</span>
        <button onClick={(e) => {
          e.stopPropagation();
          deleteTab(id)
        }}>X</button>
      </div>
    )
  }

  return (
    <div className='tabs-container'>
        {tabs && tabs.map((tab, index) => 
          <Tab name={tab.name} id={tab.id} index={index} key={tab.id}/>
        )}
    </div>
  )
}

export default Tabs 
