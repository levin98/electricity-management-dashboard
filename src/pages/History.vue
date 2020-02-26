<template>
  <base-table :data="tableData" :columns="columns">
    <template slot="columns">
      <th>#</th>
      <th>Device ID</th>
      <th>Type</th>
      <th>Value</th>
      <th>Time</th>
    </template>  
    <template slot-scope="{row}">
      <td>{{row.id}}</td>
      <td>{{row.deviceId}}</td>
      <td>{{row.type}}</td>
      <td>{{row.value}} W</td>
      <td>{{row.timestamp}}</td>
    </template>    
  </base-table>
</template>
<script>
  import { BaseTable } from "@/components";
  import AWSconfig from "../../config.json";

  const AWS = require("aws-sdk");
  AWS.config.update({
    region: AWSconfig.aws_region,
    accessKeyId: AWSconfig.aws_access_key_id,
    secretAccessKey: AWSconfig.aws_secret_access_key,
    sessionToken: AWSconfig.aws_session_token
  });
  var dynamodb = new AWS.DynamoDB.DocumentClient();
  var moment = require('moment');

  export default {
    components: {
      BaseTable
    },
    data() {
      return {
        columns: ["id", "deviceId", "type", "value", "timestamp"],
        tableData: [],
        rawData: []
      }
    },
    methods: {
      getData() {
        var params = {
          TableName: "ems",
          ProjectionExpression: "deviceId, #ts, #d",
          ExpressionAttributeNames: {
              "#ts": "timestamp",
              "#d" : "data"
          }
        };

        dynamodb.scan(params, (err, data) => {
          if (err) {
            this.$notify({type: 'danger', message: 'Data load from DynamoDB failed'});
            console.log(JSON.stringify(err, undefined, 2));
          } else {
            // console.log(JSON.stringify(data, undefined, 2));
            this.$notify({type: 'success', message: 'Data loaded from DynamoDB successfully'});
            this.rawData = data.Items;
            this.populateData();
          }
        });
      },
      populateData() {
        this.rawData.forEach((element, index) => {
          this.tableData[index] = {
            id: index + 1,
            deviceId: element.deviceId,
            type: element.data.data[0].device_type,
            value: element.data.data[0].value,
            timestamp: moment(element.data.data[0].timestamp).format('MMMM Do YYYY, h:mm:ss a')
          }
        });
        this.$forceUpdate();
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>
<style>
</style>
