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
// @version		1.6
// @grant		none
// @description	ニコニコ大百科掲示板NG機能。IDを入力して設定を押せばNGできます。
// ==/UserScript==

var url = window.location.href;


var doNGImpl;
var doNG;
if(url.indexOf("dic.nicovideo.jp/t/b/a")===-1){//PC or nicomoba
	doNGImpl=function doNGImpl(dl, ngList){
		var resheads=dl.getElementsByTagName("dt");
		var resbodies=dl.getElementsByTagName("dd");
		for(var i=0; i<resheads.length; i++){
			var reshead=resheads[i];
			var resbody=resbodies[i];
			for(var j=0; j<ngList.length; j++){
				if(reshead.textContent.indexOf(ngList[j])!=-1){
					reshead.childNodes[3].textContent="NGしました";
					reshead.childNodes[4].textContent=" ：NGしました ID: "+ngList[j];
					resbody.textContent="NGしました";
				}
			}
		}
	};
	doNG=function doNG(NGList){
		console.log("doNG PC or nicomoba");
		var ngList=NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		var bbs = document.getElementsByTagName("dl");
		for(var dl=0; dl<bbs.length; dl++)
			doNGImpl(bbs[dl], ngList);
	};
}
else{//mobile
	doNGImpl=function doNGImpl(bbs, ngList){
		var posts=bbs.getElementsByTagName("p");
		for(var i=0; i<posts.length; i++){
			var post=posts[i];
			for(var j=0; j<ngList.length; j++){
				if(post.textContent.indexOf(ngList[j])!=-1){
					post.children[2].textContent="NGしました";
					post.children[4].textContent="NGしました ID: "+ngList[j];
					post.childNodes[9].textContent="NGしました";
					var length = post.childNodes.length;
					for(var k=0; k<length-10; k++)
						post.removeChild(post.childNodes[10]);
				}
			}
		}
	};
	doNG=function doNG(NGList){
		console.log("doNG mobile");
		var ngList=NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		var bbs = document.getElementById("bbs_wrapper");
		doNGImpl(bbs, ngList);
	};
}

function getNGdiv(){
	var div = document.createElement("div");
	var NGList = document.createElement("textarea");
	var NGButton = document.createElement("button");
	NGList.name = "NGList";
	NGList.maxLength = "5000";
	NGList.cols = "40";
	NGList.rows = "10";
	if(typeof(Storage) !== "undefined"){
		if(localStorage.nicodicNG){
			NGList.value = localStorage.getItem('nicodicNG');
		}
	}
	NGButton.name = "NGButton";
	NGButton.textContent = "設定";
	NGButton.style = "width:50px; height:25px";
	NGButton.onclick=function(){
		localStorage.setItem('nicodicNG', NGList.value);
		doNG(NGList);
	};
	div.appendChild(NGList);
	div.appendChild(NGButton);

	div.NGList=NGList;
	return div;
}

(function(){
	//autopagerize support
	document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
		doNG(NGdiv.NGList);
	}, false);
	
	var NGdiv = getNGdiv();
	var div;
	if(url.indexOf("dic.nicovideo.jp/t")!==-1){//mobile
		div = document.getElementById("footer");
		div.parentNode.insertBefore(NGdiv, div);
	}
	else if(url.indexOf("nicomoba")===-1){//PC
		div = document.getElementById("main");
		div.appendChild(NGdiv);
	}
	else{//nicomoba
		div = document.querySelectorAll("[id='bottom']")[1];
		div.parentNode.insertBefore(NGdiv, div);
	}

	doNG(NGdiv.NGList);
})();