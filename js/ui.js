var ui = {
	init: function(){
		$('.modal').modal();
		$('select').material_select();
		$('ul.tabs').tabs();
		$('.datepicker').pickadate({
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 15, // Creates a dropdown of 15 years to control year,
			today: 'Hoy',
			clear: 'Limpiar',
			close: 'Ok',
			closeOnSelect: true // Close upon selecting a date,
		});
		
		//customized
		ui.getToday();
		$('#add-incomes form').on('submit',fnc.addIncomes);
		$('#add-expenses form').on('submit',fnc.addExpenses);
		$('#add-savings form').on('submit',fnc.addSavings);
		$('#add-first-data form').on('submit',fnc.addFirstData);
		$('#btn-balance').on('click',ui.showIncomes);
	},
	getToday: function(){
		var date = new Date();
		var d = date.getDate();
		var m = ui.getMonthName(date.getMonth());
		var y = date.getFullYear();
		
		var today = d + ' '+m+', '+y;
		$('input[name = date]').val(today);
	},
	getMonthName: function(m){
		var am = ['January',
				 'February',
				 'March',
				 'April',
				 'May',
				 'June',
				 'July',
				 'Augost',
				 'September',
				 'October',
				 'November',
				 'December'];
		return am[m];
	},
	showIncomes: function(){
		db.getIncomes();
		db.getExpenses();
		db.getSavings();
		$('#balance').modal('open');
	}
};