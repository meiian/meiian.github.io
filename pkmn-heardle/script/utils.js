const UTILS =
{
    secondsToDisplay(s) {
        const minutes = Math.floor(s / 60);
        const seconds = s - minutes * 60;
        return minutes + ":" + ((seconds<10)?"0":"") + seconds;
    },

    hideNodesByClass(className) {
        const to_remove = document.getElementsByClassName(className);
        for (let tr of to_remove) {
            tr.style.display = "none";
        }
    },

    showNodesByClass(className) {
        const to_show = document.getElementsByClassName(className);
        for (let ts of to_show) {
            ts.style.display = null;
        }
    },

    clearInput(id) {
        document.getElementById(id).value = '';
    },

    timeBetweenDates(date1, date2) {
        let buffer = Math.abs(date1 - date2) / 1000;
        const hours = Math.floor(buffer / 3600) % 24;
        buffer -= hours * 3600;
        const minutes = Math.floor(buffer / 60) % 60;
        buffer -= minutes * 60;
        const seconds = Math.round(buffer) % 60;

        const hours_display = (((hours < 10)?"0":"") + hours);
        const minutes_display = (((minutes < 10)?"0":"") + minutes);
        const seconds_display = (((seconds < 10)?"0":"") + seconds);

        return [hours_display, minutes_display, seconds_display].join(":");
    },

    getTomorrow() {
        let tomorrow = new Date(today.getTime());
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    }
}