var started = false;
var waiting = false;
var stopwatch = document.getElementById("stopwatch");
var mintime = document.getElementById("mintime");
var maxtime = document.getElementById("maxtime");
var average = document.getElementById("average");
var splitscontainer = document.getElementById("splitscontainer");
var splitstext = document.getElementById("splitstext");
var elapsedTime;
const times = [];
var splits = [];
var numSplits = 10;

const Actions = {
    waitOrEnd() {
        if (started) { //end
            times.push(elapsedTime);
            started = false;
            document.body.style.backgroundColor = "#151515";
            mintime.style.display = "block";
            maxtime.style.display = "block";
            average.style.display = "block";
	if (splits.length > 0) {
		splitstext.style.display = "block";
	}
            updateMinMax();
        }
        else { //wait
            waiting = true;
            stopwatch.innerHTML = "<b>0.00</b>s";
            document.body.style.backgroundColor = "#353535";
        }

    },
    start() {
        if (waiting) {
            startTime = new Date();
            started = true;
            waiting = false;
            mintime.style.display = "none";
            maxtime.style.display = "none";
            average.style.display = "none";
	splitstext.style.display = "none";
	splitscontainer.style.display = "grid";
	splitscontainer.style.flexWrap = "wrap";
            splits = [];
	splitscontainer.innerHTML = "";
            for (let i = 0; i < splits.length; i++) {
		splitElapsedColon = timeToColon(timeToSixty(splits[i]));
		splitscontainer.innerHTML += '<div style="padding-left: 1em; padding-right: 1em; flex: 0 0 20%; box-sizing: border-box; ">' + splitElapsedColon + '</div>';
	}
        }
    },
    split() {
        if (splits.length < numSplits) {
            document.body.style.backgroundColor = "#404040";
            splitTime = new Date();
            var splitElapsedTime = Math.round((splitTime - startTime) / 10) / 100;
            splits.push(splitElapsedTime);
	splitscontainer.innerHTML = "";
            for (let i = 0; i < splits.length; i++) {
		splitElapsedColon = timeToColon(timeToSixty(splits[i]));
		splitscontainer.innerHTML += '<div style="padding-left: 1em; padding-right: 1em; flex: 0 0 20%; box-sizing: border-box; ">' + splitElapsedColon + '</div>';
	}
        } else {
            times.push(elapsedTime);
            started = false;
            document.body.style.backgroundColor = "#151515";
            mintime.style.display = "block";
            maxtime.style.display = "block";
            average.style.display = "block";
	splitstext.style.display = "block";
            updateMinMax();
        }
    },
    endSplit() {
        if (started) {
	document.body.style.backgroundColor = "#353535";
	}
	else {
		document.body.style.backgroundColor = "#151515";
	}
    }
};

const keyAction = {
    " ": { keydown: Actions.waitOrEnd, keyup: Actions.start },
    "Enter": { keydown: Actions.split, keyup: Actions.endSplit }
};

const keyHandler = (ev) => {
    if (ev.repeat) { return; }
    if (!(ev.key in keyAction) || !(ev.type in keyAction[ev.key])) { return; }
    keyAction[ev.key][ev.type]();
};

['keydown', 'keyup'].forEach((evType) => {
    document.body.addEventListener(evType, keyHandler);
});

setInterval(updateTime, 10);

function updateTime() {
    if (started) {
        currentTime = new Date();
        elapsedTime = Math.round((currentTime - startTime) / 10) / 100;
        timeArray = timeToSixty(elapsedTime);
        elapsedHours = timeArray[0];
        elapsedMinutes = timeArray[1];
        elapsedSeconds = timeArray[2];

        elapsedText = "<b>" + elapsedSeconds.toFixed(2) + "</b>s";
        if (elapsedMinutes > 0) {
            elapsedText = "<b>" + elapsedMinutes.toString() + "</b>m " + elapsedText;
        }
        if (elapsedHours > 0) {
            if (elapsedMinutes == 0) {
                elapsedText = "<b>" + elapsedMinutes.toString() + "</b>m " + elapsedText;
            }
            elapsedText = "<b>" + elapsedHours.toString() + "</b>h " + elapsedText;
        }
        stopwatch.innerHTML = elapsedText;
    }
}

function timeToSixty(elapsedTime) {
    elapsedHours = Math.floor(elapsedTime / 3600);
    elapsedMinutes = Math.floor((elapsedTime - elapsedHours * 3600) / 60);
    elapsedSeconds = elapsedTime - elapsedHours * 3600 - elapsedMinutes * 60;
    return [elapsedHours, elapsedMinutes, elapsedSeconds];
}

function updateMinMax() {
    if (times.length > 0) {
        minTime = timeToSixty(Math.min(...times));
        maxTime = timeToSixty(Math.max(...times));
        ao5 = timeToSixty(calculateAo5(times.slice(Math.max(times.length - 5, 0), times.length)));
        mintime.innerText = "Minimum: " + timeToColon(minTime);
        maxtime.innerText = "Maximum: " + timeToColon(maxTime);
        average.innerText = "Latest Ao5: " + timeToColon(ao5);
    }
}

function timeToColon(array) {
    hours = leadingZeros(array[0].toString(), 2);
    minutes = leadingZeros(array[1].toString(), 2);
    seconds = leadingZeros(array[2].toFixed(2), 5);
    return hours + ":" + minutes + ":" + seconds;
}

function leadingZeros(text, digits) {
    while (text.length < digits) {
        text = "0" + text;
    }
    return text;
}

function calculateAo5(array) {
    if (array.length < 3) {
        sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length;
    }
    else {
        var minIndex = array.indexOf(Math.min(...array));
        array.splice(minIndex, 1);
        var maxIndex = array.indexOf(Math.max(...array));
        array.splice(maxIndex, 1);
        sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length;
    }
}


