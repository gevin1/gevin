var Run_List = Array();
var Time_Run,Time_Read;


function Main_run(){

	print("run 加载成功");
	
	UpData_JsonFile();
	
	Create_RunList();
	
	Switch_App();

};


//生成运行列表
function Create_RunList(){
	var arr = Array();
	var num = 0;
	
	//获取界面数据 - 生成数组
	for(var i=1;i<=30;i++){
		tamp = config.read("spinner_"+i+".text");
		if("" != tamp && null != tamp ){
			var tamp = config.read("spinner_"+i+".text");
			arr[num++] = tamp;
			Set_Config(tamp,"time_run",config.read("Edit_Read_run_"+i+".text"));
			
			var min = Number(config.read("Edit_Read_Min_"+i+".text"));
			var max = Number(config.read("Edit_Read_Max_"+i+".text"));
			Set_Config(tamp,"time_read",[min,max]);
			print(tamp+"|"+ config.read("Edit_Read_Min_"+i+".text") + "|"+config.read("Edit_Read_Max_"+i+".text"));
		};
	};	
			
	//定位启动位置
	num = 0;
	var run_start = config.read("spinner_start.text");
	
	for(var i=0;i<arr.length;i++){
		if(0 < num || run_start == arr[i]){
			Run_List[num++] = arr[i];
		};
	};

	var loop_num = Number(config.read("loop_num.text"));
	if(0 != loop_num){
		for(var i=0;i<loop_num;i++){
			for(a in arr){
				Run_List[num++] = arr[a];
			};
		};	
	};

};

//启动应用 - 开始阅读
function Switch_App(){

	for(a in Run_List){	
		Time_Run = Get_Config(Run_List[a],"time_run") * 60000;
		Time_Read = Get_Config(Run_List[a],"time_read");
		toast("准备启动 | " + Run_List[a]); 
		Get_Config(Run_List[a],"func")();
		execute("am force-stop "+Get_Config(Run_List[a],"activity").split("/")[0]);
		sleep(2000);
	};
	
};
                                           
//是否运行
function Is_RunApp(app){

	var tamp = time();
	
	if(device.getAct().split("/")[0] != Get_Config(app,"activity").split("/")[0]){
		
		device.pressHome();
		sleep(1000);
		device.pressMenu();
		sleep(2000);
		Tap("desc",Pattern.compile(".*双击清理全部任务"),2000);
		device.pressHome();
		sleep(1000);
		
		execute("am start -n " + Get_Config(app,"activity"));
		WaitMessage(20,"启动应用");
		IsUpDataApp(app);
		return true;
	}else{
		print("Tap" + toStr(time()-tamp));
		return false;
	};
	
};


/*
*
*	头条脚本
*
*/

function 聚看点(){
	var appName = "聚看点";
	var tamp_read = 0
	var activity;
	var news_num;
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		By.res('com.xiangzi.jukandian:id/pager_jinbi_num').getText()
		
		//领取时段奖励
		if(null == By.clazz('android.widget.RelativeLayout').getText()){
			By.clazz('android.widget.RelativeLayout').clickAt(0);
			sleep(3000);
			if(Is_TextView("开箱成功")){device.pressBack();};
		};

		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			if(false == Get_SginIn(appName) && Tap("text","一键签到")){Set_SginIn(appName);}
			Tap("text",Pattern.compile("我知道了|继续赚钱|忽略|返回|.*close.*|不要奖励"),Random_num(2000,3000));
			Tap("res", Pattern.compile(".*image_update_cancle|.*ll_web_bottom_back|.*close.*"), 2000);
		};
		
		if( 0 == tamp_read){
			
			for(var i=0;i<=2;i++){
				Tap_RandomRect(612,1208,680,1270);
				sleep(Random_num(1000,2000));
			};
			if(Is_TextView("微信登录")){
				if(!Update_Id(appName)){return;};
			};
			Tap("text","看点",3000);
			news_num = By.res('com.xiangzi.jukandian:id/pager_jinbi_num').getText();
			
		}else if(1 <= tamp_read){
			device.swipe(20,176,580,175,Random_num(10,30));
			if(news_num == By.res('com.xiangzi.jukandian:id/pager_jinbi_num').getText()){
				Tap("text","我的",5000);
				Tap("res", Pattern.compile(".*close.*"), 2000);
				Tap_RandomRect(28,73,70,115);	//设置按钮
				Random_Swipt("top",Random_num(1500,2000));
				Tap("text","退出登录",5000);
				if(!Update_Id(appName)){return;};
			};
		};
		
		//随机选择标题栏
		Random_title(["推荐","美文","健康","资讯","娱乐","搞笑"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		//获取服务与组件名
		activity = device.getAct();
		
		//选择文章
		Tap("res","com.xiangzi.jukandian:id/item_artical_three_title_tv",3000);
		
		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){

				sleep(2000);
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(bool){if(FindImage("jkd_zk.png")){bool = false;};};

					if(Is_RunApp(appName)){break;};

					Tap("text","不要奖励",Random_num(1000,1500));
					
					Random_Swipt("top",Random_num(2500,4000));
				};

				tamp_read++;
				device.pressBack();
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};

	};
}

