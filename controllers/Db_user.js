var express = require('express');
var JWT = require('jsonwebtoken');
var fs = require('fs');
var dateTime = require('node-datetime');
var md5 = require('md5');
module.exports = function (app,con1) {

    
    // ################################################
    // ##                                            ##
    // ##            Update number order             ##
    // ##                                            ##
    // ################################################

    app.get('/province',function(req,res){
        var sql="SELECT * FROM `province` ORDER BY `province`.`PROVINCE_NAME` ASC";
        con1.query(sql,function(err,rows){
            if (err) throw err;
            res.json(rows);
        });
    })
    app.get('/amphur/:name',function(req,res){
        var sql="SELECT * FROM `province` where PROVINCE_NAME ='"+req.params.name+"'";
        con1.query(sql,function(err,rows){
            if (err) throw err;
            console.log(rows[0].PROVINCE_ID);
            var sql1="SELECT amphur.AMPHUR_ID,province.PROVINCE_ID,amphur.AMPHUR_NAME FROM `province` INNER JOIN amphur on province.PROVINCE_ID = amphur.PROVINCE_ID WHERE amphur.PROVINCE_ID="+rows[0].PROVINCE_ID;
            con1.query(sql1,function(err,rows1){
                if (err) throw err;
                res.json(rows1);
            });
        });
    })

    // ################################################
    // ##                                            ##
    // ##            Data Status Add&Edit            ##
    // ##                                            ##
    // ################################################

    app.get('/status',function(req,res){
        var sql ="SELECT * FROM `status` ORDER BY `status`.`status_id` ASC"
        con1.query(sql,function(err,rows){
            if (err) throw err;
            res.json(rows);
        });
    })
    app.post('/insert_status',function(req,res){
        var name = req.body.name;
        var sql ="INSERT INTO `status`(`status_type`) VALUES (?)"
        con1.query(sql,[name],function(err){
            if (err) throw err;
            res.json({'data':'success_insert'});
        });
    })
    app.post('/update_status',function(req,res){
        var name = req.body.name;
        var id = req.body.id;
        var sql ="UPDATE `status` SET `status_type`=? WHERE `status_id`=?"
        con1.query(sql,[name,id],function(err){
            if (err) throw err;
            res.json({'data':'success_update'});
        });
    })
    app.post('/delete_status',function(req,res){
        var id = req.body.id;
        var sql ="DELETE FROM `status` WHERE `status_id`=?"
        con1.query(sql,[id],function(err){
            if (err) throw err;
            res.json({'data':'success_delete'});
        });
    })

    

    app.get('/num_user',function(req,res){
        var sql="SELECT COUNT(user_id) as num_user FROM `user`";
        con1.query(sql,function(err,rows){
            if (err) throw err;
            res.json(rows);
        });
    })

    app.get('/update/:status/:name',function(req,res){
        var sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id=status.status_id WHERE `user`.`user_name` LIKE '%"+req.params.name+"%' && `status`.`status_id`='"+req.params.status+"'";       
        let user1=[];
        con1.query(sql,function (err,rows) {
            if(err) throw err;
            for (let i in rows) {
                let user = {         
                  'name' : rows[i].user_name +" / "+ rows[i].user_username
                };
                user1.push(user);
            }
            res.json(user1);
        });
    });
    app.get('/update',function(req,res){
        var sql = "SELECT * FROM `user`";       
        let user1=[];
        con1.query(sql,function (err,rows) {
            if(err) throw err;
            for (let i in rows) {
            let user = {         
                          'name' : rows[i].user_name +" / "+ rows[i].user_username
                        };
                user1.push(user);
            }
            res.json(user1);
        });
    });
    app.post('/token',function (req,res) {
        
        var sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id=status.status_id WHERE user_username=? && user_password=?";
        
        var user = req.body.var_user;
        var pass = req.body.var_pass;

        console.log(user, md5(pass));
        con1.query(sql,[user,md5(pass)],function (err,rows) {
            if (err) throw err; 
            if(rows!="") {
                let user = {
                          'id':rows[0].user_id,
                          'image':rows[0].user_image,         
                          'username' : rows[0].user_username,
                          'head': rows[0].user_head,
                          'name':rows[0].user_name,
                          'tel':rows[0].user_tel,
                          'facebook':rows[0].user_facebook,
                          'email':rows[0].user_email,
                          'status':rows[0].status_type,
                          'province':rows[0].user_province,
                          'results':'success_update'
                        };
                let token = JWT.sign(user, 'mysecretKey', {
                      expiresIn: '5s'
                    });
                    var decoded = JWT.decode(token, {complete: true});
                    console.log(token);
                    console.log(decoded); 
                res.json({'token':token} );
            }else{
                console.log(rows);
                res.json({'token':""} );
            }
        });
        // res.send(rand.generate(64));
    });
    app.post('/profind',function (req,res) {
        
        var sql = "UPDATE `user` SET `user_image`=?,`user_name`=?,`user_tel`=?,`user_facebook`=?,`user_email`=?,`user_lat`=?,`user_lng`=?,`user_address`=?,`user_province`=?,`user_amphur`=?,`status_id`=?,`user_head`=? WHERE `user_username`=?";
        var select = req.body.var_select;
        var head = req.body.var_head;
        var user = req.body.var_user;
        var name = req.body.var_name;
        var tel = req.body.var_tel;
        var facebook = req.body.var_facebook;
        var email = req.body.var_email;
        var image = req.body.image;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var line_image = req.body.line_image;
        var address = req.body.address;
        var province = req.body.province;
        var amphur = req.body.amphur;
        console.log(address,head,select);
        var url1 = req.protocol + '://' + req.get('host') ;
        if(image!=undefined){
         
        console.log(image.substring((req.protocol+ '://').length,url1.length));
        console.log(req.get('host'));
        if(image.substring((req.protocol+ '://').length,url1.length)==req.get('host')){
            con1.query(sql,[image,name,tel,facebook,email,lat,lng,address,province,amphur,select,head,user],function (err,rows) {
                if (err) throw err; 
                res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                    
            });
        }else{
                var dt = dateTime.create();
                var formatted = dt.format('YmdHMS');

                // console.log(name + tel + facebook + email,image);
                var data = image.replace(/^data:image\/\w+;base64,/, '');
                var url = req.protocol + '://' + req.get('host') +  '/picture/user/';
                console.log(line_image.substring(url1.length));
                fs.unlink("."+line_image.substring(url1.length), (err) => {  // delete file picture for file node js eiei
                    if (err) throw err;
                    console.log('successfully deleted local image'); 
                    fs.writeFile('picture/user/'+formatted+'.jpg', data, {encoding: 'base64'}, function(err){
                        if (err) throw err;
                        con1.query(sql,[url+formatted+'.jpg',name,tel,facebook,email,lat,lng,address,province,amphur,select,head,user],function (err,rows) {
                            if (err) throw err; 
                            res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย','image':url+formatted+'.jpg'});   
                        });
                    });
                });
            }
        }else{
            if(image==undefined){
                con1.query(sql,['',name,tel,facebook,email,lat,lng,address,province,amphur,select,head,'admin'],function (err,rows) {
                if (err) throw err; 
                res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                    
            });
        }    
        
        }
    });
     app.post('/update_profind',function (req,res) {
        
        var sql = 'UPDATE `user` SET `user_image`=?,\
            `user_password`=?,\
             `status_id`=?,\
              `user_head`=?,\
               `user_name`=?,\
                `user_tel`=?,\
                 `user_facebook`=?,\
                  `user_email`=?,\
                  `user_address`=?,\
                  `user_province`=?,\
                  `user_amphur`=?,\
                   `user_lat`=? ,\
                    `user_lng`=?\
                     WHERE `user_username`= ?';
        var url1 = req.protocol + '://' + req.get('host') ;
        var user = req.body.var_user;
        var name = req.body.var_name;
        var tel = req.body.var_tel;
        var facebook = req.body.var_facebook;
        var email = req.body.var_email;
        var image = req.body.var_image;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var line_image = req.body.line_image;
        var password = req.body.var_password;
        var select = req.body.var_select;
        var head = req.body.var_head;
        var address = req.body.address;
        var province = req.body.province;
        var amphur = req.body.amphur;
        console.log(amphur);
        if(image!=undefined){
            
        console.log(image.substring((req.protocol+ '://').length,url1.length));
        console.log(req.get('host'));
        if(image.substring((req.protocol+ '://').length,url1.length)==req.get('host')){

            con1.query(sql,[image,password,select,head,name,tel,facebook,email,address,province,amphur,lat,lng,user],function (err,rows) {
                if (err) throw err; 
                res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                    
            });
        }else{
                var dt = dateTime.create();
                var formatted = dt.format('YmdHMS');

                // console.log(name + tel + facebook + email,image);
                var data = image.replace(/^data:image\/\w+;base64,/, '');
                var url = req.protocol + '://' + req.get('host') +  '/picture/user/';
                console.log(line_image.substring(url1.length));
                fs.unlink("."+line_image.substring(url1.length), (err) => {  // delete file picture for file node js eiei
                    if (err) throw err;
                    console.log('successfully deleted local image'); 
                    fs.writeFile('picture/user/'+formatted+'.jpg', data, {encoding: 'base64'}, function(err){
                        
                        con1.query(sql,[url+formatted+'.jpg',password,select,head,name,tel,facebook,email,address,province,amphur,lat,lng,user],function (err,rows) {
                            if (err) throw err; 
                            res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย','image':url+formatted+'.jpg'});
                                
                        });
                    });
                });
            }
        }else{
            if(image==undefined){
                con1.query(sql,['',password,select,head,name,tel,facebook,email,address,province,amphur,lat,lng,user],function (err,rows) {
                    if (err) throw err; 
                    res.json({'results':'success_update','message':'แก่ไขข้อมูลเรียบร้อย'});
                    
                });
            }    
        
        }
    });

// app.post('/select_status',function (req,res) {
//         var select_status = req.body.select_status;
//         console.log(select_status);
//         let status;
//         if(select_status=='gold'){
//             status="`user_status`='vip'";
//         }else if(select_status=='vip'){
//             status="`user_status`='dealer'";
//         }else if(select_status=='dealer'){
//             status="`user_status`='admin'";
//         }else if(select_status=='admin'){
//             status="`user_status`='admin'";
//         }else{
//                status=1;
//         }
//         var sql = "SELECT * FROM `user` WHERE "+status;
        
//         let user1 = [];
//         con1.query(sql,function (err,rows) {
//             if (err) throw err; 
//             for (let i in rows) {
//             let user = {         
//                           'username' : rows[i].user_name,
//                           'status':status
//                         };
//                 user1.push(user);
//             }
//             console.log(user1);
//             res.json(user1);
                
//         });
//     });

    app.post('/show_profind',function (req,res) {
        var user = req.body.var_user;
        var sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id = status.status_id WHERE `user_username`='"+user+"'";

        console.log(user);
        con1.query(sql,function (err,rows) {
            if (err) throw err; 
            let user = {         
              'image':rows[0].user_image,
              'user':rows[0].user_username,
              'name':rows[0].user_name,
              'tel':rows[0].user_tel,
              'facebook':rows[0].user_facebook,
              'email':rows[0].user_email,
              'address':rows[0].user_address,
              'province':rows[0].user_province,
              'amphur':rows[0].user_amphur,
              'user_lat':rows[0].user_lat,
              'user_lng':rows[0].user_lng,
              'status':rows[0].status_id,
              'head':rows[0].user_head
            };
            console.log([user]);
            res.json([user]);
        });
    });

    app.post('/add_member',function (req,res) {
        var user = req.body.var_username;
        var password = req.body.var_password;
        var status = req.body.var_select;
        var head = req.body.var_head;
        var name = req.body.var_name;
        var tel = req.body.var_tel;
        var facebook = req.body.var_facebook;
        var email = req.body.var_email;
        var image = req.body.image;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var address = req.body.address;
        var province = req.body.province;
        var amphur = req.body.amphur;
        console.log(req.body);
        
        // con1.query("SELECT * FROM `user` ORDER BY `user`.`user_date` DESC LIMIT 1",function (err,rows) {
        //     if (err) throw err; 
        //     var num = parseInt(rows.length)-1;
        //     var b = (rows[num].user_username.substring(5)*1)+1; 
        //     user = 'richy'+b;
        // });
        console.log(user);
        var sql = "INSERT INTO `user`(`user_image`, `user_username`, `user_password`, `status_id`, `user_head`, `user_name`, `user_tel`, `user_facebook`, `user_email`, `user_address`, `user_province`,`user_amphur`,`user_lat`,`user_lng`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        console.log(sql);
        console.log(user);
        var dt = dateTime.create();
        var formatted = dt.format('YmdHMS');

        // console.log(name + tel + facebook + email,image);
        var data = image.replace(/^data:image\/\w+;base64,/, '');
        var url = req.protocol + '://' + req.get('host') +  '/picture/user/';
        console.log(url);
        fs.writeFile('picture/user/'+formatted+'.jpg', data, {encoding: 'base64'}, function(err){
        con1.query(sql,[url+formatted+'.jpg',user,md5(password),status,head,name,tel,facebook,email,address,province,amphur,lat,lng],function (err,rows) {
            if (err) throw err; 
            res.json({'results':'success_insert','message':'เพิ่มข้อมูลเรียบร้อย'});  
        });
        });
    });

    app.post('/delete_user',function (req,res) {
            var id = req.body.var_id;
            var image = req.body.var_image;
            console.log(id,image);
            var url1 = req.protocol + '://' + req.get('host') ;
            
            fs.unlink("."+image.substring(url1.length), (err) => {
            var sql = "DELETE FROM `user` WHERE `user_id` = ?";
            console.log(sql);
            con1.query(sql,[id],function (err) {
                if(err) throw err;
                res.json({'results':'success_delete','message':'ลบข้อมูลเรียบร้อย'});
            });
        });
    });
    app.get('/user/:name/:status/:location', function (req, res) {
        var user,status,location;
        if(req.params.status==="any"){
            status = 1;
        }else{
            status = "status.status_id = '"+req.params.status+"'";
        }
        if(req.params.name=='undefined'){
            user = 1;
        }else{
            user = "user.user_name LIKE '%"+req.params.name+"%'";
        }
        if(req.params.location==="All"){
            location = 1;
        }else{
            location = "user.user_province LIKE '%"+req.params.location+"%'";
        }
        var sql = "SELECT * FROM `user` INNER JOIN `status` ON user.status_id=status.status_id WHERE "+status+" AND "+user+" AND "+location+" ORDER BY status.status_id ASC";
        console.log(sql)
        con1.query(sql,function (err,rows) {
            if(err) throw err;    
            res.json(rows);   
        });
    });

    app.get('/autocom/:status',function(req,res){
        var status;
        if(req.params.status==4){
            status = 3;
        }else if(req.params.status==3){
            status = 2;
        }else if(req.params.status==2){
            status = 1;
        }
        var sql = "SELECT * FROM `user` where `status_id`='"+status+"'";       
        var user1=[];
        con1.query(sql,function (err,rows) {
            if(err) throw err;
            for (var i in rows) {
            var user = {         
                'name' : rows[i].user_name +" / "+ rows[i].user_username
            };
                user1.push(user);
            }
            res.json(user1);
        });
    });

}


// .then(function(response) {
//         return response.json()
//       }).then(function(body) {
//         console.log(body);
//       });