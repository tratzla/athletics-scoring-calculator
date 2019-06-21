/*
Takes in seconds and calculates the number of hours, minutes and Seconds
as well as generates a string representation of each time rounded nicely
for consistant display
INPUT:
  secs [float] number of seconds for calculation
OUTPUT:
  [obj] Structure with each time unit as float and a string
        representation of each time unit
*/
function secs_to_parts(secs){
    var parts = {};
    parts.str = {};
    parts.h = Math.floor(secs / 3600);
    secs %= 3600;
    parts.m = Math.floor(secs / 60);
    parts.s = secs % 60;
    secs_digits = 1;
    mins_digits = 1;

    parts.str.h = parts.h
                      .toLocaleString('en', {
                        minimumIntegerDigits:1,
                        minimumFractionDigits:0,
                        maximumSignificantDigits:5,
                        useGrouping:false});

    if(parts.h > 0) mins_digits = 2;
    parts.str.m = parts.m
                      .toLocaleString('en', {
                        minimumIntegerDigits:mins_digits,
                        minimumFractionDigits:0,
                        useGrouping:false});

    if(parts.m > 0 || parts.h > 0) secs_digits = 2;
    parts.str.s = parts.s
                      .toLocaleString('en', {
                        minimumIntegerDigits:secs_digits,
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                        useGrouping:false});
    return parts;
}
/*
Takes in a time_parts structure and generates an object contatining
two strings: one with seconds as well as minutes and hours (if the time is
more than 60 seconds) separated by colons, and the decimal fraction of a
second. This checks for zeros in the parts and prepares for nice display
on the webpage.
INPUT:
parts [obj] Structure with each of hours, minutes, seconds as members
OUTPUT:
[obj] Structure with string representation of the input
*/
function build_time_str(parts){
string_parts = {};
string_parts.time = "";
if(parts.h > 0) string_parts.time = parts.str.h  + ":";
if(parts.m > 0 || parts.h > 0) string_parts.time += parts.str.m + ":";
string_parts.time += parts.str.s
return string_parts.time;
}
