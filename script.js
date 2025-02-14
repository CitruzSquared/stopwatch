var started = false;
var waiting = false;
var stopwatch = document.getElementById("stopwatch");
var mintime = document.getElementById("mintime");
var maxtime = document.getElementById("maxtime");
var elapsedTime;
const times = [];

const Actions = {
	waitOrEnd() {
		if(started) { //end
			times.push(elapsedTime);
			console.log(times);
			started = false;
			document.body.style.backgroundColor = "#151515";
			mintime.style.display = "block";
			maxtime.style.display = "block";
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
		}
	}
};

const keyAction = {
	" ": {keydown: Actions.waitOrEnd, keyup: Actions.start}
};

const keyHandler = (ev) => {
	if (ev.repeat) {return;}
	if (!(ev.key in keyAction) || !(ev.type in keyAction[ev.key])) {return;}
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
		if(elapsedMinutes > 0) {
			elapsedText = "<b>" + elapsedMinutes.toString() + "</b>m " + elapsedText;
		}
		if(elapsedHours > 0) {
			if(elapsedMinutes == 0) {
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
		mintime.innerText = "Minimum Time: " + timeToText(minTime);
		maxtime.innerText = "Maximum Time: " + timeToText(maxTime);
	}
}

function timeToText(timeArray) {
	elapsedText = timeArray[2].toFixed(2) + "s";
	if(elapsedMinutes > 0) {
		elapsedText = timeArray[1].toString() + "m " + elapsedText;
	}
	if(elapsedHours > 0) {
		if(elapsedMinutes == 0) {
		elapsedText =timeArray[1].toString() + "m " + elapsedText;
		}
		elapsedText = timeArray[0].toString() + "h " + elapsedText;
	}
	return elapsedText;
}


