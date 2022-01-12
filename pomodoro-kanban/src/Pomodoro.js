// JavaScript Document

import React, {useState, useEffect, useRef, useCallback} from "react";
import Button from 'react-bootstrap/Button';


export default function Pomodoro(){
	const[minutes, setMinutes] = useState(25);
	const[seconds, setSeconds] = useState(0);
	const[displayMessage, setDisplayMessage] = useState(false);
	const[started, setStarted] = useState(false);
	const isMounted = useRef(true) 

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])
	
	const btnClick = useCallback(async () => {
    // don't send again while we are sending
    if (started) return
    // update state
    setStarted(true)
    // send the actual request
    await countdown();
    if (isMounted.current) // only update if we are still mounted
      setStarted(false)
  }, [started]) // update the callback if the state changes
	
	function countdown(){
		if(started){
		let interval = setInterval(()=> {
			clearInterval(interval);
			if(seconds === 0 && started == true){
				if( minutes !== 0){
					setSeconds(59);
					setMinutes(minutes-1);
					
				} else{
					let minutes = displayMessage ? 24 :  4;
					let seconds = 59;
					
					setSeconds(seconds);
					setMinutes(minutes);
					setDisplayMessage(!displayMessage);
					
				}
			}else{
				setSeconds(seconds - 1);
			
			}
		}, 1000)
	}
	}
	
	
	useEffect(()=>{
		let interval = setInterval(()=> {
			clearInterval(interval);
			if(seconds === 0 && started == true){
				if( minutes !== 0){
					setSeconds(59);
					setMinutes(minutes-1);
					
				} else{
					let minutes = displayMessage ? 24 :  4;
					let seconds = 59;
					
					setSeconds(seconds);
					setMinutes(minutes);
					setDisplayMessage(!displayMessage);
					
				}
			}else if(started == true){
				setSeconds(seconds - 1);
			
			}
		}, 1000)
	},[seconds]);
	
	const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;
	const btnTimer = seconds; 
	
	return <div className="pomodoro" style={{display:'flex',justifyContent:'center', height:'100%'}}>
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
	<h2 className="mb-3"> Timer </h2>
			<div className="message" style={{margin: 8}}>
				<div style={{
						padding: 4,
						width: 250,
						minHeight: 500
					}}>
					{displayMessage && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					 	<h3 style={{fontSize: '25px'}}> Break time!</h3>
					 	<p> Next session starts in: </p> 
					</div>}
<div className="timer" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><h2 >{timerMinutes}:{timerSeconds}</h2>
<Button variant="outline-secondary" onClick={btnClick}> Begin Timer</Button></div>
	
				</div>
					
		</div>
</div>
</div>;
}