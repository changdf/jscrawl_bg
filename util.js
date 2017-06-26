var utils = {
	addSeconds:function(date,seconds){
		var newDate = new Date(date.getTime());
		newDate.setSeconds(date.getSeconds() + seconds);
		return newDate;
	},
	addMinutes: function (date, minutes) {
		var newDate = new Date(date.getTime());
		newDate.setMinutes(date.getMinutes() + minutes);
		return newDate;
	},
	addHours: function (date, hours) {
		var newDate = new Date(date.getTime());
		newDate.setHours(date.getHours() + hours);
		return newDate;
	},
	addDays: function (date, days) {
		var newDate = new Date(date.getTime());
		newDate.setDate(date.getDate() + days);
		return newDate;
	},
	toLocalString:function (date){
		var month = ((date.getMonth()+1+"").length==1)?("0"+(date.getMonth()+1)):(date.getMonth()+1+"");
		var day = ((date.getDate()+"").length==1)?("0"+(date.getDate())):(date.getDate()+"");
		var hour = ((date.getHours()+"").length==1)?("0"+(date.getHours())):(date.getHours()+"");
		var minute = ((date.getMinutes()+"").length==1)?("0"+(date.getMinutes())):(date.getMinutes()+"");
		var second = ((date.getSeconds()+"").length==1)?("0"+(date.getSeconds())):(date.getSeconds()+"");
		return date.getFullYear() + "-" + month + "-" + day + " "+hour +":"+minute+":"+second;
	}
};

module.exports = utils;