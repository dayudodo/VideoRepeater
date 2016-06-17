var SECOND = 1000
    , MINUTE = 60 * SECOND
    , HOUR = 60 * MINUTE;


function parseTime(timeString) {
    var chunks = timeString.split(":")
        , secondChunks = chunks[2].split(",")
        , hours = parseInt(chunks[0], 10)
        , minutes = parseInt(chunks[1], 10)
        , seconds = parseInt(secondChunks[0], 10)
        , milliSeconds = parseInt(secondChunks[1], 10)

    return HOUR * hours +
        MINUTE * minutes +
        SECOND * seconds +
        milliSeconds
}

// var t=parseTime("00:00:27,420");
// console.log(t);
// var fs= require('fs');
// fs.readFile('./media/panda1.srt','utf8', function(err,data){
// 	if (err) {throw err};
// 	var segments = data.split('\r\n\r\n');
// 	console.log(segments[0]);
// });

var srt=require('srt');
srt('./media/panda1.srt',function(err,data){
	// console.log(data["1"]);
	
})