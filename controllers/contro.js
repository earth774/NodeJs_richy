var fs = require('fs');
module.exports = function (app) {
    
    app.get('/api',function (req,res) {
        res.json({ firstname:'John', lastname:'Doe',image:'http://localhost:3000/picture/order/20171107170320.jpg'.substring(21) });
    });

    app.get('/time',function (req,res) {
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-dH:M:S');
        console.log(formatted);
    });

	
    


}