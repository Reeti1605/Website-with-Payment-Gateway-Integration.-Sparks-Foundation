const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()

var Publishable_Key = 'pk_test_51IfTgjSH8fzydOOwdzQgyslP8iprlPD12oxnHnJDEApVZoefwDVz2TjYKXuDa2PEVaz8npBOlgT0Pe5xkxcLY7Fz001lNBjmgR'
var Secret_Key = 'sk_test_51IfTgjSH8fzydOOwQYXUCGSyDeNzRvS5UdBSN5mjVqLIezQIM8IbW0Syvn3ZiHAEpU6i3naf3jhvVfrJphYttfEb00mvNuL0EN'

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use("/static",express.static(__dirname + "/static"));

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res){
	res.render('Home', {
	key: Publishable_Key
	})
})
app.get("/admin/dashboard",function(req,res){
	res.render("admin/dashboard");
})
app.post('/payment', function(req, res){

	// Moreover you can take more details from user
	// like Address, Name, etc from form
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'Customer',
		address: {
			line1: 'TC 9/4 Old MES colony',
			postal_code: '110092',
			city: 'New Delhi',
			state: 'Delhi',
			country: 'India',
		}
	})
	.then((customer) => {

		return stripe.charges.create({
			amount: 50000,	 // Charing Rs 25
			description: 'Donation',
			currency: 'INR',
			customer: customer.id
		});
	})
	.then((charge) => {
		res.sendFile(path.join(__dirname + '/thanks.html')); // If no error occurs
	})
	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

app.listen(process.env.PORT || port, function(error){
	if(error) throw error
	console.log("Server created Successfully")
})
