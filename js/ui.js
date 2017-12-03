var ui = {
	init: function(){
		$('.modal').modal();
		$('select').material_select();
		$('.datepicker').pickadate({
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 15, // Creates a dropdown of 15 years to control year,
			today: 'Hoy',
			clear: 'Lompiar',
			close: 'Ok',
			closeOnSelect: true // Close upon selecting a date,
		});
		
		//customized
		$('#add-incomes form').on('submit',fnc.addIncomes);
		$('#add-expenses form').on('submit',fnc.addExpenses);
		$('#add-savings form').on('submit',fnc.addSavings);
		$('#add-first-data form').on('submit',fnc.addFirstData);
	}
};