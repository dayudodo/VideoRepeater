function string_filter(str) {
	str
	.replace(//,'')
	.replace(/,\./,'') //去掉句号，逗号
	.replace(/\s+/,' ')	//把多的空格换成一个
	.replace(/\!\?/,'') //去掉那些个奇怪的符号  
	//thiere's 这种情况不能去掉', 需要保留，那么应该去掉哪些个''?
};

// 把中文的标点符号转换成英文
function cn_notation_toEnglish(cnStr) {

};