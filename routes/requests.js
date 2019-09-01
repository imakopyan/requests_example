const Router = require('koa-router')
const router = new Router()
const Requests = require('../models/Requests')

const RemoveNull = (name) => (
  {$cond: {
    if: { $eq: [ 0, `$${name}` ] },
    then: "$$REMOVE",
    else: `$${name}`
 }}
)



router.get('/api/rejectReasonsTimeline', async ctx => {
  try {
    const from = new Date(ctx.query.from)
    const to = new Date(ctx.query.to)
    const result = await Requests.aggregate([
      {$match: {createdAt: {$gt : from, $lt: to}, statuses: {$elemMatch: { id : "rejected"}}  }},
      {$unwind: "$statuses"},
      {$match: {'statuses.id': 'rejected'}},
      {$unwind: "$statuses.rejectReasons"},
      {$project: {yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
      rejectReasons: "$statuses.rejectReasons", count: {$add: [1]},  }},
      
      {$group: {_id:  {"date" : "$yearMonthDay", "rejectReasons": "$rejectReasons"  }, "count": {$sum: "$count"}} },
    
      
      {$project: {rejectReasons: {$objectToArray: "$_id"}, count: 1, yearMonthDay: 1}},
      {$addFields: { stat: {$arrayElemAt: ["$rejectReasons",1]} } } ,
      {$addFields: { dat: {$arrayElemAt: ["$rejectReasons",0]} } } ,
      {$project: {stat: {$arrayToObject: [ [ { k: "$stat.v", v: "$count" } ] ]},
        dat: {$arrayToObject: [ [ { k: "date", v: "$dat.v" } ] ]}
      }},

      {$replaceRoot: { newRoot: { $mergeObjects:  [ "$stat" , "$dat"] }} },

      {$group: {_id: "$date", 
        "client_insolvent": {$sum: "$client_insolvent"}, 
        "client_cannot_confirm_income": {$sum: "$client_cannot_confirm_income"},
        "client_has_temp_registration": {$sum: "$client_has_temp_registration"},
        "client_high_load": {$sum: "$client_high_load"},
        "client_over_70_years": {$sum: "$client_over_70_years"}, 
        "client_disabled": {$sum: "$client_disabled"},
        "deposit_illiquid": {$sum: "$deposit_illiquid"},
        "deposit_remote": {$sum: "$deposit_remote"},
        "deposit_burdened": {$sum: "$deposit_burdened"}, 
        "deposit_shared": {$sum: "$deposit_shared"},
        "deposit_shared_with_minor": {$sum: "$deposit_shared_with_minor"},
        "deposit_bought_for_maternity_capital": {$sum: "$deposit_bought_for_maternity_capital"},
        "deposit_is_equipment_or_other": {$sum: "$deposit_is_equipment_or_other"}, 
        "deposit_not_commissioned": {$sum: "$deposit_not_commissioned"},
        "other": {$sum: "$other"}
    }},
      {$project: { _id: 0, date: "$_id",
      "client_insolvent": RemoveNull("client_insolvent"),
      "client_cannot_confirm_income": RemoveNull("client_cannot_confirm_income"),
      "client_has_temp_registration": RemoveNull("client_has_temp_registration"),
      "client_high_load": RemoveNull("client_high_load"),
      "client_over_70_years": RemoveNull("client_over_70_years"),
      "client_disabled": RemoveNull("client_disabled"),
      "deposit_illiquid": RemoveNull("deposit_illiquid"),
      "deposit_remote": RemoveNull("deposit_remote"),
      "deposit_burdened": RemoveNull("deposit_burdened"),
      "deposit_shared": RemoveNull("deposit_shared"),
      "deposit_shared_with_minor": RemoveNull("deposit_shared_with_minor"),
      "deposit_bought_for_maternity_capital": RemoveNull("deposit_bought_for_maternity_capital"),
      "deposit_is_equipment_or_other": RemoveNull("deposit_is_equipment_or_other"),
      "deposit_not_commissioned": RemoveNull("deposit_not_commissioned"),
      "other": RemoveNull("other"),
    }},


    ])
    
    
    ctx.body = result


  } catch (error) {
    ctx.body = 'error: ' + error
  }
})

//http://localhost:5000/api/rejectReasonsTimeline?from=2019-05-13T08:31:05.798&to=2019-07-11T10:15:18.016

router.get('/api/amountTimeline', async ctx => {
  try {
    const from = new Date(ctx.query.from)
    const to = new Date(ctx.query.to)
    console.log(from)
    const result = await Requests.find({createdAt: {$gt : from, $lt: to}  })
    console.log(result[0].createdAt)

    ctx.body = result


  } catch (error) {
    ctx.body = 'error: ' + error
  }
})


module.exports = router
