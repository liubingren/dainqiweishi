var HEADER = "http://172.16.31.217:8020/electricguards/";
// var HEADER = "http://lift.varyagtech.com/electricguards/"

//检查数组重复数据
function getReplace(arr, name, flag) {
    var sum = arr.length;
    if (sum > 0) {
        for (var i = 0; i < sum; ++i) {
            for (var j = 0; j < sum; ++j) {
                if (i != j) {
                    try {
                        if (arr[i][name].indexOf(arr[j][name]) != -1) {
                            arr[i].value = Number(arr[i].value) + Number(arr[j].value);
                            if (!!flag) {
                                arr[i].time = arr[i].time + "," + arr[j].time;
                            }
                            arr.splice(j, 1);
                            sum--;
                            break;
                        }
                    } catch (e) {
                        return [];
                    }
                }
            }
        }
    }
    return arr;
}

function checkNumber(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字而不是.
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    obj.value < 0 ? obj.value = 0 : obj.value = obj.value;
    obj.value > 1 ? obj.value = 1 : obj.value = obj.value;
};

//计算上一天的毫秒数
function calcLastDate(time) {
    if (time) {
        var DAY = 24 * 60 * 60 * 1000;
        var dateTime = new Date(time).getTime();
        return new Date(dateTime - DAY);
    }
}

// 未读信息数量的格式
function formatnum(num) {
    if (num <= 0) {
        return 0
    } else if ((num > 0) && (num < 999)) {
        return num
    } else if ((num > 999) && (num < 10000)) {
        return ((num / 1000).toFixed(1) + "k");
    } else if (num > 10000) {
        return ((num / 10000).toFixed(1) + "w");
    }
}

//检测为正数
function checkInteger(dom) {
    var value = parseInt($(dom).val()) + "";
    console.log("检测为正数"+value);
    if (value == "NaN") {
        alert("请输入正确的数字!");
        $(dom).val("");
    } else if (value * 1 < 0) {
        ("请输入正数！")
        $(dom).val("");
    } else {
        $(dom).val(parseInt(Math.round(value)));
    };
}

function getFloatStr(num) {
    num += '';
    num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符
    if (/^0+/) //清除字符串开头的0
        num = num.replace(/^0+/, '');
    if (!/\./.test(num)) //为整数字符串在末尾添加.00
        num += '.00';
    if (/^\./.test(num)) //字符以.开头时,在开头添加0
        num = '0' + num;
    num += '00'; //在字符串末尾补零
    num = num.match(/\d+\.\d{2}/)[0];
    return num;
}

// 返回上一页
function turnBack() {
    api.closeWin();
}

function ellipsis(msg, len) {
    if (typeof msg == "string") {
        if (msg.length >= len) {
            return msg.substring(0, len) + "...";
        } else {
            return msg;
        }
    }
}

// function checkInteger(dom) {
//     var value = parseInt($(dom).val() * 100) / 100 + "";
//     if (value == "NaN") {
//         $(dom).val(0);
//     } else {
//         $(dom).val(parseInt(Math.abs(value) * 100) / 100);
//     };
// }

function randomNumber(start, end) {
    var number = "";
    for (var i = 0; i < 3; i++) {
        number += Math.floor(Math.random() * (end - start + 1)) + start;
    }
    return number;
}

Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function exit_app() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.toast({
            msg: '再按一次返回键退出' + api.appName,
            duration: 2000,
            location: 'bottom'
        });
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            api.closeWidget({
                id: 'A6051962182559', //你的APPid
                retData: {
                    name: 'closeWidget'
                },
                animation: {
                    type: 'flip',
                    subType: 'from_bottom',
                    duration: 500
                },
                silent: true
            });
        });
        setTimeout(function() {
            exit_app();
        }, 3000);
    });
}

