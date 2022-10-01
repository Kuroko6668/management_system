import React,{Component} from 'react'
import './home.css'

export default class Home extends Component{
  render(){
    return (
      <div className="shadow_wrap" style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'100%',fontSize:'34px'}}>
				<span className="floating">Welcome to Wang's Inventory Management System</span>
			</div>
    )
  }
}