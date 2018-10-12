var Http = "https://gevin1.github.io/gevin/demo/";
var Path_func = ["main2.js","json.js","xiaoyi.js","run.js"];


function Main2(){
	
	for(var i=0;i<10;i++){
		toast("23333333"+" | "+i);
		sleep(1000);
	};
	
	Is_UpdataJs();
	
	//加载JS文件
	include(scriptDir+"/xiaoyi.js");
	
	include(scriptDir+"/json.js");
	Main_json();
	
	include(scriptDir+"/run.js");
	Main_run();
	
};


//检查是否需要更新
function Is_UpdataJs(){
	if(1 == Number(HttpUtil.get(Http+"updata.txt"))){
		toast("检测到需要更新,请等待...");
		for(a in Path_func){
			print(FileUtil.write(scriptDir,HttpUtil.get(Http+Path_func[a])));
			//HttpUtil.download(Http+Path_func[a],Path_Js+Path_func[a]);
		};
		toast("更新完成");
	};
}


