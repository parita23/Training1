var cron = require("node-cron");
const fileModel = require("./models/fileModel");
const csvtojson = require("csvtojson");
const userModel = require("./models/userModel");
// DB connection
var mongoose = require('mongoose');
global.config=require('./config/config.json')

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://admin:admin@localhost:27017/admin")
    .then(() => console.log("Connection DB Open"))
    .catch((err) => console.error(err));


console.log("in cron..");
cron.schedule(config.scheduler.files.fileProcess.time, async() => {
    console.log('running a task every minute');
    socket.emit('cron started');
    let data= await fileModel.find({status : "pending"})
    console.log("data....",data)
    for(let temp of data){
      
      let result=temp.name
      socket.emit('cron inprogress',{result});
      let data1= await fileModel.updateOne({_id:temp._id},{status:'inProgress'})

        console.log("1 by 1",temp)

        try {

          await testCase(temp);
            let validUser = 0;
            let invalidUser = 0;
            let duplicateUser = 0;
            let discarded = 0;
            let totalRecords = 0;
            let finalUser = [];
            let jsonArray;
               
           //find the csv path from public folder
            const csvFilePath = "./public/importFile/" + temp.name;
            
            //in jsonArray we get our json file
            jsonArray = await csvtojson({noheader:true}).fromFile(csvFilePath);
          
            if(temp.skipFirstRow == "true"){
              
              jsonArray=jsonArray.slice(1)
              
            }
            console.log("jjjjjjjjjjjjjj",jsonArray)
            if (jsonArray.length) {
             
              for (let user of jsonArray) {
                 
                let name = user[temp.fieldMappingObject['name']]
               
                let email = user[temp.fieldMappingObject['email']]
                let mobile = user[temp.fieldMappingObject['mobile']]
        
                if(name && email && mobile){
        
                    let userData = await userModel.findOne({$or : [{email : email}, {mobile : mobile}]});
                    if(userData) 
                    {
                      duplicateUser++;
                    }else{
                      validUser++;
                      let userObj = {} 
                     
                      for (const field in temp.fieldMappingObject) {
                        userObj[field] = user[temp.fieldMappingObject[field]];
                      }
                      console.log("userxgfhfdxh", userObj);
                      finalUser.push(userObj);
                      
                    }
                    function testCase(temp) {
                      return new Promise((resolve, reject) => {
                        setTimeout(function () {
                          console.log(temp);
                          resolve();
                        }, 3000);
                      });
                    }
                }else{
                  invalidUser++;
                }
               
              }
              console.log("finalUser,",finalUser)
             
              //find total uploaded user which is clean
              let uploadedUsers = await userModel.insertMany(finalUser);
              let totalUploadedUsers = uploadedUsers.length;
              //finally we update duplicates,totalRecords,totalUploaded and discarded into database using updateOne
              let demo = await fileModel.updateOne(
                { _id:temp._id},
                {
                  $set: {
                    duplicates: duplicateUser,
                    totalRecords: totalRecords,
                    totalUploaded: totalUploadedUsers,
                    discarded: discarded,
                    status:'sucess'
                  },
                }
              );
              if (demo) {
                console.log("data fetched",demo)
                socket.emit('cronend',{result});
              } else {
                console.log("error..")
    
              }
            }
           
          } catch (error) {
            console.log("Error",error)
          }
    }
    
});
