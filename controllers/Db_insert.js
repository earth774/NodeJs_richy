module.exports = function (app,con1) {
    // ################################################
    // ##                                            ##
    // ##            Insert number order             ##
    // ##                                            ##
    // ################################################

    app.post('/insert',function (req,res){
        var sql = "INSERT INTO `order_goods_d` (`ogd_name`, `ogd_num`, `ogd_status`, `og_id`) Values(?,?,?,?)";
        var id = req.body.var_id;
        var name = req.body.var_name;
        var num = req.body.var_num;
        var status = 0;

        con1.query(sql,[name,num,status,id],function (err) {
                if(err) throw err;
                res.json({'results':'success_insert','message':'บันทึกข้อมูลเรียบร้อย'});
        });
    });

    // app.get('/lamdap',function (req,res) {
    //     var status = '';
    //     if(status==='admin'){
    //         var sql = "SELECT * FROM `user` where user_head='admin'";
    //         con1.query(sql,function (err,rows) {
    //             if (err) throw err; 
    //             var w_1 = [];
    //             for(var h in rows){   
    //                 let z = "user_head='"+rows[h].user_username+"'";
    //                 w_1.push(z); 
    //             }
    //             console.log(w_1);
    //             w_1 = my_implode_js(' || ',w_1);

    //                 let user ;
    //                 let sql1 = "SELECT * FROM `user` where "+w_1; //"SELECT * FROM `user` where "+b;
    //                 con1.query(sql1,function (err,rows1) { // loop dealer
    //                         if (err) throw err; 
    //                         var b = [];
    //                         var b2 = [];
    //                         for(var i in rows){  
    //                             var b2 = [];
    //                             var w_2 = [];
    //                             for(var j in rows1){   
    //                                 let z = "user_head='"+rows1[j].user_username+"'";
    //                                 w_2.push(z); 
   
    //                             }
    //                             console.log(w_2);
    //                             w_2 = my_implode_js(' || ',w_2);
    //                                 let sql2 = "SELECT * FROM `user` where "+w_2; //"SELECT * FROM `user` where "+b;
    //                                     con1.query(sql2,function (err,rows2) { // loop vip
    //                                             if (err) throw err; 
    //                                                 var b_1 = [];
    //                                                 var b_2 = [];
    //                                                 for(var k in rows1){  
    //                                                     var b_2 = [];
    //                                                     console.log(rows1[k].user_username);
    //                                                     for(var l in rows2){
    //                                                         if (rows1[k].user_username===rows2[l].user_head) {
    //                                                             console.log(rows1[k].user_username,rows2[l].user_head);
    //                                                           b_2.push(rows2[l]);
    //                                                         }
    //                                                     }

    //                                                 }
    //                                                 for(var j in rows1){  
    //                                                         if (rows[i].user_username===rows1[j].user_head) {
    //                                                             let user1 = {
    //                                                                           'user_id':rows1[j].user_id,         
    //                                                                           'user_image' : rows1[j].user_image,
    //                                                                           'user_username': rows1[j].user_username,
    //                                                                           'user_password':rows1[j].user_password,
    //                                                                           'user_status':rows1[j].user_status,
    //                                                                           'facebook':rows1[j].user_facebook,
    //                                                                           'user_head':rows1[j].user_head,
    //                                                                           'user_name':rows1[j].user_name,
    //                                                                           'user_tel':rows1[j].user_tel,
    //                                                                           'user_facebook':rows1[j].user_facebook,
    //                                                                           'user_email':rows1[j].user_email,
    //                                                                           'client':b_2,
    //                                                                               }
    //                                                           b2.push(user1);
    //                                                         }
    //                                                     }  

    //                                                     user = {
    //                                                           'user_id':rows[i].user_id,         
    //                                                           'user_image' : rows[i].user_image,
    //                                                           'user_username': rows[i].user_username,
    //                                                           'user_password':rows[i].user_password,
    //                                                           'user_status':rows[i].user_status,
    //                                                           'facebook':rows[i].user_facebook,
    //                                                           'user_head':rows[i].user_head,
    //                                                           'user_name':rows[i].user_name,
    //                                                           'user_tel':rows[i].user_tel,
    //                                                           'user_facebook':rows[i].user_facebook,
    //                                                           'user_email':rows[i].user_email,
    //                                                           'client':b2,
    //                                                           'results':'success_update'
    //                                                         }; 
    //                                                 console.log(b_2); 

    //                                             b_1.push(user);
    //                                             res.json(b_1);
    //                                        });  
                                        
                                        
    //                             }

                            
    //                     }); 

                
    //              //\\ console.log(rows.length);
    //             //  \\a.push(b);
    //            //    \\
    //           ////////\\
    //         });
    //     }else if(status==='dealer'){
    //         var a = [];
    //         var sql = "SELECT * FROM `user` where user_head='rc0001'";

            
    //         con1.query(sql,function (err,rows) {
    //             if (err) throw err; 
    //             a.push(rows);
    //             var w_1 = [];
    //             for(var i in rows){   
    //                 let z = "user_head='"+rows[i].user_username+"'";
    //                 w_1.push(z); 
    //             }
    //             w_1 = my_implode_js(' || ',w_1);
    //                 let sql1 = "SELECT * FROM `user` where "+w_1; //"SELECT * FROM `user` where "+b;
    //                 con1.query(sql1,function (err,rows1) {
    //                         if (err) throw err; 
    //                             var b = [];
    //                             var b2 = [];
    //                             for(var i in rows){  
    //                                 var b2 = [];
    //                                 for(var j in rows1){  
    //                                     if (rows[i].user_username===rows1[j].user_head) {
    //                                       b2.push(rows1[j]);
    //                                     }
    //                                 }
    //                                 let user = {
    //                                       'user_id':rows[i].user_id,         
    //                                       'user_image' : rows[i].user_image,
    //                                       'user_username': rows[i].user_username,
    //                                       'user_password':rows[i].user_password,
    //                                       'user_status':rows[i].user_status,
    //                                       'facebook':rows[i].user_facebook,
    //                                       'user_head':rows[i].user_head,
    //                                       'user_name':rows[i].user_name,
    //                                       'user_tel':rows[i].user_tel,
    //                                       'user_facebook':rows[i].user_facebook,
    //                                       'user_email':rows[i].user_email,
    //                                       'client':b2,
    //                                       'results':'success_update'
    //                                     }; 
                                        
    //                                     b.push(user);
    //                             }
    //                         a.push(rows1);
                            
    //                         res.json(b);
    //                     }); 

                
    //              //\\ console.log(rows.length);
    //             //  \\a.push(b);
    //            //    \\
    //           ////////\\
    //         });
    //     }else if(status==='vip'){
    //         var a = [];
    //         var sql = "SELECT * FROM `user` where user_head='rc0002'";

            
    //         con1.query(sql,function (err,rows) {
    //             res.json(rows);
    //         });
    //     }
    // });
    
    app.post('/lamdap',function(req,res,next){
      var status = req.body.var_status;
      console.log(status);
      
          var sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id = status.status_id where user_head='"+status+"'";
          con1.query(sql,function (err,rows) {
              if (err) {
                console.log(err);
                return next(res.json(["error", err]));
            }
               var w_1 = [];
              for(var h in rows){   
                  let z = "user_head='"+rows[h].user_username+"'";
                  w_1.push(z);
              }
              if(w_1!=""){
              console.log(w_1);
              w_1 = my_implode_js(' || ',w_1);
              var sql1 = "SELECT * FROM `user` where "+w_1;
              console.log(sql1);
              con1.query(sql1,function (err,rows1) {
                if (err){console.log(err);
                return next(res.json(["error", err]));
            } 
                let b = [];
                let b2 = [];
                for(var i in rows){
                    let b2 = [];
                    for (var j in rows1) {
                        if (rows1[j].user_head==rows[i].user_username) {
                            b2.push(rows1[j].user_head);
                        }
                    }
                  let user = {
                    'user_id':rows[i].user_id,         
                    'user_image' : rows[i].user_image,
                    'user_username': rows[i].user_username,
                    'user_password':rows[i].user_password,
                    'status_id':rows[i].status_id,
                    'status_type':rows[i].status_type,
                    'user_head':rows[i].user_head,
                    'user_name':rows[i].user_name,
                    'user_tel':rows[i].user_tel,
                    'user_facebook':rows[i].user_facebook,
                    'user_email':rows[i].user_email,
                    'user_lat':rows[i].user_lat,
                    'user_lng':rows[i].user_lng,
                    'user_address':rows[i].user_address,
                    'user_province':rows[i].user_province,
                    'user_amphur':rows[i].user_amphur,
                    'num':b2.length,
                    'results':'success_update'
                  }; 
                  b.push(user);
                }
                res.json(b);
              });
          
            }else{
                res.json([{
                    'user_id':'1',         
                    'user_image' : './assets/error.png',
                    'user_username': 'error',
                    'user_password':'error',
                    'status_id':'error',
                    'status_type':'error',
                    'facebook':'error',
                    'user_head':'error',
                    'user_name':'ไม่มีข้อมูล',
                    'user_tel':'error',
                    'user_facebook':'error',
                    'user_email':'error',
                    'num':0,
                    'results':'error'
                  }]);
            }

            });     
        
    });

    app.get('/searchreport/:status/:province/:head',function(req,res){
        var sql;
        if(req.params.status=='admin'){
            sql = "SELECT * FROM  `user` INNER JOIN `status` on user.status_id = status.status_id"; 
        }else if(req.params.status=='dm'){
            sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id = status.status_id where user_province='"+req.params.province+"'"; 
        }else if(req.params.status=='vip'){
            sql = "SELECT * FROM `user` INNER JOIN `status` on user.status_id = status.status_id WHERE `user_head`='"+req.params.head+"' && `user_province`='"+req.params.province+"'";
        }        

        con1.query(sql,function (err,rows) {
              if (err) {
                console.log(err);
                return next(res.json(["error", err]));
            }
               var w_1 = [];
              for(var h in rows){   
                  let z = "user_head='"+rows[h].user_username+"'";
                  w_1.push(z);
              }
              console.log(w_1);
              w_1 = my_implode_js(' || ',w_1);
              var sql1 = "SELECT * FROM `user` where "+w_1;
              console.log(sql1);
              con1.query(sql1,function (err,rows1) {
                if (err){console.log(err);
                return next(res.json(["error", err]));
                } 
                let b = [];
                let b2 = [];
                console.log(rows1);
                for(var i in rows){
                    let b2 = [];
                    for (var j in rows1) {
                        if (rows1[j].user_head==rows[i].user_username) {
                            b2.push(rows1[j].user_head);
                        }
                    }
                  let user = {
                    'user_id':rows[i].user_id,         
                    'user_image' : rows[i].user_image,
                    'user_username': rows[i].user_username,
                    'user_password':rows[i].user_password,
                    'status_id':rows[i].status_id,
                    'status_type':rows[i].status_type,
                    'user_head':rows[i].user_head,
                    'user_name':rows[i].user_name,
                    'user_tel':rows[i].user_tel,
                    'user_facebook':rows[i].user_facebook,
                    'user_email':rows[i].user_email,
                    'user_lat':rows[i].user_lat,
                    'user_lng':rows[i].user_lng,
                    'user_address':rows[i].user_address,
                    'user_province':rows[i].user_province,
                    'num':b2.length,
                    'results':'success_update'
                  }; 
                  b.push(user);
                }
                res.json(b);
              });
    });

});
    
}

function my_implode_js(separator,array){
           var temp = '';
           for(var i=0;i<array.length;i++){
                   temp +=  array[i] 
                   if(i!=array.length-1){
                        temp += separator  ; 
                   }
               }//end of the for loop

               return temp;
        }