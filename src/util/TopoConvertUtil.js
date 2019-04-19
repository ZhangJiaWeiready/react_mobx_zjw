/**
 * 拓扑转换工具以及缓存工具
 * */
const nodePropertys = ['x', 'y', 'image', 'w', 'h', 'name', 'id', 'font', 'color'];
const linkPropertys = ['fromId', 'toId', 'id', 'name', 'color', 'w'];
const groupPropertys = ['id', 'name', 'x', 'y', 'w', 'h', 'children'];
const cachMap = new Map();
const jcachMap = new Map();



window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
JTopo.Link.prototype.drawanimepic=function(imgurl,scene,width,height, zIndex){
    
    // 创建一个节点
    var imgnode=new JTopo.Node(); 
    if(zIndex === 4){
        imgnode.setSize(4,4)
    }else {
        imgnode.setSize(width?width:50,height?height:8)
    }
    imgnode.setImage(imgurl);
    imgnode.setLocation(50, 50) 
    // img 
    imgnode.zIndex=4;
    imgnode.showSelected = false;
    
    var thislink=this;
    this.isremove=false;
    function b(a, b) {
        var c = [];
        if (null == a || null == b) return c;
        if (a && b && a.outLinks && b.inLinks) for (var d = 0; d < a.outLinks.length; d++) for (var e = a.outLinks[d], f = 0; f < b.inLinks.length; f++) {
            var g = b.inLinks[f];
            e === g && c.push(g)
        }
        return c
    }
    function c(a, c) {
        var d = b(a, c),
                e = b(c, a),
                f = d.concat(e);
        return f
    }
    function d(a) {
    
        var b = c(a.nodeA, a.nodeZ);
        return b = b.filter(function(b) {
            return a !== b
        })
    }
    thislink.removeHandler = function() {
        
        this.isremove=true;
        var a = this;
        this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(b) {
            return b !== a
        })),
        this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(b) {
            return b !== a
        }));
        var b = d(this);
        b.forEach(function(a, b) {
            a.nodeIndex = b
        })
    };
    function imgnodeanime(){
        // 刚进来是false 直接进入第一个逻辑
    
        if(!thislink.isremove){
            if(thislink.nodeA.outLinks){
                var xs= thislink.nodeA.cx- thislink.nodeZ.cx, // x之差 影响终点x 坐标
                    xy=thislink.nodeA.cy- thislink.nodeZ.cy, // y之差 影响终点y 坐标
                    l = Math.floor(Math.sqrt(xs * xs + xy * xy)),  // 影响速度
                    j=l;
                var xl=xs/l, 
                    yl=xy/l;
                
                // 运行速度
                if(zIndex === 4){
                    var animespeed=(new Date()/20);
                }else {
                    var animespeed=(new Date()/7);
                }
                
                var colorpoint=parseInt(animespeed % l); //  控制起点位置 不会影响总的运行轨迹 无效
                imgnode.rotate=(Math.atan(xy/xs))+(xs>0?Math.PI:0); // 旋转的角度
                imgnode.cx= thislink.nodeA.cx-colorpoint*xl;
                imgnode.cy=thislink.nodeA.cy-colorpoint*yl;
                window.requestAnimationFrame(imgnodeanime);
            }
        }else{
            scene.remove(imgnode)
        }
    }
    window.requestAnimationFrame(imgnodeanime);
    scene.add(imgnode);
    return imgnode;
};
function addCache(id, value) {
    cachMap.set(id, value);
}
function getCache(id) {
    if (cachMap.has(id)) {
        return cachMap.get(id);
    } else {
        console.log('查找的Id=%s不存在', id);
    }
    return null;
}

function getJCache(id) {
    if (jcachMap.has(id)) {
        return jcachMap.get(id);
    } else {
        console.log('查找的Id=%s不存在', id);
    }
    return null;
}

