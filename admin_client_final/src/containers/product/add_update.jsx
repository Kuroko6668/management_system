import React, { Component } from 'react'
import {Card,Button,Icon,Form,Input,Select,message} from 'antd'
import {connect} from 'react-redux'
import {reqCategoryList,reqAddProduct,reqProdById,reqUpdateProduct} from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
const {Item} = Form
const {Option} = Select

@connect(
  state => ({
    categoryList:state.categoryList,
    productList:state.productList
  }),
  {}
)
@Form.create()
class AddUpdate extends Component {

  state = {
    categoryList:[],//商品分类列表
    operaType:'add',
    categoryId:'',
    name:'',
    desc:'',
    price:'',
    detail:'',
    imgs:[],
    _id:''
  }

  getCategoryList = async()=>{
    let result = await reqCategoryList()
    const {status,data,msg} = result
    if(status === 0) this.setState({categoryList:data})
    else message.error(msg)
  }

  getProductList = async(id)=>{
    let result = await reqProdById(id)
    const {status,data} = result
    if(status === 0) {
      this.setState({...data})
      this.refs.pictureWall.setFileList(data.imgs)
      this.refs.richTextEditor.setRichText(data.detail)
    }
  }

  componentDidMount(){
    const {categoryList,productList} = this.props
    const {id} = this.props.match.params
    if(categoryList.length)this.setState({categoryList})
    else this.getCategoryList()
    if(id) {
      this.setState({operaType:'update'})
      if(productList.length){
        let result = productList.find((item)=>{
          return item._id === id
        })
        if(result) {
          this.setState({...result})
          this.refs.pictureWall.setFileList(result.imgs)
          this.refs.richTextEditor.setRichText(result.detail)
        }
      }
      else this.getProductList(id)
    }

    
  }

  handleSubmit = (event)=>{
    event.preventDefault()
    //从上传组件中获取已经上传的图片数组
    let imgs = this.refs.pictureWall.getImgArr()
    //从富文本组件中获取用户输入的文字转换为富文本的字符串
    let detail = this.refs.richTextEditor.getRichText()
    const {operaType,_id} = this.state
    this.props.form.validateFields(async(err, values) => {
      if(err) return
      let result
      if(operaType === 'add') result = await reqAddProduct({...values,imgs,detail})
      else result = await reqUpdateProduct({...values,imgs,detail,_id})
      const {status,msg} = result
      if(status === 0) {
        message.success('successful!')
        this.props.history.replace('/admin/prod_about/product')
      }
      else message.error(msg)
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {operaType} = this.state
    return (
        <Card 
          title={
            <div>
              <Button type="link" onClick={this.props.history.goBack}>
                <Icon type="arrow-left"/>
                <span>back</span>
              </Button>
              <span>{operaType==='update' ? 'modify' : 'add'}</span>
            </div>}
        >
          <Form 
            onSubmit={this.handleSubmit}
            labelCol={{md:2}}
            wrapperCol={{md:7}}
          >
            <Item label="product name">
              {
                getFieldDecorator('name', {
                  initialValue:this.state.name || '',
                  rules: [{required: true, message: 'please input product name' }],
                })(
                  <Input
                    placeholder="product name"
                  />
                )
              }
            </Item>
            <Item label="product description">
              {getFieldDecorator('desc', {
                initialValue:this.state.desc || '',
                rules: [
                  { required: true, message: 'please input product description' },
                ],
              })(
                <Input
                  placeholder="product description"
                />
              )}
            </Item>
            <Item label="product price">
              {getFieldDecorator('price', {
                initialValue:this.state.price || '',
                rules: [
                  { required: true, message: 'please input product price' },
                ],
              })(
                <Input
                  placeholder="price"
                  addonAfter="eruo"
                  prefix="€"
                  type="number"
                />
              )}
            </Item>
            <Item label="product category">
              {getFieldDecorator('categoryId', {
                initialValue:this.state.categoryId || '',
                rules: [
                  { required: true, message: 'please select one category' },
                ],
              })(
                <Select>
                  <Option value="">please select one category</Option>
                  {
                    this.state.categoryList.map((item)=>{
                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Item>
            <Item  label="picture" wrapperCol={{md:12}}>
              <PicturesWall ref="pictureWall"/>
            </Item>
            <Item label="detail" wrapperCol={{md:16}}>
              <RichTextEditor ref="richTextEditor"/>
            </Item>
            <Button type="primary" htmlType="submit">submit</Button>
          </Form>
        </Card>
    )
  }
}

export default AddUpdate
