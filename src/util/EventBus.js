/**
 * Created by maixing on 2018/01/22 13:35
 * 消息总线
 */
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { isFunction, has, isArray } from "lodash";
let action = new Subject();
let map = new Map();
const listener = action
    .pipe(
        filter(event => {
            if (map.has(event.type)) {
                return true;
            } else {
                return false;
            }
        })
    )
    .subscribe(event => {
        let funs = map.get(event.type);
        if (funs) {
            funs.map((fun, index) => {
                if (fun && isFunction(fun) && has(event, "data")) {
                    fun.call(null, event.data);
                }
            });
        }
    });

/**
 * 初始化
 */
let init = () => {};

/**
 * 添加监听
 */
let addAppEventListener = (type, callBack) => {
    let callBacks = [];
    if (map.has(type)) {
        callBacks = map.get(type);
    }
    if (callBacks.indexOf(callBack) == -1) {
        callBacks.push(callBack);
    }
    map.set(type, callBacks);
};

/**
 * 移除所有监听
 */
let removeAllAppEventListener = type => {
    if (map.has(type)) {
        let funs = map.get(type);
        if (funs) {
            for (let fun in funs) {
                fun = null;
            }
            funs.splice(0);
        }
        map.delete(type);
    }
};

/**
 * 移除指定监听
 */
let removeAppEventListener = (type, callBack) => {
    try {
        if (map.has(type)) {
            let funs = map.get(type);
            if (funs) {
                let index = funs.indexOf(callBack);
                if (index != -1) {
                    let fun = funs[index];
                    fun = null;
                    funs.splice(index, 1);
                }
                map.set(type, funs);
            }
            if (funs && isArray(funs) && funs.length == 0) {
                // console.log("removeAppEventListener---->>type=%o,result=%", type, map.delete(type));
            }
        }
    } catch (e) {
        console.log("removeAppEventListener--->%s", e.toString());
    }
};

/**
 * 事件派发
 */
let dispatchAppEventListener = (type, data) => {
    action.next({
        type: type,
        data: data
    });
};

export {
    init,
    addAppEventListener,
    removeAppEventListener,
    dispatchAppEventListener,
    removeAllAppEventListener
};
