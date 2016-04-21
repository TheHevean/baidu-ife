/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

//用于存放图表标题
var titleText = "";

// 获取随机颜色
function getRandomColor(){
  return "#"+("00000"+(Math.random()*0xAAAAAA<<0).toString(16)).substr(-6); 
}

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

var formGraTime = document.getElementById('form-gra-time');
var citySelect = document.getElementById('city-select');
var pho = document.getElementsByClassName('pho')[0];
var title = document.getElementsByClassName('title')[0];

/**
 * 渲染图表
 */
function renderChart() {
  var text = "", color = "";
  title.innerHTML = "<h3>"+titleText+"</h3>"
  for(var item in chartData){
    color = getRandomColor();
    text += '<div title="'+item+':'+chartData[item]+'" class="'+pageState.nowGraTime+'" style="height:'+chartData[item]+'px;background: '+color+'"></div>'
  }
  pho.innerHTML = text;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowGraTime == this.value){
    return;
  }
  else{
    pageState.nowGraTime = this.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowSelectCity == this.value){
    return;
  }
  else{
    pageState.nowSelectCity = this.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = formGraTime.getElementsByTagName('input');
  for(var i=0; i<radio.length; i++){
    radio[i].addEventListener("click",graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var city = "<option>--选择城市--</option>";
  for(var i in aqiSourceData){
    city += "<option>"+i+"</option>"
  }
  citySelect.innerHTML = city;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.addEventListener("change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var nowData = aqiSourceData[pageState.nowSelectCity];
  chartData = {};
  // 处理好的数据存到 chartData 中
  titleText = "";
  if(pageState.nowGraTime === "day"){
     chartData = nowData;
     titleText = "2016年1-3月每日空气质量";
   }
  else if(pageState.nowGraTime === "week"){ 
    titleText = "2016年1-3月周平均空气质量";
    var daysum = 0, week = 1, count = 0;
    for(var i in nowData){
      daysum += nowData[i];
      count++;
      if((new Date(i)).getDay() === 6){
        chartData["第"+week+"周"] = Math.round(daysum/count);
        week++;
        daysum = 0;
        count = 0;
      }
      //最后一周的数据
      if(daysum !== 0){
        chartData["第"+week+"周"] = Math.round(daysum/count);
      }
    }
  }
  else{
    titleText = "2016年1-3月月平均空气质量";
    var monthsum = 0, month = 0, count = 0;
    for(var i in nowData){
      if((new Date(i)).getMonth() === month){
        monthsum += nowData[i];
        count++;
      }
      else{
        chartData["2016年"+(month+1)+"月"] = Math.round(monthsum/count);
        month++;
        monthsum = 0;
        count = 0;
      }

    }
    if(monthsum !== 0){
      chartData["2016年"+(month+1)+"月"] = Math.round(monthsum/count);
    }
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
