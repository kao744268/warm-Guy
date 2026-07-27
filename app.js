// ===================================
// 溫暖酒場｜智慧備料系統 V2
// app.js
// ===================================


// ======================
// 初始化資料
// ======================

let prepData = JSON.parse(
    localStorage.getItem("prepData")
) || {};

let saucePrep = JSON.parse(
    localStorage.getItem("saucePrep")
) || {};



function saveData(){

    localStorage.setItem(
        "prepData",
        JSON.stringify(prepData)
    );

    localStorage.setItem(
        "saucePrep",
        JSON.stringify(saucePrep)
    );

}



// ======================
// 建立資料
// ======================

function initItem(name, actions){


    if(!prepData[name]){

        prepData[name]={

            qty:0,

            actions:[],

            availableActions:actions

        };

    }


}



drinkData.forEach(
    x=>initItem(x,drinkActions)
);


foodData.forEach(
    x=>initItem(x,foodActions)
);


stuffData.forEach(
    x=>initItem(x,stuffActions)
);




// ======================
// 分頁
// ======================


function showPage(id){

    document
    .querySelectorAll("section")
    .forEach(
        x=>x.classList.remove("active")
    );


    document
    .getElementById(id)
    .classList.add("active");

}





// ======================
// 建立品項
// ======================


function renderItems(list,id){


let html="";


list.forEach(name=>{


let item=prepData[name];


html += `


<div class="card">


<h3>${name}</h3>



<div class="row">


<button onclick="changeQty('${name}',-1)">
－
</button>



<span id="qty-${name}">
${item.qty}
</span>



<button onclick="changeQty('${name}',1)">
＋
</button>


</div>



<div>


${
item.availableActions.map(a=>`


<button onclick="toggleAction('${name}','${a}')"
class="${item.actions.includes(a)?'active':''}"
>

${a}

</button>


`).join("")
}


</div>



</div>


`;


});


document
.getElementById(id)
.innerHTML=html;


}





// ======================
// 數量
// ======================


function changeQty(name,num){


prepData[name].qty += num;


if(prepData[name].qty<0){

prepData[name].qty=0;

}


saveData();


refresh();

}





// ======================
// 選項
// ======================


function toggleAction(name,action){


let arr =
prepData[name].actions;


if(arr.includes(action)){


prepData[name].actions =
arr.filter(
x=>x!==action
);


}else{


arr.push(action);


}



saveData();

refresh();


}






// ======================
// 醬料
// ======================


function renderSauce(){


let html="";


sauceData.forEach((s,index)=>{


html += `


<div class="card">


<h3>

${s.name}

</h3>


<button onclick="openSauce(${index})">

製作

</button>


<div id="sauce-${index}"></div>


</div>


`;


});


document
.getElementById("sauce")
.innerHTML=html;


}




function openSauce(index){


let sauce=sauceData[index];


if(!saucePrep[sauce.name]){


saucePrep[sauce.name]={};


}



let html="";


sauce.materials.forEach(m=>{


if(!saucePrep[sauce.name][m]){


saucePrep[sauce.name][m]=0;


}



html += `


<div class="row">


<span>

${m}

</span>



<button onclick="changeSauce('${sauce.name}','${m}',-1)">
－
</button>


<span>

${saucePrep[sauce.name][m]}

</span>


<button onclick="changeSauce('${sauce.name}','${m}',1)">
＋
</button>


</div>


`;


});



document
.getElementById(
"sauce-"+index
)
.innerHTML=html;


saveData();


}




function changeSauce(sauce,item,num){


saucePrep[sauce][item]+=num;


if(
saucePrep[sauce][item]<0
){

saucePrep[sauce][item]=0;

}


saveData();



renderSauce();


openSauce(
sauceData.findIndex(
x=>x.name===sauce
)
);


}







// ======================
// LINE
// ======================


function createLINE(){


let text=

"【🍶 溫暖酒場 今日備料】\n\n";





function addSection(title,list){


let result="";


list.forEach(name=>{


let item=prepData[name];


if(item.qty>0){


result +=

`□ ${name} × ${item.qty}\n`;


item.actions.forEach(a=>{


result +=

`　→ ${a}\n`;


});


result+="\n";


}


});


if(result){


text +=

title+"\n\n"+
result+
"────────\n\n";


}


}



addSection(
"🍺 酒水",
drinkData
);


addSection(
"🥩 食材",
foodData
);


addSection(
"🧹 雜物",
stuffData
);





text += "🥫 醬料製作\n\n";



Object.keys(saucePrep)
.forEach(s=>{


let materials="";


Object.keys(saucePrep[s])
.forEach(m=>{


if(saucePrep[s][m]>0){


materials +=

`□ ${m} × ${saucePrep[s][m]}\n`;


}


});


if(materials){


text +=

s+"\n"+
materials+
"\n";


}


});





document
.getElementById("lineText")
.value=text;


}





function copyLINE(){


navigator.clipboard.writeText(

document.getElementById("lineText").value

);


alert("已複製");


}







// ======================
// 更新畫面
// ======================


function refresh(){


renderItems(
drinkData,
"drink"
);


renderItems(
foodData,
"food"
);


renderItems(
stuffData,
"stuff"
);


renderSauce();


}






// ======================
// 啟動
// ======================


refresh();

showPage("drink");
