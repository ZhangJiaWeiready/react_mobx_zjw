/**
 * created by zhangjiawei on 2010/1/2
 * 父 mobx
 */
import { observable, action, computed } from 'mobx';

class mainMobx {
    // 初始化值
    @observable title = '欢迎使用react'
    @observable num = 1

    @action addNum = () => {
        this.num = this.num += 1
    }
    // 计算属性 一旦num更改只 copyNum也会改
    @computed get copyNum(){
        return this.num +1
    }
}
export default new mainMobx()