//加载普通用户详情页面电表水表相关数据
function loadEquineDetail() {
    var html = "";
    var style = api.pageParam.style;
    var equineStyle = "";
    var unit = "";
    switch (style) {
        case "0":
            equineStyle = "电";
            unit = "kWh";
            break;
        case "1":
            equineStyle = "水";
            unit = "吨";
            break;
    }
    html = "<div>" +
        "	<span>" + equineStyle + "表编号：</span>" +
        "	<span id='meterId'></span>" +
        "	<span id='payLevels' class='aui-pull-right aui-text-info' tapmode onclick='openElec();'>付费升级</span>" +
        "</div>" +
        "<div>" +
        "	<span class='aui-pull-left'>所在分组：</span>" +
        "	<select class='aui-pull-left aui-ellipsis-1' disabled name='group' id='group' value='' tapmode></select>" +
        "	<img class='aui-pull-right' src='../image/5.png' data-flag='true' width='25' tapmode onclick='openGroupList();'/>" +
        "</div><br />" +
        "<div>" +
        "	<span class='aui-pull-left'>设备名称：</span>" +
        "	<span class='aui-pull-left aui-ellipsis-1' id='address' tapmode onchange='addDisabled(this);'></span>" +
        "</div><br />" +
        "<div>" +
        "	<span class='aui-pull-left'>余额：</span>" +
        "	<span class='aui-pull-left aui-ellipsis-1' id='money'>0</span>" +
        // "	<span class='aui-pull-right aui-text-info' tapmode onclick='openElec();'>充值</span>" +
        //			"	<span class='aui-pull-right aui-text-info' tapmode onclick='openElec();'>充值记录</span>"+
        "</div><br />" +
        "<div class='line1'></div>" +
        "<div>" +
        "	<span class='aui-pull-left'>设备状态：<span id='status'></span></span>" +
        "	<span class='aui-pull-right'>" + equineStyle + "表初值：<span id='meterInitval'>0</span>" + unit + "</span>" +
        "</div><br />" +
        (style == "0" ? "<div>" +
            "	<span class='aui-pull-left'>通断状态：<span id='powerType'></span></span>" +
            "	<span class='aui-pull-right'>当前读数：<span id='nowW'>0</span>" + unit + "</span>" +
            "</div>" : "<div>" +
            "	<span class='aui-pull-left'>当前读数：<span id='nowW'>0</span>" + unit + "</span>" +
            "</div><br />") +
        (style == "0" ? "<br /><div>" +
            "	<span class='aui-pull-left'>当前电流：<span id='nowI'>0</span>A</span>" +
            "	<span class='aui-pull-right'>当前功率：<span id='power'>0</span>W</span>" +
            "</div><br />" : "") +
        "<div>" +
        "	<span class='aui-pull-left'>当日用" + equineStyle + "：<span id='todayW'>0</span>" + unit + "</span>" +
        "	<span class='aui-pull-right'>本月用" + equineStyle + "：<span id='monthW'>0</span>" + unit + "</span>" +
        "</div><br />" +
        "<div>" +
        "	<span class='aui-pull-left'>" + equineStyle + "费单价：</span>" +
        "	<span class='aui-pull-left' id='feeset' style='width:30px'>0</span>" +
        "	<span class='aui-pull-left'>元/" + unit + "</span>" +
        "</div><br />" +
        "<div>" +
        "	<span class='aui-pull-left'>今日" + equineStyle + "费：<span id='todayFee'>0</span>元</span>" +
        "	<span class='aui-pull-right'>本月" + equineStyle + "费：<span id='monthFee'>0</span>元</span>" +
        "</div><br />";
    $("#loadMeterData").html(html);
}

function showTip00(type, callback) {
    if (type == 0 || type == "0") {
        api.alert({
            title: '提示信息',
            msg: '操作失败!',
        });
    } else if (type == 1 || type == "1") {
        api.alert({
            title: '提示信息',
            msg: '操作成功!',
        });
        if (!!callback) {
            callback();
        }
    } else if (type == 2 || type == "2") {
        api.alert({
            title: '提示信息',
            msg: '参数不正确!',
        });
    } else if (type == 3 || type == "3") {
        api.alert({
            title: '提示信息',
            msg: '设备无响应!',
        });
    }
}

//公共提示方法
function showTip(type, callback) {
    if (type == 1 || type == "1") {
        api.alert({
            title: '提示信息',
            msg: '操作成功!',
        });
        if (!!callback) {
            callback();
        }
    } else if (type == 2 || type == "2") {
        api.alert({
            title: '提示信息',
            msg: '已存在!',
        });
    } else if (type == 3 || type == "3") {
        api.alert({
            title: '提示信息',
            msg: '未登录!',
        });
    } else if (type == 4 || type == "4") {
        api.alert({
            title: '提示信息',
            msg: '不存在!',
        });
    } else if (type == 5 || type == "5") {
        api.alert({
            title: '提示信息',
            msg: '没有权限!',
        });
    } else if (type == 6 || type == "6") {
        api.alert({
            title: '提示信息',
            msg: '密码不正确!',
        });
    } else if (type == 7 || type == "7") {
        api.alert({
            title: '提示信息',
            msg: '参数不正确!',
        });
    } else if (type == 8 || type == "8") {
        api.alert({
            title: '提示信息',
            msg: '默认分组不能删除!',
        });
    } else if (type == 9 || type == "9") {
        api.alert({
            title: '提示信息',
            msg: '电表编号或密钥不正确!',
        });
    } else if (type == 10 || type == "10") {
        api.alert({
            title: '提示信息',
            msg: '不能重复邀请!',
        });
    } else if (type == 11 || type == "11") {
        api.alert({
            title: '提示信息',
            msg: '该电表已进行分摊!',
        });
    } else if (type == 12 || type == "12") {
        api.alert({
            title: '提示信息',
            msg: '该用户不是该电表管理员!',
        });
    } else if (type == 13 || type == "13") {
        api.alert({
            title: '提示信息',
            msg: '密保不正确!',
        });
    } else if (type == 14 || type == "14") {
        api.alert({
            title: '提示信息',
            msg: '公共电表不能进行授权!',
        });
    } else if (type == 15 || type == "15") {
        api.alert({
            title: '提示信息',
            msg: '该用户不存在!',
        });
    } else if (type == 16 || type == "16") {
        api.alert({
            title: '提示信息',
            msg: '普通电表不能进行分摊!',
        });
    } else if (type == 17 || type == "17") {
        api.alert({
            title: '提示信息',
            msg: '公用电表不能被分摊!',
        });
    } else if (type == 18 || type == "18") {
        api.alert({
            title: '提示信息',
            msg: '日期格式不正确!',
        });
    } else if (type == 19 || type == "19") {
        api.alert({
            title: '提示信息',
            msg: '通讯失败，请稍后再试!',
        });
    } else if (type == 20 || type == "20") {
        api.alert({
            title: '提示信息',
            msg: '设备编号与类型不匹配!',
        });
    } else if (type == 23 || type == "23") {
        api.alert({
            title: '提示信息',
            msg: '余额不足!',
        });
    } else {
        api.alert({
            title: '提示信息',
            msg: '操作失败!',
        });
    }
}

