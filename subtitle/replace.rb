output= File.open("output.srt", "w")
File.open('panda1.srt', "r") { |file| 
	alllines=file.readlines
	# puts alllines.match(/\n\n/)
	# p alllines[0..4]
	alllines.each {|line|
		output.write(line.gsub(/\r/,''))
	}
 }
 output.close

 # str="abc\r\nthis is a \n\n good thing.so here is \n\r\nthe linux style"