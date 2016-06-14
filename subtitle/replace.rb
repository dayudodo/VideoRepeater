#将字幕文件中的\r\n替换成为\n,以便在windows,mac系统下都能使用。
output= File.open("output.srt", "w")
File.open('croods.srt', "r") { |file| 
	alllines=file.readlines
	# puts alllines.match(/\n\n/)
	# p alllines[0..4]
	alllines.each {|line|
		output.write(line.gsub(/\r/,''))
	}
 }
 output.close

 # str="abc\r\nthis is a \n\n good thing.so here is \n\r\nthe linux style"