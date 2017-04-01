var playButton = document.getElementById("playButton");
var winButton = document.getElementById("winButton");
var loseButton = document.getElementById("loseButton");
var clearWinstreak = document.getElementById("clearWinstreak");
var updateButton = document.getElementById("updateButton");
var timeButton = document.getElementById("timeButton");
var dayButton = document.getElementById("dayButton");
var buyButton = document.getElementById("buyButton");
var goldButton = document.getElementById("goldButton");
var powerButton = document.getElementById("powerButton");
var craftButton = document.getElementById("craftButton");
var arenaButton = document.getElementById("arenaButton");
var option1 = document.getElementById("option1");
var option2 = document.getElementById("option2");
var option3 = document.getElementById("option3");
var playArenaButton = document.getElementById("playArenaButton");
var doneButton = document.getElementById("doneButton");
var guideButton = document.getElementById("guideButton");

playButton.addEventListener("click", play);
winButton.addEventListener("click", forceWin);
loseButton.addEventListener("click", forceLose);
clearWinstreak.addEventListener("click", zeroWinstreak);
updateButton.addEventListener("click", update);
timeButton.addEventListener("click", spendHours);
dayButton.addEventListener("click", spendDays);
buyButton.addEventListener("click", buyPack);
goldButton.addEventListener("click", addGold);
powerButton.addEventListener("click", powerPlay);
craftButton.addEventListener("click", craftLegend);
arenaButton.addEventListener("click", arenaGame);
option1.addEventListener("click", choice1);
option2.addEventListener("click", choice2);
option3.addEventListener("click", choice3);
playArenaButton.addEventListener("click", playArena);
doneButton.addEventListener("click", getRewards);
guideButton.addEventListener("click", readGuide);

var player = {rank: 25, stars: 0, winstreak: 0, wins: 0, losses: 0, winner: 0, skill: 50, bestRank: 25}
var resource = {gold: 0, dust: 0, legend: 0, bonus: 0, bonusAvailable: 10, quest: 0, questAvailable: 1, months: 0, monthCount: 0, minutes: 0, hours: 6, days: 29}
var arena = {cards: 0, tierscore: 0, tierscoreTotal: 0, winner: 0, wins: 0, losses: 0, skill: 0, chance: 0, chanceToWin: 0, buttonLock: 0, kripp: 1}
var draft1;
var draft2;
var draft3;

// GM Commands for testing
function addGold() {
	resource.gold += 100;
	update();
}

function spendHours() {
	checkTime();
	resource.hours -= 1;
	checkTime();
	update();
}

function spendDays() {
	checkTime();
	resource.days -= 9;
	checkTime();
	update();
}

function zeroWinstreak(){
	player.winstreak = 0;
	update();
}

function forceWin(){
	winGame();
	update();
}

function forceLose(){
	loseGame();
	update();
}

function powerPlay(){ play(); play(); play(); play(); play(); play(); play(); play(); play(); play(); }
// GM Commands for testing

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 80) {
		if (player.rank > 0){
        play();
		update();
		}
    }
});

function readGuide(){
	if (arena.skill < 5){
		resource.minutes -= 40;
		checkTime();
		arena.skill += 1;
		arena.kripp = 0;
	}	
	update();
}

function arenaGame(){
	if (resource.gold >= 150){
		resource.gold -= 150;
		arenaPanel.classList.remove("hidden2");
		arena.buttonLock = 1;
		arenaResults.innerHTML = "&nbsp";
		deckScore.innerHTML = "0";
		arena.wins = 0;
		arena.losses = 0;
		arena.winner = 0;
		arena.tierscore = 0;
		arena.tierscoreTotal = 0;
		arena.cards = 0;
		update();
		arenaDraft();
	}
}

function arenaDraft(){
	draft1 = Math.floor(Math.random() * 100) + 1;;
	option1.innerHTML = draft1;
	draft2 = Math.floor(Math.random() * 100) + 1;;
	option2.innerHTML = draft2;
	draft3 = Math.floor(Math.random() * 100) + 1;;
	option3.innerHTML = draft3;
}

function choice1(){
	arena.tierscoreTotal += draft1;
	continueDraft();
}
function choice2(){
	arena.tierscoreTotal += draft2;
	continueDraft();
}
function choice3(){
	arena.tierscoreTotal += draft3;
	continueDraft();
}

function continueDraft(){
	arena.cards += 1;
	amount.innerHTML = arena.cards;
	if (arena.cards < 30){
	arenaDraft();
	} else { arenaReady(); }
}

