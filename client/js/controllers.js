//client controller

var myControllers = angular.module('myControllers', []);

myControllers.controller("ListCtrl", function($scope, $firebase) {
	
	var ref = new Firebase("https://onlinechat88.firebaseio.com/foo/");
	
	var a = 0,b = 0,d = 0;
	window.check = 1; //close key
	window.online = null;
	var chatinfo = []; // chat server info
	
	var userinfo = $(window).navigate;
	console.log(userinfo);
	
	//selection 
	$scope.data = {
		
		availableOptions: [
		  {id: '0', name: '请选择您所使用的语言'},
		  {id: '1', name: '中文'},
		  {id: '2', name: 'Tiếng Việt'},
		  {id: '3', name: 'ภาษาไทย'},
		  {id: '4', name: 'Bahasa Indonesia'},
		  {id: '5', name: '日本語'}
		],
		selectedOption: {id: '0', name: '请选择您所使用的语言'}
    };
	
	$scope.update = function(option){
		
		//language set
		var language_key = null;
		
		switch (option){
			case '1': language_key = "CH"; break;
			case '2': language_key = "VN"; break;
			case '3': language_key = "TH"; break;
			case '4': language_key = "ID"; break;
			case '5': language_key = "JP"; break;
			default : console.log("请选择您所使用的语言")
		}
		
		console.log("选择语言"+language_key+"，链接服务器");
		
		//language selected
		var userc = ref.child(language_key);
		var userRef = ref.child(language_key).child("user1");
		var userState = ref.child(language_key).child("user1").child("state");
		var userChatNo = ref.child(language_key).child("user1").child("chatNo");
		var userOnline = ref.child(language_key).child("user1").child("onlineNo");
			
		console.log("开始链接服务器...");
		
		//check and load server
		
		userc.once("value",function(snapshot){
			
			snapshot.forEach(function(childSnapshot){
				var user = childSnapshot.key();
				var key = childSnapshot.val().state;
				var totalchat = childSnapshot.val().onlineNo;
				var pushin = [user,childSnapshot.val()];
				if(key == "online"){
					chatinfo.push(pushin);
				}
				if(totalchat === undefined){
					totalchat = 0;
				}	
				console.log(language_key+"服务器"+user+"状态"+key+"/在线聊天："+totalchat);
				//operate server
				
			});
			
			var counter = chatinfo[0][1].onlineNo,loader = chatinfo[0][0];// check balance
			
			for( var i = 1 ; i < chatinfo.length;i ++){
				
				if(chatinfo[i][1].onlineNo < counter){
					counter = chatinfo[i][1].onlineNo;
					loader = chatinfo[i][0];
				}else if(chatinfo[i][1].onlineNo == undefined){
					loader = chatinfo[i][0];
				}else{
					
				}
				console.log(chatinfo[i][1].onlineNo);
			}
			
			console.log("选择进入"+language_key+"服务器客服："+loader);
			
			userRef = ref.child(language_key).child(loader);
			userState = ref.child(language_key).child(loader).child("state");
			userChatNo = ref.child(language_key).child(loader).child("chatNo");  // totall chat s
			userOnline = ref.child(language_key).child(loader).child("onlineNo");  // online chat s
			
			
			userChatNo.once("value", function(snapshot){
				a = snapshot.exists();
				if(a){
					b = snapshot.val();
					b = b + 1;
					userChatNo.set(b);
					
					$scope.messages = $firebase(userRef.child("chat"+b).child("content")); //chat inside of content
					
					userRef.child("chat"+b).child("state").set("open"); //chat state open
					
					window.check = b;
					$scope.addMsg = function() {
						$scope.messages.$add({
							name : $scope.name,
							text : $scope.text
						}).then(function(ref) {
								});
						//$scope.name = "";
						//clear text
						$scope.text = "";
					};
					
				}else{
					userChatNo.set(1);
					$scope.messages = $firebase(userRef.child("chat"+1).child("content"));
					userRef.child("chat1").child("state").set("open"); //chat state open
					var keys = $scope.messages.$getIndex();
					
					keys.forEach(function(key, i) {
						console.log(i, $scope.items[key]); // Prints items in order they appear in Firebase.
					});

					$scope.addMsg = function() {
						$scope.messages.$add({
							name : $scope.name,
							text : $scope.text
						}).then(function(ref) {
								});
						//$scope.name = "";
						//clear text
						$scope.text = "";
					};
				}
				return b
			},function(e){
				console.log("读写失败："+e.code);
			});
			
			userOnline.once("value",function(snapshot){
					a = snapshot.exists();
				if(a){
					b = snapshot.val();
					b = b +1;
					console.log("现在有"+b+"人在线");
					userOnline.set(b);
				}else{
					userOnline.set(1);
					console.log("目前1人在线");
				}
				
				window.online = b;
			},function(e){
				console.log("读写失败："+e.code);
			});
				
		userChatNo.once("value", function(snapshot){
				
				a = snapshot.exists();
				if(a){
					b = snapshot.val();
					b = b + 1;
					userChatNo.set(b);
					
					$scope.messages = $firebase(userRef.child("chat"+b).child("content")); //chat inside of content
					
					userRef.child("chat"+b).child("state").set("open"); //chat state open
					
					window.check = b;
					$scope.addMsg = function() {
						$scope.messages.$add({
							name : $scope.name,
							text : $scope.text
						}).then(function(ref) {
								});
						//$scope.name = "";
						//clear text
						$scope.text = "";
					};
					
				}else{
					userChatNo.set(1);
					$scope.messages = $firebase(userRef.child("chat"+1).child("content"));
					userRef.child("chat1").child("state").set("open"); //chat state open
					var keys = $scope.messages.$getIndex();
					
					keys.forEach(function(key, i) {
						console.log(i, $scope.items[key]); // Prints items in order they appear in Firebase.
					});

					$scope.addMsg = function() {
						$scope.messages.$add({
							name : $scope.name,
							text : $scope.text
						}).then(function(ref) {
								});
						//$scope.name = "";
						//clear text
						$scope.text = "";
					};
				}
				return b
			},function(e){
				console.log("读写失败："+e.code);
			});	
		
		window.onbeforeunload = function (event){
			var c = event || window.event;
			c.returnValue = "离开页面将导致数据丢失!";
			
			
			console.log(window.online);
		}
		
		window.onunload  = function(event){
			var key = window.check,onlineholder = window.online;
			userRef.child("chat"+key).child("state").set("close");
			
			if(onlineholder > 0){
				onlineholder = onlineholder - 1 ;
				userOnline.set(onlineholder);
			}else{
				userOnline.set(0);
			}
		}
		
		//loaded success
		$("#language_selection").css("display","none");
	
	});
	
	}
	//output
	$('#button_submit').on('click',function(event){
		$scope.addMsg();
	})
	
});