var dateTime = require('node-datetime');
var fs = require('fs');

module.exports = function (app,con1) {

    // ################################################
    // ##                                            ##
    // ##            Select data order               ##
    // ##                                            ##
    // ################################################
app.get('/list',function (req,res) {
        con1.query("SELECT * FROM order_goods ORDER BY og_id ASC",function (err,rows) {
                if (err) throw err; 
                if (rows)
                    res.json(rows);
                else 
                    res.json('');
        });
});



app.get('/chart_today',function(req,res){
    var sql = "SELECT * FROM `order` INNER JOIN `user` on order.user_id = user.user_id where order.order_status=1 ";
    con1.query(sql,function(err,rows){
        if(err) throw err;
        
        var json;
        json = r_date(rows);
        console.log(json);
        res.json(json);
    })
});

app.get('/chart_week',function(req,res){
    var sql = "SELECT * FROM `order` INNER JOIN `user` on order.user_id = user.user_id where order.order_status=1";
    con1.query(sql,function(err,rows){
        if(err) throw err;
        var data_week = week(rows);
        res.json([{
                'status':('dm'),
                'data_num':data_week
            }]);
    })
});

app.get('/chart_Month',function(req,res){
    var sql = "SELECT * FROM `order` INNER JOIN `user` on order.user_id = user.user_id where order.order_status=1";
    con1.query(sql,function(err,rows){
        if(err) throw err;
        
        var data_month = month(rows);

        res.json([{
                'status':('dm'),
                'data_num':data_month[0],
                'dateinMonth':data_month[1]
            }]);
    });
});

app.get('/top5/:status',function(req,res){
    var sql = "SELECT order.order_id,user.user_id,SUM(order.order_total) AS order_total,SUM(order.order_num) AS order_num,user.user_image,user.user_username,status.status_type,user.user_name FROM `user` INNER JOIN `order` on user.user_id = order.user_id INNER JOIN `status` on user.status_id = status.status_id WHERE status.status_type='"+req.params.status+"' && order.order_status=1 ORDER BY `order`.`order_total` GROUP BY user.user_id  ASC LIMIT 5";
    con1.query(sql,function(err,rows){
        var user=[];
        for(let i in rows){
            user.push({
                'user_id':rows[i].user_id,
                'order_total': abbrNum(rows[i].order_total,2),
                'order_num':abbrNum(rows[i].order_num,2),
                'user_image':rows[i].user_image,
                'user_username':rows[i].user_username,
                'status_type':rows[i].status_type,
                'user_name':rows[i].user_name
            })
        }
        res.json(user);
    });
})

app.get('/chart_year/:name',function(req,res){
    var sql = "SELECT * FROM `order` INNER JOIN `user` on order.user_id = user.user_id where order.order_status=1";
    con1.query(sql,function(err,rows){
        if(err) throw err;
        
        var data = year(rows,req.params.name);
        var json = new Array();
        for(let i=0;i<3;i++){
            var user = {
                'status':((i==0)?'dm':((i==1)?'vip':'gold')),
                'data_num':data[i]
            };
            json.push(user);
        }
        res.json(json);
    });
});

app.get('/list_order',function (req,res) {
        con1.query("SELECT *  FROM order_goods_d ORDER BY ogd_id ASC",function (err,rows) {
                if (err) throw err; 
                if (rows)
                    res.json(rows);
                else 
                    res.json('');
        });
});

app.post('/cart',function (req,res){
        var cart = req.body.var_cart;
        var total = req.body.var_total;
        var id = req.body.var_id;
        var num = req.body.var_num;
        var name = req.body.var_name;
        //var a = JSON.parse(cart);
        for(let cart1 in cart){
            console.log(cart[cart1]);
        }
        console.log(total,id,num,name);
        var sql = "INSERT INTO `order`(`user_id`, `order_date`,`order_total`,`order_num`) Values(?,?,?,?)";
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        con1.query(sql,[id,formatted,total,num],function (err) {
                if(err) throw err;
                    var sql1 = "Select * FROM `order` where order_date=?";  
                    console.log(sql1);
                    con1.query(sql1,[formatted],function (err,rows) { 
                    if(err) throw err; 
                        for(let cart1 in cart){
                            var sql2 = "INSERT INTO `order_description`(`order_d_name`, `order_d_img`, `order_d_title`, `order_d_qty`, `order_d_price`,`order_id`) Values(?,?,?,?,?,?)";
                            con1.query(sql2,[name,cart[cart1].image,cart[cart1].title,cart[cart1].qty,cart[cart1].price,rows[0].order_id],function (err) {
                            if(err) throw err; 
                            
                            });
                        }
                        res.json({'results':'success_insert','message':'สั่งซื่อสินค่าเรียบร้อย'});
                    });
            
        });
    });

app.post('/add_order',function(req,res){
    var name = req.body.var_name;
    var price = req.body.var_price;
    var des = req.body.var_des;
    var image = req.body.image;

    var dt = dateTime.create();
    var formatted = dt.format('YmdHMS');
    
    var sql = "INSERT INTO `order_goods`(`og_name`, `og_pic`, `og_price`, `og_des`) VALUES (?,?,?,?)";
    var data = image.replace(/^data:image\/\w+;base64,/, '');
    var url = req.protocol + '://' + req.get('host') +  '/picture/product/';
    console.log(url);
    fs.writeFile('picture/product/'+formatted+'.jpg', data, {encoding: 'base64'}, function(err){
        con1.query(sql,[name,url+formatted+'.jpg',price,des],function (err) {
            if(err) throw err;
            res.json({'results':'success_insert','message':'บันทึกข้อมูลเรียบร้อย'});
        });
    });
});

app.post('/delete_order',function(req,res){
    var id = req.body.var_id;
    var image = req.body.image;
    var url = req.protocol + '://' + req.get('host') ; 
    fs.unlink("."+image.substring(url.length), (err) => {
        var sql = "DELETE FROM `order_goods` WHERE `og_id` = ?";
        console.log(sql);
        con1.query(sql,[id],function (err) {
            if(err) throw err;
            res.json({'results':'success_delete','message':'ลบข้อมูลเรียบร้อย'});
        });
    });
});

app.post('/update_order',function(req,res){
    var name = req.body.var_name;
    var price = req.body.var_price;
    var image = req.body.image;
    var des = req.body.var_des;
    var id = req.body.id;
    var line_image = req.body.line_image;
    console.log(name,price,des,image,id);
    var sql = "UPDATE `order_goods` SET `og_pic`=?,`og_name`=?,`og_price`=?,`og_des`=? WHERE `og_id`="+id;
    if(image!=undefined){
        console.log(image);
        console.log(req.get('host'));
        var url = req.protocol + '://' + req.get('host') ; 
        if((image.substring((req.protocol+ '://').length,url.length)==req.get('host'))||(image.substring((req.protocol).length,url.length)=='richlybrownie.')){
            
            con1.query(sql,[image,name,price,des],function (err,rows) {
                if (err) throw err; 
                res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                    
            });
        }else{
                var dt = dateTime.create();
                var formatted = dt.format('YmdHMS');

                // console.log(name + tel + facebook + email,image);
                var data = image.replace(/^data:image\/\w+;base64,/, '');
                var url = req.protocol + '://' + req.get('host') +  '/picture/product/';
                var url1 = req.protocol + '://' + req.get('host') ; 
                console.log(url);
                fs.unlink("."+line_image.substring(url1.length), (err) => {  // delete file picture for file node js eiei
                    if (err) throw err;
                    console.log('successfully deleted local image');                                
                
                    fs.writeFile('picture/product/'+formatted+'.jpg', data, {encoding: 'base64'}, function(err){
                        
                        con1.query(sql,[url+formatted+'.jpg',name,price,des],function (err,rows) {
                            if (err) throw err; 
                            res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย','image':url+formatted+'.jpg'});
                                
                        });
                    });
                });
            }
    }else{
        if(image==undefined){
            con1.query(sql,['',,name,price,des],function (err,rows) {
            if (err) throw err; 
            res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                
        });
    }    
    
    }
});



}