function arenaReady(){
	checkArenaChance();
	resource.minutes -= 5;
	checkTime();
	arena.tierscore = Math.round(arena.tierscoreTotal / 30);
	deckScore.innerHTML = arena.tierscore;
	option1.classList.add("locked");
	document.getElementById("option1").disabled = true;
	option2.classList.add("locked");
	document.getElementById("option2").disabled = true;
	option3.classList.add("locked");
	document.getElementById("option3").disabled = true;
	playArenaButton.classList.remove("locked");
	document.getElementById("playArenaButton").disabled = false;
	update();
}

function playArena(){
	dailyQuest();
	matchLength();
	checkTime();
	whoWinsArena();
	
	if (arena.winner == 1) {
		winArena();
	}
	else {
		loseArena();
	}
	
	checkButtons();
	update();
}

function checkArenaChance(){
	arena.chance = (arena.tierscore * (1 + 0.1 * arena.skill));
	arena.chanceToWin = Math.round(arena.chance * (2/3));
	arenaWinChance.innerHTML = arena.chanceToWin;
}

function whoWinsArena() {
		arena.winner = 0;
		checkArenaChance();
	var winningChance = Math.floor(Math.random() * 150) + 1;;
	if (winningChance < arena.chance) {
		arena.winner = 1;
	}
	if (winningChance > arena.chance) {
		arena.winner = 0;
	}	
}

function winArena(){
	arenaResults.innerHTML = "You've won an Arena match!";
	arenaResults.classList.add("correct");
	arenaResults.classList.remove("wrong");
	arena.wins += 1;
	if (arena.wins >= 12){
		summonRewards();
	}
	update();
}

function loseArena(){
	arenaResults.innerHTML = "You've lost an Arena match.";
	arenaResults.classList.add("wrong");
	arenaResults.classList.remove("correct");
	arena.losses += 1;
	if (arena.losses >= 3){
		summonRewards();
	}
	update();
}

function summonRewards(){
	doneButton.classList.remove("locked");
	document.getElementById("doneButton").disabled = false;	
}

function getRewards(){
	if (arena.wins == 0){ resource.gold += 50; resource.dust += 50; }
	if (arena.wins == 1){ resource.gold += 60; resource.dust += 60; }
	if (arena.wins == 2){ resource.gold += 70; resource.dust += 70; }
	if (arena.wins == 3){ resource.gold += 90; resource.dust += 90; }
	if (arena.wins == 4){ resource.gold += 100; resource.dust += 100; }
	if (arena.wins == 5){ resource.gold += 110; resource.dust += 110; }
	if (arena.wins == 6){ resource.gold += 130; resource.dust += 130; }
	if (arena.wins == 7){ resource.gold += 150; resource.dust += 150; }
	if (arena.wins == 8){ resource.gold += 170; resource.dust += 170; }
	if (arena.wins == 9){ resource.gold += 180; resource.dust += 180; }
	if (arena.wins == 10){ resource.gold += 200; resource.dust += 200; }
	if (arena.wins == 11){ resource.gold += 210; resource.dust += 210; }
	if (arena.wins == 12){ resource.gold += 225; resource.dust += 225; }
	arena.buttonLock = 0;
	update();
	endArena();
}

function endArena(){
	arenaPanel.classList.add("hidden2");
	option1.classList.remove("locked");
	document.getElementById("option1").disabled = false;
	option2.classList.remove("locked");
	document.getElementById("option2").disabled = false;
	option3.classList.remove("locked");
	document.getElementById("option3").disabled = false;
	playArena.classList.add("locked");
	document.getElementById("playArena").disabled = true;
	doneButton.classList.add("locked");
	document.getElementById("doneButton").disabled = true;	
	update();
}

function buyPack() {
	if (resource.gold >= 100){
	resource.gold -= 100;
	resource.minutes -= 1;
	checkTime();
	var pack = Math.floor(Math.random() * 3) + 1;;
		if (pack == 1){
			resource.dust += 40;
		}
		if (pack == 2){
			resource.dust += 100;
		}
		if (pack == 3){
			resource.dust += 160;
		}
	var rare = Math.floor(Math.random() * 40) + 1;;
		if (rare == 50){
			resource.legend += 1;
		}
	update();
	}
}

function craftLegend(){
	if (resource.dust >= 1600){
		resource.dust -= 1600;
		resource.minutes -= 3;
		checkTime();
		resource.legend += 1;
	}
	update();
}

function checkGoldcap() {
	if (resource.gold > 10000){ resource.gold = 10000; }
}

