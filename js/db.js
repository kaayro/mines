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
			var s = db.ls.getItem('savings');
			db.ls.setItem('available',parseFloat(a)-parseFloat(amount));
			db.ls.setItem('savings',parseFloat(s)+parseFloat(amount));
		}
		return r;
	},
	getSavingsSum: function(){
		db.obj.transaction(function (tx) {
			tx.executeSql('SELECT * FROM savings', [], function (tx, r) {
				var ret = 0;
				var len = r.rows.length, i;
				for (i = 0; i < len; i++)
					ret += parseFloat( r.rows.item(i).amount );
				var sv = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(ret);
				$('#savings').text(sv);
			}, null);
		});
	},
	getAvailableSum: function(){
		db.obj.transaction(function (tx) {
			tx.executeSql('SELECT * FROM income', [], function (tx, r) {
				var retinc = 0;
				var len = r.rows.length, i;
				for (i = 0; i < len; i++)
					retinc += parseFloat( r.rows.item(i).amount );
				var av = retinc;
				tx.executeSql('SELECT * FROM savings',[],function(tx, r){
					var retsv = 0;
					var len = r.rows.length, i;
					for (i = 0; i < len; i++)
						retsv += parseFloat( r.rows.item(i).amount );
					av = av-retsv;
					tx.executeSql("SELECT * FROM expense",[],function(tx, r){
						var retex = 0;
						var len = r.rows.length, i;
						for (i = 0; i < len; i++)
							retex += parseFloat( r.rows.item(i).amount );
						av = av-retex;
						var avn = parseFloat(db.ls.getItem('available'));
						var aux = avn - av;
						av = av + aux;
						var inc = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(av);
						$('#available').text(inc);
					},null);
				},null);
			}, null);
		});
	},
	getIncomes: function(){
		db.obj.transaction(function(tx){
			tx.executeSql("SELECT * FROM income",[],function(tx,r){
				var l = r.rows.length;
				var t = '';
				var total = 0.0;
				for(i=0;i<l;i++){
					t += '<tr><td>'+r.rows.item(i).name+'</td>';
					var n = parseFloat(r.rows.item(i).amount);
					total += n;
					var fn = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(n);
					t += '<td>'+fn+'</td>';
					t += '<td>'+r.rows.item(i).date+'</td></tr>';
				}
				t += '<tr><td></td><td>'+new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(total)+'</td><td>TOTAL</td></tr>';
				$('#incomes-balance tbody').html(t);
			},null);
		});
	},
	getExpenses: function(){
		db.obj.transaction(function(tx){
			tx.executeSql("SELECT * FROM expense",[],function(tx,r){
				var l = r.rows.length;
				var t = '';
				var total = 0.0;
				for(i=0;i<l;i++){
					t += '<tr><td>'+r.rows.item(i).name+'</td>';
					var n = parseFloat(r.rows.item(i).amount);
					total += n;
					var fn = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(n);
					t += '<td>'+fn+'</td>';
					t += '<td>'+r.rows.item(i).date+'</td></tr>';
				}
				t += '<tr><td></td><td>'+new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(total)+'</td><td>TOTAL</td></tr>';
				$('#expenses-balance tbody').html(t);
			},null);
		});
	},
	getSavings: function(){
		db.obj.transaction(function(tx){
			tx.executeSql("SELECT * FROM savings",[],function(tx,r){
				var l = r.rows.length;
				var t = '';
				var total = 0.0;
				for(i=0;i<l;i++){
					var n = parseFloat(r.rows.item(i).amount);
					total += n;
					var fn = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(n);
					t += '<tr><td>'+fn+'</td>';
					t += '<td>'+r.rows.item(i).date+'</td></tr>';
				}
				t += '<tr><td>'+new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(total)+'</td><td>TOTAL</td></tr>';
				$('#savings-balance tbody').html(t);
			},null);
		});
	}
};