/**
 *  created by zhangjiawei on 2019/4/19
 *  公用组件
 */
import React,{ Component, Fragment } from 'react';
import { Button, Row, Col } from 'antd';
import { inject, observer} from 'mobx-react';

@inject('MainMobx')
@observer
export default class Common extends Component {
    addNums = () => {
        const {
            addNum
        } = this.props.MainMobx;
        addNum()
    }
    render() {
        const {
            num,
            copyNum
        } = this.props.MainMobx
        return (
            <Fragment>
                <Row style={{textAlign: 'center'}}>
                    <Col>
                        {num}
                    </Col>
                    <Col>
                        <Button onClick={this.addNums} type="primary">增加</Button>
                    </Col>
                    <Col>
                        {copyNum}
                    </Col>
                </Row>
            </Fragment>
        )   
    }
}