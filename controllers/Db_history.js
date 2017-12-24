var mysql = require('mysql');

module.exports = function (app,con1) {
   
    
    // ################################################
    // ##                                            ##
    // ##            Delete number order             ##
    // ##                                            ##
    // ################################################
    app.get('/report/:name/:status/:location/:order_status',function(req,res){
        var user,status,location,order_status;
        if(req.params.status==="any"){
            status = 1;
        }else{
            status = "user.user_status = '"+req.params.status+"'";
        }
        if(req.params.name=='undefined'){
            user = 1;
        }else{
            user = "user.user_name LIKE '%"+req.params.name+"%'";
        }
        if(req.params.location==="All"){
            location = 1;
        }else{
            location = "`user_province` LIKE '%"+req.params.location+"%'";
        }
        if(req.params.order_status==="any"){
            order_status = 1;
        }else{
            order_status = "`order_status` LIKE '%"+req.params.order_status+"%'";
        }
        var sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id  WHERE "+status+" AND "+user+' AND '+location+' AND '+order_status+' ORDER BY `order`.`order_date` DESC';
        console.log(sql)
        con1.query(sql,function (err,rows) {
            if(err) throw err;    
            res.json(rows);   
        });
    });

    app.get('/report_con',function(req,res){
        var sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id where order.order_status=0 && user.user_status='dealer'";

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });
    app.get('/report_con/:province',function(req,res){
        var sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id where order.order_status=0 && user.user_province='"+req.params.province+"'";

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });

    app.get('/report_con_detail/:id',function(req,res){
        var sql = "SELECT * FROM `order_description` where order_id="+req.params.id;

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });

    
    app.post('/history',function(req,res){
        var name = req.body.var_name;
        var status = req.body.var_status;
        var province = req.body.var_province;
        console.log(name , status , province);
            var sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id WHERE user.user_username='"+name+"' ORDER BY `order`.`order_id` DESC";
        if(status!='vip'){
            if(name=='admin'){
                sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id ORDER BY `order`.`order_id` DESC";
            }else if(status=='dealer'){
                sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id WHERE user.user_province='"+province+"' ORDER BY `order`.`order_id` DESC";   
            }
        }else{
            sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id WHERE user.user_head='"+name+"' || user_username='"+name+"' ORDER BY `order`.`order_id` DESC";
        }      

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });
    app.post('/history_description',function(req,res){
        var id = req.body.var_id;
        console.log(id);
        var sql = "SELECT * FROM `order_description` WHERE `order_id`='"+id+"'";

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });

    app.post('/confirm_order',function(req,res){
        var name = req.body.var_name;
        var sql = "SELECT * FROM `order`INNER JOIN user ON order.user_id = user.user_id where order.order_status = 0";

        con1.query(sql,function (err,rows) {
            if(err) throw err;
            res.json(rows);
        });
    });

    app.post('/cnf_status',function(req,res){
        var status = req.body.var_status;
        var id = req.body.var_id;

        var sql = "UPDATE `order` SET `order_status`=? WHERE `order_id`=?";
        con1.query(sql,[status,id],function (err) {
            if(err) throw err;
            res.json({'results':'success_update','message':'แก้ไขข้อมูลเรียบร้อย'});
        });
    });

}