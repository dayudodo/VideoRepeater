var player=document.getElementById("player");

var G_timer; //全局时间变量，供整个程序使用

function MediaPlayer(start,end, repeatTimes=1){
	//看来还是需要改变为全局变量，毕竟只有一个播放器，使用let貌似变量会消失？
		// var startTime= start;
		// var endTime= end;
		var ready=false;

		
		// let player=vid;
		if (start > end) { throw new Error("start should less than end.")};


		// player.addEventListener("loadedmetadata",function(){
		// 	this.currentTime=startTime;
		// 	ready=true;
		// 	this.play();
		// });
		var playMilli = (end-start)*1000;

		//多次点击可能会产生问题，所以一进入就要先取消，然后再设置新的时间段！并且G_timer是全局变量
		if (G_timer) {clearInterval(G_timer)};
		//最终还是用setInterval来解决，每多少时间执行一次，并且在次数完成后删除自己。
		//用事件的话还是有N多问题，因为事件中会有嵌套，并且时间上掌握不准，而Interval是毫秒级的，准确的多！
		G_timer = setInterval(function(){
			player.currentTime = start;
			repeatTimes -= 1;
			if (repeatTimes == 0) { 
				player.pause();
				clearInterval(G_timer);
			}else{
				player.play();
			}
		},playMilli);

		//供测试时间对之用
		this.to_s=function(){
			console.log(start+":"+end);
			// alert(startTime+":"+endTime);
		};

		player.currentTime = start;
		player.play();
		//奇怪，少了这句就不播放了。。。可能是当你使用src的时候，才会真正的加载吧？
		// player.controls="controls";
		// player.play();
		// console.log(player.currentTime);
}

