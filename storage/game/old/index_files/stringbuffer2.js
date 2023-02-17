function StringBuffer(){this.buffer=[]}StringBuffer.prototype.append=function(a){this.buffer.push(a);return this};StringBuffer.prototype.toString=function(){return this.buffer.join("")};
