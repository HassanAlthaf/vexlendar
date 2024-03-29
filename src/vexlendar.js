(function (global) {
    let vexlender = function (calendarElement, configuration) {
        return new vexlender.init(calendarElement, configuration);
    };

    let months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let calendar = null;
    let options = {};

    vexlender.init = function (calendarElement, configuration) {
        if (!calendarElement) {
            throw "You need to define a calendar element."
        }

        calendar = calendarElement;
        options = configuration || {};

        this.generateCalendar();
    };

    vexlender.init.prototype = {
        getNumberOfDaysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        getFirstDayOfMonth: function(month, year) {
            return new Date(year, month, 1).getDay();
        },
        updateMonthYearIndicator: function() {
            let indicator = options.monthYearIndicator || null;

            if (indicator == null)
                return;

            let handler = options.monthYearIndicatorHandler || null;

            if (handler == null)
                options.monthYearIndicator.innerText = months[options.month] + ", " + options.year + ".";
            else
                handler(months[options.month], options.year);
        },
        generateCalendar: function () {
            let date = new Date();
            options.month = options.month || date.getMonth() + 1; // Zero-based month index.
            options.year = options.year || date.getFullYear();

            let daysInMonth = this.getNumberOfDaysInMonth(options.month, options.year);

            this.updateMonthYearIndicator();

            calendar.append(this.prepareCalendarList(daysInMonth, this.getFirstDayOfMonth(options.month - 1, options.year)));
        },
        makeEmptyNodes: function (list, count) {
            for (let i = 0; i < count; i++) {
                let emptyNode = document.createElement("div");
                emptyNode.classList.add('emptyNode');
                emptyNode.classList.add('dateNode');

                list.appendChild(emptyNode);
            }

            return list;
        },
        prepareCalendarList: function(numberOfDays, start = 0) {
            let list = document.createElement("div");
            list.classList.add('dateList');

            // Days of the Week

            for (let i = 0; i < days.length; i++) {
                let dayNode = document.createElement("div");
                dayNode.classList.add('dateNode');
                dayNode.classList.add('dayNode');

                dayNode.innerText = days[i];

                list.appendChild(dayNode);
            }

            if (start !== 0) {
                list = this.makeEmptyNodes(list, start);
            }

            // Dates

            for (let i = 1; i <= numberOfDays; i++) {
                let dateNode = document.createElement("div");
                dateNode.classList.add('dateNode');
                dateNode.dataset.id = i;

                let handler = options.dateRenderer || null;

                if (handler == null)
                    dateNode.innerText = i;
                else
                    handler(dateNode, i, options.month, options.year);

                dateNode.addEventListener('click', this.dateNodeClick);

                list.appendChild(dateNode);
            }

            list = this.makeEmptyNodes(list, (7 - (start + numberOfDays) % 7));

            return list;
        },
        regenerateCalendar: function () {
            calendar.innerHTML = '';
            this.generateCalendar();
        },
        previousMonth: function (handler) {
            handler = options.redirectFunction || null;

            if (options.month === 1) {
                options.year--;
                options.month = 12;
            } else {
                options.month--;
            }

            if (!handler) {
                this.regenerateCalendar();
            } else {
                handler(options.month, options.year);
            }
        },
        nextMonth: function () {
            handler = options.redirectFunction || null;

            if (options.month === 12) {
                options.year++;
                options.month = 1;
            } else {
                options.month++;
            }

            if (!handler) {
                this.regenerateCalendar();
            } else {
                handler(options.month, options.year);
            }
        },
        dateNodeClick: function (e) {
            let handler = options.dateNodeClick || null;

            if (handler == null)
                return;

            options.dateNodeClick(e, this.dataset.id, options.month, options.year);
        },
        jumpToMonthOfYear: function (month, year) {
            options.month = month;
            options.year  = year;

            this.regenerateCalendar();
        }
    };

    window.vexlender = vexlender;

}(window));