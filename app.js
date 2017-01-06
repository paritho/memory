'use strict';

// game object
function Game(){
    var _len = 0,
        _numbers = [],
        _found = 0,
        _clickedOn = [],
        _tries = 0,
        _won = false;
    return {
        play: function(num){
            _len = num;
            this.generateNumbers();
            this.populateCards();
            
            var flippers = document.getElementById('container');
            flippers.addEventListener('click', this.checkCards);
            
        },
        generateNumbers: function(){
            for(var i=0;i<_len;++i) {
                var n = Math.floor(Math.random() * (100 - 1) + 1);
                
                // need to make sure pairs are not duplicated
                // if we've seen the number, it will look like 90a
                // if we find it, move i backward and continue the loop
                if(_numbers.indexOf(n+"a") > -1) {
                    --i;
                    continue;
                }
                                        
                _numbers.push(n+"a");
                _numbers.push(n+"b");
            }

            // shuffle 
            _numbers = shuffle(_numbers);
        },
        populateCards:function(){
            // we need twice as many cards so that each is paired
            var numOfCards = _len * 2;
            while(numOfCards--){
                var card = document.createElement('div');
                                
                card.className = 'memoryCard';
                card.id = _numbers.pop();
                
                // yay javascript!
                var value = parseInt(card.id);
                
                var html = `<div class="front"></div>
                            <div class="back"><p class="num">${value}</p></div>`;

                card.innerHTML = html;
                document.querySelector("#container").appendChild(card);

                fadeIn(card);
            }
        },
        checkCards: function(e){
            _tries++;
            flip(e);
            
            var el = e.target.parentNode;
                        
            _clickedOn.push(el.id);
            
            if(_clickedOn.length < 2) return;
            
            var first = _clickedOn.shift(),
                second = _clickedOn.shift();

             // no match :( flip back the cards that were showing
            if(parseInt(first) !== parseInt(second)) {            
                setTimeout(function(){
                    document.getElementById(first).className = "memoryCard";
                    document.getElementById(second).className = "memoryCard";
                    
                }, 1500);
                return;
            }
            
            // match!
            _found++;
            if(_len == _found) playerWins(_tries);
        }
    }
}

var game = new Game();

// user clicks to select how many pairs to play with, 3,4,6,8
var card = document.getElementById('select');
card.addEventListener('click', getNumber);

function getNumber(e){
    if(e.target !== e.currentTarget){
        var num = e.target.innerHTML,
            pairs = document.querySelector('#pairs');
        
        fadeOut(pairs);
        game.play(num);
    }
    e.stopPropagation();
}

function flip(e){
    if(e.target !== e.currentTarget){
        e.target.parentNode.className += " flip";
    }
    e.stopPropagation();
}

// fade an element out
function fadeOut(el){
    el.style.opacity = 1;
    (function fade(){
        if((el.style.opacity -= .05) < 0 ) {el.style.display = "none"; return;}
        requestAnimationFrame(fade);
    })();  
}

// fade and element in
function fadeIn(el){
    el.style.opacity = 0;
    el.style.display = "inline-block";
    (function fade(){
        var val = parseFloat(el.style.opacity);
        if(!((val += .05) > 1)) {
            el.style.opacity = val;   
            requestAnimationFrame(fade);
        }
    })();
}

// shuffles an array in-place. returns the array
function shuffle(array){
    for(var j=0;j<array.length-1;++j){
        var temp = array[j],
            randIndx = Math.floor(Math.random() * array.length);
        
        array[j] = array[randIndx];
        array[randIndx] = temp;
    }
    return array;
}
    
function playerWins(tries){
    fadeOut(document.getElementById('container'));
    
    var gameover = document.getElementById('gameover'),
        msg = document.getElementById('message');
    
    msg.innerHTML = "Congratulations! You won in " + tries + " moves.";
    
    fadeIn(gameover);

}
