

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
logData = [];
logData.index = 1;
logData.length = 31;
user = {};
ip = {};
num = 0;
var loadData = function () {
	for (var i = 1; i < 10; i++) {
		d3.csv("data/2017-11-0" + i + "/login.csv", function (data) {
			logData.push(data);
			if (!user[data.user]) {
				num++;
				user[data.user] = {};
				user[data.user].count = 1;
				user[data.user].IPlist = [data.sip];
			} else if (user[data.user].IPlist.indexOf(data.sip) === -1) {
				user[data.user].count++;
				user[data.user].IPlist.push(data.sip);
			};
			// user[data.user].count++;

			if(!ip[data.user]){
				ip[data.sip]=[];
			}
			ip[data.sip].push(data.user);
		})
	}
	for (var i = 10; i <= 30; i++) {
		d3.csv("data/2017-11-" + i + "/login.csv", function (data) {
			logData.push(data);
			if (!user[data.user]) {
				user[data.user] = {};
				user[data.user].count = 0;
				user[data.user].IPlist = [data.sip];
			} else if (user[data.user].IPlist.indexOf(data.sip) === -1) {
				user[data.user].count++;
				user[data.user].IPlist.push(data.sip);
			};
			// user[data.user].count++;
			if(!ip[data.user]){
				ip[data.sip]=[];
			}
			ip[data.sip].push(data.user);
		})
	}
}
loadData();
// userStr = JSON.stringify(user);
// // filePath = "out/user";
// // fw = new FileWriter(filePath);
// // fw.write(userStr);
// document.write(userStr);

// d3.csv("data/2017-11-01/login.csv", function (data) {
// 	logData[logData.index++] = data;
// 			if (!user[data.user]) {
// 				user[data.user]={};
// 				user[data.user].count = 1;
// 				user[data.user].IPlist = [data.sip];
// 			}else if(user[data.user].IPlist.indexOf(data.sip)===-1){
// 				user[data.user].count++;
// 				user[data.user].IPlist.push(data.sip);
// 			};
// })



d3.select('#chart')
	.selectAll("div")
	.data([4, 8, 15, 16, 23, 42])
	.enter()
	.append("div")
	.style("height", (d) => d + "px")

