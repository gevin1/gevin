//创建Json数据
var Json_Config = [{
	"聚看点":{
		func:function (){return 聚看点()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.xiangzi.jukandian/.activity.MainActivity",
		by:"res",
		updata:"com.xiangzi.jukandian:id/btn_update_now"
	},
	"趣看点":{
		func:function (){return 趣看点()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.zhangku.qukandian/.activitys.MainActivity",
		by:"text",
		updata:"立即更新"
	},
	"惠头条":{
		func:function (){return 惠头条()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.cashtoutiao/.account.ui.main.MainTabActivity",
		by:"text",
		updata:"安全升级"
	},
	"微鲤看看":{
		func:function (){return 微鲤看看()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"cn.weli.story/cn.etouch.ecalendar.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	},
	"趣看天下":{
		func:function (){return 趣看天下()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.yanhui.qktx/.activity.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	}
}];


var json_path = "/sdcard/config.txt";


Delete_JsonFile();

Is_JsonFile();







//加载_配置文件 - 返回 Json 数据
function Load_Config(){
	var json = FileUtil.read(json_path);
	return JSON.parse(json);
};

//设置_配置文件
function Set_Config(app,name,value){	
	Json_Config[0][app][name] = value;
};

//读取_配置文件
function Get_Config(app,name){
	return Json_Config[0][app][name];
};

//获取_签到状态
function Get_SginIn(app){
	return Load_Config()[0][app]["sign"];
};

//获取 Json 数据
function Get_Json(){
	return Json_Config[0];
}

//设置_签到状态
function Set_SginIn(app){
	var tamp_json = Load_Config();
	tamp_json[0][app]["sign"] = true;
	FileUtil.write(json_path,JSON.stringify(tamp_json));
};

//检查Json文件是否存在 - 签到记录
function Is_JsonFile(){
	if(!java.io.File(json_path).exists()){
		FileUtil.write(json_path,JSON.stringify(Json_Config));
	};
};

//
function Delete_JsonFile(){
	var tamp_json = Load_Config();
	for(a in Json_Config[0]){
		if(undefined == tamp_json[0][a]){
			java.io.File(json_path).delete();
			break;
		};
	};
};








