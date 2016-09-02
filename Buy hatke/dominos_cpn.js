savingsArray = [];
coupArray = [];
bestCouponFound = 0;
flagCoupon = [];
arrayMsg = [];
arrayBest = [];
couponAt = 1352;

for(var i=0;i < 200; i++){
  flagCoupon[i] = 2;
}

function changeFlag(i, coupon, initialamount){
  flagCoupon[i] = 1;
  setTimeout(function(){postProcessor(coupon, i, initialamount);},1000);
}

function changeFlag2(i, coupon){
  if($('.remove-coupon-offer').length>0&&bestCouponFound==0){
    $('.remove-coupon-offer').click();
  }
  flagCoupon[i] = 0;
}

function removeCompletely(){
}

function postProcessor(coupon, i, initialamount){
  if($('#jqi_state_state0').length>0){
    var totalPrices = $('.prices').length -1;
    var currentamount = $('.prices:eq(' + totalPrices + ')').text();
    savings = initialamount - currentamount;

    savings = parseFloat(savings);
    cpn_msg = "";
    if($('#jqibox').length > 0){
      cpn_msg = $('#jqibox').text().trim();
    }
    // console.log("Savings for " + coupon + " is " + savings);
    couponAt = 1352;
    arrayMsg.push([coupon, encodeURIComponent(cpn_msg), couponAt ]);

    if(savings > $('.hdc-sav-amt:eq(0)').text()){
      var currentSavAmt = parseFloat($('.hdc-sav-amt:eq(0)').text()),
      finalSavAmt = savings;
      $({c: currentSavAmt}).animate({c: finalSavAmt}, {
        step: function(now) {
          $('.hdc-sav-amt:eq(0)').text(Math.round(now))
        },
        duration: 1000,
        easing: "linear"
      });
    }

    savingsArray[i] = savings;
    document.getElementById("jqi_state0_buttonOk").click();

    setTimeout(function(){changeFlag2(i, coupon);},1000);
  }
  else {
    setTimeout(function(){postProcessor(coupon, i, initialamount);},1000);
  }
}

function preProcessor(i, coupon){
  if(stopCoupon == 1){
    if($('.remove-coupon-offer').length>0)
    {
      setTimeout(function(){preProcessor(i,coupon)},1000);
    }
    else
    {
     if($('#open-coupon-veg').length > 0 || $('#open-coupon-nveg').length > 0){
      $(".hatke-discount-cover").css("display", "none");
    }

    $('#coupon-code-field').val(coupon);
    var totalPrices = $('.prices').length -1;
    var initialamount = $('.prices:eq(' + totalPrices + ')').text();
    document.getElementById('redeem-coupon-button').click();
  //console.log("Coupon Code applied " + coupon);
  setTimeout(function(){changeFlag(i, coupon, initialamount);},1000);
}
}
}

function temp(coupon, i, lenArray){
  if(lenArray==100){
    $('.hdc-loading').html('Automatically applying the best coupon now !');
    $('.hdc-lb-progress').text("100% Complete");
    $('.hdc-lb-fg').css("width", "100%");
    arrayBest.push([coupon, couponAt]);
    arrayBest = JSON.stringify(arrayBest);
    var jsonArr = [{'best_cpn': arrayBest}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr, 13, doNothing, []);
    preProcessor(i, coupon);
  }
  else if(i==0||flagCoupon[i-1]==0){
    $('.hdc-loading').html('Trying code <span class="hdc-load-curr hdc-bold">' + (i+1) + '</span> of <span class="hdc-load-tot hdc-bold">' + lenArray + '</span>');
    var perDone = i/lenArray;
    perDone = perDone*100;
    perDone = parseInt(perDone);
    $('.hdc-lb-progress').text(perDone + "% Complete");
    $('.hdc-lb-fg').css("width", perDone + "%");
    preProcessor(i, coupon);
  }
  else {
    setTimeout(function(){temp(coupon, i, lenArray);},1000);
  } 
}

