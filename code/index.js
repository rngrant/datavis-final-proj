/*
Created 4-17-17 by Nick Roberson, Reilly Grant, and Connor GT
*/

//height and width of svg's
var svg_height = 400;
var svg_width = 1000;

// margins for the left, top, right, and bottom.
margins = 30;

// parse by year-month-day
var parseTime = d3.timeParse("%y-%b-%d");