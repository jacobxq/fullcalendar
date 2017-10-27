/**
* 获取日期节假日
* Author: hebl
* Date: 2015/7/17
* Time: 23:30
*/

function getHoliday(date) {
	var cnMonth = CnMonthofDate(date);//农历月
	var cnDay = CnDayofDate(date);//农历日
	var solar = SolarTerm(date);//农历节气
	if(solar!='') cnDay=solar;
	var cnMonDay = cnMonth+cnDay;
	var holiday = '';
	if(cnDay=='正月')
		holiday = '春节';
	switch(cnMonDay){
		case '正月初一': holiday = '春节';break;
		case '正月十五': holiday = '元宵';break;
		case '五月初五': holiday = '端午';break;
		case '八月十五': holiday = '中秋';break;
		case '九月初九': holiday = '重阳';break;
		case '腊月三十': holiday = '除夕';break; 
	}
	
	var day = formatDate(date,'MMdd');
	switch(day)
	{
		case '0101':
			holiday += " 元旦";break;
		case '0501':
			holiday += " 劳动节";break;
		case '0601':
			holiday += " 儿童节";break;
		case '1001':
			holiday += " 国庆节";break;
	}
	return holiday;
}



/**------------------------------------------------Chinese calendar--------------------------------------------------------------------------- */

