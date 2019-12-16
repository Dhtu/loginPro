// document.getElementById("upload").addEventListener("change", function() {
//     var files = this.files;
//     if(files.length == 0) {
//         console.log("没有文件");
//         return;
//     }

//     var reader = new FileReader();

//     reader.readAsText(files[0]);
//     reader.onload = function(e) {
// 		let fileData=e.target.result;
// 		let dataArray=fileData.split('\n');
// 		for (var i=0;i<dataArray.length;i++){
// 			dataArray[i]=dataArray[i].split(',');
// 		}
// 		// console.log("文件内容如下\n"+e.target.result);
// 		console.log(dataArray[0].length);

//     }
// })
window.logData = [];
window.logData.index = 1;
window.logData.length = 31;
window.count = {};
window.num=0;
var loadData = function () {
	for (var i = 1; i < 10; i++) {
		d3.csv("data/2017-11-0" + i + "/login.csv", function (data) {
			window.logData[window.logData.index++] = data;
			if (!window.count[data.user]) {
				window.num++;
				window.count[data.user]={};
				window.count[data.user].count = 1;
				window.count[data.user].IPlist = [data.sip];
			}else if(window.count[data.user].IPlist.indexOf(data.sip)===-1){
				window.count[data.user].count++;
				window.count[data.user].IPlist.push(data.sip);
			};
			// window.count[data.user].count++;
		})
	}
	for (var i = 10; i <= 30; i++) {
		d3.csv("data/2017-11-" + i + "/login.csv", function (data) {
			window.logData[window.logData.index++] = data;
			if (!window.count[data.user]) {
				window.count[data.user]={};
				window.count[data.user].count = 0;
				window.count[data.user].IPlist = [data.sip];
			}else if(window.count[data.user].IPlist.indexOf(data.sip)===-1){
				window.count[data.user].count++;
				window.count[data.user].IPlist.push(data.sip);
			};
			// window.count[data.user].count++;
		})
	}
}
loadData();

// d3.csv("data/2017-11-01/login.csv", function (data) {
// 	window.logData[window.logData.index++] = data;
// 			if (!window.count[data.user]) {
// 				window.count[data.user]={};
// 				window.count[data.user].count = 1;
// 				window.count[data.user].IPlist = [data.sip];
// 			}else if(window.count[data.user].IPlist.indexOf(data.sip)===-1){
// 				window.count[data.user].count++;
// 				window.count[data.user].IPlist.push(data.sip);
// 			};
// })



d3.select('#chart')
	.selectAll("div")
	.data([4, 8, 15, 16, 23, 42])
	.enter()
	.append("div")
	.style("height", (d) => d + "px")

