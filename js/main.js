(function(){
	var section = document.getElementsByTagName('section')[0];

	var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown'];

	var settings = [{id: 'pegs', name: 'Code Pegs', value: 4},
					{id: 'rows', name: 'Rows', value: 12},
					{id: 'colors', name: 'Colors', value: 6}];

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

			board += '</div>';
			section.innerHTML = board;
		},

		showControls: function(){
			
		}
	}

	mastermind.init();
})(this, document);