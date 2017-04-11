var fs = require('fs')

var str1 = "he is a good person.\n and a good man."
var jsonStr = ` {"media_index": 1,
  "video": [
    {
      "name": "croods",
      "description": "疯狂原始人",
      "image": "croods.jpg",
      "filename_index": 0,
      "other": "",
      "filenames": [
        {
          "name": "1",
          "description": "1",
          "medianame": "croods.mp4",
          "srtname": "croods.srt",
          "editor": "dodo",
          "index": 205
        }
      ]
    },
    {
      "name": "panda1",
      "description": "功夫熊猫1",
      "image": "panda1.jpg",
      "filename_index": 0,
      "other": "",
      "filenames": [
        {
          "name": "1",
          "description": "1",
          "medianame": "panda1.mp4",
          "srtname": "panda1.srt",
          "editor": "dodo",
          "index": 78
        }
      ]
    },"}    
   `
   console.log(jsonStr)
// fs.writeFile('test.json', JSON.stringify(G_media,null, 4) ,(err)=>{
//   if (err) {throw new Error(err)}
//     else
//   {
//     console.log(`test.json saved.`);
//   }
// })