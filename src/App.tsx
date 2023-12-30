import React, { useEffect, useMemo, useReducer } from 'react'
import { Table, Input, Select, Modal, Form, InputNumber } from 'antd'
import { throttle, find } from 'lodash'
import { initialState, reducer } from './store/state'
import { isSubString } from './utils'
import { IDataItem, ISelectOptItem } from './types'
import { dataSource, selectData } from './mock'
import './App.css'

const { Option } = Select
const { TextArea } = Input
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [form] = Form.useForm();

  const onTablePageChange = (page: number, pageSize: number) => {
    dispatch({ type: 'updatePageInfo', payload: { pageNum: page, pageSize } })
  }

  const handleSearch = (input: string, option: number) => {
    const val = input.replace(/\s+/g, '').toLowerCase()
    const data = state.originData
    if (!val) {
      dispatch({ type: 'updateListData', payload: data })
    } else {
      const filterData = data.filter(
        (item: IDataItem) => isSubString(val, item.name.toLowerCase())
        && (item.category ===  option || option === -1))
      dispatch({ type: 'updateListData', payload: filterData })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    dispatch({ type: 'updateInputValue', payload: val })
    handleSearch(val, state.optionValue)
  }

  const handleOptionChange = (val: number) => {
    dispatch({ type: 'updateOptionValue', payload: val })
    handleSearch(state.inputValue, val)
  }

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      dispatch({ type: 'updateCurrItem', payload: values })
      dispatch({ type: 'updateModal', payload: false })
    })
  }

  const tableColumns = useMemo(() => ([
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string, record: IDataItem) => <span className='search_name' onClick={() => {
        dispatch({ type: 'updateModal', payload: true })
        dispatch({ type: 'setCurrItem', payload: record.id })
      }}>{text}</span>
    },
    {
      title: 'Category',
      render: (text: number, record: IDataItem) => 
        <>{find(selectData, (v: ISelectOptItem) => v.value === record.category)?.name}</>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (text: number) => `$${text}`
    },
    {
      title: 'Remark',
      dataIndex: 'remark'
    }
  ]), [dispatch])

  useEffect(() => {
    dispatch({ type: 'updateListData', payload: dataSource })
    dispatch({ type: 'initOriginData', payload: dataSource })
  }, [])

  useEffect(() => {
    if (state.visible) {  
      form.setFieldsValue(state.currItem)
    } else {
      form.resetFields()
    }
  }, [form, state])

  return (
    <div className="App">
      <div className='search_container'>
        <Input style={{ width: 400 }} value={state.inputValue} onChange={throttle(handleInputChange, 300)} placeholder='Please Type Name For Search'/>
        <Select value={state.optionValue} onChange={handleOptionChange} className='search_selector'>
            {
                selectData.map(item => {
                    return (
                        <Option key={item.value} value={item.value}>{item.name}</Option>
                    )
                })
            }
        </Select>
      </div>
      <Table 
        columns={tableColumns}
        dataSource={state.listData}
        pagination={{
          total: state.listData.length,
          pageSize: state.pageInfo.pageSize,
          current: state.pageInfo.pageNum,
          onChange: onTablePageChange
        }}
      />
      <Modal
        title="Edit"
        open={state.visible} 
        onOk={handleEditSubmit}
        onCancel={() => dispatch({ type: 'updateModal', payload: false })}
      >
        <Form form={form} {...layout}>
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='category' label='Category' rules={[{ required: true }]}>
            <Select>
              {
                  selectData.map(item => {
                      return (
                          <Option key={item.value} value={item.value}>{item.name}</Option>
                      )
                  })
              }
            </Select>
          </Form.Item>
          <Form.Item name='price' label='Price' rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name='remark' label='Remark'>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
