// ==UserScript==
// @name		ニコニコ大百科掲示板NG機能
// @namespace	yakisoft
// @include		http://dic.nicovideo.jp/a/*
// @include		https://dic.nicovideo.jp/a/*
// @include		http://dic.nicovideo.jp/b/a/*
// @include		https://dic.nicovideo.jp/b/a/*
// @include		http://dic.nicomoba.jp/k/b/a/*
// @include		https://dic.nicomoba.jp/k/b/a/*
// @include		http://dic.nicovideo.jp/t/b/a/*
// @include		https://dic.nicovideo.jp/t/b/a/*
// @version		1.5.1
// @grant		none
// @description	ニコニコ大百科掲示板NG機能。IDを入力して設定を押せばNGできます。
// ==/UserScript==

(function(){
	document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
		doNG(NGList)
	}, false);
	function doNGImpl(dl, ngList){
		var resheads=dl.getElementsByTagName("dt")
		var resbodies=dl.getElementsByTagName("dd")
		for(var i=0; i<resheads.length; i++){
			var reshead=resheads[i]
			var resbody=resbodies[i]
			for(var j=0; j<ngList.length; j++){
				if(reshead.textContent.indexOf(ngList[j])!=-1){
					reshead.childNodes[3].textContent="NGしました"
					reshead.childNodes[4].textContent=" ：NGしました ID: "+ngList[j]
					resbody.textContent="NGしました"
				}
			}
		}
	}
	function doNG(NGList){
		var ngList=NGList.value.split('\n').filter(function(el) {return el.length != 0})
		var bbs = document.getElementsByTagName("dl")
		for(var dl=0; dl<bbs.length; dl++)
			doNGImpl(bbs[dl], ngList)
	}
	var div = document.getElementById("right-column");
	if(div==null)//mobile version
		div=document.querySelectorAll("[id='bottom']")[1] 
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