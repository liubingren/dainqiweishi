    // var line_num_each_row = 3; //图例中每行显示的线条数目；
    // var default_line_num = 4; //采用默认grid.top值的默认线条数目；
    // var default_grid_top_pecentage = 24; //默认的grid.top百分比（整数部分）；
    // var delta_grid_top_pecentage = 6; //超出默认线条数时的grid.top百分比增量（整数部分）；
    // var max_grid_top_pecentage = 54; //最大的grid.top百分比（整数部分）；
    // /**
    //  * 调整图例显示样式
    //  * params array 需要调整的图例
    //  * return array
    //  */
    // function adjustLegend(beforeLegend) {
    //     // 图例太多时，Echarts文档注明【特殊字符串 ''（空字符串）或者 '\n' (换行字符串)用于图例的换行。】
    //     // console.log(beforeLegend);
    //     var afterLegend = [];
    //     var index = 0;
    //     // var len = count(beforeLegend);
    //     var len = beforeLegend.length;
    //     for (var i = 0; i < len; i++) {
    //         if ((index + 1) % (line_num_each_row + 1) === 0) { //只要是整除了，比如是2,4，6,8......
    //             afterLegend[index] = ''; //这一个legend就为空
    //             index++;
    //             afterLegend[index] = beforeLegend[i]; //下一个legend等于当前
    //         } else {
    //             afterLegend[index] = beforeLegend[i];
    //         }
    //         index++;
    //     }
    //     // console.log(afterLegend);
    //     return afterLegend;
    // }

    /**
     * 设置grid.top值
     * params array 需要调整的图例
     * return string
     */
    // function setGridTop(arrLegend) {
    //     var len = arrLegend.length;
    //     // console.log(len);
    //     // 如果图例太多，需要调整option中的grid.top值才能避免重叠
    //     var topInt = len > default_line_num ? (default_grid_top_pecentage + delta_grid_top_pecentage * Math.ceil((len - default_line_num) / line_num_each_row)) : default_grid_top_pecentage;
    //     if (topInt >= max_grid_top_pecentage) {
    //         topInt = max_grid_top_pecentage;
    //     }
    //     gridTop = topInt + '%';
    //     // console.log("gridTop:" + gridTop);
    //     return gridTop;
    // }

    //折线图，，，解决legend与grid重合的问题（iphone6+的屏幕比较宽，所以这里是按照安卓的屏算的，本来是可以区分plus和安卓的，但是由于怕ios其他的屏幕窄一些，所以宁愿plus多空一点也不能被遮住）
    function fnGridTop(legendArr) {
        var rownum = 1;
        var itemWidth = 6;
        var systemType = api.systemType; //手机系统
        var str3 = "周期性小用电器（如冰箱）-2";
        var str4 = "电脑/电视/油烟机";
        var baseLen = itemWidth * 2 + str3.length + str4.length;
        var sum = 0;
        for (var i = 0; i < legendArr.length; i++) {
            sum += legendArr[i].length + itemWidth;
            if (sum > baseLen) {
                rownum++;
                sum = legendArr[i].length + itemWidth;
            }
        }
        var gridTop = rownum * 6 + "%";
        return gridTop;
    }

    //饼状图，，最长legend加最短legend(水平排列时)
    function formatLegend(dataName) {
        // console.log(dataName);
        var newLegend = [];
        var len = dataName.length;
        var itemWidth = 4;
        var str = "空调/电热水壶/浴霸/微波炉/吹风机-1洗衣机（脱水）"
        var baseLen = str.length;
        // str1 = "周期性小用电器（如电冰箱）-3电脑/电视/油烟机-1";
        // console.log(baseLen+"####"+str1.length);
        // console.log(baseLen);
        var sum = 0;
        var rownum = 0;
        for (var i = 0, j = 0; i < len; i++) {
            var min = len - 1 - i + j;
            if (i < min && newLegend.length <= len) {
                sum = dataName[i].length + dataName[min].length;
                //进行长度比较
                if (sum < baseLen) {
                    newLegend.push(dataName[i]); //最大的//最小的
                    newLegend.push(dataName[min]);
                } else {
                    newLegend.push(dataName[i]); //最大的
                    j++; //有多少不匹配的，即单行显示的，j就等于几
                }
                rownum++;
                // console.log(newLegend);
            } else {
                break;
            }
        }
        // console.log(rownum);
        // newLegend = newLegend.sort(); //按数字顺序排
        var y = (24 + rownum * 6) + "%";
        var center = ["50%", y];
        // console.log("newLegend" + newLegend);
        var arr = {
            "newLegend": newLegend,
            "center": center
        };
        // console.log(JSON.stringify(arr));
        return arr;
    }

    //横屏页面解决legend覆盖grid方法
    function fnGridTop_FullScreen(legendArr) {
        var rownum = 1;
        var itemWidth = 6;
        var systemType = api.systemType; //手机系统
        var str1 = "空调/电热水壶/浴霸/微波炉/吹风机";
        var str2 = "周期性小用电器（如洗衣机）-2";
        var str3 = "周期性小用电器（如冰箱）-1";
        var str4 = "周期性小用电器（如冰箱）-2";
        var str5 = "周期性小用电器（如冰箱）-3";
        var str6 = "电脑/电视/油烟机-3";
        if (systemType == "android") {
            var baseLen = itemWidth * 3 + str3.length + str4.length + str6.length;
        } else if (systemType == "ios") {
            var baseLen = itemWidth * 3 + str3.length + str4.length + str5.length;
        }
        var sum = 0;
        for (var i = 0; i < legendArr.length; i++) {
            sum += legendArr[i].length + itemWidth;
            if (sum > baseLen) {
                rownum++;
                sum = legendArr[i].length + itemWidth;
            }
        }
        // console.log(rownum);
        var gridTop = rownum * 8 + "%";
        // console.log(gridTop);
        return gridTop;
    }

    //把series按照name的长度及大小排列(在苹果上可能还是有几个不行)
    function sequence(jsonArr) {
        for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]['nameLen'] = jsonArr[i].name.length;//这里nameLen的值是name的长度
        }
        jsonArr.sort(sortBy("nameLen"));//让jsonArr按照nameLen的大小排
        for (var j = 0; j < jsonArr.length - 1; j++) {
            //如果两个名字长度一样并且后面的名字比前面的名字小就替换
            if (jsonArr[j].name.length == jsonArr[j + 1].name.length) {
                //如果和后面的名字长度一样
                if (jsonArr[j].name> jsonArr[j + 1].name) {
                    //如果后面的名字比前面的名字小就替换
                    var temp = jsonArr[j];
                    jsonArr[j] = jsonArr[j + 1];
                    jsonArr[j + 1] = temp;
                }
            }
        }
    }

    //按照大小排
    function sortBy(field) {
        return function(a, b) {
            return a[field] - b[field];
        }
    }
