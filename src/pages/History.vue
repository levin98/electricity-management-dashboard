<template>
  <div class="row">
    <div class="col-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-6">
              <download-csv
                :data="CSVdata">
                <button class="btn btn-sm btn-primary">Generate CSV</button>
              </download-csv>
            </div>
            <div class="col-sm-6">
              <div class="btn-group btn-group-toggle"
                    :class="isRTL ? 'float-left' : 'float-right'"
                    data-toggle="buttons">
                <label v-for="(option, index) in $t('dashboard.chartCategories')"
                        :key="option"
                        class="btn btn-sm btn-primary btn-simple"
                        :class="{active: activeIndex === index}"
                        :id="index">
                  <input type="radio"
                          @click="activeIndex = index"
                          name="options" autocomplete="off"
                          :checked="activeIndex === index">
                  {{option}}
                </label>
              </div>
            </div>
          </div>
        </template>
        <base-table :data="tableData[$t('dashboard.chartCategories')[activeIndex]]" :columns="columns">
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
      </card>
    </div>
  </div>
</template>
<script>
  import { BaseTable } from "@/components";
  import io from "socket.io-client";

  var moment = require('moment');

  export default {
    components: {
      BaseTable
    },
    data() {
      return {
        columns: ["id", "deviceId", "type", "value", "timestamp"],
        tableData: { "ems001": [], "ems002": [], "ems003": [], "ems004": [], "ems005": []},
        activeIndex: 0,
        isRTL: false
      }
    },
    methods: {
      getData() {
        var socket = io.connect("http://localhost:4000");
        socket.on("historydata", fetchedData => {
          // console.log(fetchedData);
          if (fetchedData.statusCode == 400) {
            console.log(fetchedData);
          } else {
            this.tableData = fetchedData;
          }
        });
      }
    },
    mounted() {
      // this.getData();
      this.$socketClient.onOpen = () => {
        console.log('socket connected')
      }
      this.$socketClient.onMessage = (msg) => {
        // console.log(JSON.parse(msg.data))
        if (JSON.parse(msg.data).body.historicalData) {
          this.tableData = JSON.parse(msg.data).body.historicalData;
        }
        if (JSON.parse(msg.data).body.alert) {
          this.$parent.$parent.$root.$emit('updateClearAlert', JSON.parse(msg.data).body.alert.length);
        }
      }
      this.$socketClient.onClose = (msg) => {
        console.log('socket closed')
      }
      this.$socketClient.onError = (msg) => {
        console.log('socket error')
      }
      setInterval(() => {
        this.$socketClient.sendObj({"action": "onGetRTData"})
        this.$socketClient.sendObj({"action": "onGetAlert"})
      }, 10000)
    },
    computed: {
      CSVdata() {
        var csvData = [];
        Object.keys(this.tableData).forEach(key => {
          this.tableData[key].forEach(element => {
            csvData.push({
              "id": element.id,
              "deviceId": element.deviceId,
              "type": element.type,
              "value": element.value,
              "timestamp": element.timestamp
            });
          });
        });
        return csvData;
      }
    }
  }
</script>
<style>
</style>