function dailyReset(){
		resource.bonusAvailable = 10;
		bonustext.classList.remove("strike");
		if (resource.questAvailable == 0){
			resource.questAvailable += 1;
			resource.quest = 0;	
			questtext.classList.remove("strike");
		}
		arena.kripp = 1;	
		if (arena.skill > 0){
			var forget = Math.floor(Math.random() * 2) + 1;;
			if (forget == 1){
				arena.skill -= 1;
			}
		}
}

function monthCount(){
	resource.monthCount += 1;
	if (resource.monthCount >= 2){
		if (resource.legend >= 1){
			resource.legend -= 1;
			resource.dust += 400;
			arena.skill = 0;
		}
		resource.monthCount = 0;
	}
	update();
}

function checkTime() {
	update();
	if (resource.minutes < 0){
		resource.hours -= 1;
		resource.minutes = (60 + resource.minutes);
		if (resource.minutes == 60){
			resource.minutes = 0;
			resource.hours += 1;
		}
	}
	if (resource.hours < 0 || (resource.minutes == 0 && resource.hours == 0)){
		resource.days -= 1;
		resource.hours = (6 + resource.hours);
		dailyReset();
	}
	if (resource.days < 0 || (resource.days == 0 && resource.hours == 0 && resource.minutes == 00)){
		resource.months += 1;
		resource.minutes = 0;
		resource.hours = 6;
		resource.days = 29;
		resetRank();
		if (arena.skill > 0){ arena.skill -= 1; }
		dailyReset();
		monthCount();
	}
	update();
}

function dailyQuest(){
	if (resource.questAvailable >= 1){
		resource.quest += 1;
	}
		if (resource.quest >= 5){
			questtext.classList.add("strike");
			resource.questAvailable = 0;
			resource.gold += 50;
		}
}

function checkBonus(){
	if (resource.bonus == 0){
		document.getElementById('box1').src='images/checkbox.png'
		document.getElementById('box2').src='images/checkbox.png'
		document.getElementById('box3').src='images/checkbox.png'
	}
}

function addBonus(){
	if (resource.bonusAvailable >= 1){
	resource.bonus += 1;
		if (resource.bonus == 0){
			document.getElementById('box1').src='images/checkbox.png'
			document.getElementById('box2').src='images/checkbox.png'
			document.getElementById('box3').src='images/checkbox.png'
		}
		if (resource.bonus == 1){
			document.getElementById('box1').src='images/checkboxfill.png'
			document.getElementById('box2').src='images/checkbox.png'
			document.getElementById('box3').src='images/checkbox.png'
		}
		if (resource.bonus == 2){
			document.getElementById('box1').src='images/checkboxfill.png'
			document.getElementById('box2').src='images/checkboxfill.png'
			document.getElementById('box3').src='images/checkbox.png'
		}
		if (resource.bonus == 3){
			document.getElementById('box1').src='images/checkboxfill.png'
			document.getElementById('box2').src='images/checkboxfill.png'
			document.getElementById('box3').src='images/checkboxfill.png'
		resource.bonusAvailable -= 1;
		resource.gold += 10;
		resource.bonus = 0;
		}
		if (resource.bonusAvailable <= 0){
			bonustext.classList.add("strike");
		}
	}
}

function seasonEndReward() {
	if (player.rank <= 0){return 550;}
	if (player.rank >= 1 && player.rank <= 5) {return (530 - (player.rank * 5));}
	if (player.rank >= 6 && player.rank <= 10) {return (230 - (player.rank - 5) * 5);}
	if (player.rank >= 11 && player.rank <= 15) {return (180 - (player.rank - 10) * 5);}
	if (player.rank >= 16 && player.rank <= 20) {return (80 - (player.rank - 15) * 5);}
	if (player.rank >= 21) {return 0;}
}

function bestRank(){
	if (player.bestRank > player.rank){
		player.bestRank = player.rank;
	}
}

function resetRank() {
	resource.dust += seasonEndReward();
	bestRank();
	player.stars = 0;
	player.winstreak = 0;
	player.stars = (25 - player.rank);
	player.rank = 25;
	while (player.rank > 20 && player.stars > 2) {
		player.stars -= 2;
		player.rank -= 1;
	}
	while (player.rank > 15 && player.stars > 3) {
		player.stars -= 3;
		player.rank -= 1;
	}
	while (player.rank > 10 && player.stars > 4) {
	player.stars -= 4;
	player.rank -= 1;
	}
	while (player.rank > 0 && player.stars > 5) {
	player.stars -= 5;
	player.rank -= 1;
	}
	if (player.rank == 0) {
	results.innerHTML = "You've won a match and reached the Legend. Congratulations!";
	player.stars = 0;
	}
	update();
}

