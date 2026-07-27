// ==========================
// 溫暖備料系統 V1
// app.js
// ==========================



// ==========================
// 顯示頁面
// ==========================


function showPage(page){


document
.querySelectorAll(".page")
.forEach(item=>{


item.classList.remove("show");


});



document
.getElementById(page)
.classList.add("show");


}






// ==========================
// 建立品項卡
// ==========================


function createItem(name){



let data =
prepareData[name];



return `


<div class="item">


<div class="item-name">

${name}

</div>



<div class="qty-box">


<button class="qty-btn"

onclick="changeQty('${name}',-1)">

－

</button>



<div class="qty-number"

id="qty-${name}">

${data.qty}

</div>



<button class="qty-btn"

onclick="changeQty('${name}',1)">

＋

</button>



</div>





<div class="action-box">


${

data.availableActions.map(action=>`


<button

class="action-btn"

id="${name}-${action}"

onclick="toggleAction('${name}','${action}')"

>

${action}

</button>


`).join("")

}


</div>



</div>


`;

}





// ==========================
// 顯示分類
// ==========================


function renderList(list,target){



let html="";



list.forEach(item=>{


html += createItem(item);


});



document.getElementById(target)
.innerHTML=html;


}





// ==========================
// 數量調整
// ==========================


function changeQty(name,num){



prepareData[name].qty += num;



if(
prepareData[name].qty < 0
){

prepareData[name].qty=0;

}



document
.getElementById(
"qty-"+name
)
.innerHTML =
prepareData[name].qty;


}







// ==========================
// 選擇處理方式
// ==========================


function toggleAction(name,action){



let list =
prepareData[name].actions;



let index =
list.indexOf(action);



let button =
document.getElementById(
name+"-"+action
);



if(index>-1){


list.splice(index,1);


button.classList.remove(
"active"
);


}

else{


list.push(action);


button.classList.add(
"active"
);


}


}







// ==========================
// 醬料
// ==========================


function renderSauce(){



let html="";



sauceData.forEach((sauce,index)=>{


html += `


<div class="item">


<div class="item-name">

${sauce.name}

</div>


<button

class="action-btn"

onclick="showSauce(${index})"

>

查看材料

</button>


<div id="sauce-${index}"></div>


</div>


`;

});


document
.getElementById("sauceList")
.innerHTML=html;


}





function showSauce(index){



let sauce =
sauceData[index];



let html =

"<p>需要製作：</p>";



sauce.materials.forEach(item=>{


html +=

`
<div>

□ ${item}

</div>

`;


});



document
.getElementById(
"sauce-"+index
)
.innerHTML=html;


}







// ==========================
// LINE產生
// ==========================


function createLINE(){



let text =

"【🍶 溫暖酒場備料】\n\n";






// 酒水


let drinkText="";



drinkData.forEach(item=>{


let data =
prepareData[item];



if(data.qty>0){


drinkText +=

"□ "+
item+
" × "+
data.qty+
"\n";


data.actions.forEach(action=>{


drinkText +=

"　→ "+
action+
"\n";


});


drinkText+="\n";


}


});



if(drinkText){


text +=

"🍺 酒水\n\n"+
drinkText;


}






// 食材


let foodText="";



foodData.forEach(item=>{


let data =
prepareData[item];


if(data.qty>0){


foodText +=

"□ "+
item+
" × "+
data.qty+
"\n";


data.actions.forEach(action=>{


foodText +=

"　→ "+
action+
"\n";


});


foodText+="\n";


}


});



if(foodText){


text +=

"🥩 食材\n\n"+
foodText;


}






// 雜物


let stuffText="";



stuffData.forEach(item=>{


let data =
prepareData[item];


if(data.qty>0){


stuffText +=

"□ "+
item+
" × "+
data.qty+
"\n";


}


});



if(stuffText){


text +=

"🧹 雜物\n\n"+
stuffText;


}





document
.getElementById(
"lineText"
)
.value=text;


}






// ==========================
// 複製
// ==========================


function copyLINE(){


let box =
document.getElementById(
"lineText"
);



box.select();



document.execCommand(
"copy"
);



alert(
"已複製"
);


}






// ==========================
// 啟動
// ==========================



renderList(
drinkData,
"drinkList"
);


renderList(
foodData,
"foodList"
);


renderList(
stuffData,
"stuffList"
);


renderSauce();



showPage(
"drink"
);
