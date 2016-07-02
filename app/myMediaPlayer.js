'use strict';
let G_timer; 
const freeze_at_end = true; //播放完成后，画面停在end
let testTimestart ;

function MediaPlayer(start,end,after_played){
	//看来还是需要改变为全局变量，毕竟只有一个播放器，使用let貌似变量会消失？
		// var startTime= start;
		// var endTime= end;

		let repeatTimes = 1;
		// console.log(rt.val());
		if ( G_repeat_times) { repeatTimes= G_repeat_times }
		else{ throw new Error('can\'t find the repeat_times element') };
		// let G_player=vid;
		if (start > end) { throw new Error("start should less than end.")};
		if (isNaN(start) || isNaN(end)) { throw new Error('start or end should have value!')};
		
		// let playMilli = (end-start)*1000;
		// let playMilli = (end-start)*(1/G_player.playbackRate)*1000;

		//多次点击可能会产生问题，所以一进入就要先取消，然后再设置新的时间段！并且G_timer是全局变量
		if (G_timer) {clearInterval(G_timer)};
		//最终还是用setInterval来解决，每多少时间执行一次，并且在次数完成后删除自己。
		//用事件的话还是有N多问题，因为事件中会有嵌套，并且时间上掌握不准，而Interval是毫秒级的，准确的多！
		const playFrontStart=function(){
			G_player.currentTime = start;
			G_player.play();
		}
		G_timer = setInterval(function(){
			if (! freeze_at_end ) { G_player.currentTime = start }
			if ( G_player.currentTime >= end ) {
				console.log(G_player.currentTime)
				repeatTimes-=1;
				if (repeatTimes == 0) {
					clearInterval(G_timer);
					G_player.pause()
					//播放完成后干啥
					G_event.emit('play_over_event')
					if(after_played){after_played()}
				}else{
					playFrontStart();
				}
			}
		}, 10)
		testTimestart= new Date();
		console.log("time start:",testTimestart);
		// G_player.addEventListener('timeupdate',function(){
		// 	// console.log("inside timeupdate",testTimestart);
		// 	let testTimeEnd= new Date();
		// 	console.log("load time:", (testTimeEnd- testTimestart));
		// 	// console.log(G_player.currentTime);
		// },false);

		playFrontStart();

}