function matchLength(){
	var length = Math.floor(Math.random() * 3) + 1;;
	if (length == 1){
		resource.minutes -= 10;
	}
	if (length == 2){
		resource.minutes -= 15;
	}
	if (length == 3){
		resource.minutes -= 20;
	}
}

function play() {
	matchLength();
	checkTime();
	whoWins();
	
	if (player.winner == 1) {
		winGame();
	}
	else {
		loseGame();
	}
	
	update();
	
}

function checkPlayerSkill(){
	player.skill = (50 + (player.rank - 16));
	if (resource.legend >= 0 && resource.legend <= 3) {
		player.skill = (player.skill + (5 * resource.legend));
		}
}

function whoWins() {
		player.winner = 0;
	var winningChance = Math.floor(Math.random() * 100) + 1;;
	checkPlayerSkill();
	if (winningChance < player.skill) {
		player.winner = 1;
	}
	if (winningChance > player.skill) {
		player.winner = 0;
	}	
}

function winGame() {
	results.innerHTML = "You've won a match!";
	results.classList.add("correct");
	results.classList.remove("wrong");
	player.wins += 1;
	player.winstreak += 1;
	player.stars += 1;
	addBonus();
	if (player.rank > 5 && player.winstreak > 2){
		player.stars += 1;
		results.innerHTML = "You've won a match and gained 1 bonus star!";
	}
	if (player.rank > 20 && player.stars > 2) {
		player.stars -= 2;
		player.rank -= 1;
	}
	if (player.rank > 15 && player.stars > 3) {
		player.stars -= 3;
		player.rank -= 1;
	}
	if (player.rank > 10 && player.stars > 4) {
	player.stars -= 4;
	player.rank -= 1;
	}
	if (player.rank > 5 && player.stars > 5) {
	player.stars -= 5;
	player.rank -= 1;
	}
	if (player.rank > 0 && player.stars > 5) {
	player.stars -= 5;
	player.rank -= 1;
	}
	if (player.rank == 0) {
	results.innerHTML = "You've won a match and reached the Legend. Congratulations!";
	player.stars = 0;
	}
	bestRank();
}

function loseGame() {
	results.innerHTML = "You've lost a match.";
	results.classList.add("wrong");
	results.classList.remove("correct");
	player.losses += 1;
	player.winstreak = 0;
	checkBonus();
	if (player.rank > 20){
		results.innerHTML = "You've lost a match. You can't lose stars at this rank.";
	}
	if (player.rank <= 20){
		player.stars -= 1;
	}
	if (player.rank == 20 && player.stars <= 0){
		player.stars = 0;
	}
	if (player.rank < 20 && player.rank >= 15 && player.stars < 0){
		player.rank += 1;
		player.stars += 4;
	}
	if (player.rank < 15 && player.rank >= 10 && player.stars < 0){
		player.rank += 1;
		player.stars += 5;
	}
	if (player.rank < 10 && player.rank >= 0 && player.stars < 0){
		player.rank += 1;
		player.stars += 6;
	}
	if (player.rank == 0) {
		player.rank += 1;
		player.stars += 6;
	}
}


function checkButtons(){
		if (resource.gold < 100){
 		document.getElementById("buyButton").disabled = true;
		buyButton.classList.add("locked");
	} else {
		document.getElementById("buyButton").disabled = false;
		buyButton.classList.remove("locked");
	}
		if (resource.dust < 1600){
		document.getElementById("craftButton").disabled = true;
		craftButton.classList.add("locked");
	} else {
		document.getElementById("craftButton").disabled = false;
		craftButton.classList.remove("locked");
	}
	if (resource.gold < 150 || arena.buttonLock == 1){
 		document.getElementById("arenaButton").disabled = true;
		arenaButton.classList.add("locked");
	} else {
		document.getElementById("arenaButton").disabled = false;
		arenaButton.classList.remove("locked");
	}
	if (arena.wins < 12 && arena.losses < 3 && arena.cards == 30){
		document.getElementById("playArenaButton").disabled = false;
		playArenaButton.classList.remove("locked");
	} else {
		document.getElementById("playArenaButton").disabled = true;
		playArenaButton.classList.add("locked");
	}
	if (arena.wins != 12 && arena.losses != 3){
		document.getElementById("doneButton").disabled = true;
		doneButton.classList.add("locked");	
	} else {
		document.getElementById("doneButton").disabled = false;
		doneButton.classList.remove("locked");		
	}
	if (arena.skill >= 5 || arena.kripp == 0){
		document.getElementById("guideButton").disabled = true;
		guideButton.classList.add("locked");	
	} else {
		document.getElementById("guideButton").disabled = false;
		guideButton.classList.remove("locked");		
	}
}


