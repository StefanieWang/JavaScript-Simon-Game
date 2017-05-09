var simonGame = {
    init: function(){
        this.simonSequence = [];
        this.playerSequence = [];
        this.stepCount = 0;
        this.strict = false;
        this.totalSteps = 3;
        this.win = false;
        this.err = false;
        this.playComplete = false;
        this.timer = undefined;
        this.sequenceTimer = [];
        this.errorTimer = undefined;
        this.displayCount();
        var that = this;
        $(".start").click(function(){
            $(".start").off("click");
            that.startGame();
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
            "click": function(){
                var i = parseInt($(this).attr("id"));
                that.audioPlay(i);

            //=====================
                if(that.errorTimer){
                    var timer = that.errorTimer;
                    clearTimeout(timer);
                    that.err = false;
                    that.errorTimer = undefined;
                };

                var btnId = parseInt($(this).attr("id"));
            
                console.log("simonSequence: "+that.simonSequence);
                console.log("player input: "+btnId);

                that.checkPlayersInput(btnId, count);
                console.log("Error: "+that.err);

                if(that.err){
                    that.disableBtn();
                    that.notifyErr();  
                    count = 0; 
                    that.playSequenceAfter(3);            
                }else{
                    count++;
                    if(count === that.simonSequence.length){
                        if(that.stepCount === that.totalSteps){
                            that.disableBtn();
                            that.notifyWin();
                            setTimeout(function(){
                                
                                that.init();
                            }, 5000);
                        }else{
                            that.disableBtn();
                            that.addStep();  
                            count = 0; 
                            that.playSequenceAfter(2);
                        }
                                      
                    }else{
                        that.set5SecondsErrorTimer();
                    }
                };
            //===================================
            }
        });
    },

    /*getPlayersInput: function(){
        this.enableBtn();
        
        var that = this;
        var count = 0;
        $("#0, #1, #2, #3").click(function(){
            if(that.playComplete){
            
            var btnId = parseInt($(this).attr("id"));
            
            console.log("simonSequence: "+that.simonSequence);
            console.log("player input: "+btnId);

            that.checkPlayersInput(btnId, count);
            console.log("Error: "+that.err);

            if(that.err){
                that.disableBtn();
                that.notifyErr();  
                count = 0; 
                setTimeout(function(){
                    that.playSequence();
                }, 2000);            
            }else{
                count++;
                if(count === that.simonSequence.length){
                    that.disableBtn();
                    that.addStep();  
                    count = 0; 
                    setTimeout(function(){
                        that.playSequence();
                    }, 2000);               
                }
            };
            
           
            
            }
        });
    },*/
    set5SecondsErrorTimer: function(){
        var that = this;
        this.errorTimer = setTimeout(function(){
            that.err = true;
            that.disableBtn();
            that.notifyErr();  
            count = 0; 
            that.playSequenceAfter(3);       
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
        [0,1,2,3,0,1,2,3].forEach(function(btnId, index){
            setTimeout(function(){
                that.triggerBtn(btnId);
            }, 1000+200*index);
        });
        [0,1,2,3].forEach(function(btnId){
            that.btnFlash(btnId);
        });

    },

    displayCount: function(){
        if(this.stepCount > 9){
            $(".count .show").html(this.stepCount);
        }else if(this.stepCount === 0){
            $(".count .show").html("--");
        }else {
            $(".count .show").html("0 " +this.stepCount);
        }
        
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
    },

    playSequence: function(){    
        this.displayCount();    
        this.playComplete = false;
        var timer;
        var that = this;
        var sequenceLength = this.simonSequence.length;
        for(var i=0; i<sequenceLength; i++){
            var btnId = that.simonSequence[i];
            (function(i, btnId){
                timer = setTimeout(function(){               
                    that.triggerBtn(btnId);
                    that.sequenceTimer.shift();
                    if(i===sequenceLength-1){
                        that.playComplete = true;
                        that.enableBtn();
                        that.set5SecondsErrorTimer();
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
        //this.init();
        this.addStep();
        var that = this;
        this.playSequenceAfter(2);      
    },

    reset: function(){
        if(this.timer){
            var timer = this.timer;
            clearTimeout(timer);
        };

        if(this.sequenceTimer.length){
            this.sequenceTimer.forEach(function(timer){
                clearTimeout(timer);
            });
        };
        if(this.errorTimer){
            var errortimer = this.errorTimer;
            clearTimeout(errortimer);
        } 

        $(".count .show").html(" ");
        //this.init();
    }

};

$(document).ready(function(){
    $(".off").click(function(){
        $(this).removeClass("hidden");
        $(".on").addClass("hidden");
        simonGame.reset();
    });

    $(".on").click(function(){
        $(this).removeClass("hidden");
        $(".off").addClass("hidden");
        simonGame.init();
    });
})