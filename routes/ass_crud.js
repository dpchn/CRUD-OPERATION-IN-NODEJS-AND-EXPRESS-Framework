var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var sync = require('synchronize');

/* GET home page. */
router.get('/', function(req, res, next) {
	var s="Hello how are you ?";
  res.render('ass_crud', { title: "Learn to Print String", str:s});


});




var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  
  database : 'CRUD_test_db'
});


///////////////////////////////////////////////////////REGISTRATION/////////////////


router.get('/crud_reg',function(req, res, next){
	res.render("registration",{title:"Welcome to Registration Page"});
});

router.post('/crud_enter',function  (req, res, next) {
	var result='';
//console.log("What ",req.params.input);
//if(req.params.input=='student'){
		 if(req.body["fname"].length==0 || req.body["lname"].length==0 || req.body["psw"].length==0 || req.body["roll_num"].length==0)
		 	result = 'Enter Details properly';
		 else{
				connection.query('INSERT INTO student (firstName, lastName, RollNumber,Password) VALUES (?, ?, ?,?)', [req.body["fname"], req.body["lname"], req.body["roll_num"],req.body["psw"]],function(err,result){
					if(err){
							console.log("Error while insert",err);
							}
					else
							console.log("Successfully entered");
				});
			result = "Registration Successfully."
			res.render("notification",{result:result});
		}
//	}
	// else
	// {
	// 	if(req.body["fname"].length==0 || req.body["lname"].length==0 || req.body["psw"].length==0)
	// 	 	result = 'Enter Details properly';
	// 	 else{
	// 			connection.query('INSERT INTO teacher_details (firstName, lastName,Password) VALUES (?, ?, ?)', [req.body["fname"], req.body["lname"], req.body["psw"]],function(err,result){
	// 				if(err){
	// 					console.log("Error while insert",err);
	// 					}
	// 				else
	// 					console.log("Successfully entered");
	// 			});
	// 		result = "Registration Successfully."
	// 		res.render("notification",{result:result});
	// 	}
	// }
});

/////////////////////////Login////////////////////////////

router.get('/crud_login', function(req, res, next){
	res.render("login",{value:"Enter login details"});
});


router.post('/crud_verify',function(req, res, next){
		var r = 'res';
		var send_result = '';
		connection.query('SELECT Password as res FROM student WHERE RollNumber=?',[req.body["roll_num"]],function(err,result){
			var send_result = '';
			if(err){
					console.log("Error of not found");
					res.render("notification",{result:"failure"});
			}
			else{
					if (result.length==0)
					{
						res.render("notification",{result:"Wrong Roll Number"});	
					}
					else
					{
						if(result[0][r]==req.body["psw"]){
							res.redirect('/ass_crud/crud_update/true');
						}
						else
						 	res.render("notification",{result:"Wrong Password"});
					}	
				}
		});
});
////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////?UPDATE///////////////////////////////////////////


router.get('/crud_update/:input',function(req, res, next){
	if(req.params.input=="true"){
	   connection.query('SELECT * FROM student',function(err,result){
		res.render("all_data",{result:result});
	});
	}
	else
		res.render("notification",{result:"Unauthorize Access"});
});


router.get('/edit/:input',function(req, res, next){
		var roll = req.params.input;
		connection.query('SELECT * FROM student where RollNumber =?',[roll],function(err,result){
		if (err)
			console.log("Error while update");
		else{
		    res.render("edit_details",{result:result[0]});
	}
	});
});



router.post('/update_details/:input',function(req, res, next){
	var id=req.params.input;
    if(id==-1){
    	    connection.query('INSERT INTO student (firstName, lastName, RollNumber,Password) VALUES (?, ?, ?,?)', [req.body["fname"], req.body["lname"], req.body["roll_num"],req.body["psw"]],function(err,result){
			if (err)
				console.log("Error while Adding");
			else{
				res.redirect('/ass_crud/crud_update/true');
			}
	});
}
    else
    	connection.query('Update student Set firstName = ?, lastName = ?, RollNumber = ? where ID=?',[req.body["fname"], req.body["lname"], req.body["roll_num"], id],function(err,result){
			if (err)
				console.log("Error while update");
			else{
				res.redirect('/ass_crud/crud_update/true');
			}
	});


});

////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////DELETE//////////////////////////////////////////////////////



router.get('/delete/:input',function(req, res, next){
	var roll=req.params.input;
    connection.query('delete from student where RollNumber=?',[roll],function(err,result){
			if (err)
				console.log("Error while update");
			else{
				res.redirect('/ass_crud/crud_update/true');
			}
	});
});

//////////////////////////////////////////////////////////////////////////////////////////?

/////////////////////////////////////////////////ADD NEW STUDENT///////////////////////////
router.get('/add_new',function(req, res, next){
 res.render("add_new",{title:"Add"});
});


module.exports = router;
