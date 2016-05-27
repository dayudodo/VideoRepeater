/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(1);
	var srt = __webpack_require__(2).fromString;


	//初始化视频及字幕文件
	var sourceName='croods'
	var videoFileName=`media/${sourceName}.mp4`
	var srtFileName=`./subtitle/${sourceName}.srt`

	var vid= document.getElementById('player');
	vid.src=videoFileName;

	// 注意需要加上utf-8, 需要使用Sync同步读取、
	// 不然下面的items获取不到值。
	var data = srt(fs.readFileSync(srtFileName,'utf-8'));
	for(var key in data){
		data[key]["english"]= data[key].text.split('\n')[0]
		data[key]["chinese"]= data[key].text.split('\n')[1]
	}

	// 将数据转化成数组，以供angular的filter使用。
	var dataArray=[];
	for(var key in data){
		dataArray= dataArray.concat(data[key]);
	}




	// console.log(dataArray);
	var app=angular.module("app",['TextFilters']);
	app.controller("sentenceCtrl",function myCtrl($scope,$timeout){
		// $scope.items = [
		// 	{title: 'Paint pots', quantity: 8, price: 3.95},
		// 	{title: 'Polka dots', quantity: 17, price: 12.95},
		// 	{title: 'Pebbles', quantity: 5, price: 6.95}
		// 	];
		$scope.items=dataArray;
		$scope.is_display = true; //一开始字幕是显示的
		$scope.current_index = 0; //todo 值应该是从配置文件中读取，也就是最后一次索引位置
		var myapp= this;

		$scope.mediaplay=function(item,index){
			// console.log(`${start}:${end}`);
			MediaPlayer(item.startTime/1000, item.endTime/1000);
			// let current_sentence = $("#current_sentence");
			// current_sentence.html(item.english);
			$scope.current_sentence = item.english;
			$scope.current_index = parseInt(index); //保存到一个全局的变量，貌似有问题。
		};

		//search相关，仅仅用于搜索到合适的句子并播放
		$scope.search_init=function(){ 
			if ($scope.sentence) {	//虽然在前端写的是sentence.english，但是其实还是需要先判断sentence是否存在！
				$scope.sentence.english="";	//首先让所有句子可播放，删除过滤单词
			};
		};
		$scope.prev_search_text="";
		$scope.search_prev=function(){
			this.search_init(); 
		};
		$scope.search_next=function(){
			this.search_init();
			if ($scope.search_text) {
				//如果用户新输入内容，那么就从0开始搜索，否则就是查找下一句。
				var start= ($scope.search_text == $scope.prev_search_text)? $scope.current_index:0 
				$scope.prev_search_text = $scope.search_text;

				for(var index = start; index < dataArray.length; index++){
					var sentence = dataArray[index].english.toLowerCase();
					if(sentence.includes($scope.search_text.toLowerCase())){
						console.log(`${$scope.current_index} :index:${index}`);
						if (index == $scope.current_index ) {
							continue;
						};
						$scope.play_sentence(index);
						break;
					}else{
						if (dataArray.length-1 == index) {  console.log('last sentence')};
					}
				}
				// alert("last word");
			};
		};


		//显示字幕与否
		$scope.li_display=function(){
			$scope.is_display = !$scope.is_display; //配合页面进行字幕的显示
		};

		//播放控制
		$scope.play_sentence=function  (index) {
			// console.log(current_li);
			//点击的话还是用angular自己提供的比较好，另外，还需要加上timeout, 以免出现$apply already in progress这种错误，
			//单纯使用jQuery是没有任何问题的！而事实上只要有了timeout, jQuery的办法也是可以用的。。。
			var current_li = $('#english_list li').get(index);
			if (current_li) {
				$timeout(function() {
				   // angular.element(current_li).triggerHandler('click');
				   $scope.current_index = index;
				   current_li.click(); //
				});
			}
			// angular.element(current_li).triggerHandler('click');
			// current_li.click();
		}
		$scope.play_current=function(){
			this.play_sentence($scope.current_index);
		};
		$scope.prev_sen=function () {
			this.play_sentence($scope.current_index - 1)
		};
		$scope.next_sen=function (){
			this.play_sentence($scope.current_index + 1)
		};

		//按键控制
		$(window).keydown(function(e){
			var focused = $('input').is(':focus');
			if (!focused) {
				if (e.keyCode == 37) { $scope.prev_sen();}; //left
				if (e.keyCode == 39) { $scope.next_sen();}; //right
				if (e.keyCode == 13) { $scope.play_current()};
			}else{
				if (e.keyCode == 114) { console.log('help')};
			};

		});
		//搜索框回车则直接执行搜索下一句按钮。
		$('#search_text').keydown(function(e){
			if( (e.keyCode == 13) && $(this).val() ){
				$scope.search_next();
			}
		})
	});

	angular.module('TextFilters',[]).filter('filter_text',function(){
		return function(input){
				// return input.english.includes("the");
				// console.log(input);
				return input.length>5;
			}
	});



/***/ },
/* 1 */
/***/ function(module, exports) {

	console.log("I'm `fs` modules");


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var SECOND = 1000
	    , MINUTE = 60 * SECOND
	    , HOUR = 60 * MINUTE
	    , fs = __webpack_require__(1)
	    , partial = __webpack_require__(3).partial

	srt.fromString = fromString

	module.exports = srt

	function srt(fileName, callback) {
	    fs.readFile(fileName, partial(returnParsedData, callback))
	}

	function returnParsedData(callback, err, data) {
	    if (err) {
	        return callback(err)
	    }

	    callback(null, fromString(data.toString()))
	}

	function fromString(stringData) {
	    var segments = stringData.split("\n\n")
	    return segments.reduce(createSrtData, {})
	}

	function createSrtData(memo, string) {
	    var lines = string.split("\n")

	    if (lines.length < 3) {
	        return memo
	    }

	    var number = parseInt(lines[0], 10)
	        , times = lines[1].split(" --> ")
	        , startTime = parseTime(times[0])
	        , endTime = parseTime(times[1])
	        , text = lines.slice(2).join("\n")

	    memo[number] = {
	        number: number
	        , startTime: startTime
	        , endTime: endTime
	        , text: text
	    }

	    return memo
	}

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	exports = module.exports = ap;
	function ap (args, fn) {
	    return function () {
	        return fn.apply(this, args.concat.apply(args, arguments));
	    };
	}

	exports.pa = pa;
	function pa (args, fn) {
	    return function () {
	        return fn.apply(this, [].slice.call(arguments).concat(args));
	    };
	}

	exports.apa = apa;
	function apa (left, right, fn) {
	    return function () {
	        return fn.apply(this,
	            left.concat.apply(left, arguments).concat(right)
	        );
	    };
	}

	exports.partial = partial;
	function partial (fn) {
	    var args = [].slice.call(arguments, 1);
	    return ap(args, fn);
	}

	exports.partialRight = partialRight;
	function partialRight (fn) {
	    var args = [].slice.call(arguments, 1);
	    return pa(args, fn);
	}

	exports.curry = curry;
	function curry (fn) {
	    return partial(partial, fn);
	}

	exports.curryRight = function curryRight (fn) {
	    return partial(partialRight, fn);
	}


/***/ }
/******/ ]);