function clear() {
    let keys = cachMap.keys();
    let keyNum = keys.size;
    for (let keyIndex = 0; keyIndex < keyNum; keyIndex++) {
        let v = cachMap.get(keyNum[keyIndex]);
        v = null;
    }
    cachMap.clear();

    let jkeys = cachMap.keys();
    let jkeyNum = jkeys.size;
    for (let jkeyIndex = 0; jkeyIndex < jkeyNum; jkeyIndex++) {
        let jv = jcachMap.get(jkeyNum[jkeyIndex]);
        jv = null;
    }
    jcachMap.clear();
}
// 创建中心节点 自适应
function convertCenterNode(scene, node,topoNode) {
    if(!scene) {
        console.error('场景不存在,请创建');
    }
    if (!node) {
        console.error('节点数据为空,请确认');
    }
    let jnode = new JTopo.Node(node.name);
    jnode.textPosition =node.position; 
    jnode.setSize(node.w, node.h);
    jnode.id = node.id;
    jnode.fontColor = node.color;
    jnode.font = node.font;
    jnode.dragable = false;
    jnode.setImage(node.image);
    jnode.setCenterLocation(topoNode.width/2, topoNode.height/2);
    jnode.layout = {type:'tree', direction:'bottom', width: 50, height: 100};
    JTopo.Layout.layoutNode(scene, jnode);
    addCache(node.name, node);
    // jnode.click(function (e) {
    //     console.log('node click-->', e)
    // })
    
    jcachMap.set(node.name, jnode);
    scene.add(jnode);
    return jnode;
}
/****
 * 创建节点
 * @param node
 * @param scene
 */
function convertNode(scene, node) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    if (!node) {
        console.error('节点数据为空,请确认');
    }
    // if (!hasPropertyByArray(node, nodePropertys)) {
    //     console.error('节点的必要属性为空,请确认');
    // }
    let jnode = new JTopo.Node(node.name);
    jnode.textPosition =node.position; 
    jnode.setLocation(node.x, node.y);
    jnode.setSize(node.w, node.h);
    jnode.id = node.id;
    jnode.fontColor = node.color;
    jnode.font = node.font;
    jnode.dragable = false;
    if(node.alpha){
        jnode.alpha=0
    }

    // jnode.showSelected = true;
    // 设置selected的背景效果
    // jnode.paintSelected = function (a){	//修改节点选中样式
    //     0 != this.showSelected &&
    //      (a.save(), 
    //         a.beginPath(),
    //         a.fillStyle = "rgba(255,255,255,0.2)",  
    //         a.fillRect(-this.width/2-2,-this.height/2-2,this.width+4,this.height+4),
    //         a.stroke(),
    //         a.closePath(),
    //         a.restore())
    // };
    jnode.zIndex = node.zIndex || 5
    // if(node.showSelected){
    //     jnode.showSelected = false;
    // }
    if(node.image){
        jnode.setImage(node.image);
    }
    jnode.canDrill = node.canDrill;
    jnode.showSelected = false  // 是否被选中
    // jnode.mouseover(()=>{
    //     // jnode.scaleX=1.2;
    //     // jnode.scaleY=1.2
    //     // console.log(jnode)
    //     jnode.showSelected = false
    // })
    // jnode.mouseout(()=>{
    //     // jnode.scaleX=1;
    //     // jnode.scaleY=1;
    // })
    if(node.isLayout){
        JTopo.Layout.layoutNode(scene, jnode);
    }
    
    addCache(node.name, node);
    // jnode.click(function (e) {
    //     console.log('node click-->', e)
    // })
    jcachMap.set(node.name, jnode);
    scene.add(jnode);
    return jnode;
}

/**
 *
 * @param scene
 * @param node
 * @param radius
 * @param color
 * @returns
 */
function convertCircleNode(scene, node, radius) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    if (!node) {
        console.error('节点数据为空,请确认');
    }
    if (!hasPropertyByArray(node, nodePropertys)) {
        console.error('节点的必要属性为空,请确认');
    }
    let circleNode = new JTopo.CircleNode('');
    circleNode.radius = radius; // 半径
    circleNode.alpha = 0.7;
    circleNode.fillColor = '127, 255, 0'; // 填充颜色
    circleNode.setLocation(node.x, node.y);
    addCache(node.id, node);
    jcachMap.set(node.id, circleNode);
    scene.add(circleNode);
    return circleNode;
}

