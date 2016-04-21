/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var cityinput = document.getElementById('aqi-city-input');
var datainput = document.getElementById('aqi-value-input');
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = cityinput.value.trim();
	var data = datainput.value.trim();
	if(!city.match(/^[a-zA-Z\u4e00-\u9fa5]+$/)){
    alert("城市名必须为中英文字符");
    return;
  }

  if(!data.match(/^[0-9]+$/)){ //if(!data.match(/^\d+$/))
    alert("空气质量必须为数字");
    return;
  }
  aqiData[city] = data;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var items = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    for(var city in aqiData){
        items += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button data-city='"+city+"'>删除</button></td></tr>"
    }
    document.getElementById("aqi-table").innerHTML = city ? items : "";
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  var button = event.target;
  if(button.nodeName === "BUTTON")
  {
    var trNode = button.parentNode.parentNode;
    var tdNode = trNode.childNodes[0];
    var index = tdNode.innerText;
    delete aqiData[index];
  }
//  var tdNode = trNode.childNodes[0];
//  var index = tdNode.innerTEXT; 
//  delete aqidata[index]; 
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById('add-btn').onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  document.getElementById('aqi-table').onclick = delBtnHandle;
}
init();