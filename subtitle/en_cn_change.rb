# 改变英文和中文字幕的顺序，英文在前
needchangefileName='croods.srt'
newfileName='en_cn.srt'

if RUBY_PLATFORM=~/i386-mingw32|x64-mingw32|darwin/
 lineBreak=/\n/
 doubleLineBreak=/\n\n/
else RUBY_PLATFORM=~/linux/
 lineBreak=/\r\n/
 doubleLineBreak=/\r\n\r\n/
end
# throw "#{newfileName} has already exist!" if File.exist?(newfileName) 
output= File.open(newfileName, "w")
newLines=[]
File.open(needchangefileName, "r") { |file| 
	text=file.read
	alltext = text.split(doubleLineBreak)
	alltext.each { |item| 
		oneArr= item.split(lineBreak)
		output.puts(oneArr[0])
		output.puts(oneArr[1])
		output.puts(oneArr[3])
		output.puts(oneArr[2])
		output.puts
	}
	# alllines.step(4){ |line|
	# 	if index!=0 and index%2==0
	# 		alllines[index],alllines[index+1] = alllines[index+1], alllines[index]
	# 	end
	# }
	# output.write(alllines)
 }
 output.close