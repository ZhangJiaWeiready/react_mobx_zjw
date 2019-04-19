import { addLocaleData, IntlProvider } from "react-intl";
import { LocaleProvider } from "antd";
import { Provider } from "mobx-react";
import intl from "intl";
import promis from "es6-promise";
import React from "react";

import "antd/dist/antd.less";
import "font-awesome/css/font-awesome.min.css";

import appstore from "./view/store";
import Routes from "./router/routes";
import cnLocale from "./local/zh-CN";
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import 'moment/locale/zh-cn';
import "./style/magic.css";

// import '../resource/jtopo-0.4.8-min.js';
global.Intl = intl; //解决react intl的ie问题
promis.polyfill(); //
addLocaleData(cnLocale.data);
module.exports = (
    <IntlProvider locale={cnLocale.locale} messages={cnLocale.messages}>
        <LocaleProvider locale={zh_CN}>
            <Provider {...appstore}>
                <Routes />
            </Provider>
        </LocaleProvider>
    </IntlProvider>
);
