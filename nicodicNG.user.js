// ==UserScript==
// @name        �j�R�j�R��S�Ȍf����NG�@�\
// @namespace   yakisoft
// @include     http://dic.nicovideo.jp/a/*
// @include     http://dic.nicovideo.jp/b/a/*
// @version     1
// @grant       none
// @description �j�R�j�R��S�Ȍf����NG�@�\�BID����͂��Đݒ��������NG�ł��܂��B
// ==/UserScript==

(function(){

  function doNG(NGList){
    var ngList = NGList.value.split('\n')
    var bbs = document.getElementById("bbs").getElementsByTagName("dl")[0]
    for(var i=0; i<bbs.childElementCount; i+=2){
      var reshead=bbs.children[i];
      var resbody=bbs.children[i+1];
      for(var j=0; j<ngList.length; j++){
        if(reshead.textContent.search(ngList[j])!=-1){
          reshead.childNodes[3].textContent="NG���܂���"
          reshead.childNodes[4].textContent="�FNG���܂��� ID: "+ngList[j]
          resbody.textContent="NG���܂���"
        }
      }
    }
  }
  var div = document.getElementById("contents");
  var NGList = document.createElement("textarea");
  var NGButton = document.createElement("button");
  NGList.class = "NGList"
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
  NGButton.textContent = "�ݒ�"
  NGButton.style = "width:50px; height:25px"
  NGButton.onclick=function(){
    localStorage.setItem('nicodicNG', NGList.value)
    doNG(NGList)
  }
  div.appendChild(NGList); //appendChild
  div.appendChild(NGButton);

  
  doNG(NGList);
})();