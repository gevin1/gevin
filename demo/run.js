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
		device.pressHome();
		Time_Run = Get_Config(Run_List[a],"time_run") * 60000;
		Time_Read = Get_Config(Run_List[a],"time_read");
		toast("准备启动 | " + Run_List[a]);
		device.pressHome();
		sleep(2000);
		device.pressMenu();
		sleep(3000);
		device.click(360, 1150);	//菜单
		device.pressHome();
		Get_Config(Run_List[a],"func")();
	};
	
};

function Is_RunApp(app){

	if(device.getAct() != Get_Config(app,"activity")){
		execute("am start -n " + Get_Config(app,"activity"));
		WaitMessage(20,"启动应用");
		IsUpDataApp(app);
		return true;
	}else{return false;};
	
};


/*
*
*	头条脚本
*
*/

function 聚看点(){
	var appName = "聚看点";
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//领取时段奖励
		if(null == By.clazz('android.widget.RelativeLayout').getText()){
			By.clazz('android.widget.RelativeLayout').clickAt(0);
			sleep(3000);
			if(Is_TextView("开箱成功")){device.pressBack();};
		};
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			if(false == Get_SginIn(appName) && Tap("text","一键签到")){Set_SginIn(appName);}
			Tap("text",Pattern.compile("我知道了|继续赚钱|忽略|返回|.*close.*"),Random_num(2000,3000));
			Tap("res", "com.xiangzi.jukandian:id/image_update_cancle", 2000);
			Tap("res","com.xiangzi.jukandian:id/ll_web_bottom_back", 2000);
		};

		//随机选择标题栏
		Random_title(["推荐","美文","健康","资讯","娱乐","搞笑"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]*阅读|0-9]*万阅读"),3000);
		
		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(undefined != findView(By.text("评论得金币"))){

				sleep(2000);
				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(bool){	
						var news_zk = By.res('readBtn').getView();
						if(null != By.res('readBtn').getView()){
							news_zk.click();
							sleep(Random_num(1300,2000));
							bool = false;
						};  
					};

					if(Is_RunApp(appName)){break;};
					
					Random_Swipt("top",Random_num(2500,4000));
				};
				
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
			if(Tap("text","点击阅读全文",Random_num(1000,2000))){

				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					Tap("text","继续阅读"),Random_num(2500,4000);
					
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
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+分钟前|[0-9]+小时前"),4000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("写评论...")){
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
		
		//判断是否处于主界面状态
		while(!Tap("text","头条",3000)){
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

		if(Tap("text","领金币",Random_num(3000,4000))){
			Tap("text",Pattern.compile("继续阅读|知道了"),Random_num(1500,2000));	
		};

		//随机选择标题栏
		Random_title(["推荐","财经","军事","热点","美图","女神"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++){
			if(Tap("text","领金币",Random_num(3000,4000))){
				Random_Swipt("top", Random_num(300,1000));
				Tap("text",Pattern.compile("继续阅读|知道了"),Random_num(1500,2000));	
			};
		};
		
		//选择文章
		Tap("res","cn.weli.story:id/tv_title",3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("写评论...")){
				sleep(1000);

				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){

					if(Is_RunApp(appName)){break;};
					
					Tap("text",Pattern.compile("展开查看全文|收下啦"),Random_num(1000,2000));
					
					Random_Swipt("top",Random_num(2000,3500));
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

function 趣看天下(){
	var tamp_read = 0;
	var appName = "趣看天下"
	
	//头条新闻_限时阅读
	var wait_time = time();
	while(time()-wait_time<=Time_Run){
		toast("阅读时间 | 剩余"+toStr((Time_Run-(time()-wait_time))/1000)+"秒");

		Is_RunApp(appName);
		
		//领取时段奖励
		Tap("text","领取", 1000);
		
		//判断是否处于主界面状态
		while(!Tap("text","刷新",3000)){
			if(!Tap("text",Pattern.compile("忽略|.*close.*"),Random_num(2000,3000))){
				Tap("text","首页",3000);
				device.pressBack();
				sleep(2000);
			};
		};

		if(0 == tamp_read && !Get_SginIn(appName)){
			Tap("text","每日金币",Random_num(8000,10000));
			device.pressBack();
			sleep(2000);
			Set_SginIn(appName);
		}

		//随机选择标题栏
		Random_title(["推荐","热点","养生","情感","娱乐","励志"]);

		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+评|刚刚|[0-9]+分钟前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=15*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("写评论")){
				sleep(1000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){
						Tap("desc","展开查看全文",Random_num(1000,2000));
						bool = false;
					};

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
			Tap("text","任务",Random_num(6000,10000));
			Tap("res","com.songheng.eastnews:id/uj",Random_num(3000,5000));
			Tap("desc","立即签到",Random_num(3000,5000));
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
						var rect = findImg(scriptDir+"/dftt_ad.png",557,307,615,362,32,2,0x101010,0.9);
						if(-1 != rect.left){device.click(rect.left+20, rect.top+20);};
						
						var node = findView(By.desc('猜你喜欢 '));
						if(undefined != node){
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
			Tap("text",Pattern.compile("继续阅读|确定"),Random_num(2000,3000));
			Tap("res",Pattern.compile(".*close.*"),Random_num(2000,3000));
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
		device.click(Random_num(640,715),Random_num(170,200));
		sleep(Random_num(4000,5000));
		Random_title(["推荐","美文","汽车","女人","娱乐","育儿","养生","生活","搞笑","健康","情感","国际","时尚"]);
		while(!Is_TextView("刷新")){sleep(1000);};
		
		//随机选择 刷新 or 滑动列表
		for(var i=1;i<=Random_num(0,4);i++)
			Random_Swipt("top", Random_num(300,1000));
		
		//选择文章
		Tap("text",Pattern.compile("[0-9]+阅|[0-9]+分钟前"),3000);

		//等待文章加载
		var wait_news = time();
		while(time()-wait_news<=20*1000){
			
			//获取文章类型 - 获取成功 表示 文章加载完成
			if(Is_TextView("评论一下…")){
				sleep(1000);

				var bool = true;
				var wait_read = time();
				while(time()-wait_read<=Random_num(Time_Read[0],Time_Read[1])*1000){
					
					if(bool){
						var rect = findImg(scriptDir+"/zdkk_zk.png",0,0,0,0,32,2,0x101010,0.9);
						if(-1 != rect.left){
							device.click(rect.left+Random_num(-60,600), rect.top+Random_num(-10,10));
							bool = false;
						};
					};

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
			Tap("text","任务中心",Random_num(8000,12000));
			Tap_RandomRect(135,293,591,359);	//点击签到按钮
			sleep(Random_num(3000,5000));
			device.pressBack();
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











function print2(content){
	toast(content);
	print(content);
}

