/**
 * Created by guoxi on 2017/5/11.
 */
(function($, window, document){

    var windowWidth = $(window).width(),
        bili = 1;

    windowWidth =  windowWidth > 750 ? 750 : windowWidth;
    bili = windowWidth / 750;


    //to merge object
    function merge() {
        var arg = arguments,
            target = arg[0];
        for (var i = 1, ln = arg.length; i < ln; i++) {
            var obj = arg[i];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    target[k] = obj[k];
                }
            }
        }
        return target;
    }

    function LineChart(container,lineOption){
        lineOption = lineOption || {};
        lineOption = merge({}, lineChartIndicator.defaults, lineOption);

        this.lineOption = lineOption;

        if (typeof container == "string")
            container = document.querySelector(container);

        if (container.length)
            container = container[0];

        this.container = container;

        var canElm = document.createElement("canvas");
        container.appendChild(canElm);

        this.canElm = canElm;

        this.ctx = canElm.getContext('2d');

    }

    LineChart.prototype = {
        constructor: lineChartIndicator,
        init: function(){
            var lineOption = this.lineOption,
                canElm = this.canElm,
                ctx = this.ctx,
                y_axis = lineOption["y_axis"],
                y_axisText = y_axis["text"],
                x_axis = lineOption["x_axis"],
                x_axisText = x_axis["text"],
                line = lineOption["line"];

            canElm.width = lineOption.cavansWidth * bili;
            canElm.height = lineOption.canvasHeight * bili;

            //绘制y轴
            ctx.strokeStyle = y_axis.color;
            ctx.lineWidth = y_axis.lineWidth;


            ctx.beginPath();
            ctx.font = x_axisText.size * bili + "px " + x_axisText.family;
            ctx.moveTo(lineOption.gap_width * bili,lineOption.gap_height * bili);
            ctx.lineTo(lineOption.gap_width * bili,lineOption.gap_height * bili + lineOption.chart_height * bili);
            ctx.fillText( x_axisText.textCont[0], lineOption.gap_width * bili , lineOption.gap_height * bili + lineOption.chart_height * bili + x_axisText.gap * bili);
            ctx.stroke();
            ctx.closePath();

            //绘制x轴
            ctx.beginPath();
            ctx.moveTo(lineOption.gap_width * bili,lineOption.gap_height * bili + lineOption.chart_height * bili);
            ctx.lineTo(lineOption.gap_width * bili + lineOption.chart_width * bili,lineOption.gap_height * bili + lineOption.chart_height * bili);
            ctx.stroke();
            ctx.closePath();

            //绘制x轴刻度
            var x_axisLength = y_axisText.textCont.length,
                x;
            ctx.font = y_axisText.size * bili + "px " + y_axisText.family;
            for(x=0; x<x_axisLength; x++){
                ctx.beginPath();
                ctx.moveTo(lineOption.gap_width * bili,(lineOption.gap_height * bili + lineOption.chart_height * bili) - (lineOption.gap_width * bili * (x+1)));
                ctx.lineTo(lineOption.gap_width * bili - 12  * bili,(lineOption.gap_height * bili + lineOption.chart_height * bili) - (lineOption.gap_width * bili * (x+1)));
                ctx.fillText(y_axisText.textCont[x], lineOption.gap_width * bili - (y_axisText.textCont[x].length * y_axisText.size * bili),(lineOption.gap_height * bili + lineOption.chart_height * bili) - (lineOption.gap_width * bili * (x+1)) + y_axisText.size  * bili /2);
                ctx.stroke();
                ctx.closePath();
            }


            //绘制y轴内部线条和y轴上的刻度
            var y_axisLength = x_axisText.textCont.length,
                i,
                y_axisItem = y_axis.y_axisItem;
            ctx.setLineDash(y_axisItem.dash);
            ctx.font = x_axisText.size * bili + "px " + x_axisText.family;
            ctx.strokeStyle = y_axisItem.color;
            for(i=0; i<y_axisLength-1;i++){
                ctx.beginPath();
                ctx.moveTo(lineOption.gap_width * bili + (i+1) * lineOption.x_axisItem_gap * bili,lineOption.gap_height * bili);
                ctx.lineTo(lineOption.gap_width * bili + (i+1) * lineOption.x_axisItem_gap * bili,lineOption.gap_height * bili + lineOption.chart_height * bili);
                ctx.fillText(x_axisText.textCont[i+1],lineOption.gap_width * bili + (i+1) * lineOption.x_axisItem_gap * bili - x_axisText.textCont[i+1].length/2 * x_axisText.size * bili, lineOption.gap_height * bili + lineOption.chart_height * bili + x_axisText.gap * bili);
                ctx.stroke();
                ctx.closePath();
            }

            //绘制折线
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.lineWidth;
            var data = line.data;
            var showData = line.showData;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(lineOption.gap_width * bili ,(lineOption.gap_height * bili + lineOption.chart_height * bili)-(data[0]/10000 * lineOption.y_axisItem_gap * bili));
            for(var y =0; y< 4; y++){
                ctx.font = showData.size * bili + "px " + showData.family;
                ctx.fillStyle = showData.color;
                ctx.lineTo(lineOption.gap_width * bili + (y+1) * lineOption.x_axisItem_gap * bili,(lineOption.gap_height * bili + lineOption.chart_height * bili)-(data[y+1]/10000 * lineOption.y_axisItem_gap * bili));
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(lineOption.gap_width * bili + (y+1) * lineOption.x_axisItem_gap * bili, (lineOption.gap_height * bili + lineOption.chart_height * bili)-(data[y+1]/10000 * lineOption.y_axisItem_gap * bili), line.dot.radius * bili, 0, Math.PI*2, true);
                ctx.fill();
                ctx.fillText(data[y+1], lineOption.gap_width * bili + (y+1) * lineOption.x_axisItem_gap * bili - (''+data[y+1]).length/3 * showData.size * bili, (lineOption.gap_height * bili + lineOption.chart_height * bili)-(data[y+1]/10000 * lineOption.y_axisItem_gap * bili) - showData.size/2);

            }

            ctx.stroke();
            ctx.closePath();


        }
    }

    function lineChartIndicator(container,options){

        var chartObj = new LineChart(container,options);
        chartObj.init();
        return chartObj;
    }

    lineChartIndicator.defaults = {
        cavansWidth: 690,
        canvasHeight: 394,
        gap_width: 80,
        gap_height: 36,
        chart_width: 580,
        chart_height: 290,
        x_axisItem_gap: 130,
        y_axisItem_gap: 80,
        x_axis: {
            lineWidth: 1,
            color: "#dedbd9",
            text: {
                textCont: ["0年","1年","2年","3年","4年"],
                gap: 30,
                size: 28,
                color: "#4a4a4a",
                family: "microsoft yahei",
            }
        },
        y_axis: {
            lineWidth: 1,
            color: "#dedbd9",
            text: {
                textCont: ["10k","20k","30k"],
                size: 24,
                color: "#4a4a4a",
                family: "microsoft yahei",
            },
            y_axisItem: {
                dash: [4, 2],
                color: "#dedbd9",
                lineWidth: 1,
            }
        },
        line: {
            lineWidth: 1,
            color: "#ff6c00",
            data: [5800,8800,10000,12000,16500],
            showData: {
                color: '#ff6c00',
                size: 30,
                family: "microsoft yahei",
            },
            dot: {
                radius: 6,
            }
        }
    }

    window.lineChartIndicator = lineChartIndicator;

    if($){
        $.fn.lineChartIndicator = function(options){
            lineChartIndicator(this,options);
        }
    }

})(window.jQuery, window, document);