function update(){
	checkGoldcap();
	checkButtons();
	rank.innerHTML = player.rank;
	stars.innerHTML = player.stars;
	winstreak.innerHTML = player.winstreak;
	wins.innerHTML = player.wins;
	losses.innerHTML = player.losses;
	gold.innerHTML = resource.gold;
	dust.innerHTML = resource.dust;
	legend.innerHTML = resource.legend;
	skill.innerHTML = arena.skill;
	minutes.innerHTML = resource.minutes;
	hours.innerHTML = resource.hours;
	days.innerHTML = (resource.days + 1);
	months.innerHTML = resource.months;
	arenaWins.innerHTML = arena.wins;
	arenaLosses.innerHTML = arena.losses;
	arenaQuest.innerHTML = resource.quest;
	checkArenaChance();
	arenaWinChance.innerHTML = arena.chanceToWin;
	checkPlayerSkill();
	chance.innerHTML = Math.round(player.skill);
	highest.innerHTML = player.bestRank;

	document.getElementById('rankicon').src='images/'+player.rank+'.png'

	if (player.rank > 20){
		staricon1.classList.remove("hidden2");
		staricon2.classList.remove("hidden");
		staricon3.classList.add("hidden");
		staricon4.classList.add("hidden");
		staricon5.classList.add("hidden");
	}
		if (player.rank > 15 && player.rank <= 20){
		staricon1.classList.remove("hidden2");
		staricon2.classList.remove("hidden");
		staricon3.classList.remove("hidden");
		staricon4.classList.add("hidden");
		staricon5.classList.add("hidden");
	}
		if (player.rank > 10 && player.rank <= 15){
		staricon1.classList.remove("hidden2");
		staricon2.classList.remove("hidden");
		staricon3.classList.remove("hidden");
		staricon4.classList.remove("hidden");
		staricon5.classList.add("hidden");
	}
		if (player.rank > 0 && player.rank <= 10){
		staricon1.classList.remove("hidden2");
		staricon2.classList.remove("hidden");
		staricon3.classList.remove("hidden");
		staricon4.classList.remove("hidden");
		staricon5.classList.remove("hidden");
	}
		if (player.rank == 0){
		staricon1.classList.add("hidden2");
		staricon2.classList.add("hidden");
		staricon3.classList.add("hidden");
		staricon4.classList.add("hidden");
		staricon5.classList.add("hidden");
			document.getElementById("playButton").disabled = true;
			playButton.classList.add("locked");
	} else {
		document.getElementById("playButton").disabled = false;
		playButton.classList.remove("locked");
	}
	
	if (player.stars == 0){
		document.getElementById('staricon1').src='images/starempty.png'
		document.getElementById('staricon2').src='images/starempty.png'
		document.getElementById('staricon3').src='images/starempty.png'
		document.getElementById('staricon4').src='images/starempty.png'
		document.getElementById('staricon5').src='images/starempty.png'
	}
	if (player.stars == 1){
		document.getElementById('staricon1').src='images/star.png'
		document.getElementById('staricon2').src='images/starempty.png'
		document.getElementById('staricon3').src='images/starempty.png'
		document.getElementById('staricon4').src='images/starempty.png'
		document.getElementById('staricon5').src='images/starempty.png'
	}
	if (player.stars == 2){
		document.getElementById('staricon1').src='images/star.png'
		document.getElementById('staricon2').src='images/star.png'
		document.getElementById('staricon3').src='images/starempty.png'
		document.getElementById('staricon4').src='images/starempty.png'
		document.getElementById('staricon5').src='images/starempty.png'
	}
	if (player.stars == 3){
		document.getElementById('staricon1').src='images/star.png'
		document.getElementById('staricon2').src='images/star.png'
		document.getElementById('staricon3').src='images/star.png'
		document.getElementById('staricon4').src='images/starempty.png'
		document.getElementById('staricon5').src='images/starempty.png'
	}
	if (player.stars == 4){
		document.getElementById('staricon1').src='images/star.png'
		document.getElementById('staricon2').src='images/star.png'
		document.getElementById('staricon3').src='images/star.png'
		document.getElementById('staricon4').src='images/star.png'
		document.getElementById('staricon5').src='images/starempty.png'
	}
	if (player.stars == 5){
		document.getElementById('staricon1').src='images/star.png'
		document.getElementById('staricon2').src='images/star.png'
		document.getElementById('staricon3').src='images/star.png'
		document.getElementById('staricon4').src='images/star.png'
		document.getElementById('staricon5').src='images/star.png'
	}
}
