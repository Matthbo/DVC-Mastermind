(function(){
	var section = document.getElementsByTagName('section')[0];

	var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown'];

	var settings = [{id: 'pegs', name: 'Code Pegs', value: 4},
					{id: 'rows', name: 'Rows', value: 12},
					{id: 'colors', name: 'Colors', value: 6}];

	var RNGCode = [];

	var currentPeg = 0;
	var currentRow = 0

	var mastermind = {
		init: function(){
			var _this = this;

			this.updateInfo();
			this.showSettings();
		},

		updateInfo: function(){
			var cDate = document.getElementById('cDate');

			var date = new Date().getFullYear();
			cDate.innerHTML += date;
		},

		showSettings: function(){
			var settingsForm = '<h3>Settings</h3><div id="settings_form">';
			for(i=0; i<settings.length; i++){
				settingsForm += '<div class="row"><label>'+settings[i].name+':</label><input type="number" name="'+settings[i].id+'" value="'+settings[i].value+'"></input></div>';
			}
			settingsForm += '<div><button class="w3-btn w3-blue" id="settings_submit">Start game</button></div></div>';

			section.innerHTML = settingsForm;

			document.getElementById('settings_submit').addEventListener('click', function(){
				var settingsForm = document.querySelectorAll('#settings_form input');

				for(i=0; i<settingsForm.length; i++){
					settings.find(x => x.id == settingsForm[i].name).value = settingsForm[i].value;
				}

				mastermind.initGame();
			}, false);

		},

		initGame: function(){
			this.createBoard();
			this.calcRNGCode();
			this.showControls();

		},

		createBoard: function(){
			var rows = settings.find(x => x.name == 'Rows');
			var pegs = settings.find(x => x.name == 'Code Pegs');

			section.innerHTML = '';

			var board = '<div id="game_board">';

			for(i=0; i<rows.value; i++){
				board += '<div class="game_row">';

				for(j=0; j<pegs.value; j++){
					board += '<div class="game_peg"></div>';
				}

				board += '</div>';
			}

			board += '<div id="game_controls"></div></div>';
			section.innerHTML = board;
		},

		calcRNGCode: function(){
			for(i=0; i<settings.find(x => x.id == 'pegs').value; i++){
				newColor = colors[Math.floor(Math.random() * settings.find(x => x.id == 'colors').value)];

				RNGCode.push(newColor);
			}

			console.log(RNGCode);
		},

		showControls: function(){
			var controlsElement = document.getElementById('game_controls');

			for(i=0; i<settings.find(x => x.id == 'colors').value; i++){
				controlsElement.innerHTML += '<div class="controls_peg" data-setcolor="'+colors[i]+'"></div>';
			}

			var controlsPegs = document.querySelectorAll('#game_controls .controls_peg');

			for(i=0; i<controlsPegs.length; i++){
				controlsPegs[i].style.backgroundColor = controlsPegs[i].dataset.setcolor;

				controlsPegs[i].addEventListener('click', function(event){
					color = event.target.dataset.setcolor;

					//document.querySelector('#game_board .game_row .game_peg').style.backgroundColor = color;
					targetPeg = document.querySelectorAll('#game_board .game_row')[currentRow].querySelectorAll('.game_peg')[currentPeg];
					targetPeg.dataset.color = color;
					targetPeg.style.backgroundColor = color;

					mastermind.next();
				});
			}
		},

		next: function(){
			if(currentPeg < settings.find(x => x.id == 'pegs').value -1){
				currentPeg++;
			}
		}
	}

	mastermind.init();
})(this, document);