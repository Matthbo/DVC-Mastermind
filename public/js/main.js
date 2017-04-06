(function(){
	var section = document.getElementsByTagName('section')[0];

	var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'white'];

	var settings = [
		{id: 'pegs', name: 'Code Pegs', value: 4},
		{id: 'rows', name: 'Rows', value: 12},
		{id: 'colors', name: 'Colors', value: 6, max: 8}
	];

	var RNGCode = [];
	var sessionName = '';

	var currentPeg = 0;
	var currentRow = 0;

	var mastermind = {
		init: function(){
			var self = this;

			this.updateInfo();
			this.getSession();

			//this.sendAJAX('POST', 'api/create_game', function(response){console.log(response)}, 'test=true&otherthing=false&bs=more+pls&why=no');
		},

		updateInfo: function(){
			var cDate = document.getElementById('cDate');

			var date = new Date().getFullYear();
			cDate.innerHTML += date;
		},

		getSession: function(){
			function readCookie(name) {
			    var nameEQ = name + "=";
			    var ca = document.cookie.split(';');
			    for(var i=0;i < ca.length;i++) {
			        var c = ca[i];
			        while (c.charAt(0)==' ') c = c.substring(1,c.length);
			        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			    }
			    return null;
			}

			var session = readCookie('session_name');
			if(session != null){
				this.sendAJAX('GET', 'api/get_session', function(result){
					if(result.status == "Success" && result.is_active){
						sessionName = session;
						settings.find(x => x.id == 'pegs').value = result.pegs;
						settings.find(x => x.id == 'rows').value = result.rows;
						settings.find(x => x.id == 'colors').value = result.colors;

						mastermind.initGame(false);
					} else {
						this.showSettings();
					}
				}, 'session_name='+session);
			} else {
				this.showSettings();
			}

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

				mastermind.createSession();
			}, false);

		},

		createSession: function(){
			var rows = settings.find(x => x.id == 'rows').value;
			var pegs = settings.find(x => x.id == 'pegs').value;
			var colors = settings.find(x => x.id == 'colors').value;

			var data = 'pegs='+pegs+'&rows='+rows+'&colors='+colors;
			this.sendAJAX('POST', 'api/create_game', function(result){
				if(result.status == "Success") {
					var date = new Date();
					date.setFullYear(new Date().getFullYear()+1);
					document.cookie = 'session_name='+result.session_name+'; expires='+date.toUTCString()+'; path=/DVC-Mastermind';

					sessionName = result.session_name;

					mastermind.initGame(true);
				} else alert("Couldn't create a session, please try again");
			}, data);

		},

		initGame: function(newgame){
			this.createBoard();
			if(newgame) this.calcRNGCode();
			else this.loadGameData();
			this.showControls();
		},

		createBoard: function(){
			var rows = settings.find(x => x.id == 'rows');
			var pegs = settings.find(x => x.id == 'pegs');

			section.innerHTML = '';

			var board = '<div id="game_board">';

			for(i=0; i<rows.value; i++){
				board += '<div class="game_row">';

				for(j=0; j<pegs.value; j++){
					board += '<div class="game_peg"></div>';
				}

				// key pegs
				roundKeyPegs = pegs.value % 2 == 0 ? 0 : 6.5;
				board += '<div class="key_pegs" style="width: '+ (13 * pegs.value / 2 + roundKeyPegs) +'px">';
				for(j=0; j<pegs.value; j++){
					board += '<div class="key_peg"></div>'
				}

				board += '</div></div>';
			}

			board += '<div id="game_controls"></div></div><div class="action_buttons"><button class="w3-btn w3-gray" id="undo">Undo</button><button class="w3-btn w3-red" id="reset">Reset</button></div>';
			section.innerHTML = board;
		},

		calcRNGCode: function(){
			var colorSetting = settings.find(x => x.id == 'colors').value < 9 ? settings.find(x => x.id == 'colors').value : settings.find(x => x.id == 'colors').max; 
			for(i=0; i<settings.find(x => x.id == 'pegs').value; i++){
				newColor = colors[Math.floor(Math.random() * colorSetting)];

				RNGCode.push(newColor);
			}

			console.log(RNGCode);
		},

		loadGameData: function(){
			var loadRow = 0;

			this.sendAJAX('GET', 'api/load_game', function(result){
				if(result.status == "Success"){
					for(i=0; i < result.steps.length; i++){
						var savedRow = JSON.parse(result.steps[i]);
						var row = document.querySelectorAll('#game_board .game_row')[i];

						for(j=0; j<settings.find(x => x.id == 'pegs').value; j++){
							var savedPegColor = savedRow[j];
							var peg = row.querySelectorAll('.game_peg')[j];

							peg.dataset.color = savedPegColor;
						}
					}
					currentRow = result.steps.length;
				} else alert("Couldn't load the saved game, please reload the page!");
			}, 'session_name='+sessionName);
		},

		showControls: function(){
			var controlsElement = document.getElementById('game_controls');
			var colorSetting = settings.find(x => x.id == 'colors').value < 9 ? settings.find(x => x.id == 'colors').value : settings.find(x => x.id == 'colors').max; 
			
			for(i=0; i<colorSetting; i++){
				controlsElement.innerHTML += '<div class="controls_peg" data-setcolor="'+colors[i]+'"></div>';
			}

			var controlsPegs = document.querySelectorAll('#game_controls .controls_peg');

			for(i=0; i<controlsPegs.length; i++){
				controlsPegs[i].addEventListener('click', function(event){
					color = event.target.dataset.setcolor;

					targetPeg = document.querySelectorAll('#game_board .game_row')[currentRow].querySelectorAll('.game_peg')[currentPeg];
					targetPeg.dataset.color = color;

					mastermind.next();
				});
			}

			document.querySelector('.action_buttons #undo').addEventListener('click', function(){
				if(currentPeg > 0){
					currentPeg--;
					delete document.querySelectorAll('#game_board .game_row')[currentRow].querySelectorAll('.game_peg')[currentPeg].dataset.color;
				}
			});

			document.querySelector('.action_buttons #reset').addEventListener('click', function(){
				mastermind.reset();
			});
		},

		next: function(){
			if(currentPeg < settings.find(x => x.id == 'pegs').value -1){
				currentPeg++;
			} else if(currentRow < settings.find(x => x.id == 'rows').value -1) {
				var pegsSetting = settings.find(x => x.name == 'Code Pegs');
				var row = document.querySelectorAll('#game_board .game_row')[currentRow];
				var keyPegs = row.querySelectorAll('.key_pegs .key_peg');
				var code = RNGCode.slice(0);
				var correctAmount = 0;
				var jsonRow = {};

				//check correct pegs
				for(i=0; i<pegsSetting.value; i++){
					var peg = row.querySelectorAll('.game_peg')[i];
					jsonRow[i] = peg.dataset.color;
					if(peg.dataset.color == code[i]){
						keyPegs[i].dataset.correct = 2;
						code[i] = 'correct';
						correctAmount++;
					}
				}

				//check if color is in answer
				for(i=0; i<pegsSetting.value; i++){
					var peg = row.querySelectorAll('.game_peg')[i];
					var codeIndex = code.indexOf(peg.dataset.color);
					if(codeIndex != -1 && keyPegs[i].dataset.correct != 2){
						keyPegs[i].dataset.correct = 1;
						code[codeIndex] = 'in answer';
					}
				}

				if(correctAmount == pegsSetting.value){
					setTimeout(function(){
						mastermind.reset();
						alert('You win!');
					}, 0);
				} else {
					var data = 'session_name='+sessionName+'&row='+currentRow+'&move='+JSON.stringify(jsonRow);
					this.sendAJAX('POST', 'api/save_step', function(result){
						if(result.status != "Success") console.log(result);
					}, data);

					currentRow++;
					currentPeg = 0;	
				}
			} else {
				setTimeout(function(){
					mastermind.reset();
					alert('Game Over!');
				}, 0);
			}
		},

		reset: function(full){
			section.innerHTML = '';
			RNGCode = [];
			currentPeg = 0;
			currentRow = 0;

			this.showSettings();
		},

		sendAJAX: function(method, url, callback, data = ""){
			var xmlhttp = new XMLHttpRequest();

	        xmlhttp.onreadystatechange = function() {
	            if (this.readyState == 4) {
	                callback(JSON.parse(this.responseText));
	            }
	        };
	        if(method == "POST"){
		        xmlhttp.open(method, url, true);

				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		        xmlhttp.send(data);
	        } else {
		        xmlhttp.open(method, url +"?"+ data, true);
		        xmlhttp.send();
	        }
		}
	}

	mastermind.init();
})(this, document);