/*
    This file is part of Rekall.
    Copyright (C) 2013-2014

    Project Manager: Clarisse Bardiot
    Development & interactive design: Guillaume Jacquemin & Guillaume Marais (http://www.buzzinglight.com)

    This file was written by Guillaume Jacquemin.

    Rekall is a free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function Timeline() {
	this.timeStart         = moment();
	this.state             = 0;
	this.timeCurrentOffset = 0;
	this.timeCurrent       = 0;
	
	var thiss = this;
	$(document).keyup(function(e) {
	    if(e.keyCode == 32)
			thiss.toggle();
	    if(e.keyCode == 70)
			thiss.rewind();
		if(e.keyCode == 83)
			thiss.rewind(120);
		if(e.keyCode == 68)
			thiss.play(60);
	});
}

Timeline.prototype.play = function(timeCurrentOffset) {
	if(timeCurrentOffset == undefined)
		timeCurrentOffset = this.timeCurrent;
	this.timeCurrentOffset = timeCurrentOffset;
	this.timeStart         = moment();
	this.state = 1;
	rekall.captationVideoPlayers.play(timeCurrentOffset);
}
Timeline.prototype.stop = function() {
	this.state = 0;
	rekall.captationVideoPlayers.pause();
}
Timeline.prototype.rewind = function(timeCurrentOffset) {
	if(timeCurrentOffset == undefined)
		timeCurrentOffset = 0;
	this.timeCurrent       = timeCurrentOffset;
	this.timeCurrentOffset = timeCurrentOffset;
	this.state = 2;
	rekall.captationVideoPlayers.rewind(timeCurrentOffset);
}

Timeline.prototype.toggle = function() {
	if(this.state)
		this.stop();
	else
		this.play();
}

Timeline.prototype.update = function() {
	if(rekall.sortings["horizontal"].metadataKey == "Time") {
		var timeBarPoints = this.line.points();
		if((this.state) || (isNaN(timeBarPoints[0]))) {
			if(isNaN(timeBarPoints[0]))
				this.timeStart = moment();
			if(this.state == 2)		this.state = 0;
			else					this.timeCurrent = this.timeCurrentOffset + moment().diff(this.timeStart) / 1000;
			timeBarPoints[0] = timeBarPoints[2] = Sorting.positionForTime(this.timeCurrent) * Sorting.size;
			this.line.setPoints(timeBarPoints);
			this.text.setText((this.timeCurrent+"").toHHMMSSmmm());
			this.text.setX(timeBarPoints[0] + 3);
			return true;
		}
	}
	else if(rekall.timeline.barLayer.group.visible()) {
		rekall.timeline.barLayer.group.setVisible(false);
		return true;
	}
	return false;
}

