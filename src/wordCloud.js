// 需要使用V3版本
d3.scaleOrdinal(d3.schemeCategory10);
var color = d3.scaleOrdinal(d3.schemeCategory10);
var layout = d3.layout.cloud()
  .size([500, 500])  // 宽高
  .words([
    "Hello", "world", "normally", "you", "want", "more", "words",
    "than", "this"].map(function (d) {
      return { text: d, size: 10 + Math.random() * 90 };
    }))  // 数据
  .padding(5)  // 内间距
  .rotate(function () { return ~~(Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function (d) { return d.size; })
  .on("end", draw);

layout.start();

// 渲染
function draw(words) {
  d3.select("#vis").append("svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
    .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function (d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function (d, i) { return color(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function (d) { return d.text; });
}