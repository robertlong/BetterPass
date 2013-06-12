function get_type(thing){
    if(thing===null)return "[object Null]";
    return Object.prototype.toString.call(thing);
}

Number.prototype.hours = function() {
   this =this * 360;
}

Number.prototype.minutes = function() {
   this = this * 60;
}

Number.prototype.seconds = function() {
   this = this;
}

Number.prototype.toHours = function() {
   this = this / 360;
}

Number.prototype.toMinutes = function() {
   this = this / 60;
}

Number.prototype.toSeconds = function() {
   this = this;
}

var Time = function (string) {
   var parts = string.match(/(\d+):(\d+) (\w+)/);
   var hours = parseInt(parts[1]), minutes = parseInt(parts[2]), ampm = parts[3].toUpperCase();

   if(hours == undefined || minutes == undefined || (ampm != 'AM' && ampm != 'PM'))
      throw "Invalid time format";

   if(hours > 12 || hours < 1)
      throw "Invalid hours";

   if(minutes > 59 || minutes < 0)
      throw "Invalid minutes";

   this.parts = parts;
   this.hours = hours;
   this.minutes = minutes;
   this.ampm = ampm;
   
   if(ampm == 'PM' && hours != 12) {
      hours += 12;
   } else if(ampm == 'AM' && hours == 12) {
      hours = 0;
   }

   this.value = (hours * 360) + (minutes * 60);
}

Time.prototype.toString = function() {
   return this.parts[0];
}

Time.prototype.format = function(format) {
   format = format.replace("%H", parts[1]);
   format = format.replace("%h", parseInt(parts[1]));
   format = format.replace("%M", parts[2]);
   format = format.replace("%m", parseInt(parts[2]));
   format = format.replace("%T", parts[3]);
   format = format.replace("%t", parts[3].toLowerCase());

   return format;
}

Time.prototype.lt = function(time){
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return this.value < time.value;
}

Time.prototype.lte = function(time){
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return this.value <= time.value;
}

Time.prototype.gt = function(time){
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return this.value > time.value;
}

Time.prototype.gte = function(time){
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return this.value >= time.value;
}

Time.prototype.eq = function(time){
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return this.value == time.value;
}

Time.prototype.in = function(period) {
   if(!(from instanceof Period))
      throw "period is not of type Period";

   return period.contains(this);
}

var Period = function(from, to) {
   if(!(from instanceof Time))
      throw "from is not of type Time";
   if(!(to instanceof Time))
      throw "to is not of type Time";
   
   this.from = from;
   this.to = to;
}

Period.prototype.contains = function(time) {
   if(!(time instanceof Time))
      throw "time is not of type Time";

   return time.gte(this.from) && time.lte(this.to);
}

Period.prototype.encompass = function(period) {
   if(!(period instanceof Period))
      throw "period is not of type Period";

   return period.from.lte(this.from) && period.from.lte(this.to)  
         && period.to.gte(this.from) && period.to.gte(this.to);
}

Period.prototype.overlaps = function(period) {
   if(!(period instanceof Period))
      throw "period is not of type Period";

   return this.contains(period.from) || this.contains(period.to) || this.encompass(period);
}

exports.Time = Time;
exports.Period = Period;