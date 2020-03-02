<template>
  <div>
    <div class="row">
      <div class="col-4">
        <card type="nav-tabs">
          <div slot="header" class="card-header-success">
            Total Power Consumption (kWh)
          </div>
          <blockquote class="blockquote mb-0">
            <p>{{ totalPower.toFixed(2) }} kWh</p>
          </blockquote>
        </card>
      </div>
      <div class="col-4">
        <card type="nav-tabs">
          <div slot="header" class="card-header-success">
            Average Power Consumption (kWh)
          </div>
          <blockquote class="blockquote mb-0">
            <p>{{ averageHourlyPower.toFixed(2) }} kWh</p>
          </blockquote>
        </card>
      </div>
      <div class="col-4">
        <card type="nav-tabs">
          <div slot="header" class="card-header-success">
            Estimated cost (MYR)
          </div>
          <blockquote class="blockquote mb-0">
            <p>RM {{ totalCost.toFixed(2) }}</p>
          </blockquote>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">{{$t('dashboard.totalPowerConsumption')}}</h5>
                <h2 class="card-title">{{$t('dashboard.totalPowerConsumptionTitle')}}</h2>
              </div>
            </div>
          </template>
          <div class="chart-area">
                <line-chart style="height: 100%"
                            ref="totalChart"
                            chart-id="total-line-chart"
                            :chart-data="totalLineChart.chartData"
                            :gradient-colors="totalLineChart.gradientColors"
                            :gradient-stops="totalLineChart.gradientStops"
                            :extra-options="totalLineChart.extraOptions">
                </line-chart>
              </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">{{$t('dashboard.powerConsumption')}}</h5>
                <h2 class="card-title">{{$t('dashboard.powerConsumptionTitle')}}</h2>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle"
                     :class="isRTL ? 'float-left' : 'float-right'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: bigLineChart.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="selectIndex(index)"
                           name="options" autocomplete="off"
                           :checked="bigLineChart.activeIndex === index">
                    {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        ref="bigChart"
                        chart-id="big-line-chart"
                        :chart-data="bigLineChart.chartData"
                        :gradient-colors="bigLineChart.gradientColors"
                        :gradient-stops="bigLineChart.gradientStops"
                        :extra-options="bigLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  import * as chartConfigs from '@/components/Charts/config';
  import config from '@/config';
  import io from "socket.io-client";

  var moment = require('moment');

  export default {
    components: {
      LineChart,
      BarChart
    },
    data() {
      return {
        selectedIndex: 0,
        allPowerData: 0,
        totalPower: 0,
        averageHourlyPower: 0,
        lastTimestamp: "",
        totalCost: 0,
        bigLineChartCategories: ["ems001", "ems002", "ems003", "ems004", "ems005"],
        bigLineChart: {
          allData: {},
          allLabel: {},
          activeIndex: 0,
          chartData: null,
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        },
        totalLineChart: {
          allData: [],
          allLabel: [],
          activeIndex: 0,
          chartData: null,
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        }
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      }
    },
    methods: {
      getRealtimeData() {
        
        var socket = io.connect("http://localhost:4000");
        socket.on("newdata", fetchedData => {
          // console.log(fetchedData);
          if (fetchedData.statusCode == 400) {
            console.log(fetchedData);
          } else {
            this.bigLineChart.allData = fetchedData.value;
            this.bigLineChart.allLabel = fetchedData.timestamp;
            this.selectIndex(this.selectedIndex);
          }
        });
        socket.on("totaldata", fetchedData => {
          // console.log(fetchedData);
          if (fetchedData.statusCode == 400) {
            console.log(fetchedData);
          } else {
            this.totalLineChart.allData = fetchedData.value;
            this.totalLineChart.allLabel = fetchedData.timestamp;
            this.initTotalChart();
          }
        });
      },
      selectIndex(index) {
        this.selectedIndex = index;
        this.initBigChart(this.bigLineChartCategories[index]);
      },
      initBigChart(category) {
        let chartData = {
          datasets: [{
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.bigLineChart.allData[category]
          }],
          labels: this.bigLineChart.allLabel[category]
        }
        if(this.$refs.bigChart) {
          this.$refs.bigChart.updateGradients(chartData);
        }
        this.bigLineChart.chartData = chartData;
        this.bigLineChart.activeIndex = this.selectedIndex;
      },
      initTotalChart() {
        let chartData = {
          datasets: [{
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.totalLineChart.allData
          }],
          labels: this.totalLineChart.allLabel,
        }
        if(this.$refs.totalChart) {
          this.$refs.totalChart.updateGradients(chartData);
        }
        this.totalLineChart.chartData = chartData;
        this.calculateTotalData();
      },
      calculateTotalData() {
        this.allPowerData = 0;
        this.totalLineChart.allData.forEach(element => {
          this.allPowerData += element;
        });
        var firstDate = moment(this.totalLineChart.allLabel[0]);
        var lastDate = moment(this.totalLineChart.allLabel[this.totalLineChart.allLabel.length-1]);
        // console.log(lastDate.diff(firstDate, 'hour'));
        this.averageHourlyPower = this.allPowerData / this.totalLineChart.allData.length / 1000;
        this.totalPower = this.averageHourlyPower * (lastDate.diff(firstDate, 'hour') + 1);
        this.totalCost = this.averageHourlyPower / 3600 * lastDate.diff(firstDate, 'second') * 0.218;
      }
    },
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }
      // this.getRealtimeData();
      this.$socketClient.onOpen = () => {
        console.log('socket connected')
      }
      this.$socketClient.onMessage = (msg) => {
        if (JSON.parse(msg.data).body.RTdata) {
          this.bigLineChart.allData = JSON.parse(msg.data).body.RTdata.value;
          this.bigLineChart.allLabel = JSON.parse(msg.data).body.RTdata.timestamp;
          this.selectIndex(this.selectedIndex);
        }
        if (JSON.parse(msg.data).body.totalData) {
          this.totalLineChart.allData = JSON.parse(msg.data).body.totalData.value;
          this.totalLineChart.allLabel = JSON.parse(msg.data).body.totalData.timestamp;
          this.initTotalChart();
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
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
</style>
