<template>
  <div class="row">
      <div class="col-lg-12 col-md-12">
        <card :header-classes="{'text-right': false}">
          <template slot="header">
            <h6 class="title d-inline">{{$t('dashboard.alerts', {count: alertCount})}}</h6>
            <base-dropdown menu-on-right=""
                           tag="div"
                           title-classes="btn btn-link btn-icon"
                           aria-label="Settings menu"
                           :class="{'float-left': false}">
              <i slot="title" class="tim-icons icon-settings-gear-63"></i>
              <a class="dropdown-item" href="#" @click="clearAlert()">Clear All</a>
            </base-dropdown>
          </template>
          <div class="table-full-width table-responsive">
            <base-table :data="tableData"
                thead-classes="text-primary">
              <template slot-scope="{row}">
                <td>
                  <p class="title">{{ row.message }}</p>
                  <p class="text-muted">{{ row.messageBody.Timestamp }}</p>
                </td>
              </template>
            </base-table>
          </div>
        </card>
      </div>
  </div>
</template>
<script>
  import io from "socket.io-client";
  import {BaseTable} from '@/components'
  import axios from 'axios';

  export default {
    components: {
      BaseTable
    },
    data() {
      return {
        alertCount: 0,
        tableData: []
      };
    },
    methods: {
      getAlert() {
        var socket = io.connect("http://localhost:4000");
        socket.on("alert", fetchedData => {
          // console.log(fetchedData);
          if (fetchedData.statusCode == 400) {
            console.log(fetchedData);
          } else {
            // console.log(fetchedData);
            if(fetchedData.length > 0) {
              this.tableData = fetchedData;
              this.alertCount = fetchedData.length;
            }
          }
        });
      },
      clearAlert() {
        var blacklistData = { 
          "blacklistedMessageId": []
         }

        this.tableData.forEach(element => {
          blacklistData.blacklistedMessageId.push(element.messageId)
        })

        // axios.post("http://localhost:4000/blacklist", { body: blacklistData })
        // .then(response => {
        //   // console.log(response)
        //   if(response.status == 200) {
        //     this.tableData = [];
        //     this.$notify({type: 'success', message: 'Alerts have been cleared.'});
        //     this.$parent.$parent.$root.$emit('handleClearAlert');
        //   } else {
        //     this.$notify({type: 'danger', message: 'Failed to clear all alerts, please try again later.'});
        //   }
        // })
        // .catch(err => {
        //   console.log(err)
        // });
        this.$socketClient.sendObj({"action": "onPutBlacklist", "data": blacklistData })
      }
    },
    mounted() {
      // this.getAlert();
      this.$socketClient.onOpen = () => {
        console.log('socket connected')
      }
      this.$socketClient.onMessage = (msg) => {
        // console.log(JSON.parse(msg.data))
        if(JSON.parse(msg.data).body.alert) {
          this.tableData = JSON.parse(msg.data).body.alert;
          this.alertCount = JSON.parse(msg.data).body.alert.length;
          this.$parent.$parent.$root.$emit('updateClearAlert', JSON.parse(msg.data).body.alert.length);
        }
        if(JSON.parse(msg.data).body.actionCallback) {
          if(JSON.parse(msg.data).body.actionCallback === "putBlacklist" && JSON.parse(msg.data).statusCode == 200) {
            this.tableData = [];
            this.$notify({type: 'success', message: 'Alerts have been cleared.'});
            this.$parent.$parent.$root.$emit('handleClearAlert');
          }
        }
      }
      this.$socketClient.onClose = (msg) => {
        console.log('socket closed')
      }
      this.$socketClient.onError = (msg) => {
        console.log('socket error')
      }
      setInterval(() => {
        this.$socketClient.sendObj({"action": "onGetAlert"})
      }, 10000)
    }
  };
</script>
<style>
</style>
