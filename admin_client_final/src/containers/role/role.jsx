import React,{Component} from 'react'
import {Card,Button,Icon,Table, message,Modal,Form,Input,Tree } from 'antd';
import dayjs from 'dayjs'
import {reqRoleList,reqAddRole,reqAuthRole} from '../../api'
import menuList from '../../config/menu_config'
import {connect} from 'react-redux'
const {Item} = Form
const {TreeNode} = Tree;

@connect(
  state => ({username:state.userInfo.user.username}),
  {}
)
@Form.create()
class Role extends Component{

  state = {
    isShowAdd:false,
    isShowAuth:false,
    roleList:[],
    menuList,
    checkedKeys: [],//选中的菜单
    _id:''//当前操作的角色id
  }

  getRoleList = async()=>{
    let result = await reqRoleList()
    const {status,data} = result
    if(status===0) this.setState({roleList:data})
  }

  componentDidMount(){
    this.getRoleList()
  }

  //新增角色--确认按钮
  handleOk = ()=>{
    this.props.form.validateFields(async(err, values) => {
      if(err) return
      let result = await reqAddRole(values)
      const {status,msg} = result
      if(status===0) {
        message.success('successfully add a role')
        this.getRoleList()
        this.setState({isShowAdd:false})
      }
      else message.error(msg)
    });
  }

  //新增角色--取消按钮
  handleCancel = ()=>{
    this.setState({isShowAdd:false})
  }

  //授权弹窗--确认按钮
  handleAuthOk = async()=>{
    const {_id,checkedKeys} = this.state
    const {username} = this.props
    let result = await reqAuthRole({_id,menus:checkedKeys,auth_name:username})
    const {status,msg} = result
    if(status===0) {
      message.success('authorize a role',1)
      this.setState({isShowAuth:false})
      this.getRoleList()
    }
    else message.error(msg,1)
  }

  //授权弹窗--取消按钮
  handleAuthCancel = ()=>{
    this.setState({isShowAuth:false})
  }

  onCheck = checkedKeys => this.setState({ checkedKeys });

  //用于展示授权弹窗
  showAuth = (id)=>{
    const {roleList} = this.state
    let result = roleList.find((item)=>{
      return item._id === id
    })
    if(result) this.setState({checkedKeys:result.menus})
    this.setState({isShowAuth:true,_id:id})
  }

  //用于展示新增弹窗
  showAdd = ()=>{
    this.props.form.resetFields()
    this.setState({isShowAdd:true});
  }

  renderTreeNodes = (data) =>
      data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
  });

  render(){
    const dataSource = this.state.roleList
    const columns = [
      {
        title: 'role name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'create time',
        dataIndex: 'create_time',
        key: 'create_time',
        render:(time)=> dayjs(time).format('MM/DD/YYYY HH:mm:ss')
      },
      {
        title: 'authorised time',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render:(time)=> time ? dayjs(time).format('MM/DD/YYYY HH:mm:ss') : ''
      },
      {
        title: 'authorised person ',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: 'operation',
        key: 'option',
        render: (item) => <Button type='link' onClick={()=>{this.showAuth(item._id)}}>set authorization</Button>
      }
    ];
    //treeData是属性菜单的源数据
    const treeData = this.state.menuList
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Card
          title={<Button type='primary' onClick={()=>{this.showAdd()}}>
                  <Icon type="plus"/>
                  add a role
                 </Button>}
          style={{ width: '100% '}}
        >
          <Table 
            dataSource={dataSource} 
            columns={columns}
            bordered
            pagination={{defaultPageSize:5}}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          title="add a role"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="confirm"
          cancelText="cancel"
        >
          <Form onSubmit={this.handleOk}>
            <Item>
              {getFieldDecorator('roleName', {
                initialValue:'',
                rules: [
                  {required: true, message: 'you must input role name' },
                ],
              })(
                <Input placeholder="please input role name" />
              )}
            </Item>
          </Form>
        </Modal>
        {/* 设置权限提示框 */}
        <Modal
          title="set authorization"
          visible={this.state.isShowAuth}
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
          okText="confirm"
          cancelText="cancel"
        >
          <Tree
            checkable //允许选中
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll={true}
          >
            <TreeNode title='platform function' key='top'>
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>
        </Modal>
      </div>
    )
  }
}

export default Role