function day(f,l,ar,rows){
    var status= new Array();
    status[0]= new Array();
    status[1]= new Array();
    status[2]= new Array();
    for(let j in ar){
        var d1 = new Date(rows[ar[j]].order_date);
        // console.log(d1.getHours(),f,l);
        if((d1.getHours()>=f)&&(d1.getHours()<l)){
            // console.log(d1.getHours()+':'+d1.getMinutes()+'.'+d1.getSeconds());
            
            
            if(rows[ar[j]].status_id=='2'){
                status[0].push(rows[ar[j]].order_total);
            }else if(rows[ar[j]].status_id=='3'){
                status[1].push(rows[ar[j]].order_total);
            }else if(rows[ar[j]].status_id=='4'){
                status[2].push(rows[ar[j]].order_total);
            }

            // console.log(rows[ar[j]].order_total);
            
            
        }
        
    }
    return status;
}

function r_date(rows){
    var ar = [];
    for(let k in rows){
            var d = new Date(rows[k].order_date);
            var d_nows = new Date();
            var order_date = d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();
            var date = d_nows.getDate()+'-'+d_nows.getMonth()+'-'+d_nows.getFullYear();
            if(order_date==date){
                
                ar.push(k);
                
            }
        }
        var status= new Array();
        for(let i =0;i<=8;i++){
            status[i]=[];
            if(i==0){
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    status[i][j]+=0;
                }
            }else if(i==1){
                var loop = day(0,3,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==2){
                var loop =day(3,6,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==3){
                var loop =day(6,9,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==4){
                var loop =day(9,12,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==5){
                var loop =day(12,15,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==6){
                var loop =day(15,18,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==7){
                var loop =day(18,21,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }else if(i==8){
                var loop =day(21,24,ar,rows);
                status[i][0]=0;
                status[i][1]=0;
                status[i][2]=0;
                for(let j =0;j<3;j++){
                    for(let k in loop[j]){
                        status[i][j]+=(loop[j][k]*1);
                    }
                }
            }
        }

        var sta = new Array();
        var json = new Array();
        for(let i = 0;i<3;i++){
            sta[i] = [];
            for(let j=0;j<=8;j++){
                sta[i][j] = status[j][i];
            }
            var user = {
                'status':((i==0)?'dm':((i==1)?'vip':'gold')),
                'data_num':sta[i]
            };
            json.push(user);
        }
        return json;
}

function week(rows){
    ar = [];
    for(let k in rows){
        var d = getWeekNumber(new Date(rows[k].order_date));
        var d_nows = getWeekNumber(new Date());
        var order_date = d[0]+'-'+d[1];
        var date = d_nows[0]+'-'+d_nows[1];

        if(order_date==date){
            if(rows[k].status_id=='2'){
                ar.push(k);
            }
        }
    }
    var data_week = [];
    for(let i =0;i<7;i++){
        data_week[i]=0;
    }
    console.log(ar);
    for(let i =0;i<7;i++){
        for (let k in ar) {
            var d = week_name(new Date(rows[ar[k]].order_date));
            if(d[1][i]===d[0]){
                if(i===0){
                    console.log(rows[ar[k]].order_total , d[1][i] , d[0],i);
                    data_week[6]+= rows[ar[k]].order_total;
                }else{
                    console.log(rows[ar[k]].order_total , d[1][i] , d[0],i);
                    data_week[i-1]+= rows[ar[k]].order_total;
                }
                    
            }
        }
    }
    
        
    console.log(data_week)
    return data_week;
}

function month(rows){
    var ar = [];var d_nows = new Date();
        for(let k in rows){
            var d = new Date(rows[k].order_date);
            
            var order_date = d.getMonth()+'-'+d.getFullYear();
            var date = d_nows.getMonth()+'-'+d_nows.getFullYear();
            if(order_date==date){
                if(rows[k].status_id=='2'){
                    ar.push(k);
                }
            }
        }
        date_month = daysInMonth(d_nows.getMonth(),d_nows.getFullYear());
        data_month = [];
        for(let i=1;i<=date_month;i++){
            data_month[i] = 0;
        }
        for(let i=1;i<=date_month;i++){
            for (let j in ar) {
                var d = new Date(rows[ar[j]].order_date);
                if(d.getDate()==i){
                    data_month[i]+=rows[ar[j]].order_total;
                }
            }
        }
    return [data_month,date_month];
}

function year(rows,name){
    var ar = [];
    var status= new Array();
    for(let i=0;i<3;i++){
        status[i]= new Array();
        status[i]= new Array();
        status[i]= new Array();
        for(let j=0;j<12;j++){
            status[i][j]=0;
        }
    }
            for (var i = 0; i<12; i++) {

                if(i==0){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==1){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==2){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==3){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==4){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==5){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==6){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==7){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==8){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==9){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==10){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }else if(i==11){
                    var data = chk_y(i,rows,name);
                    for(let k in status){
                        for(let j in data[k]){
                            status[k][i]+= data[k][j];
                        }
                    }
                }
            }
    return status;

}

function chk_y(i,rows,name){
    var status= new Array();
    status[0]= new Array();
    status[1]= new Array();
    status[2]= new Array();

    for(let k in rows){
        var d = new Date(rows[k].order_date);
        var d_nows = new Date();
        var order_date =d.getFullYear();
        var order_month =d.getMonth();
        var date = d_nows.getFullYear();

        if(order_date==date){
            if(i==order_month){
                if(name=='admin'){
                    if(rows[k].status_id=='2'){
                        status[0].push(rows[k].order_total);
                    }else if(rows[k].status_id=='3'){
                        status[1].push(rows[k].order_total);
                    }else if(rows[k].status_id=='4'){
                        status[2].push(rows[k].order_total);
                    }
                }else{
                    if(rows[k].user_username==name){
                        status[0].push(rows[k].order_total);
                    }
                }

            }
        }
    }
    return status;
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

function week_name(d) {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    

    var n = weekday[d.getDay()];

    return [n,weekday];
}

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }
    return number;
}