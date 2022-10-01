import React,{Component} from 'react'
import {Icon,Button,Modal} from 'antd'
import {withRouter} from 'react-router-dom' //在非路由组件中，要使用路由组件的api，借助withRouter实现
import screenfull from 'screenfull'
import {connect} from 'react-redux'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
import menuList from '../../../config/menu_config'
import {reqWeather} from '../../../api'
import './header.less'
const {confirm} = Modal;

@connect(
  state => ({
    userInfo:state.userInfo,
    title:state.title
  }),
  {
    deleteUser:createDeleteUserInfoAction,
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class Header extends Component{

  state = {
    isFull:false,
    date:dayjs().format('MM/DD/YYYY HH:mm:ss'),
    weatherInfo:{},
    title:''
  }

  //获取天气数据
  getWeather = async()=>{
    let weather = await reqWeather()
    this.setState({weatherInfo:weather})
  }

  componentDidMount(){
    //给screenfull绑定监听
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({isFull})
    });
    //更新时间
    this.timeID = setInterval(()=>{
      this.setState({date:dayjs().format('MM/DD/YYYY HH:mm:ss')})
    },1000)

    //展示当前菜单名称
    this.getTitle()
  }

  componentWillUnmount(){
    //清除更新时间定时器
    clearInterval(this.timeID)
  }

  //切换全屏按钮的回调
  fullScreen = ()=>{
    screenfull.toggle()
  }

  //点击退出登录的回调
  logOut = ()=>{
    let {deleteUser,saveTitle} = this.props
    confirm({
      title: 'are you sure to sign out?',
      content: 'if you log out, you need to sign in again',
      cancelText:'cancel',
      okText:'confirm',
      onOk(){
        saveTitle('')
        deleteUser()
      },
    });
  }

  getTitle = ()=>{
    let {pathname} = this.props.location
    let pathKey = pathname.split('/').reverse()[0]
    if(pathname.indexOf('product') !== -1) pathKey = 'product'
    let title = ''
    menuList.forEach((item)=>{
      if(item.children instanceof Array){
       let tmp =  item.children.find((citem)=>{
          return citem.key === pathKey
        })
       if(tmp) title = tmp.title
      }else{
        if( pathKey === item.key) title = item.title
      }
    })
    this.setState({title})
  }

  render(){
    let {isFull,weatherInfo} = this.state
    let {user} = this.props.userInfo
    return (
      <header className="header">
        <div className="header-top">
            <Button size="small" onClick={this.fullScreen}>
              <Icon type={isFull ? 'fullscreen-exit':'fullscreen'}/>
            </Button>
            <span className="username">Welcome, {user.username}</span>
            <Button type="link" onClick={this.logOut} >Sign out</Button>
        </div>
        <div className="header-bottom">
            <div className="header-bottom-left">
              {this.props.title || this.state.title}
            </div>
            <div className="header-bottom-right">
              {this.state.date}
            </div>
        </div>
      </header>
    )
  }
}
export default Header
