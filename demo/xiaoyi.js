print("xiaoyi 加载成功");

//获取手机屏幕大小
var Width = device.getDisplayWidth();
var Height = device.getDisplayHeight();

//寻找节点文本
function Is_TextView(value){
	var ret = device.hasObject(By.text(value));
	toast(value);
	return ret
};

//点击节点文本
function Tap(type,value,delay){	
	var node;
	
	//是否延迟
	if(null == delay){delay = 0};

	//类型选择
	if("text" == type){			node = findView(By.text(value));
	}else if("res" == type){		node = findView(By.res(value));
	}else if("desc" == type){	node = findView(By.desc(value));
	}else if("clazz" == type){	node = findView(By.clazz(value));};
	
	if(undefined != node){
		var rect = node.getVisibleBounds();
		Tap_RandomRect(rect.left,rect.top,rect.right,rect.bottom);
		sleep(delay);
		return true;
	}else{
		return false;
	};
};

//生成随机数值
function Random_num(min,max){
	return Math.floor((max-min+1)*Math.random()+min);
};

//随机点击标题栏
function Random_title(arr){	
	
	while(true){
		var num = Random_num(0,arr.length-1);
		if(Tap("text",arr[num])){
			toast("选择标题栏 | "+arr[num]);
			sleep(3000);
			return;
		};
	};
};

//上下随机滑动
function Random_Swipt(direction,delay){
	var t_X = InX(Random_num(300,700));
	var p1 = android.graphics.Point(Random_num(t_X-30,t_X+30),InY(Random_num(600,700)));
	var p2 = android.graphics.Point(Random_num(t_X-30,t_X+30),InY(Random_num(750,900)));
	var p3 = android.graphics.Point(Random_num(t_X-30,t_X+30),InY(Random_num(950,1200)));
	var p4 = android.graphics.Point(Random_num(t_X-30,t_X+30),InY(Random_num(1250,Random_num(1360,1500))));

	//选择方向进行滑动
	if("top"==direction)
		device.swipe([p4,p3,p2,p1],Random_num(8,11));
    	else if("down"==direction)
    		device.swipe([p1,p2,p3,p4],Random_num(8,11));
    		
	sleep(delay);
};

//X 分辨率转换
function InX(val){
	return Math.floor(Width*(val/1080));
};

//Y 分辨率转换
function InY(val){
	return Math.floor(Height*(val/1920));
};

//等待并提示
function WaitMessage(delay,content){
	for(var i=delay;i>0;i--){
		toast("等待 "+i+" | "+content);
		sleep(1000);
	}
}

//检测 是否升级
function IsUpDataApp(app){
	var type = Get_Config(app,"by");
	var value = Get_Config(app,"updata");
	
	if(Tap(type,value,5000)){

		//等待下载更新包
		var wait_UpData = time();
		while(time()-wait_UpData<=6*60*1000){
			sleep(2000);

			//下载更新包完成 - 开始安装
			if(Tap("text", "安装", 5000)){
				var wait_tamp = time();
				while(time()-wait_tamp<=6*60*1000){
					if(Tap("text", "完成", 2000)){ 
						execute("am start -n " + Get_Config(app,"activity"));
						WaitMessage(20,"更新完成｜启动应用");
						return;
					};
					sleep(2000);					
				};
			};
		};
	};
};

//判断文件是否存在
function Exists(file){
	return java.io.File(file).exists();
}

//随机在范围内点击
function Tap_RandomRect(left,top,right,bottom){
	var num1 = (right - left) * 0.1;
	var num2 = (bottom - top) * 0.1;
	device.click(Random_num(left+num1,right-num1),Random_num(top+num2,bottom-num2));
}