/***
 * 创建连线
 * @param link
 * @param scene
 */
function convertLink(scene, link) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    if (!link) {
        console.error('连线数据为空,请确认');
    }
    if (!hasPropertyByArray(link, linkPropertys)) {
        console.error('连线的必要属性为空,请确认');
    }
    let nodeA = getJCache(link.fromId);
    let nodeB = getJCache(link.toId);
    if (nodeA && nodeB) {
        var jlink = new JTopo.Link(nodeA, nodeB, link.name);
        jlink.lineWidth = link.w;
        jlink.bundleOffset = 60;
        link.arrowsRadius = 15; //箭头大小
        jlink.bundleGap = 0;
        jlink.textOffsetY = 3;
        jlink.alpha= 0.8
        jlink.fontColor = '185,185,185';
        jlink.dashedPattern = link.dashedPattern;
        jlink.strokeColor = link.color; //线条颜色
        jlink.id = link.id;
        jlink.zIndex= link.zIndex || 3;
        // jlink.bundleGap= 20;  两条线以上会变成曲线
        // jlink.fillColor='transparent'
        if(link.moveColor){
            var arrownode=jlink.drawanimepic(`./resource/img/linear_${link.moveColor}.png`,scene,20,link.w, link.zIndex);
        }
        if(link.dashedPattern){
            return;
        }
        // jlink.arrowsRadius = 10;
        let keyId = nodeA.text + nodeB.text + 'Link';
        cachMap.set(keyId, jlink);
        jcachMap.set(keyId, jlink);
        scene.add(jlink);
    }
    return jlink;
}
/***
 * 创建折现连线
 * @param link
 * @param scene
 */
function convertFoldLink(scene, link) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    if (!link) {
        console.error('连线数据为空,请确认');
    }
    if (!hasPropertyByArray(link, linkPropertys)) {
        console.error('连线的必要属性为空,请确认');
    }
    let nodeA = getJCache(link.fromId);
    let nodeB = getJCache(link.toId);
    if (nodeA && nodeB) {
        var jlink = new JTopo.FoldLink(nodeA, nodeB, link.name);
        jlink.direction = "horizontal";
        jlink.arrowsRadius = 10; //箭头大小
        jlink.bundleOffset = 60; // 折线拐角处的长度
        jlink.bundleGap = 20; // 线条之间的间隔
        jlink.textOffsetY = 3; // 文本偏移量（向下3个像素）
        // jlink.dashedPattern = 5; 
        jlink.lineWidth = link.w;
        jlink.zIndex = 10;
        jlink.strokeColor = link.color;
        jlink.id = link.id;
        cachMap.set(link.id, link);
        jcachMap.set(link.id, jlink);
        scene.add(jlink);
    }
    return jlink;
}

/****
 * 创建分组
 * @param node
 * @param child
 * @param scene
 */
function convertGroup(scene, node, child) {

}
/***
 * 根据Id获取节点
 * @param scene
 * @param nodeId
 */
function findById(scene, nodeId) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    let r = {};
    scene.findElements((e) => {
        if (e.id == nodeId) {
            r = e;
            return e;
        }
        return null;
    });
    return r;
}

/***
 * 根据id上告警
 * @param level
 * @param id
 */
function addAlarm(scene, level, id) {
    if (!scene) {
        console.error('场景不存在,请创建');
    }
    let node = findById(scene, id);
    node.alarm = level;
}

/***
 * 批量判断属性是否存在
 * @param value
 * @param propertys
 * @returns {boolean}
 */
function hasPropertyByArray(value, propertys) {
    let result = true;
    if (value && propertys) {
        let num = propertys.length;
        for (let index = 0; index < num; index++) {
            if (!value.hasOwnProperty(propertys[index])) {
                result = false;
                return result;
            }
        }
    }
    return result;
}

export { cachMap, jcachMap, clear, addCache, convertGroup,convertCenterNode, convertLink, convertFoldLink, convertNode, convertCircleNode, findById, getCache, getJCache,addAlarm};