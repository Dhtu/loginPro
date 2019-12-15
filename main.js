function switchSource() {
	window.chart.changeDataset();
}

function stackedGraph(canvas, data, options) {
	this.canvas = document.getElementById(canvas);
	this.ctx = this.canvas.getContext('2d');
	this.data = data;                           
	this.init(options);
}

stackedGraph.prototype = {

	changeDataset: function (data) {
		if(this.data===window.dataset1){
			this.data=window.dataset2;
		}else{
			this.data=window.dataset1;
		}
		this.yGap = this.getYGap(this.data);
		this.current = 0;
		this.looping();
	},

	init: function(options) {
		if(options){
			this.bgColor = options.bgColor ;
			this.axisColor = options.axisColor ;
			this.contentColor = options.contentColor ;
			this.titleColor = options.titleColor ;
			this.titlePosition = options.titlePosition ;
		}
		this.dataLength = this.data.length;         
		this.width = this.canvas.width;             
		this.height = this.canvas.height;            
		this.fillColor = ['#3366FF', '#FF6633', '#FFFF00', '#FF9EFF', '#FF00FF']; 
		this.padding = 70;
		this.yEqual = 10;
		this.yLength = Math.floor((this.height - this.padding * 2 - 10) / this.yEqual);
		this.xLength = Math.floor((this.width - this.padding * 1.5 - 10) / this.dataLength);
		this.yGap = this.getYGap(this.data);
		this.yRatio = this.yLength / this.yGap;
		this.originX = this.padding + 0.5;
		this.originY = this.height - this.padding + 0.5;
		this.looped = null;                         
		this.current = 0;                           
		this.currentIndex = -1;
		this.onceMove = -1;

		this.looping();
	},

	hoverProcessor: function (ev) {
		var chart = window.chart;
		chart.currentIndex = -1;
		for (var i = 0; i < chart.data.length; i ++){
			if( ev.offsetX > chart.data[i].left &&
				ev.offsetX < chart.data[i].right &&
				ev.offsetY > chart.data[i].top &&
				ev.offsetY < chart.data[i].bottom )
			{
				chart.currentIndex = i;
				var height = chart.data[i].bottom - ev.offsetY;
				var idx = -1;
				while (height > 0) {
					idx += 1;
					height -= chart.data[i].values[idx] * chart.yRatio;
				}

				var msg = chart.data[i].names[idx] + ':' + String(chart.data[i].values[idx]);
				
				mouseDic = document.getElementById('mouseDiv');
				mouseDic.style.display = 'block';
				mouseDic.style.left = String(ev.clientX + 10) + 'px';
				mouseDic.style.top = String(ev.clientY + 5) + 'px';
				mouseDic.style.position = 'absolute';
				mouseDic.style.background = '#33FFFF';
				mouseDic.innerHTML = msg;
			}
		}
		chart.DrawHover();
	},

	draw: function() {
		for(var i = 0; i < this.dataLength; i++) {
			var sum = this.data[i].values.reduce((x1, x2) => {
				return x1 + x2;
			});

			var height = this.data[i].bottom - this.data[i].top;
			var s = 0;
			for(var j = 0; height > 0; ++j){
				this.ctx.fillStyle = this.fillColor[j];
				if(height > this.data[i].values[j]){
					s += this.data[i].values[j];
					this.ctx.fillRect(
						this.data[i].left, 
						this.data[i].bottom - s,
						this.data[i].right - this.data[i].left, 
						this.data[i].values[j] * this.yRatio
					);
				} else {
					this.ctx.fillRect(
						this.data[i].left,
						this.data[i].top,
						this.data[i].right - this.data[i].left,
						height
					);
				}
				height -= this.data[i].values[j] * this.yRatio;
			}

		}
	},

	looping: function() {
		this.looped = requestAnimationFrame(this.looping.bind(this));
		if(this.current < 100){
			this.current = (this.current + 3) > 100 ? 100 : (this.current + 3);
			this.drawAnimation();
		}else{
			window.cancelAnimationFrame(this.looped);
			this.looped = null;
			this.canvas.addEventListener('mousemove', this.hoverProcessor);
		}
	},

	drawAnimation: function() {
		for(var i = 0; i < this.dataLength; i++) {
			var sum = this.data[i].values.reduce((x1, x2) => {
				return x1 + x2;
			});
			var x = Math.ceil(sum * this.current / 100 * this.yRatio);
			var y = this.height - this.padding - x;
			this.data[i].left = this.padding + this.xLength * (i + 0.25);
			this.data[i].top = y;
			this.data[i].right = this.padding + this.xLength * (i + 0.75);
			this.data[i].bottom = this.height - this.padding;
			this.drawUpdate();
		}
	},

	
	drawUpdate: function() {
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.drawAxis();
		this.drawPoint();
		this.draw();

	},
	

	drawAxis: function() {
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.axisColor;
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.padding + 0.5, this.padding + 0.5);
		this.ctx.moveTo(this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.lineTo(this.width - this.padding + 0.5, this.height - this.padding + 0.5);
		this.ctx.stroke();
	},

	drawPoint: function() {
		this.ctx.beginPath();
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = this.axisColor; 
		for(var i = 0; i < this.dataLength; i ++){
			var xAxis = this.data[i].xAxis;
			var xlen = this.xLength * (i + 1);
			this.ctx.fillText(xAxis, this.padding + xlen - this.xLength / 2, this.height - this.padding + 15);
		}
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.textAlign = 'right';
		this.ctx.fillStyle = this.axisColor;
		this.ctx.fillText(0, this.padding - 10, this.height - this.padding + 5);
		for(var i=0; i < this.yEqual; i ++){
			var y = this.yGap * (i + 1);
			var ylen = this.yLength * (i + 1);
			this.ctx.fillText(y,this.padding - 10, this.height - this.padding - ylen + 5);
		}
	},

	

	DrawHover: function() {

		if(this.currentIndex !== -1){
			if(this.onceMove === -1){
				this.onceMove = this.currentIndex;
				this.canvas.style.cursor = 'pointer';
			}
		}else{
			if(this.onceMove !== -1){
				mouseDic = document.getElementById('mouseDiv');
				mouseDic.style.display = 'none';
				this.onceMove = -1;
				this.canvas.style.cursor = 'inherit';
			}
		}
	},

	getYGap: function(data) {
		var arr = data.slice(0);
		arr.sort(function(a,b){
			sumA = a.values.reduce((x1, x2) => {
				return x1 + x2;
			});

			sumB = b.values.reduce((x1, x2) => {
				return x1 + x2;
			});

			return -(sumA - sumB);
		});

		var len = Math.ceil(arr[0].values.reduce((x1, x2) => {
			return x1 + x2;
		}) / this.yEqual);

		var pow = len.toString().length - 1;
		pow = pow > 2 ? 2 : pow;
		return Math.ceil(len / Math.pow(10,pow)) * Math.pow(10,pow);
	}
}

