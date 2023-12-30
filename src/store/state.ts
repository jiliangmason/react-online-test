import { find, findIndex } from 'lodash'
import { IDataItem, IState, IAction } from '../types'
import { isSubString } from '../utils'

export const initialState: IState = {
    inputValue: '',
    optionValue: -1,    
    pageInfo: {
        pageNum: 1,
        pageSize: 4,
    },
    listData: [],
    // 全量数据的备份
    originData: [],
    visible: false,
    currItem: null
}

export const reducer = (state: IState, action: IAction) => {
    const { payload } = action
    switch(action.type) {
        case 'updateInputValue':
            return {
                ...state,
                inputValue: payload
            }
        case 'updateOptionValue':
            return {
                ...state,
                optionValue: payload
            }
        case 'updatePageInfo':
            return {
                ...state,
                pageInfo: payload
            }
        case 'updateListData':
            return {
                ...state,
                listData: payload.map((v: IDataItem) => ({ key: v.id, ...v })),
            }
        case 'initOriginData':
            return {
                ...state,
                originData: payload,
            }
        case 'updateModal':
            return {
                ...state,
                visible: payload,
            }
        case 'setCurrItem':
            return {
                ...state,
                currItem: find(state.originData, (v: IDataItem) => v.id === payload) || null,
            }
        case 'updateCurrItem':
            const input = state.inputValue
            const opt = state.optionValue
            const currId = state.currItem?.id
            const delIndex = findIndex(state.originData, (v: IDataItem) => v.id === currId)
            const newData = { ...state.currItem, ...payload }
            let list = []
            if (delIndex > -1) {
                state.originData.splice(delIndex, 1, newData)
            }
            if (!input) {
                list = state.originData
            } else {
                const filterData = state.originData.filter(
                  (item: IDataItem) => isSubString(input, item.name.toLowerCase())
                  && (item.category ===  opt || opt === -1))
                list = filterData
            }
            return {
                ...state,
                listData: list.map((v: IDataItem) => ({ key: v.id, ...v })),
            }
        default: 
            return state
    }
}