function endProcess(i){
  //console.log("called with " + i);
  if(flagCoupon[i]==0){
//console.log("Process terminated");
max = -111111;
ind_req = 1000;
for(m=0;m<savingsArray.length;m++){
 if(max < savingsArray[m]){
  max = savingsArray[m];
  ind_req = m;
}
}
if(max>0){
  bestCouponFound = 1;
  coup_req = coupArray[ind_req];
  flagCoupon[0] = 2;
  temp(coup_req, 0, 100);
  $('.hatke-discount-cover').css("display", "none");
  savings = $('.hdc-sav-amt:eq(0)').text();
  $('.hatke-discount-cover:eq(1)').css("display", "block");
  var currentSavAmt = 0,
  finalSavAmt = max;
  $({c: currentSavAmt}).animate({c: finalSavAmt}, {
    step: function(now) {
      $('.hdc-sav-amt').text(Math.round(now))
    },
    duration: 1000,
    easing: "linear"
  });
  var jsonArr = [{'savings': max}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(0, jsonArr, 0, doNothing, []);
} 
else {
  temp("CRM40", 0, 99);
  temp("NET19", 0, 100);
  $('.hatke-discount-cover').css("display", "none");
  $('.hatke-discount-cover:eq(2)').css("display", "block");
} 
arrayMsg = JSON.stringify(arrayMsg);
var jsonArr = [{'cpn_msg': arrayMsg}];
jsonArr = JSON.stringify(jsonArr);
sendMessage(1, jsonArr, 12, doNothing, []);
//console.log(savingsArray);
}
else {
  setTimeout(function(){endProcess(i);},1000);
}
}
function couponInitiate(mytext){
  if(mytext.split("NET19~").length > 1){
    mytext = mytext.split("NET19~");
    mytext = mytext.join("").trim();
  }
  if(mytext.split("CRM40~").length > 1){
    mytext = mytext.split("CRM40~");
    mytext = mytext.join("").trim();
  }
  mytext="HATKE20~"+mytext;   
    //console.log("mytext"+mytext);
    couponsLength = mytext.split("~").length - 1;
    $('.hdc-c-line:eq(0)').text("We are automatically trying " + couponsLength + " coupon codes for you !");
    applyCoupons(mytext); 

  }
  function applyCoupons(coupons){
   couponsArray = coupons.split("~");
   var savings = [];
   for(var i=0;i<couponsArray.length;i++){
    if(couponsArray[i]!=""&&couponsArray[i]!=" "){

      var cur = couponsArray[i];
      coupArray[i] = cur;
      temp(cur, i, couponsArray.length-1);
    }
  }
  endProcess(couponsArray.length-2);
}

function getCoupons(){
  for(var i=0;i < 200; i++){
    flagCoupon[i] = 2;
  }
  bestCouponFound = 0;
  $('.hatke-discount-cover:eq(0)').css("display", "block");
  if($('.remove-coupon-offer').length>0){
    $('.remove-coupon-offer').click();
  }
  var jsonArr = [{'pos': 16}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(1, jsonArr, 7, startCouponProcess, [])
}

function removeTheCover(){
  if($('.hatke-discount-cover').length>0){
    $('.hatke-discount-cover').css("display", "none"); 
  }
}
function couponCheck(){
  var curURL = window.location.href;
//console.log("CP Check was called");
if(curURL.split('pizzaonline.dominos.co.in').length>1){
  var imgURL = returnResource("apply-coupon.png");
  //console.log("TEst passed");
  if($('.enter-coupon-code').length>0){
    $('.enter-coupon-code').after("<a id='couponClick' href='javascript:void();'><img style='margin-top:15px;margin-left:80px;width: 38%;' src='" + imgURL + "'></a>");
    addToDOM();
    var button = document.getElementById("couponClick");
    button.addEventListener("click", function(){
      stopCoupon = 1;
      getCoupons();
    }, false);
  }
  else {
    setTimeout(function(){couponCheck();},1000);
  }
}

}

couponCheck();
