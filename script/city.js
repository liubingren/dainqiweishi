// // 城市选择
// function citySelect() {
//     var url = HEADER + 'app/location/check_getLocationByParentId.do'
//     $.ajax({
//         type: "get",
//         url: url,
//         data: {
//             "id": 'd87cfe59cb9b4260ac0e1c909e6350bf'
//         },
//         success: function(data) {
//             // console.log("获取所有城市："+JSON.stringify(data));
//             if (data.code == 1 || data.code == "1") {
//                 var cityArr = data.data
//                 var html_P = "";
//                 for (var i = 0; i < cityArr.length; i++) {
//                     html_P += '<option value="' + cityArr[i].id + '">' + cityArr[i].name + '</option>'
//                     changecity(cityArr[0].id)
//                 }
//                 $("#province").html(html_P)
//             }
//         }
//     })
// }

// 省份改变，市也改变
function cityonchange(dom) {
    var id = $(dom).val();
    // console.log("点击切换省份:" + id);
    var url = HEADER + 'app/location/check_getLocationByParentId.do'
    $.ajax({
        type: "get",
        url: url,
        data: {
            "id": id
        },
        success: function(data) {
            // console.log("获取所有城市：" + JSON.stringify(data));
            if (data.code == 1 || data.code == "1") {
                var jsonArr = data.data
                var html_C = ""
                for (var j = 0; j < jsonArr.length; j++) {
                    html_C += '<option value="' + jsonArr[j].id + '">' + jsonArr[j].name + '</option>'
                }
                $("#city").html(html_C)
            }
        }
    })
}

function changecity(p_id, c_id) {
    if (!p_id && !c_id) {
        p_id = ""
        c_id = ""
    }
    // console.log("P_ID___" + p_id +"___C_ID___"+c_id);
    var url = HEADER + 'app/location/check_getLocationByParentId.do'
    $.ajax({
        type: "get",
        url: url,
        data: {
            "id": p_id
        },
        success: function(data) {
            // console.log(JSON.stringify(data));
            if (data.code == 1 || data.code == "1") {
                var jsonArr = data.data
                var html_C = ""
                for (var j = 0; j < jsonArr.length; j++) {
                    if (c_id != "") {
                        if (c_id == jsonArr[j].id) {
                            html_C += '<option value="' + jsonArr[j].id + '" selected>' + jsonArr[j].name + '</option>'
                        } else {
                            html_C += '<option value="' + jsonArr[j].id + '">' + jsonArr[j].name + '</option>'
                        }
                    } else if (c_id == "") {
                        html_C += '<option value="' + jsonArr[j].id + '">' + jsonArr[j].name + '</option>'
                    }
                }
                $("#city").html(html_C)
            }
        }
    })
}

// 显示原始的省份和城市
function showProvinceCity(p_id, c_id) {
    if (!p_id && !c_id) {
        p_id = ""
        c_id = ""
    }
    var url = HEADER + 'app/location/check_getLocationByParentId.do'
    $.ajax({
        type: "get",
        url: url,
        data: {
            "id": 'd87cfe59cb9b4260ac0e1c909e6350bf'
        },
        success: function(data) {
            // console.log("获取所有城市："+JSON.stringify(data));
            if (data.code == 1 || data.code == "1") {
                var cityArr = data.data
                var html_P = "";
                for (var i = 0; i < cityArr.length; i++) {
                    if (p_id != "") {
                        if (cityArr[i].id == p_id) {
                            html_P += '<option value="' + cityArr[i].id + '" selected>' + cityArr[i].name + '</option>'
                        } else {
                            html_P += '<option value="' + cityArr[i].id + '">' + cityArr[i].name + '</option>'
                        }
                        changecity(p_id, c_id)
                    } else {
                        html_P += '<option value="' + cityArr[i].id + '">' + cityArr[i].name + '</option>'
                        changecity(cityArr[0].id, "")
                    }
                }
                $("#province").html(html_P)
            }
        }
    })
}
