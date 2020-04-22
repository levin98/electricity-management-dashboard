<template>
  <card :header-classes="{'text-right': false}">
    <template slot="header">
      <h6 class="title d-inline">Electricity Cost Configurations</h6>
    </template>
    <form @submit.prevent>
      <base-input label="First 200 kWh (1 - 200 kWh) cost RM" v-model="form.first200" placeholder="RM 0.218">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the first 200 kWh (1 - 200 kWh) per month</small>
      </base-input>
      <br/>
      <base-input label="Next 100 kWh (201 - 300 kWh) cost RM" v-model="form.next100" placeholder="RM 0.334">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 100 kWh (201 - 300 kWh) per month</small>
      </base-input>
      <br/>
      <base-input label="Next 300 kWh (301 - 600 kWh) cost RM" v-model="form.next300" placeholder="RM 0.516">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 300 kWh (301 - 600 kWh) per month</small>
      </base-input>
      <br/>
      <base-input label="Next 300 kWh (601 - 900 kWh) cost RM" v-model="form.next600" placeholder="RM 0.546">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next 300 kWh (601 - 900 kWh) per month</small>
      </base-input>
      <br/>
      <base-input label="Next kWh (901 kWh onwards) cost RM" v-model="form.next900" placeholder="RM 0.571">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">For the next kWh (901 kWh onwards) per month</small>
      </base-input>
      <br/>
      <base-input label="Minimum monthly cost RM" v-model="form.mincost" placeholder="RM 3.00">
          <small slot="helperText" id="emailHelp" class="form-text text-muted">The minimum monthly charge</small>
      </base-input>
     <base-button native-type="submit" type="primary" @click="onSave">Save</base-button>
    </form>
</card>
</template>
<script>
import BaseInput from '@/components/Inputs/BaseInput';
import BaseButton from '@/components/BaseButton';

export default {
  components: {
    BaseInput,
    BaseButton
  },
  data() {
    return {
      form: {
        first200: '',
        next100: '',
        next300: '',
        next600: '',
        next900: '',
        mincost: ''
      }
    }
  },
  methods: {
    onSave() {
      let data = {
        "first200": this.form.first200,
        "next100": this.form.next100,
        "next300": this.form.next300,
        "next600": this.form.next600,
        "next900": this.form.next900,
        "mincost": this.form.mincost,
      }
      this.$socketClient.sendObj({"action": "onPutSettings", "data": data })
    }
  },
    mounted() {
      // this.getAlert();
      this.$socketClient.onOpen = () => {
        console.log('socket connected')
      }
      this.$socketClient.onMessage = (msg) => {
        // console.log(JSON.parse(msg.data))
        if(JSON.parse(msg.data).body.actionCallback) {
          if(JSON.parse(msg.data).body.actionCallback === "putSettings" && JSON.parse(msg.data).statusCode == 200) {
            this.$notify({type: 'success', message: 'Settings have been saved.'});
            this.$socketClient.sendObj({"action": "onGetSettings"})
          }
        }
        if (JSON.parse(msg.data).body.settings) {
          // console.log(JSON.parse(msg.data).body.settings)
          let settings = JSON.parse(msg.data).body.settings
          this.form.first200 = settings.first200
          this.form.next100 = settings.next100
          this.form.next300 = settings.next300
          this.form.next600 = settings.next600
          this.form.next900 = settings.next900
          this.form.mincost = settings.mincost
        }
      }
      this.$socketClient.onClose = (msg) => {
        console.log('socket closed')
      }
      this.$socketClient.onError = (msg) => {
        console.log('socket error')
      }
      this.$socketClient.sendObj({"action": "onGetSettings"})
    }
};
</script>
<style>
</style>
