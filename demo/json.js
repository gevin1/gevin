//创建Json数据
var Json_Config = [{
	"签到时间":{day:13},
	"聚看点":{
		//func:function (){return 聚看点()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.xiangzi.jukandian/.activity.MainActivity",
		by:"res",
		updata:"com.xiangzi.jukandian:id/btn_update_now"
	},
	"趣看点":{
		//func:function (){return 趣看点()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.zhangku.qukandian/.activitys.MainActivity",
		by:"text",
		updata:"立即更新"
	},
	"惠头条":{
		//func:function (){return 惠头条()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.cashtoutiao/.account.ui.main.MainTabActivity",
		by:"text",
		updata:"安全升级"
	},
	"微鲤看看":{
		//func:function (){return 微鲤看看()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"cn.weli.story/cn.etouch.ecalendar.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	},
	"趣看天下":{
		//func:function (){return 趣看天下()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.yanhui.qktx/.activity.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	},
	"东方头条":{
		//func:function (){return 东方头条()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.songheng.eastnews/com.songheng.eastfirst.common.view.activity.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	},
	"值得看看":{
		//func:function (){return 值得看看()},
		time_run:30,
		time_read:[60,80],
		sign:false,
		activity:"com.weikuai.wknews/.ui.activity.MainActivity",
		by:"text",
		updata:"更新"
	}
}];


var Path_Json = "/storage/emulated/0/config.txt";




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
	return Json_Config[0][app]["sign"];
};

//设置_签到状态
function Set_SginIn(app){
	Json_Config[0][app]["sign"] = true;
	FileUtil.write(Path_Json,JSON.stringify(Json_Config));
};

//检测本地Json对象是否需要更新
function UpData_JsonFile(){
	
	//返回本地Json数据 - 不存在 - 则返回初始化Json数据
	var tamp_json = (null == FileUtil.read(Path_Json) ? Json_Config : JSON.parse(FileUtil.read(Path_Json)));

	if(new Date().getDate() == Number(tamp_json[0]["签到时间"]["day"])){

		//更新签到状态
		for(a in Json_Config[0]){
			if("签到时间" != a){ 
				Json_Config[0][a]["sign"] = tamp_json[0][a]["sign"];
			};
		};
		
	}else{ Json_Config[0]["签到时间"]["day"] = new Date().getDate()};
	
	//重写 Json
	print(JSON.stringify(Json_Config));
	FileUtil.write(Path_Json,JSON.stringify(Json_Config));
};

