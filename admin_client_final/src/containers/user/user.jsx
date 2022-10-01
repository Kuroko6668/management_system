import React,{Component} from 'react'
import {Card,Button,Icon,Table, message,Modal,Form,Input,Select} from 'antd';
import dayjs from 'dayjs'
import {reqUserList,reqAddUser} from '../../api'
import {PAGE_SIZE} from '../../config'
const {Item} = Form
const {Option} = Select

@Form.create()
class User extends Component{

  state = {
    isShowAdd:false, //是否展示新增弹窗
    userList:[],//用户列表
    roleList:[]//角色列表
  }

  getUserList = async()=>{
    let result = await reqUserList()
    const {status,data} = result
    if(status === 0) this.setState({
      userList:data.users.reverse(),
      roleList:data.roles
    })
  }

  componentDidMount(){
    this.getUserList()
  }

  //新增用户弹窗----确定按钮回调
  handleOk = ()=>{
    this.props.form.validateFields(async(err, values) => {
      if(err) return
      let result = await reqAddUser(values)
      const {status,data,msg} = result
      if(status===0){
        message.success('添加用户成功')
        let userList = [...this.state.userList]
        userList.unshift(data)
        this.setState({userList,isShowAdd:false})
      }
      else message.error(msg,1)
    });
  }

  //新增用户弹窗----取消按钮回调
  handleCancel = ()=>{
    this.setState({isShowAdd:false})
  }

  
  render(){
    const dataSource = this.state.userList
    const columns = [
      {
        title: 'username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'phone number',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'register time',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('MM/DD/YYYY HH:mm:ss')
      },
      {
        title: 'role',
        dataIndex: 'role_id',
        key: 'role_id',
        render:(id)=>{
          let result = this.state.roleList.find((item)=>{
            return item._id === id
          })
          if(result) return result.name
        }
      },
      {
        title: 'option',
        key: 'option',
        render: () => (
          <div>
            <Button 
              type='link' 
             >modify
            </Button>
            <Button 
              type='link' 
             >delete
            </Button>
          </div>
          )
      }
    ];
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Card
          title={
            <Button type='primary' onClick={()=>{this.setState({isShowAdd:true});this.props.form.resetFields()}}>
              <Icon type="plus"/>register user
            </Button>
          }
        >
          <Table 
            dataSource={dataSource} 
            columns={columns}
            bordered
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title="add user"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="confirm"
          cancelText="cancel"
        >
          <Form labelCol={{span:4}} wrapperCol={{span:16}}>
            <Item label="user name">
              {getFieldDecorator('username', {
                initialValue:'',
                rules: [{required: true, message: 'User name must be entered' },],
              })(<Input placeholder="Please enter your username"/>)}
            </Item>
            <Item label="password" >
              {getFieldDecorator('password', {
                initialValue:'',
                rules: [{required: true, message: 'password must be entered' },],
              })(<Input placeholder="please input password" type="password"/>)}
            </Item>
            <Item label="phone number">
              {getFieldDecorator('phone', {
                initialValue:'',
                rules: [{required: true, message: 'you must input phone number' },],
              })(<Input placeholder="please input phone number"/>)}
            </Item>
            <Item label="email">
              {getFieldDecorator('email', {
                initialValue:'',
                rules: [{required: true, message: 'please input email' },],
              })(<Input placeholder="please input email"/>)}
            </Item>
            <Item label="role">
              {getFieldDecorator('role_id', {
                initialValue:'',
                rules: [{required: true, message: 'please select a role' },],
              })(
                <Select>
                  <Option value=''>please select a role</Option>
                  {
                    this.state.roleList.map((item)=>{
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User