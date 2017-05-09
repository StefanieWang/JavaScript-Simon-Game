var simonGame = {
    init: function(){
        this.simonSequence = [];
        this.stepCount = 0;        
        this.totalSteps = 3;
        this.err = false;
        this.timer = undefined;
        this.sequenceTimer = [];
        this.errorTimer = undefined;
        this.winTimer = [];
        this.displayCount();
        this.strict = false;
        if($(".strict-light").hasClass("strict-light-on")){
            this.strict = true;
        };
        //alert("game initiated");
        var that = this;
        $(".start").on("click",function(){
            $(".start").off("click");
            that.startGame();
        });
        $(".strict-button").click(function(){
            if(that.strict){
                $(".strict-light").removeClass("strict-light-on");
                that.strict = false;
            }else{
                $(".strict-light").addClass("strict-light-on");
                that.strict = true;
            }
        });
    },

    audioPlay: function(index){
        //var baseUrl = "https://s3.amazonaws.com/freecodecamp/";
        var baseUrl = "audio/";
        var audio = ["simonSound1.mp3",
                     "simonSound2.mp3",
                     "simonSound3.mp3",
                     "simonSound4.mp3"];
        new Audio(baseUrl + audio[index]).play();
    },

    enableBtn: function(){
        var that  = this;
        var count = 0;
        $("#0, #1, #2, #3").on({
            "mousedown": function(){
                $(this).addClass("light");      
            },
            "mouseup": function(){
                $(this).removeClass("light");
            },
            "click": function(event){  
                //event.stopPropagation();             
                clearTimeout(that.errorTimer);
                var btnId = parseInt($(this).attr("id"));
                that.audioPlay(btnId);
            
                //console.log("count: "+ count);
                //console.log("player input: "+btnId);
                that.strict = $(".strict-light").hasClass("strict-light-on");
                console.log("strict: "+ that.strict);
                that.checkPlayersInput(btnId, count);
                if(that.err){                   
                    if(that.strict){
                        //count = 0;
                        that.strictPlay();
                    }else{
                        count = 0;
                        that.playSequenceAgain();
                    };            
                }else{
                    count++;
                    //player complete the sequence
                    if(count === that.simonSequence.length){
                        that.disableBtn();
                        count = 0;
                        //player win if this was the last sequence
                        if(that.stepCount === that.totalSteps){
                            that.notifyWin();
                            var wintimer = setTimeout(function(){                               
                                that.init();
                            }, 2500);
                            that.winTimer.push(wintimer);
                        }else{                           
                            that.addStep();                               
                            that.playSequenceAfter(2);
                        }
                    //wait for the next input                  
                    }else{
                        that.set5SecondsErrorTimer();
                    }
                };
            //===================================
            }
        });
    },

    strictPlay: function(){     
        var that = this;   
        this.disableBtn();
        this.reset();
        this.notifyErr();
        var timer = setTimeout(function(){                               
                        that.init();
                        that.startGame();
                    }, 2000);
        this.winTimer.push(timer);       
    },

    playSequenceAgain: function () {
        this.disableBtn();
        this.notifyErr();  
        //count = 0; 
        this.playSequenceAfter(2);
    },

    set5SecondsErrorTimer: function(){
        var that = this;
        //play sequence again, if player not go on after 5 seconds
        this.errorTimer = setTimeout(function(){
            if(that.strict){
                that.strictPlay();
            }else{
                that.playSequenceAgain();
            };                            
        }, 5000);
    },

    checkPlayersInput: function(btnId, count){
        if(this.simonSequence[count] !== btnId){
            this.err = true;
        }else{
            this.err = false;
        }
    },
    
    notifyErr: function(){
        $(".count .show").html("Err!");
    },

    notifyWin: function(){
        $(".count .show").html("Win!");
        var that = this;
       /* var timer = setTimeout(function(){
            [0,1,2,3].forEach(function(btnId){
            that.btnFlash(btnId);
            }, 1000);
        this.winTimer.push(timer);*/

        [0,1,2,3,0,1,2,3].forEach(function(btnId, index){
            var flashtimer = setTimeout(function(){
                        that.triggerBtn(btnId);
                        }, 500+200*index);
            that.winTimer.push(flashtimer);
        });
    },

    displayCount: function(){
        if(this.stepCount > 9){
            $(".count .show").html(this.stepCount);
        }else if(this.stepCount === 0){
            $(".count .show").html("--");
        }else {
            $(".count .show").html("0 " +this.stepCount);
        };
        
    },

    disableBtn: function(){
        $("#0, #1, #2, #3").off();
    },

    btnFlash: function(btnId){
        $("#"+btnId).addClass("light");
        setTimeout(function(){
            $("#"+btnId).removeClass("light");
        },100);
    },

    triggerBtn: function(btnId){
        this.audioPlay(btnId);
        this.btnFlash(btnId);
    },

    addStep: function(){
        var newBtnId = Math.floor(Math.random()*4);
        this.simonSequence.push(newBtnId);
        this.stepCount++;
        console.log("step: "+ this.stepCount);
        console.log("simonSequence: "+this.simonSequence);
    },

    playSequence: function(){    
        this.displayCount();    
        this.sequenceTimer = [];
        var timer;
        var that = this;
        var sequenceLength = this.simonSequence.length;
        for(var i=0; i<sequenceLength; i++){
            var btnId = that.simonSequence[i];
            (function(i, btnId){
                timer = setTimeout(function(){               
                    that.triggerBtn(btnId);
                    if(i===sequenceLength-1){
                        that.set5SecondsErrorTimer();
                        that.enableBtn();
                        
                    };            
                },1000*i);               
            })(i, btnId);
            this.sequenceTimer.push(timer);
        };
    },

    playSequenceAfter: function(seconds){
        var that = this;
        var timer = setTimeout(function(){
                        that.playSequence();
                        that.timer = undefined;
                    }, 1000*seconds);
        this.timer = timer;
    },

    startGame: function(){
        //alert("game start");
        this.addStep();
        this.playSequenceAfter(2);      
    },

    clearTimeOut: function(timerArray){
        timerArray.forEach(function(timer){
                clearTimeout(timer);
        });
    },

    reset: function(){
        var that = this;
        if(this.timer){
            clearTimeout(that.timer);
        };       
        if(this.errorTimer){
            clearTimeout(that.errorTimer);
        };
        if(this.sequenceTimer.length){
            this.clearTimeOut(that.sequenceTimer);
        };
        if(this.winTimer.length){
            this.clearTimeOut(that.winTimer);
        };         
        $(".count .show").html(" ");
        console.log("game reset");
    }

};

$(document).ready(function(){
    $(".off").click(function(){
        simonGame.disableBtn();
        $(".start").off("click");
        $(this).removeClass("hidden");
        $(".on").addClass("hidden");       
        simonGame.reset();
    });

    $(".on").click(function(event){
        event.stopPropagation();
        $(this).removeClass("hidden");
        $(".off").addClass("hidden");
        simonGame.init();
    });
})