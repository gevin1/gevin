var Http = "https://gevin1.github.io/gevin/demo/";
var Path_func = ["main2.js","json.js","xiaoyi.js","run.js"];


run = function (){
	
	Is_UpdataJs();
	
	include(scriptDir+"/xiaoyi.js");
	
	include(scriptDir+"/json.js");
	Main_json();
	
	include(scriptDir+"/run.js");
	Main_run();
	
}();


//检查是否需要更新
function Is_UpdataJs(){
	if(1 == Number(HttpUtil.get(Http+"updata.txt"))){
		toast("检测到需要更新,请等待...");
		for(a in Path_func){
			print(FileUtil.write(scriptDir+"/"+Path_func[a],HttpUtil.get(Http+Path_func[a])));
		};
		sleep(2000);
		toast("更新完成");
	};
}


