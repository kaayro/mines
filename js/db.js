var db = {
	ls: window.localStorage,
	obj: null,
	open: function(){
		db.obj = openDatabase('kakebo', '1.0', 'kakebo offline', 5*1024*1024);
	},
	query: function(query,error){
		db.obj.transaction(query,error);
	},
	create: function(){
		db.open();
		db.query(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS income (id INTEGER PRIMARY KEY, type, name, amount, date)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY, type, name, amount, date)');
			tx.executeSql('CREATE TABLE IF NOT EXISTS savings (id INTEGER PRIMARY KEY, amount, date)');
		}, function(e){
			alert('error');
		});
	},
	addIncome: function(type,name,amount,date){
		let r = true;
		db.query(function(tx){
			tx.executeSql("INSERT INTO income (type,name,amount,date) VALUES ('"+type+"','"+name+"','"+amount+"','"+date+"')");
		},function(){
			r = false;
		});
		if(r){
			var a = db.ls.getItem('available');
			db.ls.setItem('available',parseFloat(amount)+parseFloat(a));
		}
		return r;
	},
	addExpenses: function(type,name,amount,date){
		let r = true;
		db.query(function(tx){
			tx.executeSql("INSERT INTO expense (type,name,amount,date) VALUES ('"+type+"','"+name+"','"+amount+"','"+date+"')");
		},function(){
			r = false;
		});
		if(r){
			var a = db.ls.getItem('available');
			db.ls.setItem('available',parseFloat(a)-parseFloat(amount));
		}
		return r;
	},
	addSavings: function(amount,date){
		let r = true;
		db.query(function(tx){
			tx.executeSql("INSERT INTO savings (amount,date) VALUES ('"+amount+"','"+date+"')");
		},function(){
			r = false;
		});
		if(r){
			var a = db.ls.getItem('available');
			db.ls.setItem('available',parseFloat(a)-parseFloat(amount));
		}
		return r;
	}
};