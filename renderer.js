// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// var srt= require('srt')

// srt('./subtitle/output.srt',function(err,data){
// 	//生成带英文句子的列表
// 	// var english_list=$("#english_list");
// 	// for (var i = 0; i < 100; i++) {
// 	// 	item= data[`${i}`]
// 	// 	if (item) {
// 	// 		// console.log(item);
// 	// 		li= document.createElement("li");
// 	// 		li.textContent=item.text.split('\n')[0];
// 	// 		li.setAttribute("start",item.startTime);
// 	// 		li.setAttribute("end",item.endTime);
// 	// 		// li.setAttribute("data-toggle","tooltip");
// 	// 		// li.setAttribute("data-placement","top");
// 	// 		li.setAttribute("title",item.text.split('\n')[1])
// 	// 		english_list.append(li);
// 	// 	};
// 	// };


// 	var prev=$("#prev_sentence");
// 	var next=$("#next_sentence");
// 	//给每个li添加点击事件，当点击的时候，更新当前的句子，并且设置好当前句子的索引，以便以后可以上下一句的点击。
// 	$("li").click(function(){
// 		start= this.getAttribute("start");
// 		end= this.getAttribute("end");
// 		let current_sentence = $("#current_sentence");
// 		prev.show();
// 		next.show();
// 		current_sentence.html(this.textContent);
// 		current_sentence.attr("current_index",$("li").index(this));
// 		// console.log(this);
// 		// console.log(current_sentence);
// 		// console.log(`${start}: ${end}`)
// 		// srt读取出的时间是毫秒的，所以需要转化成秒数
// 		MediaPlayer(start/1000,end/1000);
// 	}).hover(function(){
// 		$(this).toggleClass("bg-info");
// 	});
// 	$("#prev_sentence").click(function(){
// 		var current_sentence = $("#current_sentence"); 
// 		var current_index=current_sentence.attr("current_index");
// 		var prev_li=$("li").get(Number.parseInt(current_index)-1)
// 		if (prev_li) {
// 			prev_li.click();
// 		};
// 	});
// 	$("#next_sentence").click(function(){
// 		var current_sentence = $("#current_sentence"); 
// 		var current_index=current_sentence.attr("current_index");
// 		// console.log(current_index);
// 		// let next_li= $("li").get(current_index).nextSibling;
// 		var next_li= $("li").get(Number.parseInt(current_index)+1);
// 		// console.log(next_li);
// 		if (next_li) {
// 			next_li.click();
// 		};
// 	});
// 	// $('#hide_subtitle').toggle(
// 	// 	function() {	$("#english_list li").hide();	},
// 	// 	function() {	$("#english_list li").show();	}
// 	// );
// 	$('#btn_hide_subtitle').click(function(){
// 		$('ul li').hide();
// 	});
// 	$('#btn_show_subtitle').click(function(){
// 		$('ul li').show();
// 	});

// 	//搜索哪一句包含此文本并播放
// 	var all_li=$('li');
// 	var prev_text=$('#search_text').val();
// 	$('#btn_next_search').click(function(){
// 		var stext = $('#search_text').val();
// 		var current_sentence = $("#current_sentence"); 
// 		var current_index=parseInt(current_sentence.attr("current_index"));

// 		//如果是0，就从头开始找，不是的话那么就从下一句开始找。
// 		//如果输入内容变化，就从头开始找
// 		for (var i = (current_index==0? 0: current_index+1); i < all_li.length; i++) {
// 			var current_li = all_li[i];
// 			if(current_li.textContent.includes(stext)){
// 				current_li.click();
// 				console.log(`index : ${all_li.index(current_li)} `);
// 				break;
// 			}
// 		};
// 	})
// 	$('#btn_prev_search').click(function(){
// 		var stext = $('#search_text').val();
// 		var current_sentence = $("#current_sentence"); 
// 		var current_index=parseInt(current_sentence.attr("current_index"));

// 		for (var i = (current_index-1<0? 0:current_index) ; i >= 0; i--) {
// 			var current_li = all_li[i];
// 			if(current_li.textContent.includes(stext)){
// 				search_index=i-1; //找到后，下次搜索就从上一句开始。
// 				current_li.click();
// 				console.log(`index : ${all_li.index(current_li)} `);
// 				break;
// 			}
// 		};
// 	})
// 	$(window).keydown(function(e){
// 		var focused = $('input').is(':focus');
// 		if (!focused) {
// 			if (e.keyCode == 37) { prev.click();}; //left
// 			if (e.keyCode == 39) { next.click();}; //right
// 		};
// 	});
// 	$('li').tooltip();
// });

