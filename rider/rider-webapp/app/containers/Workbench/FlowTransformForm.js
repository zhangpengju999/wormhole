/*
 * <<
 * wormhole
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React from 'react'

import DataSystemSelector from '../../components/DataSystemSelector'
import Form from 'antd/lib/form'
const FormItem = Form.Item
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Cascader from 'antd/lib/cascader'
import Radio from 'antd/lib/radio'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

export class FlowTransformForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      transformNamespaceHierarchy: [],
      sinkNamespaceHierarchy: [],
      transformModalVisible: false
    }
  }

  onTransformTypeSelect = (e) => {
    // 调用上层函数
    this.props.onInitTransformValue(e.target.value)
  }

  onLookupSqlTypeItemSelect = (val) => {
    // console.log(val)
  }

  // 通过不同的Transformation里的 Sink Data System 显示不同的 Sink Namespace 的内容
  onTransformSinkDataSystemItemSelect = (val) => {
    this.props.form.setFieldsValue({
      transformSinkNamespace: undefined
    })
    this.props.onInitTransformSinkTypeNamespace(this.props.projectIdGeted, val, 'transType')
  }

  forceCheckTimeoutSave = (rule, value, callback) => {
    const reg = /^\d+$/
    if (reg.test(value)) {
      callback()
    } else {
      callback('必须是数字')
    }
  }

  render () {
    const { form } = this.props
    const { transformValue, transformSinkTypeNamespaceData } = this.props
    const { getFieldDecorator } = form

    const itemStyle = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 }
    }

    const itemStyleTimeout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 6 }
    }

    const transformTypeClassNames = [
      transformValue === 'lookupSql' ? '' : 'hide',
      transformValue === 'sparkSql' ? '' : 'hide',
      transformValue === 'streamJoinSql' ? '' : 'hide',
      transformValue === 'transformClassName' ? '' : 'hide'
    ]

    const transformTypeHiddens = [
      transformValue !== 'lookupSql',
      transformValue !== 'sparkSql',
      transformValue !== 'streamJoinSql',
      transformValue !== 'transformClassName'
    ]

    const flowLookupSqlType = [
      { value: 'leftJoin', text: 'Left Join' },
      // { value: 'rightJoin', text: 'Right Join' },
      { value: 'innerJoin', text: 'Inner Join' },
      { value: 'union', text: 'Union' }
    ]

    const flowStreamJoinSqlType = [
      { value: 'leftJoin', text: 'Left Join' },
      { value: 'rightJoin', text: 'Right Join' },
      { value: 'innerJoin', text: 'Inner Join' }
    ]

    const sinkDataSystemData = [
      { value: 'oracle', icon: 'icon-amy-db-oracle' },
      { value: 'mysql', icon: 'icon-mysql' },
      { value: 'es', icon: 'icon-elastic', style: {fontSize: '24px'} },
      { value: 'hbase', icon: 'icon-hbase1' },
      { value: 'phoenix', text: 'Phoenix' },
      { value: 'kafka', text: 'Kafka' }
    ]

    return (
      <Form className="transform-modal-style">
        <Row>
          <Col span={24}>
            <FormItem label="Source Namespace" {...itemStyle}>
              {getFieldDecorator('step2SourceNamespace', {})(
                <p className="value-font-style">{this.props.step2SourceNamespace}</p>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="Sink Namespace" {...itemStyle}>
              {getFieldDecorator('step2SinkNamespace', {})(
                <p className="value-font-style">{this.props.step2SinkNamespace}</p>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem className="hide">
              {getFieldDecorator('editTransformId', {})(
                <Input />
              )}
            </FormItem>
            <FormItem label="Transformation" {...itemStyle}>
              {getFieldDecorator('transformation', {
                rules: [{
                  required: true,
                  message: '请选择 Transformation'
                }]
              })(
                <RadioGroup onChange={this.onTransformTypeSelect}>
                  <RadioButton value="lookupSql">Lookup SQL</RadioButton>
                  <RadioButton value="sparkSql">Spark SQL</RadioButton>
                  <RadioButton value="streamJoinSql">Stream Join SQL</RadioButton>
                  <RadioButton value="transformClassName">ClassName</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Col>

          {/* 设置 Lookup Sql */}
          <Col span={24} className={transformTypeClassNames[0]}>
            <FormItem label="Type" {...itemStyle} style={{lineHeight: '36px'}}>
              {getFieldDecorator('lookupSqlType', {
                rules: [{
                  required: true,
                  message: '请选择 Type'
                }],
                hidden: transformTypeHiddens[0]
              })(
                <DataSystemSelector
                  data={flowLookupSqlType}
                  onItemSelect={this.onLookupSqlTypeItemSelect}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24} className={transformTypeClassNames[0]}>
            <FormItem label="Data System" {...itemStyle} style={{lineHeight: '36px'}}>
              {getFieldDecorator('transformSinkDataSystem', {
                rules: [{
                  required: true,
                  message: '请选择 Data System'
                }],
                hidden: transformTypeHiddens[0]
              })(
                <DataSystemSelector
                  data={sinkDataSystemData}
                  onItemSelect={this.onTransformSinkDataSystemItemSelect}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24} className={transformTypeClassNames[0]}>
            <FormItem label="Namespace" {...itemStyle}>
              {getFieldDecorator('transformSinkNamespace', {
                rules: [{
                  required: true,
                  message: '请选择 Namespace'
                }],
                hidden: transformTypeHiddens[0]
              })(
                <Cascader
                  placeholder="Select a Namespace"
                  popupClassName="ri-workbench-select-dropdown"
                  options={transformSinkTypeNamespaceData}
                  expandTrigger="hover"
                  displayRender={(labels) => labels.join('.')}
                  // onChange={(labels, options) => {
                  //   const { topicName, topicId, type } = options[options.length - 1]
                  //   this.props.form.setFieldsValue({
                  //     sourceTopicName: topicName,
                  //     sourceTopicId: topicId,
                  //     sourceType: type
                  //   })
                  // }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24} className={transformTypeClassNames[0]}>
            <FormItem label="SQL" {...itemStyle}>
              {getFieldDecorator('lookupSql', {
                rules: [{
                  required: true,
                  message: '请填写 Lookup SQL'
                }],
                hidden: transformTypeHiddens[0]
              })(
                <Input type="textarea" placeholder="Lookup SQL" autosize={{ minRows: 5, maxRows: 8 }} />
              )}
            </FormItem>
          </Col>

          {/* 设置 Spark Sql */}
          <Col span={24} className={transformTypeClassNames[1]}>
            <FormItem label="SQL" {...itemStyle}>
              {getFieldDecorator('sparkSql', {
                rules: [{
                  required: true,
                  message: '请填写 Spark SQL'
                }],
                hidden: transformTypeHiddens[1]
              })(
                <Input type="textarea" placeholder="Spark SQL" autosize={{ minRows: 5, maxRows: 8 }} />
              )}
            </FormItem>
          </Col>

          {/* 设置 Stream Join Sql */}
          <Col span={24} className={transformTypeClassNames[2]}>
            <FormItem label="Type" {...itemStyle} style={{lineHeight: '36px'}}>
              {getFieldDecorator('streamJoinSqlType', {
                rules: [{
                  required: true,
                  message: '请选择 Type'
                }],
                hidden: transformTypeHiddens[2]
              })(
                <DataSystemSelector
                  data={flowStreamJoinSqlType}
                  onItemSelect={this.onStreamJoinSqlTypeItemSelect}
                />
              )}
            </FormItem>
          </Col>
          {/* <Col span={15} className={transformTypeClassNames[2]} style={{width: '63.5%'}}>
            <FormItem label="Config" {...itemStyleNs}>
              {getFieldDecorator('streamJoinSqlConfig', {
                rules: [{
                  required: true,
                  message: '请选择一个 Config'
                }],
                hidden: transformTypeHiddens[2]
              })(
                <Select
                  placeholder="Config"
                  dropdownClassName="ri-workbench-select-dropdown"
                  onSelect={this.onStreamJoinSqlConfigTypeSelect}
                >
                  <Option value="config01">Config01</Option>
                  <Option value="config02">Config02</Option>
                  <Option value="config03">Config03</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} className={transformTypeClassNames[2]} style={{width: '32.5%'}}>
            <FormItem label="Timeout" {...itemStyleTable}>
              {getFieldDecorator('timeout', {
                rules: [{
                  required: true,
                  message: '请填写 Timeout'
                }],
                hidden: transformTypeHiddens[2]
              })(
                <Input placeholder="Timeout" />
              )}
            </FormItem>
          </Col> */}
          <Col span={24} className={transformTypeClassNames[2]}>
            <FormItem label="Timeout (Sec)" {...itemStyleTimeout}>
              {getFieldDecorator('timeout', {
                rules: [{
                  required: true,
                  message: '请填写 Timeout'
                }, {
                  validator: this.forceCheckTimeoutSave
                }],
                hidden: transformTypeHiddens[2]
              })(
                <InputNumber min={10} max={1800} step={1} placeholder="Timeout" />
              )}
            </FormItem>
          </Col>
          <Col span={24} className={transformTypeClassNames[2]}>
            <FormItem label="SQL" {...itemStyle}>
              {getFieldDecorator('streamJoinSql', {
                rules: [{
                  required: true,
                  message: '请填写 Stream Join SQL'
                }],
                hidden: transformTypeHiddens[2]
              })(
                <Input type="textarea" placeholder="Stream Join SQL" autosize={{ minRows: 5, maxRows: 8 }} />
              )}
            </FormItem>
          </Col>

          {/* 设置 ClassName */}
          <Col span={24} className={transformTypeClassNames[3]}>
            <FormItem label="ClassName" {...itemStyle}>
              {getFieldDecorator('transformClassName', {
                rules: [{
                  required: true,
                  message: '请填写 ClassName'
                }],
                hidden: transformTypeHiddens[3]
              })(
                <Input type="textarea" placeholder="ClassName" autosize={{ minRows: 5, maxRows: 8 }} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>

    )
  }
}

FlowTransformForm.propTypes = {
  form: React.PropTypes.any,
  transformSinkTypeNamespaceData: React.PropTypes.array,
  projectIdGeted: React.PropTypes.string,
  transformValue: React.PropTypes.string,
  step2SinkNamespace: React.PropTypes.string,
  step2SourceNamespace: React.PropTypes.string,
  onInitTransformValue: React.PropTypes.func,
  onInitTransformSinkTypeNamespace: React.PropTypes.func
}

export default Form.create({wrappedComponentRef: true})(FlowTransformForm)