function RunGLNL() {
    var today = new Date();
    var d = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
    var DDDD = d[today.getDay()];
    DDDD = DDDD + " " + (CnDateofDateStr(today)); //显示农历
    DDDD = DDDD + SolarTerm(today); //显示二十四节气
    document.write(DDDD);
}
function DaysNumberofDate(DateGL) {
    return parseInt((Date.parse(DateGL) - Date.parse(DateGL.getFullYear() + "/1/1")) / 86400000) + 1;
}
function CnDateofDate(DateGL) {
    var CnData = new Array(
        0x16, 0x2a, 0xda, 0x00, 0x83, 0x49, 0xb6, 0x05, 0x0e, 0x64, 0xbb, 0x00, 0x19, 0xb2, 0x5b, 0x00,
        0x87, 0x6a, 0x57, 0x04, 0x12, 0x75, 0x2b, 0x00, 0x1d, 0xb6, 0x95, 0x00, 0x8a, 0xad, 0x55, 0x02,
        0x15, 0x55, 0xaa, 0x00, 0x82, 0x55, 0x6c, 0x07, 0x0d, 0xc9, 0x76, 0x00, 0x17, 0x64, 0xb7, 0x00,
        0x86, 0xe4, 0xae, 0x05, 0x11, 0xea, 0x56, 0x00, 0x1b, 0x6d, 0x2a, 0x00, 0x88, 0x5a, 0xaa, 0x04,
        0x14, 0xad, 0x55, 0x00, 0x81, 0xaa, 0xd5, 0x09, 0x0b, 0x52, 0xea, 0x00, 0x16, 0xa9, 0x6d, 0x00,
        0x84, 0xa9, 0x5d, 0x06, 0x0f, 0xd4, 0xae, 0x00, 0x1a, 0xea, 0x4d, 0x00, 0x87, 0xba, 0x55, 0x04
    );
    var CnMonth = new Array();
    var CnMonthDays = new Array();
    var CnBeginDay;
    var LeapMonth;
    var Bytes = new Array();
    var I;
    var CnMonthData;
    var DaysCount;
    var CnDaysCount;
    var ResultMonth;
    var ResultDay;
    var yyyy = DateGL.getFullYear();
    var mm = DateGL.getMonth() + 1;
    var dd = DateGL.getDate();
    if (yyyy < 100) yyyy += 1900;
    if ((yyyy < 1997) || (yyyy > 2020)) {
        return 0;
    }
    Bytes[0] = CnData[(yyyy - 1997) * 4];
    Bytes[1] = CnData[(yyyy - 1997) * 4 + 1];
    Bytes[2] = CnData[(yyyy - 1997) * 4 + 2];
    Bytes[3] = CnData[(yyyy - 1997) * 4 + 3];
    if ((Bytes[0] & 0x80) != 0) {
        CnMonth[0] = 12;
    }
    else {
        CnMonth[0] = 11;
    }
    CnBeginDay = (Bytes[0] & 0x7f);
    CnMonthData = Bytes[1];
    CnMonthData = CnMonthData << 8;
    CnMonthData = CnMonthData | Bytes[2];
    LeapMonth = Bytes[3];
    for (I = 15; I >= 0; I--) {
        CnMonthDays[15 - I] = 29;
        if (((1 << I) & CnMonthData) != 0) {
            CnMonthDays[15 - I]++;
        }
        if (CnMonth[15 - I] == LeapMonth) {
            CnMonth[15 - I + 1] = -LeapMonth;
        }
        else {
            if (CnMonth[15 - I] < 0) {
                CnMonth[15 - I + 1] = -CnMonth[15 - I] + 1;
            }
            else {
                CnMonth[15 - I + 1] = CnMonth[15 - I] + 1;
            }
            if (CnMonth[15 - I + 1] > 12) {
                CnMonth[15 - I + 1] = 1;
            }
        }
    }
    DaysCount = DaysNumberofDate(DateGL) - 1;
    if (DaysCount <= (CnMonthDays[0] - CnBeginDay)) {
        if ((yyyy > 1901) && (CnDateofDate(new Date((yyyy - 1) + "/12/31")) < 0)) {
            ResultMonth = -CnMonth[0];
        }
        else {
            ResultMonth = CnMonth[0];
        }
        ResultDay = CnBeginDay + DaysCount;
    }
    else {
        CnDaysCount = CnMonthDays[0] - CnBeginDay;
        I = 1;
        while ((CnDaysCount < DaysCount) && (CnDaysCount + CnMonthDays[I] < DaysCount)) {
            CnDaysCount += CnMonthDays[I];
            I++;
        }
        ResultMonth = CnMonth[I];
        ResultDay = DaysCount - CnDaysCount;
    }
    if (ResultMonth > 0) {
        return ResultMonth * 100 + ResultDay;
    }
    else {
        return ResultMonth * 100 - ResultDay;
    }
}
function CnYearofDate(DateGL) {
    var YYYY = DateGL.getFullYear();
    var MM = DateGL.getMonth() + 1;
    var CnMM = parseInt(Math.abs(CnDateofDate(DateGL)) / 100);
    if (YYYY < 100) YYYY += 1900;
    if (CnMM > MM) YYYY--;
    YYYY -= 1864;
    return CnEra(YYYY) + "年";
}
function CnMonthofDate(DateGL) {
    var CnMonthStr = new Array("零", "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊");
    var Month;
    Month = parseInt(CnDateofDate(DateGL) / 100);
    if (Month < 0) {
        return "闰" + CnMonthStr[-Month] + "月";
    }
    else {
        return CnMonthStr[Month] + "月";
    }
}
function CnDayofDate(DateGL) {
    var CnDayStr = new Array("零",
        "初一", "初二", "初三", "初四", "初五",
        "初六", "初七", "初八", "初九", "初十",
        "十一", "十二", "十三", "十四", "十五",
        "十六", "十七", "十八", "十九", "二十",
        "廿一", "廿二", "廿三", "廿四", "廿五",
        "廿六", "廿七", "廿八", "廿九", "三十");
    var Day;
    Day = (Math.abs(CnDateofDate(DateGL))) % 100;
    //hanlichen mod
    if ("初一" == CnDayStr[Day]) {
        // alert(SolarTerm(DateGL));
        return CnMonthofDate(DateGL);
    } else {
        if (SolarTerm(DateGL) != "") {
            return SolarTerm(DateGL);
        } else {
            return CnDayStr[Day];
        }

    }


}
function DaysNumberofMonth(DateGL) {
    var MM1 = DateGL.getFullYear();
    MM1 < 100 ? MM1 += 1900 : MM1;
    var MM2 = MM1;
    MM1 += "/" + (DateGL.getMonth() + 1);
    MM2 += "/" + (DateGL.getMonth() + 2);
    MM1 += "/1";
    MM2 += "/1";
    return parseInt((Date.parse(MM2) - Date.parse(MM1)) / 86400000);
}
function CnEra(YYYY) {
    var Tiangan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
//var Dizhi=new Array("子(鼠)","丑(牛)","寅(虎)","卯(兔)","辰(龙)","巳(蛇)",
    //"午(马)","未(羊)","申(猴)","酉(鸡)","戌(狗)","亥(猪)");
    var Dizhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
    return Tiangan[YYYY % 10] + Dizhi[YYYY % 12];
}
function CnDateofDateStr(DateGL) {
    if (CnMonthofDate(DateGL) == "零月") return "　请调整您的计算机日期!";
    else return "农历" + CnYearofDate(DateGL) + " " + CnMonthofDate(DateGL) + CnDayofDate(DateGL);
}

function SolarTerm(DateGL) {
	return "";
    var SolarTermStr = new Array(
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
        "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
        "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至");
    var DifferenceInMonth = new Array(
        1272060, 1275495, 1281180, 1289445, 1299225, 1310355,
        1321560, 1333035, 1342770, 1350855, 1356420, 1359045,
        1358580, 1355055, 1348695, 1340040, 1329630, 1318455,
        1306935, 1297380, 1286865, 1277730, 1274550, 1271556);
    var DifferenceInYear = 31556926;
    var BeginTime = new Date(1901 / 1 / 1);
    BeginTime.setTime(947120460000);
    for (; DateGL.getFullYear() < BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() - DifferenceInYear * 1000);
    }
    for (; DateGL.getFullYear() > BeginTime.getFullYear();) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInYear * 1000);
    }
    for (var M = 0; DateGL.getMonth() > BeginTime.getMonth(); M++) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
    }
    if (DateGL.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M++;
    }
    if (DateGL.getDate() > BeginTime.getDate()) {
        BeginTime.setTime(BeginTime.getTime() + DifferenceInMonth[M] * 1000);
        M == 23 ? M = 0 : M++;
    }
    var JQ = "";
    if (DateGL.getDate() == BeginTime.getDate()) {
        JQ += SolarTermStr[M];
    }

    return JQ;
}

