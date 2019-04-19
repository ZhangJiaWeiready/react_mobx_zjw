/**
 * Created by zhangjaiwei on 2019/4/19
 */
import React from "react";
import { inject, observer } from 'mobx-react';
import Common from '../component/common';
import "./main.less";

@inject('MainMobx')
@observer
export default class Main extends React.Component {
    constructor() {
        super();
    }
    
    
    render() {
        const {
            title
        } = this.props.MainMobx;
        return (
            <div className="home-wrap" >
                <h1 style={{textAlign: 'center'}}>{title}</h1>
                <Common/>
            </div>
        );
    }
}

