Cal = function(divid, monthmode) {
	this.monthmode = monthmode;
	var ndays = monthmode ? 7 * 7 : 366 + 5;
	var div = document.getElementById(divid);
	this.div = div;
	for (var i = 0; i < ndays; i++) {
		var d = document.createElement('div');
		var s = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ][i % 7];
		if (monthmode && i < 7)
			s += " week";
		d.className = 'calcell ' + s;
		div.appendChild(d);
	}
	this.redraw();
};
Cal.prototype.nextMonth = function() {
	if (this.month == 12) {
		this.month = 1;
		this.year++;
	} else {
		this.month++;
	}
	this.redraw();
};
Cal.prototype.prevMonth = function() {
	if (this.month == 1) {
		this.month = 12;
		this.year--;
	} else {
		this.month--;
	}
	this.redraw();
}
// month 1 - 12, month 0 : prev year, month 13 : next year
Cal.prototype.getLastDayOfMonth = function(year, month) {
	if (month == 0) {
		month = 12;
		year--;
	} else if (month == 13) {
		month = 1;
		year++;
	} else if (month == 2) {
		if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
			return 29;
		return 28;
	}
	return 30 + (month + Math.floor(month / 8)) % 2;
}
// day >= 1 (must!), error ret 0
Cal.prototype.calcMonth = function(year, day) {
	if (day < 1)
		return 0;
	for (var i = 1; i <= 12; i++) {
		var days = this.getLastDayOfMonth(year, i);
		if (day <= days)
			return i;
		day -= days;
	}
	return 0;
}
// day >= 1 (must!), error ret 0
Cal.prototype.calcMonthDay = function(year, day) {
	if (day < 1)
		return 0;
	for (var i = 1; i <= 12; i++) {
		var days = this.getLastDayOfMonth(year, i);
		if (day <= days)
			return day;
		day -= days;
	}
	return 0;
}
// Sunday == 0
Cal.prototype.getWeek = function(year, month, day) {
	if (month <= 2) {
		year--;
		month += 12;
	}
	return (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + Math.floor((13 * month + 8) / 5) + day) % 7;
}
Cal.prototype.redraw = function() {
	if (this.onbeforedraw != null)
		this.onbeforedraw();
	var caloff = this.getWeek(this.year, this.month, 1);
	var len = this.div.childNodes.length;
	var year = this.year;
	if (this.monthmode) {
		for (var i = 0; i < 7; i++) {
			var d = this.div.childNodes[i];
			var s = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ][i];
			d.innerHTML = s;
		}
		var lastday = this.getLastDayOfMonth(this.year, this.month);
		for (var i = 7; i < len; i++) {
			var d = this.div.childNodes[i];
			var s = "";
			var day = i - 6 - caloff;
			if (day > 0 && day <= lastday) {
				s = "<div class='cellday'>" + day + "</div>";
				if (this.ondraw != null) {
					var sc = this.ondraw(d, year, this.month, day);
					if (sc != null)
						s = s + sc;
				}
			}
			d.innerHTML = s;
		}
	} else {
		for (var i = 0; i < len; i++) {
			var d = this.div.childNodes[i];
			var s = "";
			var day = i + 1 - caloff;
			var month = this.calcMonth(year, day);
			var day2 = this.calcMonthDay(year, day);
			d.style.background = month % 2 == 0 ? '#eee' : '#ddd';
			if (month > 0)
				s = "<div class='cellday'>" + month + "/" + day2 + "</div>";
			
			if (this.ondraw != null) {
				var sc = this.ondraw(year, day);
				if (sc != null)
					s = s + sc;
			}
			d.innerHTML = s;
		}
	}
	if (this.onchange != null)
		this.onchange();
};
Cal.prototype.getYear = function() {
	return this.year;
};
Cal.prototype.getMonth = function() {
	return this.month;
};
Cal.prototype.setYear = function(y) {
	this.year = y;
	this.redraw();
};
Cal.prototype.setMonth = function(m) {
	this.month = m;
	this.redraw();
};
Cal.prototype.set = function(year, month) {
	this.year = year;
	this.month = month;
	this.redraw();
};
Cal.prototype.getNodes = function() {
	return this.div.childNodes;
};