/* Date Formatting
-----------------------------------------------------------------------------*/

function formatDate(date, format, options) {
	return formatDates(date, null, format, options);
}


function formatDates(date1, date2, format, options) {
	options = options || {};
	var date = date1,
		otherDate = date2,
		i, len = format.length, c,
		i2, formatter,
		res = '';
	for (i=0; i<len; i++) {
		c = format.charAt(i);
		if (c == "'") {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == "'") {
					if (date) {
						if (i2 == i+1) {
							res += "'";
						}else{
							res += format.substring(i+1, i2);
						}
						i = i2;
					}
					break;
				}
			}
		}
		else if (c == '(') {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == ')') {
					var subres = formatDate(date, format.substring(i+1, i2), options);
					if (parseInt(subres.replace(/\D/, ''), 10)) {
						res += subres;
					}
					i = i2;
					break;
				}
			}
		}
		else if (c == '[') {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == ']') {
					var subformat = format.substring(i+1, i2);
					var subres = formatDate(date, subformat, options);
					if (subres != formatDate(otherDate, subformat, options)) {
						res += subres;
					}
					i = i2;
					break;
				}
			}
		}
		else if (c == '{') {
			date = date2;
			otherDate = date1;
		}
		else if (c == '}') {
			date = date1;
			otherDate = date2;
		}
		else {
			for (i2=len; i2>i; i2--) {
				if (formatter = dateFormatters[format.substring(i, i2)]) {
					if (date) {
						res += formatter(date, options);
					}
					i = i2 - 1;
					break;
				}
			}
			if (i2 == i) {
				if (date) {
					res += c;
				}
			}
		}
	}
	return res;
};
var dateFormatters = {
	s	: function(d)	{ return d.getSeconds() },
	ss	: function(d)	{ return zeroPad(d.getSeconds()) },
	m	: function(d)	{ return d.getMinutes() },
	mm	: function(d)	{ return zeroPad(d.getMinutes()) },
	h	: function(d)	{ return d.getHours() % 12 || 12 },
	hh	: function(d)	{ return zeroPad(d.getHours() % 12 || 12) },
	H	: function(d)	{ return d.getHours() },
	HH	: function(d)	{ return zeroPad(d.getHours()) },
	d	: function(d)	{ return d.getDate() },
	dd	: function(d)	{ return zeroPad(d.getDate()) },
	ddd	: function(d,o)	{ return o.dayNamesShort[d.getDay()] },
	dddd: function(d,o)	{ return o.dayNames[d.getDay()] },
	M	: function(d)	{ return d.getMonth() + 1 },
	MM	: function(d)	{ return zeroPad(d.getMonth() + 1) },
	MMM	: function(d,o)	{ return o.monthNamesShort[d.getMonth()] },
	MMMM: function(d,o)	{ return o.monthNames[d.getMonth()] },
	yy	: function(d)	{ return (d.getFullYear()+'').substring(2) },
	yyyy: function(d)	{ return d.getFullYear() },
	t	: function(d)	{ return d.getHours() < 12 ? 'a' : 'p' },
	tt	: function(d)	{ return d.getHours() < 12 ? 'am' : 'pm' },
	T	: function(d)	{ return d.getHours() < 12 ? 'A' : 'P' },
	TT	: function(d)	{ return d.getHours() < 12 ? 'AM' : 'PM' },
	u	: function(d)	{ return formatDate(d, "yyyy-MM-dd'T'HH:mm:ss'Z'") },
	S	: function(d)	{
		var date = d.getDate();
		if (date > 10 && date < 20) {
			return 'th';
		}
		return ['st', 'nd', 'rd'][date%10-1] || 'th';
	},
	w   : function(d, o) { // local
		return o.weekNumberCalculation(d);
	},
	W   : function(d) { // ISO
		return iso8601Week(d);
	}
};

function zeroPad(n) {
	return (n < 10 ? '0' : '') + n;
}
function iso8601Week(date) {
	var time;
	var checkDate = new Date(date.getTime());

	// Find Thursday of this week starting on Monday
	checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

	time = checkDate.getTime();
	checkDate.setMonth(0); // Compare with Jan 1
	checkDate.setDate(1);
	return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
}