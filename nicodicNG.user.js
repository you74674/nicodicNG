// ==UserScript==
// @name		ニコニコ大百科掲示板NG機能
// @namespace	yakisoft
// @include		http://dic.nicovideo.jp/a/*
// @include		https://dic.nicovideo.jp/a/*
// @include		http://dic.nicovideo.jp/b/a/*
// @include		https://dic.nicovideo.jp/b/a/*
// @version		1.2
// @grant		none
// @description	ニコニコ大百科掲示板NG機能。IDを入力して設定を押せばNGできます。
// ==/UserScript==

(function(){
	function doNG(NGList){
		var ngList = NGList.value.split('\n')
		var bbs = document.getElementById("bbs").getElementsByTagName("dl")[0]
		for(var i=0; i<bbs.childElementCount; i+=2){
			var reshead=bbs.children[i];
			var resbody=bbs.children[i+1];
			for(var j=0; j<ngList.length; j++){
				if(ngList[j].length!=0)
					if(reshead.textContent.indexOf(ngList[j])!=-1){
						reshead.childNodes[3].textContent="NGしました"
						reshead.childNodes[4].textContent="：NGしました ID: "+ngList[j]
						resbody.textContent="NGしました""
					}
			}
		}
	}
	var div = document.getElementById("contents");
	var NGList = document.createElement("textarea");
	var NGButton = document.createElement("button");
	NGList.name = "NGList";
	NGList.maxLength = "5000";
	NGList.cols = "40";
	NGList.rows = "10";
	if(typeof(Storage) !== "undefined"){
		if(localStorage.nicodicNG){
			NGList.value = localStorage.getItem('nicodicNG')
		}
	}
	NGButton.name = "NGButton";
	NGButton.textContent = "設定"
	NGButton.style = "width:50px; height:25px"
	NGButton.onclick=function(){
		localStorage.setItem('nicodicNG', NGList.value)
		doNG(NGList)
	}
	div.appendChild(NGList); //appendChild
	div.appendChild(NGButton);

	doNG(NGList);
})();