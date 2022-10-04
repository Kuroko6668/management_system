import React,{Component} from 'react'
import {Form,Icon,Input,Button,message} from 'antd';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createSaveUserInfoAction} from '../../redux/action_creators/login_action'
import {reqLogin} from '../../api'
import './css/login.less'
import logo from '../../static/imgs/logo.png'
const {Item} = Form

@connect(
  state => ({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)
@Form.create()
class Login extends Component{

  //点击登录按钮的回调
  handleSubmit = (event)=>{
    //阻止默认事件--禁止form表单提交---通过ajax发送
    event.preventDefault();
    //表单的统一验证
    this.props.form.validateFields(async(err, values) => {
      //获取用户输入
      const {username,password} = values
      if(!err){
        //若用户输入无错误，发送登录请求
        let result = await reqLogin(username,password)
        //从响应中获取：请求状态、错误信息、数据
        const {status,msg,data} = result
        if(status === 0){
          //1.服务器返回的user信息，还有token交由redux管理
          this.props.saveUserInfo(data)
          //2.跳转admin页面
          this.props.history.replace('/admin')
        }else message.warning(msg,1)
      }else message.error('incorrrect content, please check')
    });
  }

  //密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断
  pwdValidator = (rule,value,callback)=>{
    if(!value){
      callback('Username must be entered!')
    }else if(value.length>12){
      callback('Username must be less than or equal to 12 digits')
    }else if(value.length<4){
      callback('Username must be greater than or equal to 4 digits')
    }else if(!(/^\w+$/).test(value)){
      callback('User name must be a combination of letters, numbers and underscores')
    }else{
      callback()
    }
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    //从redux中获取用户的登录状态
    const {isLogin} = this.props;
    //如果已经登录了，重定向到admin页面
    if(isLogin)return <Redirect to="/admin/home"/>
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>Inventory System</h1>
        </header>
        <section>
          <h1>sign in</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
            {getFieldDecorator('username', {
                rules: [
                  {required: true, message: 'Username must be entered!'},
                  {max: 12, message: 'Username must be less than or equal to 12 digits'},
                  {min: 4, message: 'Username must be greater than or equal to 4 digits'},
                  {pattern: /^\w+$/, message: 'User name must be a combination of letters, numbers and underscores'},
                ],
              })(
                <Input 
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                    placeholder="default user name: admin"
                />,
              )}
            </Item>
            <Item>
            {getFieldDecorator('password', {
                rules: [
                  {validator: this.pwdValidator},
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="default password:admin"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                sign in
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Login