window.onload = function () {
	
	var nf = document.getElementById('nearFar');
	window.txt=nf;

	var data1 = [
		{xAxis:'A', names:['CN', 'HK', 'US', 'UK','JP'], values:[3253, 4236, 5643, 2855, 6424]},
		{xAxis:'B', names:['CN', 'HK', 'US', 'UK','JP'], values:[3564, 6474, 7363, 6473, 6144]},
		{xAxis:'C', names:['CN', 'HK', 'US', 'UK','JP'], values:[6325, 7366, 6744, 8634, 7254]},
		{xAxis:'D', names:['CN', 'HK', 'US', 'UK','JP'], values:[3764, 8574, 8585, 3744, 6634]},
		{xAxis:'E', names:['CN', 'HK', 'US', 'UK','JP'], values:[8662, 4867, 7965, 9867, 4373]},
		{xAxis:'F', names:['CN', 'HK', 'US', 'UK','JP'], values:[8046, 9866, 8076, 8976, 2953]}
	];

	window.dataset1 = data1;


	var data2 = [
		{xAxis:'A', names:['CN', 'HK', 'US', 'UK','JP'], values:[4633, 5964, 5967, 2674, 2737]},
		{xAxis:'B', names:['CN', 'HK', 'US', 'UK','JP'], values:[2749, 2630, 2073, 1300, 3478]},
		{xAxis:'C', names:['CN', 'HK', 'US', 'UK','JP'], values:[3250, 4580, 2090, 6740, 4580]},
		{xAxis:'D', names:['CN', 'HK', 'US', 'UK','JP'], values:[4840, 2966, 2360, 3859, 5696]},
		{xAxis:'E', names:['CN', 'HK', 'US', 'UK','JP'], values:[6070, 3253, 3074, 5360, 3259]},
		{xAxis:'F', names:['CN', 'HK', 'US', 'UK','JP'], values:[3370, 2744, 3085, 7483, 5472]}
	];

	window.dataset2 = data2;

	var chart = new stackedGraph('canvas', data1, {
		bgColor: '#003333',
		axisColor: '#FFFFFF',       
		contentColor: '#FFFFFF',    
	});

	window.chart = chart;
}
