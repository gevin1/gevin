//创建Json数据
var Json_Config = [{
	"聚看点":{
		func:function (){return 聚看点()},
		time_run:30,
		time_read:[60,80],
		activity:"com.xiangzi.jukandian/.activity.MainActivity",
		by:"res",
		updata:"com.xiangzi.jukandian:id/btn_update_now"
	},
	"趣看点":{
		func:function (){return 趣看点()},
		time_run:30,
		time_read:[60,80],
		activity:"com.zhangku.qukandian/.activitys.MainActivity",
		by:"text",
		updata:"立即更新"
	},
	"惠头条":{
		func:function (){return 惠头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.cashtoutiao/.account.ui.main.MainTabActivity",
		by:"text",
		updata:"安全升级"
	},
	"微鲤看看":{
		func:function (){return 微鲤看看()},
		time_run:30,
		time_read:[60,80],
		activity:"cn.weli.story/cn.etouch.ecalendar.MainActivity",
		by:"text",
		updata:"立即升级"
	},
	"趣看天下":{
		func:function (){return 趣看天下()},
		time_run:30,
		time_read:[60,80],
		activity:"com.yanhui.qktx/.activity.MainActivity",
		by:"text",
		updata:"立即更新"
	},
	"东方头条":{
		func:function (){return 东方头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.songheng.eastnews/com.songheng.eastfirst.common.view.activity.MainActivity",
		by:"text",		//待修改
		updata:"安全升级"	//待修改
	},
	"值得看看":{
		func:function (){return 值得看看()},
		time_run:30,
		time_read:[60,80],
		activity:"com.weikuai.wknews/.ui.activity.MainActivity",
		by:"text",
		updata:"更新"
	},
	"中青看点":{
		func:function (){return 中青看点()},
		time_run:30,
		time_read:[60,80],
		activity:"cn.youth.news/com.weishang.wxrd.activity.MainActivity",
		by:"text",		//待修改
		updata:"更新"		//待修改
	},
	"百姓头条":{
		func:function (){return 百姓头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.qiushibaike.inews/.home.HomeActivity",
		by:"text",
		updata:"确定"
	},
	"搜狐资讯":{
		func:function (){return 搜狐资讯()},
		time_run:30,
		time_read:[60,80],
		activity:"com.sohu.infonews/com.sohu.quicknews.homeModel.activity.HomeActivity",
		by:"text",		//待修改
		updata:"确定"		//待修改
	},
	"今日视点":{
		func:function (){return 今日视点()},
		time_run:30,
		time_read:[60,80],
		activity:"com.app.shidian/.view.main.MainActivity",
		by:"text",		//待修改
		updata:"确定"		//待修改
	},
	"松鼠资讯":{
		func:function (){return 松鼠资讯()},
		time_run:30,
		time_read:[60,80],
		activity:"com.songshu.jucai/.app.main.MainAc",
		by:"text",
		updata:"立即升级"
	},
	"快头条":{
		func:function (){return 快头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.ifeng.kuaitoutiao/com.ifeng.news2.activity.IfengTabMainActivity",
		by:"text",		//待修改
		updata:"立即升级"	//待修改
	},
	"快马小报":{
		func:function (){return 快马小报()},
		time_run:30,
		time_read:[60,80],
		activity:"com.kuaima.browser/.module.MainActivity",
		by:"text",		//待修改
		updata:"立即升级"	//待修改
	},
	"蚂蚁头条":{
		func:function (){return 蚂蚁头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.ldzs.zhangxin/com.weishang.wxrd.activity.MainActivity",
		by:"text",
		updata:"安装"
	},
	"牛牛头条":{
		func:function (){return 牛牛头条()},
		time_run:30,
		time_read:[60,80],
		activity:"com.huolea.bull/.page.MainActivity",
		by:"text",
		updata:"立即更新"
	},
	"大众看点":{
		func:function (){return 大众看点()},
		time_run:30,
		time_read:[60,80],
		activity:"com.dzkandian/.mvp.common.ui.activity.MainActivity",
		by:"text",		//待修改
		updata:"立即更新"	//待修改
	},
	"惠视频":{
		func:function (){return 惠视频()},
		time_run:30,
		time_read:[60,80],
		activity:"com.cashvideo/.MainTabActivity",
		by:"text",		//待修改
		updata:"立即更新"	//待修改
	},
	"头条巴士":{
		func:function (){return 头条巴士()},
		time_run:30,
		time_read:[60,80],
		activity:"com.zm.news/.main.ui.HomeActivity",
		by:"text",		//待修改
		updata:"立即更新"	//待修改
	},
	"微信":{
		func:function (){return 微信()},
		time_run:30,
		time_read:[60,80],
		activity:"com.tencent.mm/.ui.LauncherUI",
		by:"text",
		updata:"立即更新"
	}
}];


var Json_SignIn = {
		"签到时间":13,
		"聚看点":false,
		"趣看点":false,
		"惠头条":false,
		"微鲤看看":false,
		"趣看天下":false,
		"东方头条":false,
		"值得看看":false,
		"中青看点":false,
		"百姓头条":false,
		"搜狐资讯":false,
		"今日视点":false,
		"松鼠资讯":false,
		"快头条":false,
		"快马小报":false,
		"蚂蚁头条":false,
		"牛牛头条":false,
		"大众看点":false,
		"惠视频":false,
		"头条巴士":false
	};
	

var Path_Json = scriptDir+"/config.txt";


print("json 加载成功");


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
	return Json_SignIn[app];
};

//设置_签到状态
function Set_SginIn(app){
	Json_SignIn[app] = true;
	FileUtil.write(Path_Json,JSON.stringify(Json_SignIn));
};

//检测本地Json对象是否需要更新
function UpData_JsonFile(){
	
	//返回本地Json数据 - 不存在 - 则返回初始化Json数据
	var tamp_json = (null == FileUtil.read(Path_Json) ? Json_SignIn : JSON.parse(FileUtil.read(Path_Json)));

	if(new Date().getDate() == tamp_json["签到时间"]){

		//更新签到状态
		for(a in Json_SignIn)
			if("签到时间" != a)
				Json_SignIn[a] = tamp_json[a];		
	
	}else{ tamp_json["签到时间"] = new Date().getDate()};

	FileUtil.write(Path_Json,JSON.stringify(Json_SignIn));
};

