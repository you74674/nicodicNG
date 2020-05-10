// ==UserScript==
// @name		ニコニコ大百科掲示板NG機能
// @namespace	yakisoft
// @include		/^https?:\/\/dic\.nico(moba|video)\.jp\/[a-z]\/.*$/
// @version		1.9.4
// @grant		none
// @run-at document-start
// @description	ニコニコ大百科掲示板NG機能。IDを入力して設定を押せばNGできます。
// ==/UserScript==

var url = window.location.href;

function hide(e, c, r){
	var key = c+"_cache";
	if(r!==undefined){
		if(e[c]!=r){
			e[key]=e[c];
			e[c]=r;
		}
	}
	else{
		if(e[key]!==undefined){
			e[c]=e[key];
			e[key]=undefined;
		}
	}
}

var doNG;
var addNGButton;
if(url.indexOf("dic.nicovideo.jp/t/b/a")===-1){//PC or nicomoba
	var doNGImpl=function doNGImpl(dl, ngList){
		var resheads=dl.getElementsByTagName("dt");
		var resbodies=dl.getElementsByTagName("dd");
		for(var i=0; i<resheads.length; i++){
			var name=resheads[i].childNodes[5];
			var date_id=resheads[i].childNodes[7];
			var id=date_id.children[0];
            date_id.removeChild(id);
			var text=resbodies[i];
			if(ngList.indexOf(id.textContent)!=-1){
				hide(name, "textContent", "NGしました");
				hide(date_id, "textContent", "NGしました ID:  ");
				hide(text, "innerHTML", "NGしました");
			}
			else{
				hide(name, "textContent");
				hide(date_id, "textContent");
				hide(text, "innerHTML");
			}
            date_id.appendChild(id)
		}
	};
	var getBBS=function(){
		return document.getElementsByTagName("dl");
	};
	var getSelectorString=function(){
		return 'dl > dt[class=st-bbs_reshead]';
	};
	doNG=function doNG(NGList){
		console.log("doNG PC or nicomoba");
		var ngList=NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		var bbs = document.querySelectorAll('div[class=st-bbs-contents] > dl');
		for(var dl=0; dl<bbs.length; dl++)
			doNGImpl(bbs[dl], ngList);
	};

	addNGButton=function addNGButton(NGList){
		var dts=document.querySelectorAll(getSelectorString());
		var regex=/ID: (.*)/;
		dts.forEach(function(e){
			e.innerHTML=e.innerHTML.replace(regex, "ID: <id title='NGする' style='cursor: pointer;'>$1</id>");
			var id=e.querySelectorAll('id')[0];
			id.onmouseover = function() {
				id.style.color="red";
				id.style.textDecoration = "underline";
			};
			id.onmouseleave = function() {
				id.style.color="grey";
				id.style.textDecoration = "none";
			};
		});
		var ids=document.querySelectorAll(getSelectorString()+ ' > div > id');
		ids.forEach(function(e){
			e.onclick=function(){
				var ID=e.textContent;
				if(NGList.value.indexOf(ID)==-1){
					NGList.addNGID(ID);
				}
				else{
					NGList.removeNGID(ID);
				}
				doNG(NGList);
                e.onmouseleave();
			};
		});
	};
}
else{//mobile
	var doNGImpl=function doNGImpl(bbs, ngList){
		var posts=bbs.getElementsByTagName("li");
		for(var i=0; i<posts.length; i++){
			var post=posts[i];
			var name=post.getElementsByClassName("at-List_Name")[0].childNodes[1];
			var date_id=post.getElementsByClassName("at-List_Date")[0];
			var text=post.getElementsByClassName("at-List_Text")[0];
			for(var j=0; j<ngList.length; j++){
				if(date_id.textContent.indexOf(ngList[j])!=-1){
					name.textContent="NGしました";
					date_id.textContent="NGしました ID: "+ngList[j];
					text.textContent="NGしました";
				}
			}
		}
	};
	var getBBS=function(){
		return document.getElementsByClassName("sw-Article_List")[0];
	};
	doNG=function doNG(NGList){
		console.log("doNG mobile");
		var ngList=NGList.value.split('\n').filter(function(el) {return el.length !== 0;});
		var bbs = getBBS();
		doNGImpl(bbs, ngList);
	};
}

function getNGdiv(){
	var div = document.createElement("div");
	var NGList = document.createElement("textarea");
	var NGButton = document.createElement("button");
	NGList.name = "NGList";
	NGList.cols = "40";
	NGList.rows = "10";
	if(typeof(Storage) !== "undefined"){
		if(localStorage.nicodicNG){
			NGList.value = localStorage.getItem('nicodicNG');
		}
	}
	NGList.addNGID=function(id){
		NGList.value+="\n"+id;
		while(NGList.value.indexOf("\n\n")!=-1)
			NGList.value=NGList.value.replace("\n\n", "\n");
		localStorage.setItem('nicodicNG', NGList.value);
	};
	NGList.removeNGID=function(id){
		NGList.value=NGList.value.replace(id, "");
		while(NGList.value.indexOf("\n\n")!=-1)
			NGList.value=NGList.value.replace("\n\n", "\n");
		localStorage.setItem('nicodicNG', NGList.value);
	};

	NGButton.name = "NGButton";
	NGButton.textContent = "NG設定";
	NGButton.style = "width:75px; height:25px";
	NGButton.onclick=function(){
		localStorage.setItem('nicodicNG', NGList.value);
		doNG(NGList);
	};
	div.appendChild(NGList);
	div.appendChild(NGButton);

	div.NGList=NGList;

	return div;
}

var main=function(){
	//autopagerize support
	document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
		doNG(NGdiv.NGList);
	}, false);

	var NGdiv = getNGdiv();
	var div;
	if(url.indexOf("dic.nicovideo.jp/t")!==-1){//mobile
		div = document.getElementsByClassName("st-Footer_Inner")[0];
		div.parentNode.insertBefore(NGdiv, div.nextSibling);
		NGdiv.NGList.rows = "5";
		NGdiv.NGList.cols = "20";
		document.getElementsByClassName("st-Footer")[0].style.height="295.9375px";
	}
	else if(url.indexOf("nicomoba")===-1){//PC
		div = document.getElementById("main");
		div.appendChild(NGdiv);
		addNGButton(NGdiv.NGList);
	}
	else{//nicomoba
		div = document.querySelectorAll("[id='bottom']")[1];
		div.parentNode.insertBefore(NGdiv, div);
		addNGButton(NGdiv.NGList);
	}

	doNG(NGdiv.NGList);
};
if(url.indexOf("dic.nicovideo.jp/a")===-1)//notes page
	document.getElementsByTagName("html")[0].style.visibility="hidden";
var greasemonkeyInterval = setInterval(greasemonkey, 100);
function greasemonkey(){
	if(document.readyState!=="loading"){
		clearInterval(greasemonkeyInterval);
		try{
			main();
		}
		finally{
			document.getElementsByTagName("html")[0].style.visibility="";
		}
	}
}