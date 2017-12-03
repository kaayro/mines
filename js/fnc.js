var fnc = {
	ready: function(){
		document.addEventListener('deviceready',fnc.init,false);
		//fnc.init();
	},
	init: function(){
		ui.init();
		db.create();
		
		var nm = db.ls.getItem('name');
		var av = db.ls.getItem('available');
		if(nm == undefined || av == undefined)
			$('#add-first-data').modal('open');
		else{
			fnc.reloadAvailable();
			$('#name').text(db.ls.getItem('name'));
		}
		
		//ads
		ads.init();
	},
	formatDate(date){
		var d = new Date(date);
		var day = d.getDate();
		if(day < 10) day = '0'+day;
		var month = d.getMonth();
		if(month < 10) month = '0'+month;
		return d.getFullYear()+'-'+month+'-'+day;
	},
	addFirstData: function(e){
		e.preventDefault();
		
		var nm = $(this).find('input[name=name]').val();
		var av = $(this).find('input[name=amount]').val();
		
		db.ls.setItem('name',nm);
		db.ls.setItem('available',av);
		$('#name').text(nm);
		$('#add-first-data').modal('close');
		fnc.reloadAvailable();
	},
	addIncomes: function(e){
		e.preventDefault();
		
		var type = $(this).find('select[name=type]').val();
		var desc = $(this).find('input[name=desc]').val();
		var amount = $(this).find('input[name=amount]').val();
		var date = fnc.formatDate($(this).find('input[name=date]').val());
		
		if(!db.addIncome(type,desc,amount,date))
			alert('No se pudo agregar el ingreso');
		else{
			$('.modal').modal('close');
			$(this)[0].reset();
			fnc.reloadAvailable();
		}
	},
	addExpenses: function(e){
		e.preventDefault();
		
		var type = $(this).find('select[name=type]').val();
		var desc = $(this).find('input[name=desc]').val();
		var amount = $(this).find('input[name=amount]').val();
		var date = fnc.formatDate($(this).find('input[name=date]').val());
		
		if(!db.addExpenses(type,desc,amount,date))
			alert('No se pudo agregar el egreso');
		else{
			$('.modal').modal('close');
			$(this)[0].reset();
			fnc.reloadAvailable();
		}
	},
	addSavings: function(e){
		e.preventDefault();
		
		var amount = $(this).find('input[name=amount]').val();
		var date = fnc.formatDate($(this).find('input[name=date]').val());
		
		if(!db.addSavings(amount,date))
			alert('No se pudo agregar el ahorro');
		else{
			$('.modal').modal('close');
			$(this)[0].reset();
			fnc.reloadAvailable();
		}
	},
	reloadAvailable: function(){
		var n = parseFloat(db.ls.getItem('available'));
		var am = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(n);
		$('#available').text(am);
	}
};

$(fnc.ready);