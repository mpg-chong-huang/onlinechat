//server1 controller

var myControllers = angular.module('myControllers', []);

myControllers.controller("ListCtrl", function($scope, $firebase) {
	
	var ref = new Firebase("https://onlinechat88.firebaseio.com/foo/");
	
	var userRef = ref.child("ID").child("user1");
	var container = $('#message_container');
	var setRef = ref.child("ID").child("user1").child("state").set("online"); // set user1 online
	var userChatNo = ref.child("ID").child("user1").child("chatNo");  //set chat count
	//userChatNo.set(0);
	var userOnline = ref.child("ID").child("user1").child("onlineNo"); //set online chat count
	//userOnline.set(0);
	var a = 0, b = 0,c = 0,d = 0 , check_point = 0,list_long = 0,list_key = 0;
	
	//check online chat function
	
	function checkChat(e){
		
		var allChat = e,count = 1;
		
		$scope.tabs = [];
		
		for(var i = 1; i <= allChat;i++){
			
			userRef.child("chat"+i).child("state").on("value",function(snapshot,c){
				
				b = snapshot.val();
				
				if(b === "open"){
					
					console.log("第"+count+"个对话open");
					
					if(userRef.child("chat"+count).child("content")){
						
						$scope.messages = $firebase(userRef.child("chat"+count).child("content"));
						
						/*  log key
						var keys = $scope.messages.$getIndex();				
						
						keys.forEach(function(key, i) {
							console.log(i, $scope.items[key]); // Prints items in order they appear in Firebase.
						});
						*/
						
						$scope.addMsg = function() {
							$scope.messages.$add({
								name : '客服',
								text : $scope.text
							}).then(function() {
							});
							// clear text
							$scope.text = "";
						};
						
						$scope.tabs.push({
							name :"chat"+count,
							totab : "chatroom"+count
						});
						
						count++;
					}
				}else{
					console.log("第"+count+"个对话已经close");
					count++;
				}
			});
		}
	}
	
	//chatroom No. check
	userChatNo.on("value",function(snapshot){
		c = snapshot.val();
		list_long = c;
		checkChat(c)
	},function(e){
		console.log("聊天总数读写失败："+e.code);
	});
	
	//online chat No. check
	userOnline.on("value",function(snapshot){
		d = snapshot.val();
		if(check_point === 0){
			check_point = 1;
		}else{
			if(d < list_key){
				console.log("客户离开")
				checkChat(list_long);
				list_key = d;
			}else{
				console.log("客户进来");
				list_key = d;
			}
		}
	},function(e){
		console.log("在线人数读写失败："+e.code);
	});
	
	$scope.gotoMsg = function(target) {
		var go = angular.element(target).attr('data-name');
		console.log(go);
		$scope.messages = $firebase(userRef.child(go).child("content"));
	};
	
	$scope.removeMsg = function(target) {
		var id = angular.element(target).attr('data-id');
		$scope.messages.$remove(id);
	};
	
	$('#button_submit').on('click',function(event){
		$scope.addMsg();
	})
	
	window.onbeforeunload=function(event){
		ref.child("ID").child("user1").child("state").set("offline");  // user1 offline
    }
});