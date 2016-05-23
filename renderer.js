// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var srt= require('srt')

srt('./media/output.srt',function(err,data){
	// console.log(data["7"]);
	// console.log(data.last);
	var ul=$("ul");
	for (var i = 0; i < 100; i++) {
		item= data[`${i}`]
		if (item) {
			// console.log(item);
			li= document.createElement("li");
			li.textContent=item.text.split('\n')[0];
			li.setAttribute("start",item.startTime);
			li.setAttribute("end",item.endTime);
			ul.append(li);
		};
	};
	// for(item of Array.from(data)){
	// 	console.log(item)
	// 	// li= document.createElement("li");
	// 	// li.textContent=item.text;
	// 	// ul.append(li);
	// }
	$("li").click(function(){
		start= this.getAttribute("start")
		end= this.getAttribute("end")
		// console.log(`${start}: ${end}`)
		MediaPlayer(start/1000,end/1000);
	})
})