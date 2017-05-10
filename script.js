var simonGame = {
    init: function(){
        this.simonSequence = [];
        this.stepCount = 0;        
        this.totalSteps = 3;
        this.err = false;
        this.playSequenceTimer = [];
        this.sequenceTimer = [];
        this.errorTimer = [];
        this.winTimer = [];
        this.strict = $(".strict-light").hasClass("strict-light-on");
        this.displayCount();
        this.clickToStart();
        this.clickToStrictPlay();       
    },

    clickToStart: function(){
        var that = this;
        $(".start").on("click",function(){
            $(".start").off("click");
            that.startGame();
        });
    },

    clickToStrictPlay: function(){
        var that = this;
        $(".strict-button").click(function(){
            if(that.strict){
                $(".strict-light").removeClass("strict-light-on");               
            }else{
                $(".strict-light").addClass("strict-light-on");
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

    btnFlash: function(btnId){
        $("#"+btnId).addClass("light");
        setTimeout(function(){
            $("#"+btnId).removeClass("light");
        },200);
    },

    triggerBtn: function(btnId){
        this.audioPlay(btnId);
        this.btnFlash(btnId);
    },

    checkPlayersInput: function(btnId, count){
        if(this.simonSequence[count] !== btnId){
            this.err = true;
        }else{
            this.err = false;
        }
    },

    displayCount: function(){
        if(this.stepCount > 9){
            $(".count .show").html(this.stepCount);
        }else if(this.stepCount === 0){
            $(".count .show").html("&#8211; &#8211;");
        }else {
            $(".count .show").html("0 " +this.stepCount);
        };
        
    },

    notifyErr: function(){
        $(".count .show").html("Err!");
    },

    notifyWin: function(){
        $(".count .show").html("Win!");
        var that = this;
        //button flash all together
        var timer = setTimeout(function(){
            [0,1,2,3].forEach(function(btnId){
                that.btnFlash(btnId);
            })
        },1000);
        this.winTimer.push(timer);
        //button flash in turns
        [0,1,2,3,0,1,2,3].forEach(function(btnId, index){
            var flashtimer = setTimeout(function(){
                        that.triggerBtn(btnId);
                        }, 1500+200*index);
            that.winTimer.push(flashtimer);
        });
    },

    disableBtn: function(){
        $("#0, #1, #2, #3").off();
    },

    getPlayersInput: function(){
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
                if(that.errorTimer.length){
                    //clear the 5 seconds waiting error timer
                    that.clearTimeArrayOut(that.errorTimer);
                    that.errorTimer = [];
                };           
                //clearTimeout(that.errorTimer);
                var btnId = parseInt($(this).attr("id"));
                that.audioPlay(btnId);           
                that.strict = $(".strict-light").hasClass("strict-light-on");
                that.checkPlayersInput(btnId, count);
                if(that.err){                   
                    if(that.strict){
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
                            that.reset();
                            that.notifyWin();
                            var wintimer = setTimeout(function(){                               
                                that.init();
                            }, 4000);
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
            }
        });
    },

    playSequence: function(){    
        this.displayCount();    
        this.sequenceTimer = [];       
        var that = this;
        var sequenceLength = this.simonSequence.length;
        var timer;
        for(var i=0; i<sequenceLength; i++){
            var btnId = that.simonSequence[i];
            (function(i, btnId){
                timer = setTimeout(function(){               
                    that.triggerBtn(btnId);
                    if(i===sequenceLength-1){
                        that.set5SecondsErrorTimer();
                        that.getPlayersInput();
                        
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
                        //that.timer = undefined;
                    }, 1000*seconds);
        this.playSequenceTimer.push(timer);
    },

    playSequenceAgain: function () {
        this.disableBtn();
        this.notifyErr();   
        this.playSequenceAfter(2);
    },

    addStep: function(){
        var newBtnId = Math.floor(Math.random()*4);
        this.simonSequence.push(newBtnId);
        this.stepCount++;
    },

    set5SecondsErrorTimer: function(){
        var that = this;
        //play sequence again if input not go on after 5 seconds
        var errortimer = setTimeout(function(){
            that.strict = $(".strict-light").hasClass("strict-light-on");
            if(that.strict){
                that.strictPlay();
            }else{
                that.playSequenceAgain();
            };                            
        }, 5000);
        this.errorTimer.push(errortimer);
    },   

    strictPlay: function(){     
        var that = this; 
        this.reset();  
        this.disableBtn();        
        this.notifyErr();
        var timer = setTimeout(function(){                               
                    that.init();
                    $(".start").off("click");
                    that.startGame();
        }, 2000);
        this.winTimer.push(timer);      
       
    },

    startGame: function(){
        this.addStep();
        this.playSequenceAfter(2);      
    },

    clearTimeArrayOut: function(timerArray){
        if(timerArray.length){
            timerArray.forEach(function(timer){
                clearTimeout(timer);
            });
        }        
    },

    reset: function(){
        var that = this;   
        this.clearTimeArrayOut(that.playSequenceTimer);
        this.clearTimeArrayOut(that.errorTimer);
        this.clearTimeArrayOut(that.sequenceTimer);
        this.clearTimeArrayOut(that.winTimer);
        $(".count .show").html(" ");
    },

    play: function(){
        var that = this;
        $(".off").click(function(){  
            that.disableBtn();     
            that.reset();      
            $(".start").off("click");
            $(".strict").off("click");
            $(this).removeClass("hidden");
            $(".on").addClass("hidden"); 
            $(".strict-light").removeClass("strict-light-on");            
        });

        $(".on").click(function(event){
            event.stopPropagation();
            $(this).removeClass("hidden");
            $(".off").addClass("hidden");
            that.init();
        });
    }
    
};

$(document).ready(function(){
    simonGame.play();
})