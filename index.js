// 库存日历
var fullcalendar = {
    date: [],
    options: {
        header: { left: 'prevYear,prev, today', center: 'title', right: 'next,nextYear' },
        weekMode: 'variable',
        holiday: true,
        firstDay: 0,
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        selectable: true,
        lang: 'zh-cn',
        editable: true,
        eventLimit: true,
        events: function (start, end, timezone, callback) {
            callback(dateList);
            fullcalendar.adaptiveUi();
        },
        eventRender: function (event, element, view) {
            var titleHtml = '<span class="fc-stock">' + '库存：200' + '</span>';
            var elementHtml = $('<div class="fc-content" date="'+ event.start.format() +'">' + titleHtml + '</div>') ;
            $(element).html(elementHtml);
            $(element).html(elementHtml);

            $('.fc-today').parents('.fc-rigid').css('padding', '3px');
        },
        dayRender: function (date, cell, event) {
            var day = date.format('YYYY-MM-DD');

            for (var i = 0; i < fullcalendar.date.length; i++) {
                if (fullcalendar.date[i] == day) {
                    $('.fc-bg table tbody tr').find('td[data-date="' + day + '"]').addClass('selected');
                }
            };
        },
        select: function (start, end, jsEvent, view) {
            $('td .fc-highlight').removeClass('fc-highlight');
            var tr = $('.fc-bg table tbody tr');
            var list = new Date(start).getDateList(end);
            $.each(list, function (index, date) {
                var td = tr.find('td[data-date="' + date + '"]');
                if (td.hasClass('selected')) {
                    td.removeClass('selected');
                    fullcalendar.remove(date);
                } else {
                    td.addClass('selected');
                    fullcalendar.add(date);
                }
            });
            // 点击第一个价格日历才会出现调用
            fullcalendar.selectCallback(list);
        },
    },
    init: function () {
        this.events();
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar(this.options);
        this.clearCheckDay();
        this._calendarPanelHeadInit();
        this.adaptiveUi();
    },
    adaptiveUi: function(){
        var arr = $('#calendar .fc-week');

        // 为了适配日历不同的高度
        for(var i=0;i<arr.length;i++){
            var maxlength = [];
            var maxValue = 0;
            var defaultHeight = 85;

            for(var j=0;j<7;j++){
                maxlength.push($(arr[i]).find('.fc-content').eq(j).find('span').length);
            }

            maxlength = maxlength.sort(function(a,b){
                return b-a;
            });
            maxValue = maxlength[0];

            // 为什么-3，当日历的span有三个以上时才开始计算高度，未到3用css控制高度
            if(maxValue > 2){
                $(arr[i]).height(defaultHeight+((maxValue - 3)*15))
            }
        }
    },
    selectCallback: function (date) {
        var data = {};
        var unit = 100;
        if ($('.operation-panel').is(':visible')) return false;
        $('.operation-panel').show();
        for (var i = 0; i < dateList.length; i++) {
            if (dateList[i].date == date) {
                data = dateList[i];
            }
        };
        data && data.confirmTypeID == 2 ? $('#stockType').val('2') : $('#stockType').val('1');
        data.stock && $('#stock').val(data.stock);
        
    },
    add: function (date) {
        var result = [];
        this.date.push(date);

        for (var i = 0; i < this.date.length; i++) {
            if (result.indexOf(this.date[i]) == -1) {
                result.push(this.date[i]);
            }
        };

        this.dayCountInterval(result);
    },
    remove: function (date) {
        var result = [];

        for (var i = 0; i < this.date.length; i++) {
            if (this.date[i] != date) {
                result.push(this.date[i]);
            }
        };
        this.dayCountInterval(result);
    },
    dayCountInterval: function (data) {
        var interval_tips = '';
        data = data.sort();

        this.date = data;
        data[0] ? interval_tips = data[0] + ' 至 ' + data[data.length - 1] : interval_tips = '';
        console.log(interval_tips);
        console.log(data.length);
    },
    _calendarPanelHeadInit: function () {
        var that = this;
        var right = $('.fc-toolbar .fc-right .fc-button-group');
        var _clearButton = "<button type='button' class='btn btn-default btn-clear btn-small' style";
        _clearButton += "='margin-right:0.75em'>清空选择</button>";

        right.prepend(_clearButton);

        $('.btn-clear').on('click', function () {
            that.clearCheckDay();
        })
    },
    clearCheckDay: function () {
        $('.fc-bg table tbody tr .selected').removeClass('selected');
        $(".select-days").text(0);
        fullcalendar.date = [];
        $('.select-days-interval').text("");
    },
    events: function () {
        Date.prototype.getDateList = function (end) {
            end = new Date(end); //兼容 传字符串的情况
            //统一转化到 0点防止有小数
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            var start = new Date(this.getFullYear(), this.getMonth(), this.getDate());
            var length = Math.abs(
                (end.getTime() - start.getTime()) / (24 * 3600 * 1000)
            );
            var date = [];
            for (var i = 0; i < length; i++) {
                var newDate = new Date(start);
                newDate.setDate(start.getDate() + i);
                date[i] = newDate.format('yyyy-MM-dd');
            }
            return date;
        }

        Date.prototype.format = function (format) {
            /*
             * 使用例子:format="yyyy-MM-dd hh:mm:ss";
             */
            var o = {
                "M+": this.getMonth() + 1, // month
                "d+": this.getDate(), // day
                "h+": this.getHours(), // hour
                "m+": this.getMinutes(), // minute
                "s+": this.getSeconds(), // second
                "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                "S": this.getMilliseconds()
                    // millisecond
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
    }
};



// 日历假数据
var dateList = [
    {
        "date": "2017-10-13",
        "stock": "10"
    },
    {
        "date": "2017-10-14",
        "stock": "10"
    },
    {
        "date": "2017-10-25",
        "stock": "10"
    },
    {
        "date": "2017-10-24",
        "stock": "10"
    },
    {
        "date": "2017-10-26",
        "stock": "98",
        "confirmTypeID": "1",
        "soldStock": "2"
    },
    {
        "date": "2017-10-27",
        "stock": "100"
    }
]


fullcalendar.init();