//支付宝返回值
function alipayReturnMsg(type) {
    if (type == 9000 || type == "9000") {
        api.alert({
            title: '提示信息',
            msg: '支付成功!',
        });
    } else if (type == 4000 || type == "4000") {
        api.alert({
            title: '提示信息',
            msg: '系统异常!',
        });
    } else if (type == 4001 || type == "4001") {
        api.alert({
            title: '提示信息',
            msg: '数据格式不正确!',
        });
    } else if (type == 4003 || type == "4003") {
        api.alert({
            title: '提示信息',
            msg: '该用户绑定的支付宝账户被冻结或不允许支付!',
        });
    } else if (type == 4004 || type == "4004") {
        api.alert({
            title: '提示信息',
            msg: '该用户已解除绑定!',
        });
    } else if (type == 4005 || type == "4005") {
        api.alert({
            title: '提示信息',
            msg: '绑定失败或没有绑定!',
        });
    } else if (type == 4006 || type == "4006") {
        api.alert({
            title: '提示信息',
            msg: '订单支付失败!',
        });
    } else if (type == 4010 || type == "4010") {
        api.alert({
            title: '提示信息',
            msg: '重新绑定账户!',
        });
    } else if (type == 6000 || type == "6000") {
        api.alert({
            title: '提示信息',
            msg: '支付服务正在进行升级操作!',
        });
    } else if (type == 6001 || type == "6001") {
        api.alert({
            title: '提示信息',
            msg: '用户中途取消支付操作!',
        });
    }
}

//微信返回值
function wxReturnMsg(type) {
    if (type == "NOAUTH") {
        api.alert({
            title: '提示信息',
            msg: '商户无此接口权限!',
        });
    } else if (type == "NOTENOUGH") {
        api.alert({
            title: '提示信息',
            msg: '余额不足!',
        });
    } else if (type == "ORDERPAID") {
        api.alert({
            title: '提示信息',
            msg: '商户订单已支付!',
        });
    } else if (type == "ORDERCLOSED") {
        api.alert({
            title: '提示信息',
            msg: '订单已关闭!',
        });
    } else if (type == "SYSTEMERROR") {
        api.alert({
            title: '提示信息',
            msg: '系统超时!',
        });
    } else if (type == "APPID_NOT_EXIST") {
        api.alert({
            title: '提示信息',
            msg: 'APPID不存在!',
        });
    } else if (type == "MCHID_NOT_EXIST") {
        api.alert({
            title: '提示信息',
            msg: 'MCHID不存在!',
        });
    } else if (type == "APPID_MCHID_NOT_MATCH") {
        api.alert({
            title: '提示信息',
            msg: 'appid和mch_id不匹配!',
        });
    } else if (type == "LACK_PARAMS") {
        api.alert({
            title: '提示信息',
            msg: '缺少参数!',
        });
    } else if (type == "OUT_TRADE_NO_USED") {
        api.alert({
            title: '提示信息',
            msg: '商户订单号重复!',
        });
    } else if (type == "SIGNERROR") {
        api.alert({
            title: '提示信息',
            msg: '签名错误!',
        });
    } else if (type == "XML_FORMAT_ERROR") {
        api.alert({
            title: '提示信息',
            msg: 'XML格式错误!',
        });
    } else if (type == "REQUIRE_POST_METHOD") {
        api.alert({
            title: '提示信息',
            msg: '请使用post方法!',
        });
    } else if (type == "POST_DATA_EMPTY") {
        api.alert({
            title: '提示信息',
            msg: 'post数据为空!',
        });
    } else if (type == "NOT_UTF8") {
        api.alert({
            title: '提示信息',
            msg: '编码格式错误!',
        });
    } else {
        api.alert({
            title: '提示信息',
            msg: '错误!',
        });
    }
}