function 趣看点(){
	var tamp_read = 0;
	var appName = "趣看点";
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//领取时段奖励
		if(Tap("text","可领取",3000)){
			device.pressBack();
			sleep(1300);
		};
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			if(!Tap("text",Pattern.compile("忽略|.*close.*"),Random_num(2000,3000))){
				device.pressBack();
				sleep(2000);
			};
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务",Random_num(3500,5000));
			Tap("text","签到",Random_num(3500,5000));
			Tap("text","关闭",Random_num(1500,3000));
			Tap("text","首页",Random_num(1500,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","养生","正能量","娱乐"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅读"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("字体调节")){

				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					Tap("res","com.zhangku.qukandian:id/header_information_read_all_btn"),Random_num(2500,4000);
					
					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2500,4000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 惠头条(){
	var tamp_read = 0;
	var appName = "惠头条";
	var activity;
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//领取时段奖励
		if(Tap("text","点击领取",3000)){
			device.pressBack();
			sleep(1500);
		};
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			if(!Tap("text",Pattern.compile("忽略|.*close.*"),Random_num(2000,3000))){
				device.pressBack();
				sleep(2000);
			};
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务中心",Random_num(3500,5000));
			Tap("res","com.cashtoutiao:id/sign_btn_container",Random_num(3500,5000));
			Tap("text","忽略",Random_num(3500,5000));
			Tap("text","继续阅读",Random_num(3500,5000));
			Tap("text","头条",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["头条","热点","奇趣","健康","娱乐","美食"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+分钟前|[0-9]+小时前"),4000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			if(activity != device.getAct()){
				sleep(2000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){
						Tap("desc",Pattern.compile("展开全文.*"),Random_num(1000,2000))
						bool = false;
					};

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,4000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 微鲤看看(){
	var tamp_read = 0;
	var appName = "微鲤看看";

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		if(Tap("text","+50",3000)){
			device.pressBack();
			sleep(1500);
		};

		if(Tap("text","领金币",Random_num(3000,4000))){
			Tap("text",Pattern.compile("继续阅读|知道了"),Random_num(1500,2000));	
		};
		
		//判断是否处于主界面状态
		while(!Tap("text","头条")){
			if(!Tap("text",Pattern.compile("忽略|.*close.*"),Random_num(2000,3000))){
				device.pressBack();
				sleep(2000);
			};
		};

		if(1 == tamp_read && !Get_SginIn(appName)){
			Tap("text","签到",Random_num(8000,10000));
			device.click(InX(539),InY(292));
			sleep(3000);
			device.pressBack();
			sleep(2000);
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","财经","军事","热点","美图","女神"]);

		if(Tap("text","领金币",Random_num(3000,4000))){
			Tap("text",Pattern.compile("继续阅读|知道了"),Random_num(1500,2000));	
		};

		//选择文章
		By.res('cn.weli.story:id/tv_title').clickAt(Random_Arr([0,2]));
		sleep(3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){

			if(Is_TextView("写评论...")){

				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(!Is_TextView("写评论...") || Is_RunApp(appName)){break;};
					
					Tap("text",Pattern.compile("展开查看全文|收下啦"),Random_num(1000,2000));
					
					Random_Swipt("top",Random_num(2500,4000));
				
				};

				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
				
				
			};

			sleep(2000);
		
		};

		
	};
	
};

function 趣看天下(){
	var tamp_read = 0;
	var appName = "趣看天下"
	var activity;
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//领取时段奖励
		Tap("text","领取", 1000);
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			Tap("text",Pattern.compile("首页|忽略|.*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","每日金币",Random_num(8000,10000));
			device.pressBack();
			sleep(2000);
			Tap("text","刷新",Random_num(8000,10000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","养生","情感","娱乐","励志"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+评|刚刚|[0-9]+分钟前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			if(activity != device.getAct()){
				sleep(1000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){if(Tap("desc","展开查看全文",Random_num(1000,2000))){bool = false;};};

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(3500,5000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 东方头条(){
	var tamp_read = 0;
	var appName = "东方头条";
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//判断是否处于主界面状态
		while(!Tap("text","新闻",3000)){
			if(!Tap("text",Pattern.compile("忽略|.*close.*"),Random_num(2000,3000))){
				for(var i=0;i<=10;i++){
					if(By.clazz('android.widget.ImageView').clickAt(i)){break;}
				};
				device.pressBack();
				sleep(2000);
			};
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务",Random_num(8000,12000));
			Tap_RandomRect(492,352,635,388);
			sleep(Random_num(2000,3000));
			Tap("text","新闻",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","娱乐","广东"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(1,4);i++)
			Random_Swipt("top", Random_num(300,1000));
	
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅读|[0-9]+万阅读"),4000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=20*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("快去发表伟大言论吧！")){
				sleep(2000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){
						
						if(FindImage("dftt_ad.png"))
						{
							Tap_RandomRect(136,521,596,1000);
							sleep(3000);
							device.pressBack();
							sleep(3000);
						}
						
						var node = findView(By.desc('猜你喜欢 '));
						if(node){
							var rect2 = node.getVisibleBounds();
							device.click(360,Number(rect2.top)-320);
							bool = false;
						};
					};

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2500,4000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	}; 	
};

function 值得看看(){
	var tamp_read = 0;
	var appName = "值得看看";
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			Tap("text",Pattern.compile("继续阅读|取消"),Random_num(2000,3000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			if(Is_TextView("评论一下…")){
				device.pressBack();
				sleep(Random_num(2000,3000));
			};
			IsUpDataApp("值得看看");
		};

		if(1 == tamp_read && !Get_SginIn(appName)){
			Tap("text","签到",Random_num(8000,10000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.click(362,270);
			sleep(Random_num(3000,5000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("text","首页",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		By.clazz('android.view.View').clickAt(Random_num(1,6));
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅|[0-9]+分钟前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=20*1000){
			
			if(Is_TextView("评论一下…")){
				sleep(1000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){if(FindImage("zdkk_zk.png")){bool = false;}};

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2000,3500));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,4000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 中青看点(){
	var tamp_read = 0;
	var appName = "中青看点";

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap_RandomRect(576,1202,685,1279);
			sleep(Random_num(6000,10000));
			if(!Is_TextView("任务中心")){
				device.pressBack();
				sleep(1000);
			};
			Tap("text","任务中心",Random_num(8000,12000));
			Tap_RandomRect(135,293,591,359);	//点击签到按钮
			sleep(Random_num(3000,5000));
			device.pressBack();
			sleep(1000);
			Tap("text","首页",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","美文","娱乐","育儿","生活","热点","健康","笑话","美食","财政","科技"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅读"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("写评论...")){
				sleep(2000);
				
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 百姓头条(){
	var tamp_read = 0;
	var appName = "百姓头条";
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("text","确定",2000);
			Tap("desc","Navigate up",Random_num(2000,3000));
		};

		//随机选择标题栏
		Random_title(["推荐","高价","养生","教育","美食","社会","娱乐","搞笑","历史"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(1,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+万阅读|分享赚钱"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){

			sleep(2000);
			
			if(FindImage("bxtt_zk.png") && Is_TextView("分享赚钱")){
				sleep(1000);
				
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					Tap("text","取消",1000);
					
					if(Is_RunApp(appName) || Is_TextView("这篇文章您已经读很久了，建议换一篇哦！")){break;};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,4000));
				break;
			};
		};
		
	};
};

function 搜狐资讯(){
	var tamp_read = 0;
	var appName = "搜狐资讯";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领红包
		if(Tap("res","com.sohu.infonews:id/red_bag",2000)){
			Tap("res","com.sohu.infonews:id/redbag_open",2000)
		};
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务",Random_num(6000,8000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("res","com.sohu.infonews:id/lottie_sign_btn",Random_num(3000,5000))
			device.pressBack();
			sleep(2000);
			Tap("text","首页",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","要闻","娱乐","体育","国际","搞笑","南京","养生","情感"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("刚刚|[0-9]+分钟前|[0-9]+小时前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 今日视点(){
	var tamp_read = 0;
	var appName = "今日视点";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//判断是否处于主界面状态
		while(!Tap("text","资讯",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","赚钱",Random_num(8000,10000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("text","签到",Random_num(3000,5000));
			device.pressBack();
			sleep(2000);
			Tap("res","com.app.shidian:id/relay_box",Random_num(3000,5000))
			device.pressBack();
			sleep(2000);
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","娱乐","养生","搞笑","励志","奇闻","财经","历史"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("res","com.app.shidian:id/item_public_time",3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};

					if(bool){if(Tap("text",Pattern.compile("点击展开全文.*"),Random_num(1000,1500))){bool = false;};};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 松鼠资讯(){

	var tamp_read = 0;
	var appName = "松鼠资讯";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//判断是否处于主界面状态
		while(!Tap("text","首页",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","赚钱",Random_num(8000,10000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap_RandomRect(180,338,537,399);
			Tap("text","首页",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","娱乐","养生","搞笑","情感","科技","美食","游戏"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		print(Tap("res","com.songshu.jucai:id/read_num",3000));

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};

					if(bool){if(Tap("text","查看全文",Random_num(1000,1500))){bool = false;};};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 快头条(){
	var tamp_read = 0;
	var appName = "快头条";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		Tap("res","com.ifeng.kuaitoutiao:id/rlv_hour_reward",Random_num(2000,3000));
		
		//判断是否处于主界面状态
		while(!Tap("text","新闻",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap_RandomRect(414,1186,482,1276);
			sleep(Random_num(10000,15000));
			Tap_RandomRect(582,164,678,188);
			sleep(Random_num(3000,5000));
			Tap("text","新闻",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","军事","娱乐","养生","健康","图片","萌宠","小说","财经","体育","教育"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+评"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				if("com.ifeng.kuaitoutiao/com.ifeng.news2.activity.SlideActivity" == device.getAct()){
					
					while(!Is_TextView("推荐图集")){
						device.swipe(Random_num(600,718),Random_num(200,700),Random_num(10,100),Random_num(200,700),Random_num(10,50));
						sleep(Random_num(2000,3000));
					};
					
				}else{
					
					var bool = true;
					var wait_read = time();
					while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
	
						if(Is_RunApp(appName)){break;};
	
						if(bool){if(FindImage("ktt_zk.png")){bool = false;};};
						
						Random_Swipt("top",Random_num(2000,3000));
					};
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 快马小报(){

	var tamp_read = 0;
	var appName = "快马小报";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			device.pressBack();
			sleep(2000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","我的",Random_num(6000,8000));
			device.pressBack();
			sleep(2000);
			Tap("res","com.kuaima.browser:id/sign_rel",Random_num(3000,4000));
			device.pressBack();
			sleep(2000);
			Tap("text","小报",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		device.swipe(Random_num(500,600),Random_num(148,191),Random_num(1,100),Random_num(148,191),Random_num(10,50));
		device.swipe(Random_num(500,600),Random_num(148,191),Random_num(1,100),Random_num(148,191),Random_num(10,50));				
		sleep(3000);
		Tap_RandomRect(17,147,629,193);
		Tap("text","刷新",3000)
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("res","com.kuaima.browser:id/content",3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};

					if(bool){if(Tap("text","展开查看全文",Random_num(1000,2000))){bool = false;};};
					
					Random_Swipt("top",Random_num(4000,5000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(3000,4000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 蚂蚁头条(){

	var tamp_read = 0;
	var appName = "蚂蚁头条";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("res","com.ldzs.zhangxin:id/iv_back",Random_num(2000,3000));
			Tap("text","继续阅读",1000);
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务",Random_num(8000,10000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap_RandomRect(463,259,642,316);
			sleep(4000);
			device.pressBack();
			sleep(2000);
			Tap("text","看点",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","美文","育儿","社会","娱乐","国内","健康","笑话"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(1,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅读|刚刚|[0-9]+分钟前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					if(bool){if(FindImage("mytt_zk.png") || FindImage("mytt_zk2.png")){bool = false;};};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 牛牛头条(){

	var tamp_read = 0;
	var appName = "牛牛头条";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		Tap("text","点击领取",Random_num(2000,3000));
		
		//判断是否处于主界面状态
		while(!Tap("text",Pattern.compile("刷新|资讯"),3000)){
			Tap("text","忽略",Random_num(2000,3000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务",Random_num(6000,8000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap_RandomRect(463,259,642,316);
			sleep(2000);
			Tap("text","资讯",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","搞笑","娱乐","科技","汽车","体育","财经","军事","时尚","游戏","健康"]);

		activity = device.getAct();
		
		//选择文章
		if(Random_num(0,1)){
			Tap_RandomRect(82,1085,375,1149);
		}else{
			Tap_RandomRect(167,561,609,624);
		};
		
		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);

				//寻找不到进度条 - 则返回
				if(findView(By.res("com.huolea.bull:id/id_activity_news_details_progress_layout"))){
					var bool = true;
					var wait_read = time();
					while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
	
						if(Is_RunApp(appName)){break;};
						
						if(bool){
							node = findView(By.desc('猜你喜欢 '));
							if(node){
								var rect2 = node.getVisibleBounds();
								device.click(360,Number(rect2.top)-230);
								sleep(1500);
								bool = true;
							};
						};
						
						Random_Swipt("top",Random_num(2000,2500));
					};
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 大众看点(){

	var tamp_read = 0;
	var appName = "大众看点";
	var activity;
	var num = 0;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		Tap("res","com.dzkandian:id/gold_animation",Random_num(2000,3000));
		
		//判断是否处于主界面状态
		while(!Tap("text","看点",3000)){
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap("res","com.ldzs.zhangxin:id/iv_back",Random_num(2000,3000));
			Tap("text","继续阅读",1000);
		};

		for(var i=0;i<=num;i++){
			device.swipe(Random_num(100,600),Random_num(200,300),Random_num(100,600),Random_num(700,900),Random_num(10,20));
		};
		
		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务中心",Random_num(8000,10000));
			Tap("text","立即签到",Random_num(2000,3000));
			Tap("text","看点",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","美食","旅游","时尚","健康","汽车","房产","文化","娱乐"]);
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(1,4);i++){
			num++;
			Random_Swipt("top", Random_num(300,1000));
		};
			
		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+-[0-9]+-[0-9]+"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					if(bool){if(Tap("desc","展开全文 ")){bool = false;};};
					
					Random_Swipt("top",Random_num(2500,4000));
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 惠视频(){

	var tamp_read = 0;
	var appName = "惠视频";
	var activity;

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		Tap("res","com.cashvideo:id/ll_receive",2000);
		
		//判断是否处于主界面状态
		while(!Tap("text","首页",3000)){
			Tap("text",Pattern.compile("忽略|继续阅读"),Random_num(2000,3000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			device.pressBack();
			sleep(Random_num(2000,3000));
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","任务中心",Random_num(6000,8000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			Tap_RandomRect(301,188,420,310);
			sleep(2000);
			Tap("text","首页",Random_num(2000,3000));
			Set_SginIn(appName);
		}

		//随机选择标题栏
		By.clazz('android.widget.FrameLayout').clickAt(Random_num(9,16));

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));

		activity = device.getAct();
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+w次观看"),3000);
		
		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(activity != device.getAct()){
				sleep(2000);

				while(!device.hasObject(By.res('com.cashvideo:id/img_state_replay'))){

					if(Is_RunApp(appName)){break;};

					FindImage("hsp_lhb.png");
					
				};
				
				device.pressBack();
				tamp_read++;
				sleep(Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};

function 头条巴士(){

	var tamp_read = 0;
	var appName = "头条巴士";

	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);

		//领取时段奖励
		Tap("res","com.cashvideo:id/ll_receive",2000);
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			//Tap("text",Pattern.compile("忽略|继续阅读"),Random_num(2000,3000));
			//Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
			//device.pressBack();
			//sleep(Random_num(2000,3000));
		};

//		if(0 == tamp_read && !Get_SginIn(appName)){
//			Tap("text","任务",Random_num(6000,8000));
//			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
//			Tap_RandomRect(301,188,420,310);
//			sleep(2000);
//			Tap("text","首页",Random_num(2000,3000));
//			Set_SginIn(appName);
//		}

		//随机选择标题栏
		Random_title(["推荐","新时代","娱乐","上海","健康","养生","搞笑","励志","生活","财经"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
			
		//选择文章
		Tap("text",Pattern.compile("[0-9]+分钟前|刚刚|[0-9]+小时前"),3000);
		
		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("返回")){
				sleep(2000);
				
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					if(bool){if(FindImage("ttbs_zk.png")){bool = false;};};
					
					Random_Swipt("top",Random_num(2000,3000));
				};
				
				tamp_read++;
				Tap("text","返回",Random_num(2000,3000));
				break;
			};
			
			sleep(1500);
		};
		
	};
};






function 微信(){

	//阅读腾讯新闻
	Tap("text","腾讯新闻",Random_num(2500,4000));
	Tap_RandomRect(238,655,491,1227);
	sleep(Random_num(8000,15000));
	var wait_read = time();
	while(time()-wait_read<=Random_num(30,50)*1000){Random_Swipt("top",Random_num(2500,4000));};
	device.pressBack();
	sleep(Random_num(2000,3000));
	device.pressBack();
	sleep(Random_num(2000,3000));

	//随机浏览朋友圈 - 随机点赞
	Tap("text","发现",Random_num(1500,2000));
	Tap("text","朋友圈",Random_num(6000,8000));
	for(var i=0;i<Random_num(2,6);i++){
		for(var i=0;i<Random_num(2,6);i++){Random_Swipt("top",Random_num(2000,4000));};
		Tap("desc","评论",Random_num(2000,3000));
		Tap("text","赞",Random_num(1500,2000));
	};
	device.pressBack();
	sleep(Random_num(3000,4000));

	
	Tap("text","微信",Random_num(1500,2000));
	Tap_RandomRect(35,168,660,245);
	sleep(Random_num(3000,4000));
	Tap("res","com.tencent.mm:id/aca",Random_num(1500,2000));
	Tap("clazz","android.widget.EditText",Random_num(1500,2000));

	
};


function Update_Id(name){
	switch (name) {
		case "聚看点":
			var dl_num = 0;
			while(!Is_TextView("刷新")){
				Tap("text",Pattern.compile("微信登录|确定登录"),8000);
				
				if("com.xiangzi.jukandian/.wxapi.WXEntryActivity" == device.getAct()){
					Tap_RandomRect(226,798,515,843);	//微信登录按钮
					sleep(10000);
					device.pressBack();
				};

				sleep(3000);
				
				if(dl_num++ >= 4){return false};
			};
			return true;
			break;
		default:
			break;
	};
};
