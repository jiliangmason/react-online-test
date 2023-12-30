export interface IDataItem {
    id: string
    name: string
    category: number
    price: number
    remark: string
}

export interface ISelectOptItem {
    value: number
    name: string
}

interface IPageInfo {
    pageNum: number
    pageSize: number
}

export interface IState {
    inputValue: string
    optionValue: number
    pageInfo: IPageInfo
    listData: IDataItem[]
    originData: IDataItem[]
    visible: boolean
    currItem: IDataItem | null
}

export interface IAction {
    type: 'updateInputValue' | 'updateOptionValue' | 'updatePageInfo' | 'updateListData'
        | 'initOriginData' | 'updateModal' | 'setCurrItem' | 'updateCurrItem'
    payload: any
}